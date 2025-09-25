import { SearchIcon } from '../ui/Icons'
import { ThemeToggle } from '../ui/ThemeToggle'

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-black border-b border-neutral-200 dark:border-gray-800 p-4">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-neutral-600 dark:text-white hover:text-black dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-gray-400" size="sm" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="input w-64 pl-10"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button className="relative p-2 text-neutral-600 dark:text-white hover:text-black dark:hover:text-gray-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 2a7 7 0 00-7 7v7l-2 2h18l-2-2v-7a7 7 0 00-7-7z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-600 dark:bg-brand-500 rounded-full"></span>
          </button>

          {/* Quick Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <button className="btn-primary">
              Novo Pagamento
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
