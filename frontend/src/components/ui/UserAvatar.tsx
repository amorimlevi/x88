interface UserAvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const UserAvatar = ({ name, size = 'md', className = '' }: UserAvatarProps) => {
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6 text-xs'
      case 'md':
        return 'w-8 h-8 text-sm'
      case 'lg':
        return 'w-10 h-10 text-sm'
      case 'xl':
        return 'w-16 h-16 text-xl'
      default:
        return 'w-8 h-8 text-sm'
    }
  }

  return (
    <div className={`${getSizeClasses()} bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center ${className}`}>
      <span className="text-white font-medium">
        {getInitials(name)}
      </span>
    </div>
  )
}

export default UserAvatar
