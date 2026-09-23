import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ToastContext } from './toast-context'
import { AlertIcon, CheckCircleIcon, InfoIcon, XIcon } from '../components/Icons.jsx'

const AUTO_DISMISS_MS = 4600
const MAX_VISIBLE = 4

const VARIANTS = {
  success: { icon: CheckCircleIcon, iconClass: 'bg-emerald-50 text-emerald-600' },
  error: { icon: AlertIcon, iconClass: 'bg-rose-50 text-rose-600' },
  info: { icon: InfoIcon, iconClass: 'bg-brand-50 text-brand-600' },
}

/** Lightweight toast system (no extra dependencies). */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())
  const counterRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (message, variant = 'info') => {
      counterRef.current += 1
      const id = counterRef.current

      setToasts((current) => [...current, { id, message, variant }].slice(-MAX_VISIBLE))
      timersRef.current.set(
        id,
        setTimeout(() => dismiss(id), AUTO_DISMISS_MS),
      )

      return id
    },
    [dismiss],
  )

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach(clearTimeout)
      timers.clear()
    }
  }, [])

  const value = useMemo(
    () => ({
      notify: push,
      success: (message) => push(message, 'success'),
      error: (message) => push(message, 'error'),
      info: (message) => push(message, 'info'),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 top-4 z-[70] flex flex-col items-stretch gap-3 sm:inset-x-auto sm:right-6 sm:top-6 sm:w-full sm:max-w-sm"
      >
        {toasts.map((toast) => {
          const variant = VARIANTS[toast.variant] || VARIANTS.info
          const Icon = variant.icon

          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex animate-slide-in-right items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-lift backdrop-blur-xl"
            >
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${variant.iconClass}`}
              >
                <Icon size={18} />
              </span>
              <p className="flex-1 pt-1 text-sm font-medium leading-snug text-ink-800">
                {toast.message}
              </p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="rounded-lg p-1.5 text-ink-300 transition-colors hover:bg-ink-50 hover:text-ink-700"
              >
                <XIcon size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = {
  children: PropTypes.node,
}
