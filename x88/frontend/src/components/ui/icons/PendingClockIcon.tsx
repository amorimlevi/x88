interface PendingClockIconProps {
  className?: string
  size?: number
}

const PendingClockIcon = ({ className = "", size = 24 }: PendingClockIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Círculo principal do relógio */}
      <circle cx="12" cy="12" r="8" />
      
      {/* Ponteiros do relógio - mostrando aproximadamente 10h10 */}
      <polyline points="12,6 12,12 16,10" />
      
      {/* Seta circular indicando pendência/renovação */}
      <path d="M20 12c0 4.4-3.6 8-8 8v-2c3.3 0 6-2.7 6-6" />
      <path d="M18 16l2-2-2-2" />
    </svg>
  )
}

export default PendingClockIcon
