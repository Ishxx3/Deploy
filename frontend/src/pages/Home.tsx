import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

export function Home() {
  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden bg-[#0a1210] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1920&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1210]/95 via-[#0f1f1a]/88 to-[#1a3c34]/75" />
          <motion.div
            className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#c9a227]/25 blur-[100px] animate-pulse-glow"
            aria-hidden
          />
          <motion.div
            className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-emerald-500/15 blur-[90px] animate-float"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col justify-center px-4 py-24 md:min-h-[88vh] md:py-32">
          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={0}
            className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c9a227]/95"
          >
            Renaissance Automobile Africaine
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={1}
            className="mt-6 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl md:leading-[1.05]"
          >
            La mobilité retrouve{' '}
            <span className="text-gradient-gold bg-[linear-gradient(135deg,#f4e4a8,#c9a227,#8b6914)] bg-clip-text text-transparent">
              noblesse & sens
            </span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={2}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-stone-200/95 md:text-xl"
          >
            Récupération, réhabilitation mécanique, remise sur le marché à prix
            justes — une chaîne de valeur locale, transparente et exigeante.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={3}
            className="mt-12 flex flex-wrap gap-4"
          >
            <Link
              to="/vehicules"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-8 py-4 text-sm font-semibold text-[#0f1419] shadow-[0_0_40px_-10px_rgba(201,162,39,0.9)] transition hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #e8d48b, #c9a227, #a68516)',
              }}
            >
              <span className="relative z-10">Explorer le parc</span>
              <span className="absolute inset-0 translate-x-[-100%] bg-white/30 transition group-hover:translate-x-[100%] duration-700" />
            </Link>
            <Link
              to="/projet"
              className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
            >
              Vision du projet
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="mt-20 grid max-w-3xl grid-cols-3 gap-6 border-t border-white/15 pt-10 md:gap-10"
          >
            {[
              { k: 'Actifs', v: 'Relocalisés' },
              { k: 'Marché', v: 'Accessible' },
              { k: 'Impact', v: 'Local' },
            ].map((s) => (
              <div key={s.k}>
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                  {s.k}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-white md:text-xl">
                  {s.v}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-stone-900 md:text-4xl"
          >
            Une vision industrielle pour le Bénin
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-stone-600"
          >
            Du problème des véhicules immobilisés à une offre structurée :
            inspection, réparation, conformité, distribution.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3 md:grid-rows-2 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel md:row-span-2 rounded-3xl p-8 md:p-10"
          >
            <div className="h-1.5 w-14 rounded-full bg-gradient-to-r from-[#c9a227] to-transparent" />
            <h3 className="mt-6 text-xl font-semibold text-stone-900">
              Projet en 4 temps
            </h3>
            <ol className="mt-6 space-y-4 text-sm leading-relaxed text-stone-600">
              <li className="flex gap-3">
                <span className="font-semibold text-[#1a3c34]">01</span>
                Identification & sourcing avec les administrations et partenaires.
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-[#1a3c34]">02</span>
                Diagnostic et réhabilitation avec les ateliers certifiés.
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-[#1a3c34]">03</span>
                Contrôle qualité et conformité avant circulation.
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-[#1a3c34]">04</span>
                Mise en vente accompagnée et suivi client.
              </li>
            </ol>
          </motion.div>

          {[
            {
              title: 'Seconde vie',
              text: 'Valoriser l’existant plutôt que l’abandon : un geste économique et écologique.',
            },
            {
              title: 'Accès élargi',
              text: 'Des prix alignés sur la réalité locale, sans compromis sur la sécurité.',
            },
            {
              title: 'Écosystème',
              text: 'Emplois mécaniques, logistique, formation — la chaîne se renforce.',
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i }}
              className="glass-panel group rounded-3xl p-7 transition hover:shadow-[0_20px_60px_-24px_rgba(26,60,52,0.35)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1a3c34]/10 text-sm font-bold text-[#1a3c34] transition group-hover:bg-[#1a3c34] group-hover:text-[#c9a227]">
                {i + 1}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-stone-900">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {c.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3c34] via-[#142e28] to-[#0f1419]" />
        <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_50%,rgba(201,162,39,0.35),transparent_50%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 px-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Prêt pour l’accompagnement CCI & institutions ?
            </h2>
            <p className="mt-3 max-w-xl text-stone-300">
              Structurons ensemble une initiative visible, mesurable et alignée
              sur les standards locaux.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Ouvrir la conversation
          </Link>
        </div>
      </section>
    </>
  )
}
