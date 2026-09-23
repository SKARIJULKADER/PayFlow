import PropTypes from 'prop-types'
import { BoltIcon } from './Icons.jsx'

const PRESETS = {
  sm: { box: 'h-8 w-8 rounded-xl', icon: 16, text: 'text-base' },
  md: { box: 'h-10 w-10 rounded-2xl', icon: 20, text: 'text-lg' },
  lg: { box: 'h-12 w-12 rounded-2xl', icon: 24, text: 'text-xl' },
}

export function LogoMark({ size = 'md', className = '' }) {
  const preset = PRESETS[size] || PRESETS.md

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-brand-500 via-brand-600 to-aqua-400 text-white shadow-glow ${preset.box} ${className}`}
    >
      <BoltIcon size={preset.icon} strokeWidth={2} />
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-tr from-white/25 to-transparent opacity-70" />
    </span>
  )
}

export function Logo({ size = 'md', showText = true, className = '', textClassName = '' }) {
  const preset = PRESETS[size] || PRESETS.md

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {showText ? (
        <span className={`font-bold tracking-tight text-ink-900 ${preset.text} ${textClassName}`}>
          Pay
          <span className="bg-gradient-to-r from-brand-600 to-aqua-500 bg-clip-text text-transparent">
            Flow
          </span>
        </span>
      ) : null}
    </span>
  )
}

LogoMark.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
}

Logo.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showText: PropTypes.bool,
  className: PropTypes.string,
  textClassName: PropTypes.string,
}
