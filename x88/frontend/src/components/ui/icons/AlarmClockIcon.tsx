interface AlarmClockIconProps {
  className?: string
  size?: number
}

const AlarmClockIcon = ({ className = "", size = 24 }: AlarmClockIconProps) => {
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
      {/* Relógio principal */}
      <circle cx="12" cy="13" r="7" />
      
      {/* Ponteiros do relógio */}
      <polyline points="12,9 12,13 16,13" />
      
      {/* Pés do despertador */}
      <path d="M12 6V4" />
      <path d="M16 6l1.5-1.5" />
      <path d="M8 6L6.5 4.5" />
      
      {/* Campainha do topo */}
      <path d="M12 4V2" />
      <path d="M10 2h4" />
    </svg>
  )
}

export default AlarmClockIcon
