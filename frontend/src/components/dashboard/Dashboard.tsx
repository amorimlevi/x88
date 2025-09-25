import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import StatsCards from './StatsCards'
import ColaboradoresList from '../colaboradores/ColaboradoresList'
import PagamentosList from '../pagamentos/PagamentosList'
import AdiantamentosList from '../adiantamentos/AdiantamentosList'
import RelatoriosList from '../relatorios/RelatoriosList'
import ConfiguracoesList from '../configuracoes/ConfiguracoesList'
import SolicitacoesList from '../solicitacoes/SolicitacoesList'
import AddPagamentoModal from '../pagamentos/AddPagamentoModal'
import Notification from '../ui/Notification'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<any>(null)
  const [isNewPagamentoModalOpen, setIsNewPagamentoModalOpen] = useState(false)
  const [pagamentos, setPagamentos] = useState<any[]>([])
  const [notification, setNotification] = useState<{
    isVisible: boolean
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message?: string
  }>({
    isVisible: false,
    type: 'success',
    title: '',
    message: ''
  })

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  
  const handleOpenNewPagamento = () => {
    setIsNewPagamentoModalOpen(true)
  }
  
  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message
    })
  }
  
  const handleSavePagamento = (novoPagamento: any) => {
    setPagamentos(prev => [...prev, novoPagamento])
    showNotification('success', 'Pagamento Criado!', `Pagamento de €${novoPagamento.valor} para ${novoPagamento.funcionarioNome} foi criado com sucesso.`)
  }

  // Mock data para solicitações
  const solicitacoesMock = [
    { id: 1, nome: 'João da Silva', viagem: 'Viagem SP', valor: 500, tempo: '2h', iniciais: 'JD' },
    { id: 2, nome: 'João da Silva', viagem: 'Viagem SP', valor: 500, tempo: '2h', iniciais: 'JD' },
    { id: 3, nome: 'João da Silva', viagem: 'Viagem SP', valor: 500, tempo: '2h', iniciais: 'JD' },
    { id: 4, nome: 'João da Silva', viagem: 'Viagem SP', valor: 500, tempo: '2h', iniciais: 'JD' }
  ]

  // Mock data para pagamentos
  const pagamentosMock = [
    { id: 1, nome: 'Maria Santos', viagem: 'Viagem RJ', valor: 1200, tempo: '1d', iniciais: 'MS' },
    { id: 2, nome: 'Maria Santos', viagem: 'Viagem RJ', valor: 1200, tempo: '1d', iniciais: 'MS' },
    { id: 3, nome: 'Maria Santos', viagem: 'Viagem RJ', valor: 1200, tempo: '1d', iniciais: 'MS' },
    { id: 4, nome: 'Maria Santos', viagem: 'Viagem RJ', valor: 1200, tempo: '1d', iniciais: 'MS' }
  ]

  const handleSolicitacaoClick = (solicitacao: any) => {
    setSelectedSolicitacao(solicitacao)
    setActiveSection('solicitacoes')
  }

  const handleVerTodasSolicitacoes = () => {
    setSelectedSolicitacao(null) // Limpar solicitação selecionada
    setActiveSection('solicitacoes')
  }

  const handlePagamentoClick = (pagamento: any) => {
    setActiveSection('pagamentos')
  }

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={toggleSidebar} onNewPagamento={handleOpenNewPagamento} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto">
            {/* Conditional Content Based on Active Section */}
            {activeSection === 'dashboard' && (
              <>
                {/* Page Title */}
                <div className="mb-8">
                  <h1 className="heading-1">Dashboard</h1>
                  <p className="text-body mt-2">
                    Visão geral da sua frota e pagamentos
                  </p>
                </div>

                {/* Stats Cards */}
                <StatsCards onSectionChange={setActiveSection} />

                {/* Recent Activity */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Solicitações Pendentes */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="heading-3">
                    Solicitações Pendentes
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-brand-600 dark:bg-brand-500 text-white px-2 py-1 rounded-full">
                      5 novas
                    </span>
                    <button 
                      onClick={handleVerTodasSolicitacoes}
                      className="text-brand-600 dark:text-brand-500 text-sm font-medium hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
                    >
                      Ver todas
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                {solicitacoesMock.map((solicitacao) => (
                <div 
                  key={solicitacao.id} 
                  onClick={() => handleSolicitacaoClick(solicitacao)}
                  className="py-2 px-4 list-item relative overflow-hidden cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-black dark:text-white text-sm font-medium">{solicitacao.iniciais}</span>
                      </div>
                      <p className="text-black dark:text-white font-medium text-base leading-none mt-1">{solicitacao.nome}</p>
                    </div>
                    <p className="text-brand-600 dark:text-brand-400 font-semibold text-base leading-none mt-1">€ {solicitacao.valor},00</p>
                  </div>
                  <div className="flex justify-between -mt-1">
                    <p className="text-neutral-600 dark:text-gray-300 text-sm ml-[52px] leading-none">Adiantamento - {solicitacao.viagem}</p>
                    <p className="text-neutral-500 dark:text-gray-400 text-sm leading-none">há {solicitacao.tempo === '2h' ? '2 horas' : solicitacao.tempo}</p>
                  </div>
                </div>
                ))}
                </div>
              </div>

              {/* Últimos Pagamentos */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="heading-3">
                    Últimos Pagamentos
                  </h3>
                  <button 
                    onClick={() => setActiveSection('pagamentos')}
                    className="text-brand-600 dark:text-brand-500 text-sm font-medium hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
                  >
                    Ver todos
                  </button>
                </div>
                
                <div className="space-y-1">
                  {pagamentosMock.map((pagamento) => (
                  <div 
                    key={pagamento.id} 
                    onClick={() => handlePagamentoClick(pagamento)}
                    className="flex items-center justify-between py-3 px-4 list-item relative overflow-hidden cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors min-h-[55px]"
                  >
                    <div className="flex items-center flex-1">
                      <div className="w-2 h-2 bg-brand-600 dark:bg-brand-500 rounded-full mr-3 flex-shrink-0">
                      </div>
                      <div className="flex-1">
                        <p className="text-black dark:text-white font-medium text-base leading-snug">{pagamento.nome}</p>
                        <p className="text-neutral-600 dark:text-gray-300 text-sm leading-tight">Pagamento viagem {pagamento.viagem}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 self-center">
                      <p className="text-black dark:text-white font-semibold text-base leading-snug">€ {pagamento.valor},00</p>
                      <p className="text-neutral-500 dark:text-gray-400 text-sm leading-tight">Ontem</p>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
                </div>
              </>
            )}

            {/* Colaboradores Section */}
            {activeSection === 'funcionarios' && (
              <ColaboradoresList />
            )}

            {/* Pagamentos Section */}
            {activeSection === 'pagamentos' && (
              <PagamentosList />
            )}

            {activeSection === 'adiantamentos' && (
              <AdiantamentosList />
            )}

            {activeSection === 'relatorios' && (
              <RelatoriosList />
            )}

            {activeSection === 'configuracoes' && (
              <ConfiguracoesList />
            )}

            {activeSection === 'solicitacoes' && (
              <SolicitacoesList selectedSolicitacao={selectedSolicitacao} />
            )}
          </div>
        </main>
      </div>

      {/* Modal de Novo Pagamento */}
      <AddPagamentoModal
        isOpen={isNewPagamentoModalOpen}
        onClose={() => setIsNewPagamentoModalOpen(false)}
        onSave={handleSavePagamento}
      />

      {/* Notificação */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  )
}

export default Dashboard
