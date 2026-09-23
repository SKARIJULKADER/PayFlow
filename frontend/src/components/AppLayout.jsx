import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import { Logo } from './Logo.jsx'

/** Shell for authenticated screens: navbar + animated page slot + footer. */
export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-14 pt-6 sm:px-6 sm:pt-8">
        {/* Keying on the pathname re-runs the entrance animation per page. */}
        <div key={location.pathname} className="animate-fade-up">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/60 px-4 py-6 backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-xs text-ink-400 sm:flex-row sm:text-sm">
          <Logo size="sm" />
          <p>
            © {new Date().getFullYear()} PayFlow · Balances are always fetched live from the
            PayFlow API.
          </p>
        </div>
      </footer>
    </div>
  )
}
