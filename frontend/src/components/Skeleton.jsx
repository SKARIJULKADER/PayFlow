import PropTypes from 'prop-types'

const TONES = {
  light: 'from-ink-100 via-white to-ink-100',
  dark: 'from-white/20 via-white/40 to-white/20',
}

/** Shimmering placeholder block used while data is in flight. */
export default function Skeleton({ className = '', tone = 'light' }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-shimmer rounded-xl bg-gradient-to-r bg-[length:200%_100%] ${
        TONES[tone] || TONES.light
      } ${className}`}
    />
  )
}

Skeleton.propTypes = {
  className: PropTypes.string,
  tone: PropTypes.oneOf(['light', 'dark']),
}
