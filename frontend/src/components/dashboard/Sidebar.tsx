import { 
  Home, 
  Users, 
  DollarSign, 
  CreditCard, 
  BarChart3, 
  Settings,
  X,
  Truck
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeSection: string
  onSectionChange: (section: string) => void
}

const Sidebar = ({ isOpen, onClose, activeSection, onSectionChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'funcionarios', icon: Users, label: 'Colaboradores' },
    { id: 'pagamentos', icon: DollarSign, label: 'Pagamentos' },
    { id: 'adiantamentos', icon: CreditCard, label: 'Adiantamentos' },
    { id: 'relatorios', icon: BarChart3, label: 'Relatórios' },
    { id: 'configuracoes', icon: Settings, label: 'Configurações' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-100 border-r border-dark-300
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">X88</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-dark-600 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onSectionChange(item.id)
                        onClose()
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                        ${isActive 
                          ? 'bg-primary-500 text-white' 
                          : 'text-dark-600 hover:bg-dark-200 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-dark-300">
            <div className="flex items-center gap-3 p-3 bg-dark-200 rounded-lg">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">Admin User</p>
                <p className="text-dark-600 text-sm truncate">Gestor da Frota</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
