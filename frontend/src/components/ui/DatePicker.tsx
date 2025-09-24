import { Calendar } from 'lucide-react'

interface DatePickerProps {
  label: string
  value?: string
  onChange: (date: string) => void
  placeholder?: string
  className?: string
}

const DatePicker = ({ label, value, onChange, placeholder, className = '' }: DatePickerProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Calendar className="w-4 h-4 text-dark-600" />
      <div className="flex flex-col gap-1">
        <label className="text-dark-600 text-sm font-medium">{label}</label>
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="px-3 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}

export default DatePicker
