import PropTypes from 'prop-types'
import { getInitials } from '../lib/format'

const PRESETS = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-3xl',
}

/** Circular initials avatar — the only identity the API gives us. */
export default function Avatar({ profile, size = 'md', ring = true, className = '' }) {
  const preset = PRESETS[size] || PRESETS.md

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-brand-500 via-brand-600 to-aqua-500 font-semibold uppercase tracking-wide text-white shadow-glow ${
        ring ? 'ring-2 ring-white' : ''
      } ${preset} ${className}`}
    >
      {getInitials(profile)}
    </span>
  )
}

Avatar.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    username: PropTypes.string,
  }),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  ring: PropTypes.bool,
  className: PropTypes.string,
}
