import { useState } from 'react'
import { motion } from 'framer-motion'
import { InquiryModal } from '../components/InquiryModal'

export function Contact() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden px-4 py-16 md:py-24">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#c9a227]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#1a3c34]/20 blur-[100px]" />

      <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Concierge
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900 md:text-5xl">
            Un échange
            <span className="text-gradient-gold bg-[linear-gradient(135deg,#c9a227,#f5ebc8)] bg-clip-text text-transparent">
              {' '}
              sur-mesure
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-600">
            Partenariats institutionnels, presse, investisseurs ou simple demande
            d’information : nous vous répondons avec soin.
          </p>
          <div className="mt-10 space-y-5 rounded-3xl border border-white/60 bg-white/50 p-6 text-sm shadow-[0_16px_50px_-24px_rgba(15,20,25,0.25)] backdrop-blur-xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Téléphone
              </p>
              <p className="mt-1 text-stone-600">
                01 96 33 56 56 / 01 63 68 09 90
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Email
              </p>
              <p className="mt-1 text-stone-600">
                larrykhodal06@gmail.com
                <br />
                dodahobriwel@gmail.com
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel flex flex-col justify-center rounded-[2rem] p-10 md:p-12"
        >
          <h2 className="text-xl font-semibold text-stone-900">
            Ouvrir une demande
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Parcours guidé, design premium — vos informations sont traitées
            confidentiellement par l’équipe RAA.
          </p>
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative mt-8 overflow-hidden rounded-2xl border border-stone-200/80 bg-gradient-to-br from-[#1a3c34] to-[#0f1f1a] py-4 text-sm font-semibold text-white shadow-[0_20px_50px_-20px_rgba(26,60,52,0.9)]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Démarrer la demande</span>
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,162,39,0.35),transparent_50%)] opacity-0 transition group-hover:opacity-100" />
          </motion.button>
        </motion.div>
      </div>

      <InquiryModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
