import PropTypes from 'prop-types'
import { ActivityIcon } from './Icons.jsx'

export default function EmptyState({ icon: Icon = ActivityIcon, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 py-10 text-center ${className}`}>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/70 text-brand-500">
        <Icon size={22} />
      </span>
      <p className="mt-4 text-sm font-semibold text-ink-800">{title}</p>
      {description ? (
        <p className="mt-1 max-w-xs text-sm leading-relaxed text-ink-400">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
}
