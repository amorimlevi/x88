interface ReceiptIconProps {
  className?: string
  size?: number
}

const ReceiptIcon = ({ className = "", size = 24 }: ReceiptIconProps) => {
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
      {/* Corpo do recibo */}
      <path d="M4 2h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2z" />
      
      {/* Linhas do conteúdo */}
      <line x1="7" y1="7" x2="17" y2="7" />
      <line x1="7" y1="11" x2="15" y2="11" />
      
      {/* Borda serrilhada inferior */}
      <path d="M2 18l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2v2H2z" fill="currentColor" />
    </svg>
  )
}

export default ReceiptIcon
