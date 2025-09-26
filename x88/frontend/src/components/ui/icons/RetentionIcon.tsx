interface RetentionIconProps {
  className?: string
  size?: number
}

const RetentionIcon = ({ className = "", size = 24 }: RetentionIconProps) => {
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
      {/* Casa moderna com telhado mais suave */}
      <path d="M2 12l10-10 10 10" />
      <path d="M4 10v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-10" />
      {/* Porta com detalhes */}
      <rect x="10" y="16" width="4" height="5" rx="0.5" />
      <circle cx="13.5" cy="18.5" r="0.3" fill="currentColor" />
      {/* Janelas */}
      <rect x="7" y="13" width="2.5" height="2.5" rx="0.3" />
      <rect x="14.5" y="13" width="2.5" height="2.5" rx="0.3" />
      {/* Cruz na janela esquerda */}
      <path d="M8.25 13 L8.25 15.5 M7 14.25 L9.5 14.25" strokeWidth="0.5" />
      {/* Cruz na janela direita */}
      <path d="M15.75 13 L15.75 15.5 M14.5 14.25 L17 14.25" strokeWidth="0.5" />
      {/* Chaminé */}
      <rect x="16" y="7" width="1.5" height="4" />
      {/* Base da casa */}
      <path d="M3 21h18" strokeWidth="1.5" opacity="0.7" />
    </svg>
  )
}

export default RetentionIcon
