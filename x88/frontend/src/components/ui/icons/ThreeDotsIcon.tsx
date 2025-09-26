interface ThreeDotsIconProps {
  className?: string
  size?: number
}

const ThreeDotsIcon = ({ className = "", size = 24 }: ThreeDotsIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Retângulo arredondado mais espaçoso */}
      <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
      
      {/* Três pontos mais separados */}
      <circle cx="7" cy="12" r="1.3" fill="currentColor" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
      <circle cx="17" cy="12" r="1.3" fill="currentColor" />
    </svg>
  )
}

export default ThreeDotsIcon
