import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Alert from '../components/Alert.jsx'
import Avatar from '../components/Avatar.jsx'
import Button from '../components/Button.jsx'
import Skeleton from '../components/Skeleton.jsx'
import {
  AtSignIcon,
  CheckCircleIcon,
  CopyIcon,
  InfoIcon,
  LogOutIcon,
  RefreshIcon,
  ShieldCheckIcon,
  UserIcon,
  WalletIcon,
} from '../components/Icons.jsx'
import { useAuth } from '../context/auth-context'
import { useToast } from '../context/toast-context'
import { useBalance } from '../hooks/useBalance.js'
import { API_BASE } from '../lib/api.js'
import { formatCurrency, getDisplayName } from '../lib/format.js'

function InfoRow({ icon: Icon, label, children, action }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-400">{label}</p>
        <div className="mt-0.5 text-sm font-semibold text-ink-900">{children}</div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

InfoRow.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string,
  children: PropTypes.node,
  action: PropTypes.node,
}

export default function Profile() {
  const { profile, userId, signOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { balance, isLoading, isRefreshing, error: balanceError, refresh } = useBalance()

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!userId) return
    try {
      await navigator.clipboard.writeText(userId)
      setCopied(true)
      toast.success('PayFlow user id copied — share it to receive money.')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Your browser blocked clipboard access.')
    }
  }

  const handleLogout = () => {
    signOut()
    toast.info('You have been signed out of PayFlow.')
    navigate('/signup', { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#081123_0%,#142a6e_55%,#2049d6_100%)] p-6 text-white shadow-lift sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full bg-aqua-400/25 blur-3xl" />

        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <Avatar profile={profile} size="xl" ring={false} className="ring-4 ring-white/20" />

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {getDisplayName(profile)}
            </h1>
            <p className="mt-1 text-sm text-brand-100/80">
              @{(profile && profile.username) || 'payflow'}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-aqua-100 backdrop-blur">
                <ShieldCheckIcon size={13} />
                Verified wallet
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-aqua-100 backdrop-blur">
                <WalletIcon size={13} />
                Live balance
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <header className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-ink-900">Account information</h2>
          <p className="mt-0.5 text-xs text-ink-400">
            Everything the PayFlow API knows about this wallet.
          </p>
        </header>

        <div className="divide-y divide-slate-100">
          <InfoRow icon={UserIcon} label="Full name">
            {getDisplayName(profile)}
          </InfoRow>

          <InfoRow icon={AtSignIcon} label="Username">
            @{(profile && profile.username) || 'payflow'}
          </InfoRow>

          <InfoRow
            icon={CopyIcon}
            label="PayFlow user id"
            action={
              <Button
                size="sm"
                variant="secondary"
                leftIcon={copied ? CheckCircleIcon : CopyIcon}
                onClick={handleCopy}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            }
          >
            <span className="block break-all font-mono text-xs font-medium text-ink-700">
              {userId || 'Unavailable'}
            </span>
          </InfoRow>

          <InfoRow
            icon={WalletIcon}
            label="Available balance"
            action={
              <Button
                size="sm"
                variant="ghost"
                leftIcon={RefreshIcon}
                loading={isRefreshing}
                onClick={refresh}
              >
                Refresh
              </Button>
            }
          >
            {isLoading ? <Skeleton className="h-5 w-32" /> : formatCurrency(balance || 0)}
          </InfoRow>

          <InfoRow icon={ShieldCheckIcon} label="Account status">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircleIcon size={13} />
              Active
            </span>
          </InfoRow>

          <InfoRow icon={InfoIcon} label="API base">
            <span className="block break-all font-mono text-xs font-medium text-ink-700">
              {API_BASE}
            </span>
          </InfoRow>
        </div>
      </section>

      {balanceError ? (
        <Alert
          tone="warning"
          title="Balance unavailable"
          action={
            <Button size="sm" variant="secondary" leftIcon={RefreshIcon} onClick={refresh}>
              Retry
            </Button>
          }
        >
          {balanceError.message}
        </Alert>
      ) : null}

      <Alert tone="info" title="How your PayFlow session works">
        Signing up returns a JSON Web Token that this browser stores locally. The API verifies it on
        every balance and transfer request, and the backend does not expose a sign-in route yet —
        clearing this browser&apos;s storage signs you out for good.
      </Alert>

      <section className="rounded-2xl border border-rose-200/70 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-base font-semibold text-ink-900">Sign out</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
          This removes the stored session token from this device. Because the backend has no sign-in
          endpoint, you would need to create a wallet again to come back.
        </p>
        <Button variant="danger" className="mt-5" leftIcon={LogOutIcon} onClick={handleLogout}>
          Log out of PayFlow
        </Button>
      </section>
    </div>
  )
}
