import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { Logo } from '../components/Logo.jsx'
import { HomeIcon } from '../components/Icons.jsx'
import { useAuth } from '../context/auth-context'

export default function NotFound() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-7 px-6 text-center">
      <Logo size="lg" />

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-brand-600">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          This page drifted out of the flow
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-400">
          The link you followed does not exist inside PayFlow. Head back to your wallet and keep
          the money moving.
        </p>
      </div>

      <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
        <Button size="lg" leftIcon={HomeIcon}>
          {isAuthenticated ? 'Back to dashboard' : 'Create a wallet'}
        </Button>
      </Link>

      <p className="text-xs text-ink-300">PayFlow · modern digital wallet</p>
    </div>
  )
}
