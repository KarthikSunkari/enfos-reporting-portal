import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const iconDefaults = {
  'aria-hidden': true,
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.8,
  viewBox: '0 0 24 24',
} as const

export function SearchIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  )
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path d="m15 18-6-6 6-6" />
      <path d="M9 12h11" />
    </svg>
  )
}

export function SortIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path d="m8 9 4-4 4 4M16 15l-4 4-4-4" />
    </svg>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path d="M20 6v5h-5" />
      <path d="M4 18v-5h5" />
      <path d="M18.5 9A7 7 0 0 0 6.8 6.8L4 11M20 13l-2.8 4.2A7 7 0 0 1 5.5 15" />
    </svg>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function DepartmentsIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h1M14 10h1M9 14h1M14 14h1M10 21v-3h4v3" />
    </svg>
  )
}

export function ProjectsIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M8 6V4h8v2M3 11h18M10 11v2h4v-2" />
    </svg>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <path d="M10.3 3.7 2.4 17.1A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.9L13.7 3.7a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  )
}

export function DatabaseIcon(props: IconProps) {
  return (
    <svg {...iconDefaults} {...props}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </svg>
  )
}
