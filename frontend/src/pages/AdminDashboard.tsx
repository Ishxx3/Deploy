import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  apiFetch,
  assetUrl,
  getToken,
  setToken,
  uploadVehicleImages,
} from '../lib/api'
import type { Inquiry, Vehicle } from '../types'

type PendingFile = { id: string; file: File }

const emptyForm = {
  title: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  priceXof: 0,
  mileageKm: 0,
  fuel: 'Essence',
  transmission: 'Manuelle',
  description: '',
  imagePaths: [] as string[],
  /** Par défaut publié pour qu’il apparaisse sur /vehicules */
  status: 'PUBLISHED' as Vehicle['status'],
}

export function AdminDashboard() {
  const nav = useNavigate()
  const token = getToken()
  const [tab, setTab] = useState<'vehicles' | 'inquiries'>('vehicles')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [pendingItems, setPendingItems] = useState<PendingFile[]>([])
  const [saving, setSaving] = useState(false)

  const pendingPreviews = useMemo(
    () =>
      pendingItems.map((p) => ({
        id: p.id,
        url: URL.createObjectURL(p.file),
        name: p.file.name,
      })),
    [pendingItems]
  )

  useEffect(() => {
    return () => {
      pendingPreviews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [pendingPreviews])

  const load = useCallback(async () => {
    if (!token) return
    setErr(null)
    try {
      const [v, i] = await Promise.all([
        apiFetch<Vehicle[]>('/api/admin/vehicles', { token }),
        apiFetch<Inquiry[]>('/api/admin/inquiries', { token }),
      ])
      setVehicles(v)
      setInquiries(i)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur')
      if (e instanceof Error && e.message.includes('401')) {
        setToken(null)
        nav('/admin', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }, [token, nav])

  useEffect(() => {
    if (!token) {
      nav('/admin', { replace: true })
      return
    }
    load()
  }, [token, nav, load])

  function logout() {
    setToken(null)
    nav('/admin')
  }

  function startEdit(v: Vehicle) {
    setEditingId(v.id)
    setPendingItems([])
    setForm({
      title: v.title,
      brand: v.brand,
      model: v.model,
      year: v.year,
      priceXof: v.priceXof,
      mileageKm: v.mileageKm,
      fuel: v.fuel,
      transmission: v.transmission,
      description: v.description,
      imagePaths: [...v.images],
      status: v.status,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setPendingItems([])
    setForm(emptyForm)
  }

  function removeImage(index: number) {
    setForm((f) => ({
      ...f,
      imagePaths: f.imagePaths.filter((_, i) => i !== index),
    }))
  }

  function addFiles(fileList: FileList | File[]) {
    const arr = Array.from(fileList)
    if (!arr.length) return
    setPendingItems((prev) => [
      ...prev,
      ...arr.map((file) => ({ id: crypto.randomUUID(), file })),
    ])
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) addFiles(e.target.files)
    e.target.value = ''
  }

  function onDropFiles(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  function removePending(id: string) {
    setPendingItems((prev) => prev.filter((p) => p.id !== id))
  }

  async function saveVehicle(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setSaving(true)
    setErr(null)
    try {
      let uploaded: string[] = []
      const filesToUpload = pendingItems.map((p) => p.file)
      if (filesToUpload.length) {
        uploaded = await uploadVehicleImages(token, filesToUpload)
      }
      const images = [...form.imagePaths, ...uploaded]
      const toInt = (n: number, fallback: number) =>
        Number.isFinite(n) ? Math.trunc(n) : fallback
      const body = {
        title: form.title.trim(),
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: toInt(form.year, new Date().getFullYear()),
        priceXof: Math.max(0, toInt(form.priceXof, 0)),
        mileageKm: Math.max(0, toInt(form.mileageKm, 0)),
        fuel: form.fuel.trim(),
        transmission: form.transmission.trim(),
        description: form.description.trim(),
        images,
        status: form.status,
      }
      if (editingId) {
        await apiFetch(`/api/admin/vehicles/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
          token,
        })
      } else {
        await apiFetch('/api/admin/vehicles', {
          method: 'POST',
          body: JSON.stringify(body),
          token,
        })
      }
      setPendingItems([])
      cancelEdit()
      await load()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur enregistrement')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!token || !confirm('Supprimer ce véhicule ?')) return
    try {
      await apiFetch(`/api/admin/vehicles/${id}`, { method: 'DELETE', token })
      await load()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur')
    }
  }

  if (!token) return null

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-stone-900">Tableau de bord</h1>
        <div className="flex gap-2">
          <Link
            to="/"
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            Voir le site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg bg-stone-200 px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-300"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-2 border-b border-stone-200">
        <button
          type="button"
          onClick={() => setTab('vehicles')}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            tab === 'vehicles'
              ? 'border-[#1a3c34] text-[#1a3c34]'
              : 'border-transparent text-stone-500'
          }`}
        >
          Véhicules
        </button>
        <button
          type="button"
          onClick={() => setTab('inquiries')}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            tab === 'inquiries'
              ? 'border-[#1a3c34] text-[#1a3c34]'
              : 'border-transparent text-stone-500'
          }`}
        >
          Demandes ({inquiries.length})
        </button>
      </div>

      {err && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{err}</p>
      )}

      {loading && <p className="mt-6 text-stone-500">Chargement…</p>}

      {tab === 'vehicles' && !loading && (
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <form
            onSubmit={saveVehicle}
            className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-semibold text-stone-900">
              {editingId ? 'Modifier le véhicule' : 'Nouveau véhicule'}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="text-xs font-medium text-stone-600">Titre</span>
                <input
                  required
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </label>
              <label>
                <span className="text-xs font-medium text-stone-600">Marque</span>
                <input
                  required
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />
              </label>
              <label>
                <span className="text-xs font-medium text-stone-600">Modèle</span>
                <input
                  required
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                />
              </label>
              <label>
                <span className="text-xs font-medium text-stone-600">Année</span>
                <input
                  type="number"
                  required
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
                  value={form.year}
                  onChange={(e) =>
                    setForm({ ...form, year: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                <span className="text-xs font-medium text-stone-600">
                  Prix (F CFA)
                </span>
                <input
                  type="number"
                  required
                  min={1}
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
                  value={form.priceXof || ''}
                  onChange={(e) =>
                    setForm({ ...form, priceXof: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                <span className="text-xs font-medium text-stone-600">
                  Kilométrage
                </span>
                <input
                  type="number"
                  required
                  min={0}
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
                  value={form.mileageKm || ''}
                  onChange={(e) =>
                    setForm({ ...form, mileageKm: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                <span className="text-xs font-medium text-stone-600">Énergie</span>
                <input
                  required
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
                  value={form.fuel}
                  onChange={(e) => setForm({ ...form, fuel: e.target.value })}
                />
              </label>
              <label>
                <span className="text-xs font-medium text-stone-600">Boîte</span>
                <input
                  required
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
                  value={form.transmission}
                  onChange={(e) =>
                    setForm({ ...form, transmission: e.target.value })
                  }
                />
              </label>
              <label className="sm:col-span-2">
                <span className="text-xs font-medium text-stone-600">Statut</span>
                <select
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as Vehicle['status'],
                    })
                  }
                >
                  <option value="DRAFT">Brouillon</option>
                  <option value="PUBLISHED">Publié</option>
                  <option value="SOLD">Vendu</option>
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="text-xs font-medium text-stone-600">
                  Description
                </span>
                <textarea
                  required
                  rows={4}
                  className="mt-1 w-full rounded border border-stone-300 px-2 py-1.5 text-sm"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>
              <div className="sm:col-span-2">
                <span className="text-xs font-medium text-stone-600">
                  Photos du véhicule
                </span>
                <p className="mt-0.5 text-[11px] text-stone-500">
                  Ajoutez autant de photos que nécessaire (aperçu immédiat). JPG,
                  PNG, WebP — jusqu’à ~10 Mo par fichier. Glisser-déposer ou
                  clic. Envoi au serveur lors de l’enregistrement.
                </p>
                <div
                  className="mt-2"
                  onDragEnter={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onDrop={onDropFiles}
                >
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50/80 px-4 py-10 text-sm text-stone-600 transition hover:border-[#1a3c34]/50 hover:bg-[#f8faf8]">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={onPickFiles}
                    />
                    <span
                      className="rounded-full bg-[#1a3c34]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1a3c34]"
                      aria-hidden
                    >
                      Galerie
                    </span>
                    <span className="mt-2 font-semibold text-[#1a3c34]">
                      Ajouter des images
                    </span>
                    <span className="mt-1 max-w-sm text-center text-xs text-stone-500">
                      Déposez vos fichiers ici ou cliquez pour parcourir — vous
                      pouvez en sélectionner plusieurs à la fois, plusieurs fois.
                    </span>
                  </label>
                </div>
                {(form.imagePaths.length > 0 || pendingItems.length > 0) && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-medium text-stone-600">
                      Aperçu ({form.imagePaths.length + pendingItems.length}{' '}
                      image
                      {form.imagePaths.length + pendingItems.length > 1
                        ? 's'
                        : ''}
                      )
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {form.imagePaths.map((path, idx) => (
                        <div
                          key={`saved-${path}-${idx}`}
                          className="relative aspect-[4/3] overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-sm"
                        >
                          <img
                            src={assetUrl(path)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-lg leading-none text-white shadow hover:bg-black/80"
                            aria-label="Retirer cette photo"
                          >
                            ×
                          </button>
                          <span className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white">
                            En ligne
                          </span>
                        </div>
                      ))}
                      {pendingPreviews.map((p) => (
                        <div
                          key={p.id}
                          className="relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-dashed border-[#c9a227]/70 bg-amber-50/90 shadow-sm"
                        >
                          <img
                            src={p.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePending(p.id)}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-lg leading-none text-white shadow hover:bg-black/80"
                            aria-label="Retirer cette photo"
                          >
                            ×
                          </button>
                          <span className="absolute bottom-2 left-2 max-w-[90%] truncate rounded bg-amber-900/75 px-2 py-0.5 text-[10px] font-medium text-amber-50">
                            Nouveau · {p.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#1a3c34] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? 'Enregistrement…' : editingId ? 'Enregistrer' : 'Créer'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border border-stone-300 px-4 py-2 text-sm"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>

          <div>
            <h2 className="font-semibold text-stone-900">Liste</h2>
            <ul className="mt-4 space-y-3">
              {vehicles.map((v) => (
                <li
                  key={v.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white p-3 text-sm"
                >
                  <div>
                    <span className="font-medium">{v.title}</span>
                    <span className="ml-2 text-stone-500">({v.status})</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(v)}
                      className="text-[#1a3c34] underline"
                    >
                      Éditer
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(v.id)}
                      className="text-red-600 underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === 'inquiries' && !loading && (
        <ul className="mt-8 space-y-4">
          {inquiries.map((q) => (
            <li
              key={q.id}
              className="rounded-xl border border-stone-200 bg-white p-4 text-sm shadow-sm"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-semibold">{q.name}</span>
                <span className="text-stone-500">
                  {new Date(q.createdAt).toLocaleString('fr-BJ')}
                </span>
              </div>
              <p className="mt-1 text-stone-600">
                {q.email}
                {q.phone && ` · ${q.phone}`}
              </p>
              {q.vehicle && (
                <p className="mt-1 text-xs text-[#1a3c34]">
                  Véhicule : {q.vehicle.title}
                </p>
              )}
              <p className="mt-3 whitespace-pre-wrap text-stone-700">{q.message}</p>
            </li>
          ))}
          {inquiries.length === 0 && (
            <p className="text-stone-500">Aucune demande pour le moment.</p>
          )}
        </ul>
      )}
    </div>
  )
}
