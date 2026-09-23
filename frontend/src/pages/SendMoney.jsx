import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import Skeleton from '../components/Skeleton.jsx'
import TextField from '../components/TextField.jsx'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  InfoIcon,
  RefreshIcon,
  SendIcon,
  ShieldCheckIcon,
  UserIcon,
  WalletIcon,
  XIcon,
} from '../components/Icons.jsx'
import { useAuth } from '../context/auth-context'
import { useToast } from '../context/toast-context'
import { useBalance } from '../hooks/useBalance.js'
import { useOnClickOutside } from '../hooks/useOnClickOutside.js'
import { api, isUnauthorized } from '../lib/api.js'
import { recordActivity } from '../lib/activity.js'
import { formatCurrency, generateReference, getDisplayName, isValidUserId, maskId } from '../lib/format.js'

const QUICK_AMOUNTS = [100, 500, 1000, 5000]

function validateTransfer({ recipient, amount, balance, userId }) {
  const errors = {}
  const trimmedRecipient = recipient.trim()

  if (!trimmedRecipient) {
    errors.recipient = 'Enter the recipient PayFlow user id.'
  } else if (!isValidUserId(trimmedRecipient)) {
    errors.recipient = 'A PayFlow user id is 24 characters, e.g. 65f1c2a8b9d4e5f6a7b8c9d0.'
  } else if (userId && trimmedRecipient.toLowerCase() === String(userId).toLowerCase()) {
    errors.recipient = 'That is your own wallet — pick a different recipient.'
  }

  if (!amount) {
    errors.amount = 'Enter an amount to send.'
  } else {
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) {
      errors.amount = 'Enter an amount greater than ₹0.'
    } else if (balance !== null && value > balance) {
      errors.amount = `Insufficient balance — you can send up to ${formatCurrency(balance)}.`
    }
  }

  return errors
}

function friendlyTransferError(error) {
  const message = (error && error.message) || ''

  if (/insufficient/i.test(message)) {
    return 'Insufficient balance — your wallet does not hold enough funds for this transfer.'
  }
  if (/invalid account/i.test(message)) {
    return 'Invalid account — we could not find a PayFlow wallet with that user id.'
  }
  return message || 'We could not complete this transfer. Please try again.'
}

