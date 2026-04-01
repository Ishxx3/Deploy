import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiFetch, assetUrl } from '../lib/api'
import type { Vehicle } from '../types'

function formatXof(n: number) {
  return new Intl.NumberFormat('fr-BJ', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(n)
}

export function Vehicles() {
  const [list, setList] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiFetch<Vehicle[]>('/api/vehicles?status=PUBLISHED')
        if (!cancelled) setList(data)
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'Erreur réseau')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          Véhicules disponibles
        </h1>
        <p className="mt-3 text-lg text-stone-600">
          Sélection révisée, prête pour la route — chaque fiche est une promesse
          de qualité.
        </p>
      </motion.div>

      {loading && (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-3xl bg-stone-200/80"
            />
          ))}
        </div>
      )}
      {err && (
        <p className="mt-10 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-red-800 backdrop-blur">
          {err}
        </p>
      )}
      {!loading && !err && list.length === 0 && (
        <p className="mt-14 text-stone-600">
          Aucun véhicule publié pour le moment. Revenez bientôt ou contactez-nous.
        </p>
      )}

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.45 }}
          >
            <Link
              to={`/vehicules/${v.id}`}
              className="group block overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-[0_20px_60px_-28px_rgba(15,20,25,0.35)] backdrop-blur-md transition hover:-translate-y-1 hover:shadow-[0_28px_70px_-20px_rgba(26,60,52,0.35)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                {v.images[0] ? (
                  <img
                    src={assetUrl(v.images[0])}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-stone-400">
                    Photo
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {v.year}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h2 className="font-semibold text-stone-900 group-hover:text-[#1a3c34]">
                  {v.title}
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  {v.brand} {v.model}
                </p>
                <p className="mt-3 text-lg font-bold text-[#1a3c34]">
                  {formatXof(v.priceXof)} F CFA
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
