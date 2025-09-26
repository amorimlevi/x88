import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  icon?: React.ReactNode
  className?: string
}

const Select = ({ label, value, onChange, options, icon, className = '' }: SelectProps) => {
  return (
    <div className={`relative group ${className}`}>
      <label className="block text-sm font-medium text-dark-600 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 group-hover:text-primary-400 transition-colors z-10">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-10 py-3 bg-gradient-to-r from-dark-200 to-dark-100 border-2 border-dark-300 rounded-xl text-white appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-dark-200 text-white">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500 group-hover:text-primary-400 transition-colors pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </div>
  )
}

export default Select
