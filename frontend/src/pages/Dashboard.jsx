import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert.jsx'
import Avatar from '../components/Avatar.jsx'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Skeleton from '../components/Skeleton.jsx'
import {
  ActivityIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  ClockIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  RefreshIcon,
  SendIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
  WalletIcon,
} from '../components/Icons.jsx'
import { useAuth } from '../context/auth-context'
import { useToast } from '../context/toast-context'
import { useBalance } from '../hooks/useBalance.js'
import { useCountUp } from '../hooks/useCountUp.js'
import { readActivity } from '../lib/activity.js'
import { STORAGE_KEYS, readStorage, writeStorage } from '../lib/storage'
import { formatCurrency, formatRelativeTime, getDisplayName, getGreeting, maskId } from '../lib/format'

// DASHBOARD_PART_2

export default function Dashboard() {
  const { profile, userId } = useAuth()
  const toast = useToast()
  const { balance, isLoading, isRefreshing, error, refresh } = useBalance()

  const [hidden, setHidden] = useState(() => readStorage(STORAGE_KEYS.balanceHidden) === 'true')
  const [activity] = useState(() => readActivity())
  const [copied, setCopied] = useState(false)

  const animatedBalance = useCountUp(balance || 0)

  const toggleHidden = () => {
    const next = !hidden
    setHidden(next)
    writeStorage(STORAGE_KEYS.balanceHidden, String(next))
  }

  const handleRefresh = async () => {
    const value = await refresh()
    if (value !== null) toast.success('Balance updated just now.')
  }

  const handleCopy = async () => {
    if (!userId) return
    try {
      await navigator.clipboard.writeText(userId)
      setCopied(true)
      toast.success('PayFlow user id copied to clipboard.')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Your browser blocked clipboard access.')
    }
  }

  const maskedUserId = maskId(userId, 6)
  const balanceText = hidden ? '₹ ••••••' : formatCurrency(animatedBalance)

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar profile={profile} size="lg" className="hidden sm:inline-flex" />
          <div>
            <p className="text-sm font-medium text-ink-400">{getGreeting()}, welcome back</p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {getDisplayName(profile)} 👋
            </h1>
            <p className="mt-1 text-sm text-ink-400">
              Your PayFlow wallet is active and ready to move money.
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-100 bg-white px-3.5 py-2 text-xs font-semibold text-brand-700 shadow-soft">
          <SparklesIcon size={14} />
          Wallet active
        </span>
      </section>

      {error ? (
        <Alert
          tone="error"
          title="We could not load your balance"
          action={
            <Button size="sm" variant="secondary" leftIcon={RefreshIcon} onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error.message}
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#081123_0%,#142a6e_55%,#2049d6_100%)] p-6 text-white shadow-lift sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-aqua-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-100/80">
                <WalletIcon size={15} />
                Available balance
              </span>

              <div className="mt-4 flex items-baseline">
                {isLoading ? (
                  <Skeleton tone="dark" className="h-11 w-48 rounded-xl sm:h-14 sm:w-60" />
                ) : (
                  <p className="text-4xl font-bold tracking-tight sm:text-5xl">{balanceText}</p>
                )}
              </div>

              <p className="mt-3 text-sm text-brand-100/70">
                {isLoading
                  ? 'Fetching your live balance…'
                  : 'Live from the PayFlow API · refresh anytime'}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={toggleHidden}
                aria-label={hidden ? 'Show balance' : 'Hide balance'}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur transition-all duration-200 hover:bg-white/20 active:scale-95"
              >
                {hidden ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                aria-label="Refresh balance"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur transition-all duration-200 hover:bg-white/20 active:scale-95 disabled:opacity-60"
              >
                <RefreshIcon size={17} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          <div className="relative mt-7 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 backdrop-blur transition-colors hover:bg-white/20"
            >
              <span className="text-xs text-brand-100/70">PayFlow ID</span>
              <span className="font-mono text-xs font-semibold text-white">{maskedUserId}</span>
              {copied ? (
                <CheckCircleIcon size={15} className="text-aqua-200" />
              ) : (
                <CopyIcon size={15} className="text-aqua-200" />
              )}
            </button>

            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-brand-100/80 backdrop-blur">
              <ShieldCheckIcon size={14} className="text-aqua-200" />
              Signed JWT session
            </span>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Link
            to="/send"
            className="group rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 p-5 text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <SendIcon size={20} />
            </span>
            <span className="mt-4 flex items-center justify-between gap-2">
              <span className="text-base font-semibold">Send Money</span>
              <ArrowUpRightIcon
                size={18}
                className="opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </span>
            <span className="mt-0.5 block text-sm text-brand-100/85">
              Transfer to any PayFlow user in seconds.
            </span>
          </Link>

          <Link
            to="/profile"
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-card"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <UserIcon size={20} />
            </span>
            <span className="mt-4 flex items-center justify-between gap-2">
              <span className="text-base font-semibold text-ink-900">Profile</span>
              <ArrowUpRightIcon
                size={18}
                className="text-ink-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-500"
              />
            </span>
            <span className="mt-0.5 block text-sm text-ink-400">
              Account details, IDs and session.
            </span>
          </Link>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-ink-900">Recent activity</h2>
            <p className="mt-0.5 text-xs text-ink-400">
              Transfers completed from this device.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1 text-xs font-medium text-ink-500">
            <ClockIcon size={13} />
            No history endpoint yet
          </span>
        </header>

        {activity.length === 0 ? (
          <EmptyState
            icon={ActivityIcon}
            title="No transactions yet"
            description="Once you send money, the transfers you complete on this device will appear here. The current API does not expose a transaction history endpoint."
            action={
              <Link to="/send">
                <Button size="sm" leftIcon={SendIcon}>
                  Send your first payment
                </Button>
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {activity.map((entry) => (
              <li key={entry.id} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <CheckCircleIcon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    Sent to {maskId(entry.to, 6)}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-400">
                    {formatRelativeTime(entry.at)} · Ref {entry.reference}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-ink-900">
                  − {formatCurrency(entry.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 p-4 text-sm text-brand-800">
        <InfoIcon size={18} className="mt-0.5 shrink-0 text-brand-500" />
        <p className="leading-relaxed">
          Your balance is read from{' '}
          <span className="font-mono text-xs font-semibold">GET /account/balance</span> on every
          visit and transfers post to{' '}
          <span className="font-mono text-xs font-semibold">POST /account/transfer</span> — both
          exactly as the existing backend exposes them.
        </p>
      </div>

    </div>
  )
}
