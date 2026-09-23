import PropTypes from 'prop-types'
import { AlertIcon, CheckCircleIcon, InfoIcon } from './Icons.jsx'

const TONES = {
  error: {
    Icon: AlertIcon,
    wrapper: 'border-rose-200/80 bg-rose-50/80',
    badge: 'bg-rose-100 text-rose-600',
    title: 'text-rose-900',
    body: 'text-rose-700',
  },
  warning: {
    Icon: AlertIcon,
    wrapper: 'border-amber-200/80 bg-amber-50/80',
    badge: 'bg-amber-100 text-amber-600',
    title: 'text-amber-900',
    body: 'text-amber-800',
  },
  success: {
    Icon: CheckCircleIcon,
    wrapper: 'border-emerald-200/80 bg-emerald-50/80',
    badge: 'bg-emerald-100 text-emerald-600',
    title: 'text-emerald-900',
    body: 'text-emerald-700',
  },
  info: {
    Icon: InfoIcon,
    wrapper: 'border-brand-200/70 bg-brand-50/80',
    badge: 'bg-brand-100 text-brand-600',
    title: 'text-brand-900',
    body: 'text-brand-700',
  },
}

export default function Alert({ tone = 'info', title, children, action, className = '' }) {
  const preset = TONES[tone] || TONES.info
  const { Icon } = preset

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex animate-fade-in items-start gap-3 rounded-2xl border p-4 ${preset.wrapper} ${className}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${preset.badge}`}
      >
        <Icon size={18} />
      </span>
      <div className="flex-1 pt-0.5">
        {title ? <p className={`text-sm font-semibold ${preset.title}`}>{title}</p> : null}
        {children ? <p className={`mt-0.5 text-sm ${preset.body}`}>{children}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

Alert.propTypes = {
  tone: PropTypes.oneOf(['error', 'warning', 'success', 'info']),
  title: PropTypes.string,
  children: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
}
