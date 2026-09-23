import PropTypes from 'prop-types'

/**
 * Hand-drawn stroke icon set (lucide-style geometry, currentColor aware) so the
 * app stays dependency light.
 */
const iconPropTypes = {
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  className: PropTypes.string,
}

function createIcon(displayName, glyph) {
  const IconComponent = ({ size = 20, strokeWidth = 1.8, className = '' }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  )

  IconComponent.displayName = displayName
  IconComponent.propTypes = iconPropTypes
  return IconComponent
}

export const BoltIcon = createIcon('BoltIcon', <path d="M13 2 4.5 13.2H11l-1 8.8L18.5 10.8H12L13 2Z" />)

export const WalletIcon = createIcon(
  'WalletIcon',
  <>
    <path d="M3.5 9.5a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3v-7Z" />
    <path d="M3.5 10.5h17" />
    <path d="M16.5 14.5h2" />
  </>,
)

export const SendIcon = createIcon(
  'SendIcon',
  <>
    <path d="M21.5 2.5 11 13" />
    <path d="M21.5 2.5 15 21.5 11 13 2.5 9 21.5 2.5Z" />
  </>,
)

export const ArrowUpRightIcon = createIcon(
  'ArrowUpRightIcon',
  <>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </>,
)

export const UserIcon = createIcon(
  'UserIcon',
  <>
    <circle cx="12" cy="7.5" r="4" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </>,
)

export const AtSignIcon = createIcon(
  'AtSignIcon',
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
  </>,
)

export const EyeIcon = createIcon(
  'EyeIcon',
  <>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </>,
)

export const EyeOffIcon = createIcon(
  'EyeOffIcon',
  <>
    <path d="M10.6 5.1A9.6 9.6 0 0 1 12 5c6.4 0 10 7 10 7a17.7 17.7 0 0 1-2.8 3.9" />
    <path d="M6.6 6.6A17.6 17.6 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5-1.4" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="m3 3 18 18" />
  </>,
)

export const RefreshIcon = createIcon(
  'RefreshIcon',
  <>
    <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
    <path d="M20.5 3.5v5.5h-5.5" />
  </>,
)

export const LogOutIcon = createIcon(
  'LogOutIcon',
  <>
    <path d="M9.5 21h-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 16.5 20.5 12 16 7.5" />
    <path d="M20.5 12h-11" />
  </>,
)

export const ChevronRightIcon = createIcon('ChevronRightIcon', <path d="m9.5 6 6 6-6 6" />)

export const ArrowLeftIcon = createIcon(
  'ArrowLeftIcon',
  <>
    <path d="M19.5 12h-15" />
    <path d="m11 5.5-6.5 6.5 6.5 6.5" />
  </>,
)

export const CheckIcon = createIcon('CheckIcon', <path d="m20 6.5-10.5 10.5L4 11.5" />)

export const CheckCircleIcon = createIcon(
  'CheckCircleIcon',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.4 2.5 2.5 4.5-5" />
  </>,
)

export const XIcon = createIcon(
  'XIcon',
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>,
)

export const AlertIcon = createIcon(
  'AlertIcon',
  <>
    <path d="M10.3 3.9 2.6 17.4A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3.1L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9.5v4" />
    <path d="M12 17h.01" />
  </>,
)

export const InfoIcon = createIcon(
  'InfoIcon',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16.5V12" />
    <path d="M12 8.5h.01" />
  </>,
)

export const LoaderIcon = createIcon('LoaderIcon', <path d="M12 3a9 9 0 1 0 9 9" />)

export const CopyIcon = createIcon(
  'CopyIcon',
  <>
    <rect x="9" y="9" width="12" height="12" rx="2.5" />
    <path d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5" />
  </>,
)

export const ShieldCheckIcon = createIcon(
  'ShieldCheckIcon',
  <>
    <path d="M12 21.5s7.5-3.6 7.5-9.6V5.4L12 2.5 4.5 5.4v6.5c0 6 7.5 9.6 7.5 9.6Z" />
    <path d="m8.8 11.8 2.2 2.2 4.2-4.4" />
  </>,
)

export const ActivityIcon = createIcon('ActivityIcon', <path d="M22 12h-4l-3 8.5L9 3.5 6 12H2" />)

export const SparklesIcon = createIcon(
  'SparklesIcon',
  <>
    <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
    <path d="m18.5 15.5.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
  </>,
)

export const LockIcon = createIcon(
  'LockIcon',
  <>
    <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
    <path d="M8 10.5v-3a4 4 0 0 1 8 0v3" />
  </>,
)

export const ClockIcon = createIcon(
  'ClockIcon',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </>,
)

export const HomeIcon = createIcon(
  'HomeIcon',
  <path d="m3.5 10.5 8.5-7 8.5 7V20a1 1 0 0 1-1 1h-4.5v-6h-6v6H4.5a1 1 0 0 1-1-1v-9.5Z" />,
)

export const MenuIcon = createIcon(
  'MenuIcon',
  <>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </>,
)

export const PlusIcon = createIcon(
  'PlusIcon',
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>,
)

export const TrendingUpIcon = createIcon(
  'TrendingUpIcon',
  <>
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </>,
)

export const BellIcon = createIcon(
  'BellIcon',
  <>
    <path d="M18 8.5a6 6 0 1 0-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 15 18 8.5Z" />
    <path d="M13.7 20.5a2 2 0 0 1-3.4 0" />
  </>,
)