export default function SendMoney() {
  const { profile, userId, token, signOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const { balance, isLoading, isRefreshing, error: balanceError, refresh } = useBalance()

  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)

  const panelRef = useRef(null)
  useOnClickOutside(panelRef, () => setConfirmOpen(false), { enabled: confirmOpen })

  const numericAmount = Number(amount)
  const hasValidAmount = Number.isFinite(numericAmount) && numericAmount > 0
  const amountValue = hasValidAmount ? numericAmount : 0
  const balanceValue = balance === null ? 0 : balance

  const clearFieldError = (field) => {
    setFieldErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const handleRecipientChange = (event) => {
    setRecipient(event.target.value.replace(/\s+/g, ''))
    clearFieldError('recipient')
  }

  const handleAmountChange = (event) => {
    const next = event.target.value
    if (next === '' || /^\d{0,9}(\.\d{0,2})?$/.test(next)) {
      setAmount(next)
      clearFieldError('amount')
    }
  }

  const applyQuickAmount = (value) => {
    setAmount(String(value))
    clearFieldError('amount')
  }

  const handleMax = () => {
    if (balance !== null) {
      setAmount(balance.toFixed(2))
      clearFieldError('amount')
    }
  }

  const handleReview = (event) => {
    event.preventDefault()

    const errors = validateTransfer({ recipient, amount, balance, userId })
    setFieldErrors(errors)
    setFormError(null)
    if (Object.keys(errors).length) return

    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    setFormError(null)

    try {
      await api.transfer({ token, to: recipient.trim(), amount: amountValue })

      const transfer = {
        amount: amountValue,
        to: recipient.trim(),
        reference: generateReference(),
        at: new Date().toISOString(),
      }

      recordActivity(transfer)
      setSuccess(transfer)
      setConfirmOpen(false)
      toast.success(`${formatCurrency(amountValue)} sent successfully.`)
      refresh()
    } catch (error) {
      setConfirmOpen(false)

      if (isUnauthorized(error)) {
        toast.error('Your session expired. Please sign in again.')
        signOut()
        navigate('/signup', { replace: true })
        return
      }

      const message = friendlyTransferError(error)
      setFormError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSuccess(null)
    setRecipient('')
    setAmount('')
    setFieldErrors({})
    setFormError(null)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          aria-label="Back to dashboard"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-ink-500 shadow-soft transition-all duration-200 hover:border-slate-300 hover:text-ink-900 active:scale-95"
        >
          <ArrowLeftIcon size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Send money
          </h1>
          <p className="mt-0.5 text-sm text-ink-400">
            Transfer instantly to any PayFlow user id.
          </p>
        </div>
      </div>

      {formError ? (
        <Alert tone="error" title="Transfer could not be completed">
          {formError}
        </Alert>
      ) : null}

      {balanceError ? (
        <Alert
          tone="warning"
          title="We could not load your balance"
          action={
            <Button size="sm" variant="secondary" leftIcon={RefreshIcon} onClick={refresh}>
              Retry
            </Button>
          }
        >
          {balanceError.message} You can still send money, but the amount cannot be checked against
          your wallet first.
        </Alert>
      ) : null}

      {success ? (
        <>
          <div className="mx-auto w-full max-w-lg animate-pop-in rounded-2xl border border-slate-200/80 bg-white p-7 text-center shadow-card sm:p-9">
            <span className="mx-auto flex h-20 w-20 animate-scale-check items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/70">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-11 w-11 text-emerald-500"
              >
                <path
                  d="m4.5 12.5 5 5 10-10.5"
                  style={{ strokeDasharray: 48, strokeDashoffset: 48 }}
                  className="animate-draw-check"
                />
              </svg>
            </span>

            <h2 className="mt-6 text-2xl font-bold tracking-tight text-ink-900">
              Payment successful
            </h2>
            <p className="mt-2 text-sm text-ink-400">
              {formatCurrency(success.amount)} is on its way to{' '}
              <span className="font-mono text-xs font-semibold text-ink-700">
                {maskId(success.to, 6)}
              </span>
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-ink-50/70 p-4 text-left text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-ink-400">Reference</span>
                <span className="font-mono text-xs font-semibold text-ink-800">
                  {success.reference}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-ink-400">Status</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircleIcon size={13} />
                  Completed
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-ink-400">Time</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-ink-700">
                  <ClockIcon size={13} />
                  {new Date(success.at).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variant="secondary" fullWidth leftIcon={SendIcon} onClick={resetForm}>
                Send another
              </Button>
              <Link to="/dashboard" className="sm:flex-1">
                <Button fullWidth>Back to dashboard</Button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <form className="grid gap-6 lg:grid-cols-[1.35fr_1fr]" onSubmit={handleReview} noValidate>
          <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink-50/80 px-4 py-3.5">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                <WalletIcon size={15} />
                Available balance
              </span>

              <div className="flex items-center gap-2">
                {isLoading ? (
                  <Skeleton className="h-6 w-28" />
                ) : (
                  <span className="text-lg font-bold tracking-tight text-ink-900">
                    {formatCurrency(balanceValue)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={refresh}
                  aria-label="Refresh balance"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-white hover:text-ink-700"
                >
                  <RefreshIcon size={15} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            <TextField
              label="Recipient user id"
              name="recipient"
              value={recipient}
              onChange={handleRecipientChange}
              placeholder="65f1c2a8b9d4e5f6a7b8c9d0"
              icon={UserIcon}
              autoComplete="off"
              maxLength={24}
              hint="Ask the receiver for the PayFlow ID shown on their profile page."
              error={fieldErrors.recipient}
              required
            />

            <div>
              <TextField
                label="Amount"
                name="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                prefix="₹"
                inputMode="decimal"
                autoComplete="off"
                error={fieldErrors.amount}
                trailing={
                  <button
                    type="button"
                    onClick={handleMax}
                    disabled={balance === null}
                    className="mr-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-brand-600 transition-colors hover:bg-brand-50 disabled:opacity-40"
                  >
                    MAX
                  </button>
                }
              />

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {QUICK_AMOUNTS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => applyQuickAmount(value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 active:scale-95"
                  >
                    ₹{value.toLocaleString('en-IN')}
                  </button>
                ))}
                <span className="ml-auto text-xs text-ink-400">
                  Available {isLoading ? '…' : formatCurrency(balanceValue)}
                </span>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft">
              <h2 className="text-base font-semibold text-ink-900">Transfer summary</h2>
              <p className="mt-0.5 text-xs text-ink-400">
                Nothing leaves your wallet until you confirm.
              </p>

              <dl className="mt-5 space-y-3.5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink-400">From</dt>
                  <dd className="truncate font-medium text-ink-800">{getDisplayName(profile)}</dd>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink-400">To</dt>
                  <dd className="truncate font-mono text-xs font-medium text-ink-800">
                    {recipient ? maskId(recipient, 6) : 'Not set yet'}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink-400">Amount</dt>
                  <dd className="font-semibold text-ink-900">
                    {hasValidAmount ? formatCurrency(amountValue) : '—'}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink-400">Transfer fee</dt>
                  <dd className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <CheckCircleIcon size={13} />
                    ₹0.00
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
                <span className="text-sm font-semibold text-ink-800">Total</span>
                <span className="text-lg font-bold tracking-tight text-ink-900">
                  {hasValidAmount ? formatCurrency(amountValue) : '—'}
                </span>
              </div>

              <Button type="submit" size="lg" fullWidth className="mt-5" rightIcon={SendIcon}>
                Review transfer
              </Button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-400">
                <ShieldCheckIcon size={13} />
                Checked against your live PayFlow balance
              </p>
            </div>
          </aside>

        </form>
      )}

      {confirmOpen ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-ink-950/45 p-4 backdrop-blur-sm sm:items-center">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-transfer-title"
            className="w-full max-w-md animate-pop-in rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lift"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <SendIcon size={20} />
                </span>
                <div>
                  <h2
                    id="confirm-transfer-title"
                    className="text-lg font-bold tracking-tight text-ink-900"
                  >
                    Confirm transfer
                  </h2>
                  <p className="text-xs text-ink-400">Double-check the details before sending</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                aria-label="Close confirmation"
                className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
              >
                <XIcon size={16} />
              </button>
            </div>

            <div className="mt-5 space-y-3 rounded-2xl bg-ink-50/70 p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-ink-400">To</span>
                <span className="truncate font-mono text-xs font-semibold text-ink-800">
                  {maskId(recipient.trim(), 6)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-ink-400">Amount</span>
                <span className="font-semibold text-ink-900">{formatCurrency(amountValue)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-3">
                <span className="font-semibold text-ink-800">Total</span>
                <span className="font-bold text-ink-900">{formatCurrency(amountValue)}</span>
              </div>
              {balance !== null ? (
                <p className="text-xs text-ink-400">
                  Balance after transfer: {formatCurrency(Math.max(balance - amountValue, 0))}
                </p>
              ) : null}
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-brand-50/70 p-3.5 text-xs leading-relaxed text-brand-800">
              <InfoIcon size={15} className="mt-0.5 shrink-0 text-brand-500" />
              <p>Transfers are instant and cannot be reversed once confirmed.</p>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                variant="secondary"
                fullWidth
                disabled={submitting}
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                loading={submitting}
                loadingText="Sending…"
                onClick={handleConfirm}
              >
                Confirm &amp; send {formatCurrency(amountValue)}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  )
}
