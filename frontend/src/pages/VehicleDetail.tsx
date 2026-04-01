import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiFetch, assetUrl } from '../lib/api'
import { InquiryModal } from '../components/InquiryModal'
import type { Vehicle } from '../types'

function formatXof(n: number) {
  return new Intl.NumberFormat('fr-BJ', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(n)
}

export function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const [v, setV] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [hero, setHero] = useState(0)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiFetch<Vehicle>(`/api/vehicles/${id}`)
        if (!cancelled) setV(data)
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'Erreur')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24">
        <motion.div
          className="h-2 w-48 rounded-full bg-stone-200"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      </div>
    )
  }
  if (err || !v) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-red-700">{err || 'Introuvable'}</p>
        <Link
          to="/vehicules"
          className="mt-4 inline-block font-medium text-[#1a3c34] underline"
        >
          Retour au catalogue
        </Link>
      </div>
    )
  }

  const imgs = v.images.map(assetUrl)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <Link
        to="/vehicules"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#1a3c34] hover:underline"
      >
        <span aria-hidden>←</span> Catalogue
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-white/50 bg-stone-900/5 shadow-[0_24px_80px_-20px_rgba(15,20,25,0.35)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            {imgs[0] ? (
              <img
                src={imgs[hero] ?? imgs[0]}
                alt=""
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-stone-200 text-stone-500">
                Photo à venir
              </div>
            )}
          </motion.div>
          {imgs.length > 1 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-stone-500">
                {imgs.length} photo{imgs.length > 1 ? 's' : ''} — cliquez pour afficher
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                {imgs.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setHero(i)}
                    className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-32 ${
                      hero === i
                        ? 'border-[#c9a227] shadow-[0_0_20px_-8px_rgba(201,162,39,0.8)]'
                        : 'border-stone-200/80 opacity-85 hover:border-stone-300 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
            {v.brand} · {v.year}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
            {v.title}
          </h1>
          <p className="mt-4 text-3xl font-semibold text-[#1a3c34] md:text-4xl">
            {formatXof(v.priceXof)}{' '}
            <span className="text-lg font-medium text-stone-500">F CFA</span>
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div className="glass-panel rounded-2xl p-4">
              <dt className="text-xs font-medium text-stone-500">Modèle</dt>
              <dd className="mt-1 font-semibold text-stone-900">
                {v.brand} {v.model}
              </dd>
            </div>
            <div className="glass-panel rounded-2xl p-4">
              <dt className="text-xs font-medium text-stone-500">Kilométrage</dt>
              <dd className="mt-1 font-semibold text-stone-900">
                {new Intl.NumberFormat('fr-BJ').format(v.mileageKm)} km
              </dd>
            </div>
            <div className="glass-panel rounded-2xl p-4">
              <dt className="text-xs font-medium text-stone-500">Énergie</dt>
              <dd className="mt-1 font-semibold text-stone-900">{v.fuel}</dd>
            </div>
            <div className="glass-panel rounded-2xl p-4">
              <dt className="text-xs font-medium text-stone-500">Transmission</dt>
              <dd className="mt-1 font-semibold text-stone-900">
                {v.transmission}
              </dd>
            </div>
          </dl>

          <div className="mt-8 rounded-3xl border border-stone-200/80 bg-white/60 p-6 text-sm leading-relaxed text-stone-700 shadow-inner backdrop-blur">
            {v.description}
          </div>

          <motion.button
            type="button"
            onClick={() => setModalOpen(true)}
            className="group relative mt-10 w-full overflow-hidden rounded-2xl py-4 text-sm font-semibold text-[#0f1419] shadow-[0_0_40px_-12px_rgba(201,162,39,0.9)] md:w-auto md:min-w-[280px] md:px-10"
            style={{
              background: 'linear-gradient(135deg, #f2e5a8, #c9a227, #a68516)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Manifester mon intérêt</span>
            <span className="absolute inset-0 translate-x-[-100%] bg-white/35 transition group-hover:translate-x-[100%] duration-700" />
          </motion.button>
        </motion.div>
      </div>

      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicleId={v.id}
        vehicleTitle={v.title}
      />
    </div>
  )
}
