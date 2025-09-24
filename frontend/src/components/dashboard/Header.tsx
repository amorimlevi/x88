import { Menu, Bell, Search } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="bg-dark-100 border-b border-dark-300 p-4">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-dark-600 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-600" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-64 pl-10 pr-4 py-2 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-dark-600"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-dark-600 hover:text-white rounded-lg hover:bg-dark-200">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"></span>
          </button>

          {/* Quick Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">
              Novo Pagamento
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
