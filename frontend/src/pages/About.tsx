import { motion } from 'framer-motion'

export function About() {
  const blocks = [
    {
      title: 'Contexte',
      body: `Le marché automobile au Bénin connaît une forte demande de véhicules d’occasion accessibles. Beaucoup de véhicules restent immobilisés (fourrières, sinistres réparables, sous-valorisation). Parallèlement, des citoyens cherchent des moyens de transport abordables et des mécaniciens qualifiés cherchent du travail.`,
    },
    {
      title: 'Présentation',
      body: `RAA récupère des véhicules immobilisés ou sous-exploités, les réhabilite mécaniquement, puis les remet sur le marché à des prix accessibles. Le modèle donne une seconde vie aux véhicules, facilite l’accès à l’automobile, valorise des actifs existants et crée des emplois en mécanique et logistique.`,
    },
    {
      title: 'Objectifs',
      items: [
        'Dynamiser le marché automobile local',
        'Réduire les véhicules abandonnés',
        'Encourager l’emploi technique et la formation des jeunes mécaniciens',
        'Développer une activité économique durable',
      ],
    },
    {
      title: 'Approche',
      items: [
        'Administrations (gestion des véhicules immobilisés)',
        'Ateliers de mécanique locaux',
        'Partenaires financiers ou techniques',
        'Institutions d’accompagnement entrepreneurial',
      ],
      footer:
        'Chaque véhicule est inspecté, réparé et remis en circulation dans le respect des normes en vigueur.',
    },
    {
      title: 'Impact attendu',
      items: [
        'Emplois directs et indirects',
        'Valorisation de véhicules inutilisés',
        'Accès à des véhicules à prix raisonnable',
        'Développement du secteur automobile local',
      ],
    },
  ]

  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden px-4 py-16 md:py-20">
      <div className="pointer-events-none absolute -left-40 top-20 h-72 w-72 rounded-full bg-[#c9a227]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-64 w-64 rounded-full bg-[#1a3c34]/15 blur-[90px]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
          Vision
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900 md:text-5xl">
          Le projet RAA
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-stone-600">
          Transformer un problème — véhicules immobilisés ou abandonnés — en
          opportunité économique et sociale, avec une démarche professionnelle
          et conforme aux réglementations.
        </p>
      </motion.div>

      <div className="relative mt-14 space-y-8">
        {blocks.map((b, i) => (
          <motion.article
            key={b.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: 0.06 * i, duration: 0.45 }}
            className="glass-panel rounded-3xl border-l-[3px] border-l-[#c9a227] p-6 pl-7 shadow-[0_20px_60px_-30px_rgba(15,20,25,0.2)] md:p-8"
          >
            <h2 className="text-xl font-semibold text-[#1a3c34]">{b.title}</h2>
            {'body' in b && b.body && (
              <p className="mt-4 whitespace-pre-line leading-relaxed text-stone-600">
                {b.body}
              </p>
            )}
            {'items' in b && b.items && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-stone-600">
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            )}
            {'footer' in b && b.footer && (
              <p className="mt-4 text-sm text-stone-500">{b.footer}</p>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  )
}
