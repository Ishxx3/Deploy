/**
 * URLs API : base vide = chemins relatifs (/api/…) → même origine (Render ou proxy Vite en local).
 * VITE_API_URL ne sert que si le front et l’API sont sur des domaines différents.
 */
const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''

export function apiUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/** Affichage d’images : URLs absolues ou chemins /uploads servis par l’API */
export function assetUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return ''
  if (
    pathOrUrl.startsWith('http://') ||
    pathOrUrl.startsWith('https://') ||
    pathOrUrl.startsWith('data:')
  ) {
    return pathOrUrl
  }
  const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return apiUrl(p)
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { token?: string | null }
): Promise<T> {
  const { token, headers: h, ...rest } = init ?? {}
  const headers = new Headers(h)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(apiUrl(path), { ...rest, headers })
  const text = await res.text()

  if (res.status === 502 || res.status === 503) {
    throw new Error(
      'L’API ne répond pas (502/503). En local : à la racine du projet, lancez `npm run dev` ' +
        '(API + frontend). En prod : vérifiez que le service (ex. Render) tourne et les logs serveur.'
    )
  }

  if (
    text.trimStart().startsWith('<!') ||
    (res.headers.get('content-type') || '').includes('text/html')
  ) {
    throw new Error(
      'Réponse HTML au lieu de JSON : l’API n’est pas joignable à cette adresse. ' +
        'En local : `npm run dev` à la racine. En prod : même domaine que l’API (ex. Render) ou définissez VITE_API_URL.'
    )
  }
  const data = text ? (JSON.parse(text) as unknown) : null
  if (!res.ok) {
    const err = data as { error?: string }
    throw new Error(err?.error || res.statusText)
  }
  return data as T
}

const UPLOAD_BATCH = 40

export async function uploadVehicleImages(
  token: string,
  files: File[]
): Promise<string[]> {
  if (!files.length) return []
  const urls: string[] = []
  for (let i = 0; i < files.length; i += UPLOAD_BATCH) {
    const batch = files.slice(i, i + UPLOAD_BATCH)
    const fd = new FormData()
    batch.forEach((f) => fd.append('files', f))
    const res = await fetch(apiUrl('/api/admin/upload'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
  const text = await res.text()
  if (res.status === 502 || res.status === 503) {
    throw new Error(
      'L’API ne répond pas. En local : `npm run dev` à la racine. En prod : vérifiez le déploiement (ex. Render).'
    )
  }
  if (text.trimStart().startsWith('<!')) {
    throw new Error(
      'Téléversement impossible : mauvaise URL d’API. Utilisez le même domaine en prod ou définissez VITE_API_URL.'
    )
  }
  const data = text ? (JSON.parse(text) as unknown) : null
  if (!res.ok) {
    const err = data as { error?: string }
    throw new Error(err?.error || 'Échec du téléversement')
  }
    urls.push(...(data as { urls: string[] }).urls)
  }
  return urls
}

export const TOKEN_KEY = 'raa_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(t: string | null) {
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}
