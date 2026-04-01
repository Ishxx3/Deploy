import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch } from '../lib/api'

type Step = 1 | 2 | 3

type Props = {
  open: boolean
  onClose: () => void
  vehicleId?: string
  vehicleTitle?: string
  accent?: string
}

export function InquiryModal({
  open,
  onClose,
  vehicleId,
  vehicleTitle,
  accent = '#c9a227',
}: Props) {
  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setStep(1)
      setErr(null)
      setLoading(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  async function submit() {
    setErr(null)
    setLoading(true)
    try {
      await apiFetch('/api/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          message,
          vehicleId,
        }),
      })
      setStep(3)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Envoi impossible')
    } finally {
      setLoading(false)
    }
  }

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.button
            type="button"
            aria-label="Fermer"
            className="absolute inset-0 bg-[#0a0c0f]/65 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-white/95 via-white/90 to-stone-50/95 shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_25px_80px_-20px_rgba(15,20,25,0.55),0_0_120px_-30px_var(--glow)]"
            style={
              {
                '--glow': accent,
              } as React.CSSProperties
            }
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          >
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-40 blur-3xl"
              style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
            />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-[#1a3c34]/20 blur-3xl" />

            <div className="relative border-b border-white/40 bg-white/40 px-6 py-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    {vehicleTitle ? 'Intérêt véhicule' : 'Concierge RAA'}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-stone-900">
                    {vehicleTitle
                      ? `Vous aimez « ${vehicleTitle} »` 
                      : 'Parlons de votre projet'}
                  </h2>
                  {vehicleTitle && (
                    <p className="mt-1 text-sm text-stone-600">
                      Une expérience simple, en deux étapes.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-stone-200/80 bg-white/80 px-2.5 py-1 text-sm text-stone-500 shadow-sm transition hover:bg-white"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 flex gap-1">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition ${
                      step >= s ? 'opacity-100' : 'opacity-25'
                    }`}
                    style={{ background: accent }}
                  />
                ))}
              </div>
            </div>

            <div className="relative px-6 py-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-stone-600">
                      Laissez-nous vos coordonnées — notre équipe vous répond
                      en personne, rapidement.
                    </p>
                    <label className="block">
                      <span className="text-xs font-medium text-stone-600">
                        Nom complet
                      </span>
                      <input
                        required
                        className="mt-1.5 w-full rounded-2xl border border-stone-200/80 bg-white/70 px-4 py-3 text-stone-900 shadow-inner outline-none ring-0 transition focus:border-[#1a3c34]/40 focus:shadow-[0_0_0_3px_rgba(26,60,52,0.12)]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-stone-600">
                        Email
                      </span>
                      <input
                        type="email"
                        required
                        className="mt-1.5 w-full rounded-2xl border border-stone-200/80 bg-white/70 px-4 py-3 text-stone-900 shadow-inner outline-none transition focus:border-[#1a3c34]/40 focus:shadow-[0_0_0_3px_rgba(26,60,52,0.12)]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-stone-600">
                        Téléphone (WhatsApp)
                      </span>
                      <input
                        className="mt-1.5 w-full rounded-2xl border border-stone-200/80 bg-white/70 px-4 py-3 text-stone-900 shadow-inner outline-none transition focus:border-[#1a3c34]/40 focus:shadow-[0_0_0_3px_rgba(26,60,52,0.12)]"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+229 …"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (!name.trim() || !email.trim()) return
                        setStep(2)
                      }}
                      className="mt-2 w-full rounded-2xl bg-gradient-to-r from-[#e8d48b] via-[#c9a227] to-[#e8d48b] py-3.5 text-sm font-semibold text-[#0f1419] shadow-lg transition hover:brightness-105"
                      style={{ backgroundImage: `linear-gradient(135deg, ${accent}, #e8d48b, #c9a227)` }}
                    >
                      Continuer
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-stone-600">
                      Un court message pour personnaliser votre demande :
                      rendez-vous, financement, reprise…
                    </p>
                    <label className="block">
                      <span className="text-xs font-medium text-stone-600">
                        Votre message
                      </span>
                      <textarea
                        required
                        rows={5}
                        className="mt-1.5 w-full resize-none rounded-2xl border border-stone-200/80 bg-white/70 px-4 py-3 text-stone-900 shadow-inner outline-none transition focus:border-[#1a3c34]/40 focus:shadow-[0_0_0_3px_rgba(26,60,52,0.12)]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Bonjour, je souhaite…"
                        autoFocus
                      />
                    </label>
                    {err && (
                      <p className="text-sm text-red-600">{err}</p>
                    )}
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="rounded-2xl border border-stone-200 bg-white/80 px-5 py-3 text-sm font-medium text-stone-700 hover:bg-white"
                      >
                        Retour
                      </button>
                      <button
                        type="button"
                        disabled={loading || message.trim().length < 5}
                        onClick={() => submit()}
                        className="rounded-2xl bg-[#1a3c34] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#234d43] disabled:opacity-50"
                      >
                        {loading ? 'Envoi…' : 'Envoyer ma demande'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="s3"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-4 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, delay: 0.05 }}
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl text-white shadow-[0_0_40px_-15px_var(--accent)]"
                      style={{ background: `linear-gradient(135deg, ${accent}, #1a3c34)` }}
                    >
                      ✓
                    </motion.div>
                    <h3 className="mt-5 text-lg font-semibold text-stone-900">
                      Demande reçue avec élégance
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      Une personne de l’équipe RAA vous contacte très bientôt
                      pour la suite — merci de votre confiance.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-8 rounded-2xl border border-stone-200 bg-white/90 px-6 py-2.5 text-sm font-medium text-stone-800 hover:bg-white"
                    >
                      Fermer
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (typeof document === 'undefined') return null
  return createPortal(modal, document.body)
}
