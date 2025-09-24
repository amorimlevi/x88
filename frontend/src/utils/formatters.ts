// Formatação de valores em Euro (Portugal)
export const formatEuro = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// Formatação de data/hora para Portugal
export const formatDateTime = (date: Date | string): string => {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('pt-PT', {
    timeZone: 'Europe/Lisbon',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(dateObj)
}

// Formatação de data simples para Portugal
export const formatDate = (date: Date | string): string => {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('pt-PT', {
    timeZone: 'Europe/Lisbon',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(dateObj)
}

// Formatação de hora para Portugal
export const formatTime = (date: Date | string): string => {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('pt-PT', {
    timeZone: 'Europe/Lisbon',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(dateObj)
}

// Formatação de números para Portugal
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-PT').format(value)
}

// Data actual em Portugal
export const getPortugalDate = (): Date => {
  return new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Lisbon"}))
}
