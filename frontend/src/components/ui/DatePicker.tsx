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
    <div className={`relative group ${className}`}>
      <label className="block text-sm font-medium text-dark-600 mb-2">
        {label}
      </label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500 group-hover:text-primary-400 transition-colors z-10" />
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 bg-gradient-to-r from-dark-200 to-dark-100 border-2 border-dark-300 rounded-xl text-white placeholder-dark-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </div>
  )
}

export default DatePicker
