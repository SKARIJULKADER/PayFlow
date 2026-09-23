import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Avatar from './Avatar.jsx'
import { Logo } from './Logo.jsx'
import {
  ChevronRightIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  SendIcon,
  ShieldCheckIcon,
  UserIcon,
  XIcon,
} from './Icons.jsx'
import { useAuth } from '../context/auth-context'
import { useToast } from '../context/toast-context'
import { useOnClickOutside } from '../hooks/useOnClickOutside'
import { getDisplayName } from '../lib/format'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/send', label: 'Send Money', icon: SendIcon },
  { to: '/profile', label: 'Profile', icon: UserIcon },
]

function navLinkClasses({ isActive }) {
  return [
    'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200',
    isActive
      ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-500/20'
      : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900',
  ].join(' ')
}

export default function Navbar() {
  const { profile, signOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  useOnClickOutside(menuRef, closeMenu, { enabled: menuOpen })

  useEffect(() => {
    setMenuOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  const handleSignOut = () => {
    signOut()
    toast.info('You have been signed out of PayFlow.')
    navigate('/signup', { replace: true })
  }

  const menuLinks = NAV_LINKS.map(({ to, label, icon: Icon }) => (
    <Link
      key={to}
      to={to}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
    >
      <Icon size={17} className="text-ink-400" />
      {label}
    </Link>
  ))

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/dashboard"
          aria-label="PayFlow dashboard"
          className="rounded-xl transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
        >
          <Logo size="md" />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navLinkClasses}>
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 lg:inline-flex">
            <ShieldCheckIcon size={14} />
            Secure session
          </span>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Account menu"
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 pr-2 shadow-soft transition-all duration-200 hover:border-slate-300 hover:shadow-card active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
            >
              <Avatar profile={profile} size="sm" />
              <ChevronRightIcon
                size={15}
                className={`text-ink-300 transition-transform duration-200 ${
                  menuOpen ? 'rotate-[270deg]' : 'rotate-90'
                }`}
              />
            </button>
            {menuOpen ? (
              <div
                role="menu"
                className="absolute right-0 z-50 mt-2 w-64 origin-top-right animate-pop-in overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lift"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-br from-brand-50 to-white p-4">
                  <Avatar profile={profile} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {getDisplayName(profile)}
                    </p>
                    <p className="truncate text-xs text-ink-400">
                      @{(profile && profile.username) || 'payflow'}
                    </p>
                  </div>
                </div>

                <div className="p-2">{menuLinks}</div>

                <div className="border-t border-slate-100 p-2">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOutIcon size={17} />
                    Log out
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-ink-600 shadow-soft transition-all duration-200 hover:border-slate-300 hover:text-ink-900 active:scale-[0.98] md:hidden"
          >
            {mobileOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>
      {mobileOpen ? (
        <div className="border-t border-slate-200/70 bg-white/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {menuLinks}
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
            >
              <LogOutIcon size={17} />
              Log out
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
