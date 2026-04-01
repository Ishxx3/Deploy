import { Link, NavLink, Outlet } from 'react-router-dom'

function NavItem({
  to,
  end,
  children,
}: {
  to: string
  end?: boolean
  children: string
}) {
  return (
    <NavLink to={to} end={end} className="group relative px-3 py-2">
      {({ isActive }) => (
        <>
          <span
            className={`text-[13px] font-medium tracking-wide transition-colors md:text-sm ${
              isActive
                ? 'text-[#1a3c34]'
                : 'text-stone-600 group-hover:text-stone-900'
            }`}
          >
            {children}
          </span>
          <span
            className={`absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full transition-all ${
              isActive ? 'bg-[#c9a227] opacity-100' : 'bg-[#c9a227] opacity-0 group-hover:opacity-40'
            }`}
            aria-hidden
          />
        </>
      )}
    </NavLink>
  )
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-stone-200/90 bg-white/92 shadow-[0_8px_32px_-18px_rgba(15,20,25,0.12)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Mobile / tablette : deux bandes */}
          <div className="flex flex-col gap-0 md:h-[4.25rem] md:flex-row md:items-center md:justify-between md:gap-6">
            {/* Ligne marque */}
            <div className="flex h-[3.75rem] items-center justify-between md:h-auto md:min-w-[220px] md:justify-start md:gap-3">
              <Link
                to="/"
                className="group flex min-w-0 items-center gap-3 rounded-xl outline-none ring-[#1a3c34]/25 focus-visible:ring-2"
              >
                <img
                  src="/logo-mark.svg"
                  alt="RAA"
                  width={48}
                  height={48}
                  className="h-11 w-11 shrink-0 drop-shadow md:h-12 md:w-12"
                />
                <span className="min-w-0 text-left leading-tight">
                  <span className="block font-bold tracking-tight text-stone-900 md:text-[1.05rem]">
                    RAA
                  </span>
                  <span className="hidden text-[10px] font-medium uppercase leading-snug tracking-[0.14em] text-stone-500 sm:block">
                    Renaissance Automobile
                    <span className="block font-normal tracking-[0.08em] text-stone-400">
                      Africaine · Bénin
                    </span>
                  </span>
                  <span className="text-[11px] text-stone-500 sm:hidden">Bénin</span>
                </span>
              </Link>

              {/* Espace pro — visible sur mobile dans la même ligne */}
              <NavLink
                to="/admin"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#1a3c34] to-[#0f241f] px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-[#1a3c34]/25 transition hover:brightness-110 md:hidden"
              >
                Espace pro
              </NavLink>
            </div>

            {/* Navigation — centrée sur desktop */}
            <nav
              className="flex min-h-[2.75rem] items-center justify-between gap-0 border-t border-stone-100 pb-2 pt-1 md:min-h-0 md:flex-1 md:justify-center md:border-t-0 md:py-0"
              aria-label="Navigation principale"
            >
              <div className="flex w-full items-center justify-between px-0 sm:justify-center sm:gap-1 md:w-auto md:rounded-2xl md:border md:border-stone-200/95 md:bg-stone-50/90 md:px-2 md:py-1 md:shadow-inner">
                <NavItem to="/" end>
                  Accueil
                </NavItem>
                <NavItem to="/projet">Projet</NavItem>
                <NavItem to="/vehicules">Véhicules</NavItem>
                <NavItem to="/contact">Contact</NavItem>
              </div>
            </nav>

            {/* Espace pro — desktop uniquement à droite */}
            <div className="hidden min-w-[140px] justify-end md:flex">
              <NavLink
                to="/admin"
                className="inline-flex items-center justify-center rounded-xl border border-[#c9a227]/35 bg-gradient-to-b from-[#1a3c34] to-[#0f241f] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#1a3c34]/20 transition hover:brightness-110"
              >
                Espace pro
              </NavLink>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="relative overflow-hidden border-t border-stone-800/90 bg-[#07090c] text-stone-400">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/45 to-transparent" />
        <div className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#1a3c34]/30 blur-[100px]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-3">
              <img
                src="/logo-mark.svg"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 opacity-90"
              />
              <div>
                <p className="font-semibold text-white">RAA</p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed">
                  Donner une seconde vie aux véhicules, faciliter l’accès à
                  l’automobile et créer des emplois au Bénin.
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white">Contact</p>
              <p className="mt-3 text-sm">
                Tél. 01 96 33 56 56 / 01 63 68 09 90
                <br />
                larrykhodal06@gmail.com
                <br />
                dodahobriwel@gmail.com
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Porteurs</p>
              <p className="mt-3 text-sm">
                HOUNKPE Larry Khodal Mensanh
                <br />
                DODAHO Stanislas Briwel
              </p>
            </div>
          </div>
          <p className="mt-10 border-t border-stone-800 pt-8 text-center text-xs text-stone-600">
            © {new Date().getFullYear()} Renaissance Automobile Africaine — Bénin
          </p>
        </div>
      </footer>
    </div>
  )
}
