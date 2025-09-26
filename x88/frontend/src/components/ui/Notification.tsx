import { useState, useEffect } from 'react'
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

const Notification = ({ 
  type, 
  title, 
  message, 
  isVisible, 
  onClose, 
  duration = 4000 
}: NotificationProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-l-green-500'
      case 'error':
        return 'border-l-red-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'info':
        return 'border-l-blue-500'
      default:
        return 'border-l-green-500'
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`bg-white dark:bg-gray-800 border-l-4 ${getBorderColor()} shadow-lg rounded-lg p-4 max-w-sm w-full`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="ml-3 flex-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {title}
            </h4>
            {message && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {message}
              </p>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Notification
