import { useState, useRef, useEffect } from 'react'
import { SearchIcon } from '../ui/Icons'
import { ThemeToggle } from '../ui/ThemeToggle'
import { formatDateTime } from '../../utils/formatters'
import { solicitacoesService } from '../../services/solicitacoesService'

interface HeaderProps {
  onMenuClick: () => void
  onNewPagamento?: () => void
  onSectionChange?: (section: string) => void
  onSelectAdiantamento?: (adiantamentoId: string) => void
  onSearch?: (term: string) => void
}

const Header = ({ onMenuClick, onNewPagamento, onSectionChange, onSelectAdiantamento, onSearch }: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const notificationRef = useRef<HTMLDivElement>(null)

  // Notificações baseadas em solicitações reais
  const [notificationsList, setNotificationsList] = useState<any[]>([])

  // Carregar notificações das solicitações
  useEffect(() => {
    const carregarNotificacoes = () => {
      const solicitacoes = solicitacoesService.obterSolicitacoes()
      
      // Converter solicitações em notificações, priorizando pendentes
      const notificacoes = solicitacoes
        .filter(s => s.status === 'pendente') // Apenas solicitações pendentes geram notificações
        .map(solicitacao => ({
          id: solicitacao.id,
          funcionario: solicitacao.funcionarioNome,
          adiantamentoId: solicitacao.id,
          tipo: `Novo pedido de ${solicitacao.tipo}`,
          valor: solicitacao.valor || 0,
          tempo: solicitacao.datasolicitacao,
          lida: false
        }))
        .sort((a, b) => new Date(b.tempo).getTime() - new Date(a.tempo).getTime()) // Mais recentes primeiro
        .slice(0, 10) // Limitar a 10 notificações

      setNotificationsList(notificacoes)
    }

    carregarNotificacoes()

    // Configurar listener para atualizações
    const unsubscribe = solicitacoesService.addListener(() => {
      carregarNotificacoes()
    })

    return unsubscribe
  }, [])

  const handleNotificationClick = (notification: any) => {
    // Marcar notificação como lida
    setNotificationsList(prev => 
      prev.map(n => n.id === notification.id ? { ...n, lida: true } : n)
    )
    
    // Navegar para solicitações e selecionar específico
    if (onSectionChange) {
      onSectionChange('solicitacoes')
    }
    
    if (onSelectAdiantamento) {
      onSelectAdiantamento(notification.adiantamentoId)
    }
    
    // Fechar painel de notificações
    setShowNotifications(false)
  }

  const unreadCount = notificationsList.filter(n => !n.lida).length

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    if (onSearch) {
      onSearch(term)
    }
    // Se há termo de pesquisa e não estamos na página de funcionários, navegar para lá
    if (term && onSectionChange) {
      onSectionChange('funcionarios')
    }
  }

  // Fechar painel ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

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
              placeholder="Pesquisar colaboradores..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="input w-64 pl-10"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-neutral-600 dark:text-white hover:text-black dark:hover:text-gray-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 2a7 7 0 00-7 7v7l-2 2h18l-2-2v-7a7 7 0 00-7-7z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-600 dark:bg-brand-500 rounded-full"></span>
              )}
            </button>

            {/* Painel de Notificações */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-black dark:text-white">Notificações</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {unreadCount} {unreadCount === 1 ? 'nova notificação' : 'novas notificações'}
                  </p>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notificationsList.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                        !notification.lida ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {!notification.lida && (
                              <span className="w-2 h-2 bg-brand-600 dark:bg-brand-500 rounded-full"></span>
                            )}
                            <p className="text-sm font-medium text-black dark:text-white">
                              {notification.funcionario}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {notification.tipo}
                          </p>
                          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-2">
                            €{notification.valor.toFixed(2).replace('.', ',')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDateTime(notification.tempo)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {notificationsList.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">Nenhuma notificação</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <button 
              onClick={onNewPagamento}
              className="btn-primary"
            >
              Novo Pagamento
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
