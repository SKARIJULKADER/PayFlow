import PropTypes from 'prop-types'
import { LoaderIcon } from './Icons.jsx'

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow hover:from-brand-700 hover:to-brand-600 hover:shadow-lift focus-visible:ring-brand-500/30',
  navy: 'bg-ink-900 text-white shadow-soft hover:bg-ink-800 focus-visible:ring-ink-900/25',
  secondary:
    'border border-slate-200 bg-white text-ink-800 shadow-soft hover:border-slate-300 hover:bg-ink-50 focus-visible:ring-brand-500/20',
  ghost: 'text-ink-600 hover:bg-ink-100/70 hover:text-ink-900 focus-visible:ring-brand-500/20',
  danger:
    'border border-rose-200 bg-white text-rose-600 hover:border-rose-300 hover:bg-rose-50 focus-visible:ring-rose-500/25',
  white:
    'bg-white text-brand-700 shadow-lift hover:bg-brand-50 focus-visible:ring-white/50',
}

const SIZES = {
  sm: 'h-9 gap-1.5 rounded-xl px-3.5 text-sm',
  md: 'h-11 gap-2 rounded-xl px-5 text-sm',
  lg: 'h-[3.25rem] gap-2 rounded-2xl px-6 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  loadingText,
  fullWidth = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  onClick,
  ...rest
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={[
        'group relative inline-flex select-none items-center justify-center font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-4 active:scale-[0.98]',
        'disabled:pointer-events-none disabled:opacity-60 disabled:shadow-none',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading ? (
        <LoaderIcon size={17} className="animate-spin" />
      ) : LeftIcon ? (
        <LeftIcon size={17} />
      ) : null}
      <span className="truncate">{loading && loadingText ? loadingText : children}</span>
      {!loading && RightIcon ? (
        <RightIcon
          size={17}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      ) : null}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'navy', 'secondary', 'ghost', 'danger', 'white']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  leftIcon: PropTypes.elementType,
  rightIcon: PropTypes.elementType,
  className: PropTypes.string,
  onClick: PropTypes.func,
}
