import { 
  DashboardIcon,
  RequestsIcon, 
  AdvanceIcon,
  PaymentsIcon,
  ReportsIcon,
  UsersIcon, 
  SettingsIcon,
  XIcon
} from '../ui/Icons'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeSection: string
  onSectionChange: (section: string) => void
}

const Sidebar = ({ isOpen, onClose, activeSection, onSectionChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', icon: DashboardIcon, label: 'Dashboard' },
    { id: 'solicitacoes', icon: RequestsIcon, label: 'Solicitações' },
    { id: 'adiantamentos', icon: AdvanceIcon, label: 'Adiantamentos' },
    { id: 'pagamentos', icon: PaymentsIcon, label: 'Pagamentos' },
    { id: 'relatorios', icon: ReportsIcon, label: 'Relatórios' },
    { id: 'funcionarios', icon: UsersIcon, label: 'Colaboradores' },
    { id: 'configuracoes', icon: SettingsIcon, label: 'Configurações' },
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
        fixed lg:static inset-y-0 left-0 z-50 w-64 sidebar
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-dark-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-600 dark:bg-brand-500 rounded-lg flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-white" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M1 3h15l-1 9H2z" />
                  <path d="M16 8h4l-2 9H6" />
                  <circle cx="7" cy="19" r="2" />
                  <circle cx="17" cy="19" r="2" />
                </svg>
              </div>
              <span className="text-xl font-bold text-black dark:text-white">X88</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-neutral-600 dark:text-dark-600 hover:text-black dark:hover:text-white"
            >
              <XIcon size="md" />
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
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                        ${isActive 
                          ? 'bg-black dark:bg-brand-500 text-white' 
                          : 'nav-item'
                        }
                      `}
                    >
                      <Icon size="md" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 dark:border-dark-300">
            <div className="flex items-center gap-3 p-3 bg-neutral-100 dark:bg-dark-200 rounded-lg">
              <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center">
                <span className="text-black dark:text-white text-sm font-medium">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-black dark:text-white font-medium truncate">Admin User</p>
                <p className="text-neutral-600 dark:text-dark-600 text-sm truncate">Gestor da Frota</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
