import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import StatsCards from './StatsCards'
import ColaboradoresList from '../colaboradores/ColaboradoresList'
import { Check, X } from 'lucide-react'
import { historicoService } from '../../services/historicoService'

import HistoricoPage from '../historico/HistoricoPage'
import RelatoriosList from '../relatorios/RelatoriosList'
import ConfiguracoesList from '../configuracoes/ConfiguracoesList'
import SolicitacoesList from '../solicitacoes/SolicitacoesList'
import AddPagamentoModal from '../pagamentos/AddPagamentoModal'
import { ultimosPagamentosData } from '../../data/pagamentosData'

import Notification from '../ui/Notification'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<any>(null)
  const [selectedAdiantamento, setSelectedAdiantamento] = useState<string | null>(null)
  const [isAddPagamentoModalOpen, setIsAddPagamentoModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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
  
  
  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message
    })
  }
  


  // Mock data para solicitações
  const [solicitacoesMock, setSolicitacoesMock] = useState([
    { id: 1, nome: 'Ricardo Mendes', viagem: 'Viagem SP', valor: 500, tempo: '2h', iniciais: 'RM' },
    { id: 2, nome: 'Beatriz Almeida', viagem: 'Viagem RJ', valor: 800, tempo: '4h', iniciais: 'BA' },
    { id: 3, nome: 'Gabriel Rodrigues', viagem: 'Viagem BH', valor: 300, tempo: '6h', iniciais: 'GR' },
    { id: 4, nome: 'Larissa Pereira', viagem: 'Viagem Salvador', valor: 650, tempo: '1d', iniciais: 'LP' }
  ])

  // Dados compartilhados para pagamentos
  const pagamentosMock = ultimosPagamentosData

  const handleSolicitacaoClick = (solicitacao: any) => {
    setSelectedSolicitacao(solicitacao)
    // Não navega para solicitacoes, apenas abre o modal de detalhes
  }

  const handleSolicitacaoAprovada = (solicitacaoAprovada: any) => {
    // Remove a solicitação do card de pendentes baseado no nome do selectedSolicitacao original
    if (selectedSolicitacao) {
      setSolicitacoesMock(prev => prev.filter(s => s.nome !== selectedSolicitacao.nome))
    }
    setSelectedSolicitacao(null)
  }

  const handleVerTodasSolicitacoes = () => {
    setSelectedSolicitacao(null) // Limpar solicitação selecionada
    setActiveSection('solicitacoes')
  }

  const handleViewSolicitacao = (solicitacao: any) => {
    setSelectedSolicitacao(solicitacao) // Manter solicitação selecionada
    setActiveSection('solicitacoes') // Navegar para página de solicitações
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handlePagamentoClick = (pagamento: any) => {
    setActiveSection('pagamentos')
  }

  const handleSavePagamento = (pagamento: any) => {
    // Criar objeto compatível com historicoService
    const pagamentoParaHistorico = {
      nome: pagamento.funcionarioNome,
      iniciais: pagamento.funcionarioNome.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
      valor: pagamento.valor,
      viagem: 'Pagamento aprovado'
    }
    
    // Registrar o pagamento no histórico
    historicoService.registrarPagamento(pagamentoParaHistorico)
    
    console.log('Novo pagamento criado:', pagamento)
    
    showNotification('success', 'Pagamento Aprovado', 'O pagamento foi aprovado e registrado no histórico!')
    setIsAddPagamentoModalOpen(false)
  }

  const handleApprovarSolicitacao = (solicitacao: any, event: React.MouseEvent) => {
    event.stopPropagation() // Evita que o click no item seja disparado
    
    // Registrar aprovação no histórico
    historicoService.registrarAprovacao({
      nome: solicitacao.nome,
      iniciais: solicitacao.iniciais,
      valor: solicitacao.valor,
      viagem: solicitacao.viagem || 'Solicitação'
    })

    // Remover da lista de pendentes
    setSolicitacoesMock(prev => prev.filter(s => s.id !== solicitacao.id))

    // Mostrar notificação
    showNotification('success', 'Solicitação Aprovada', `A solicitação de ${solicitacao.nome} foi aprovada com sucesso.`)
  }

  const handleNegarSolicitacao = (solicitacao: any, event: React.MouseEvent) => {
    event.stopPropagation() // Evita que o click no item seja disparado
    
    // Registrar negação no histórico
    historicoService.registrarNegacao({
      nome: solicitacao.nome,
      iniciais: solicitacao.iniciais,
      valor: solicitacao.valor,
      viagem: solicitacao.viagem || 'Solicitação'
    }, 'Solicitação negada diretamente da dashboard')

    // Remover da lista de pendentes
    setSolicitacoesMock(prev => prev.filter(s => s.id !== solicitacao.id))

    // Mostrar notificação
    showNotification('error', 'Solicitação Negada', `A solicitação de ${solicitacao.nome} foi negada.`)
  }

  const handleNewPagamento = () => {
    setIsAddPagamentoModalOpen(true)
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
        <Header 
          onMenuClick={toggleSidebar} 
          onNewPagamento={() => setIsAddPagamentoModalOpen(true)}
          onSectionChange={setActiveSection}
          onSelectAdiantamento={setSelectedAdiantamento}
          onSearch={handleSearch}
        />

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
                      {solicitacoesMock.length} novas
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
                        <span className="text-white text-sm font-medium">{solicitacao.iniciais}</span>
                      </div>
                      <div>
                        <p className="text-black dark:text-white font-medium text-base leading-none">{solicitacao.nome}</p>
                        <p className="text-neutral-600 dark:text-gray-300 text-sm leading-none mt-1">Adiantamento - {solicitacao.viagem}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">

                    <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm">€ {solicitacao.valor},00</p>

                    </div>
                  </div>
                  <div className="flex justify-end -mt-2">
                    <p className="text-neutral-500 dark:text-gray-400 text-xs leading-none">há {solicitacao.tempo === '2h' ? '2 horas' : solicitacao.tempo}</p>
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
                    onClick={() => setActiveSection('historico')}
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
                className="py-2 px-4 list-item relative overflow-hidden cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                <div className="flex items-start justify-between">
                <div className="flex items-start">
                <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white text-sm font-medium">{pagamento.iniciais}</span>
                </div>
                  <p className="text-black dark:text-white font-medium text-base leading-none mt-1">{pagamento.nome}</p>
                </div>
                  <p className="text-brand-600 dark:text-brand-400 font-semibold text-base leading-none mt-1">€ {pagamento.valor},00</p>
                </div>
                <div className="flex justify-between -mt-4">
                <p className="text-neutral-600 dark:text-gray-300 text-sm ml-[52px] leading-none">Pagamento - {pagamento.viagem}</p>
                  <p className="text-neutral-500 dark:text-gray-400 text-sm leading-none">há {pagamento.tempo === '1d' ? '1 dia' : pagamento.tempo}</p>
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
              <ColaboradoresList externalSearchTerm={searchTerm} />
            )}



            {activeSection === 'historico' && (
              <HistoricoPage />
            )}

            {activeSection === 'relatorios' && (
              <RelatoriosList />
            )}

            {activeSection === 'configuracoes' && (
              <ConfiguracoesList />
            )}

            {activeSection === 'solicitacoes' && (
              <SolicitacoesList 
                selectedSolicitacao={selectedSolicitacao} 
                selectedAdiantamentoId={selectedAdiantamento}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modal de Solicitação sempre presente quando há uma selecionada */}
      {selectedSolicitacao && activeSection !== 'solicitacoes' && (
        <SolicitacoesList 
          selectedSolicitacao={selectedSolicitacao} 
          modalOnly={true} 
          onClose={() => setSelectedSolicitacao(null)}
          onApproved={handleSolicitacaoAprovada}
          onDenied={handleSolicitacaoAprovada}
          onViewSolicitacao={handleViewSolicitacao}
        />
      )}

      {/* Modal de Novo Pagamento */}
      <AddPagamentoModal
        isOpen={isAddPagamentoModalOpen}
        onClose={() => setIsAddPagamentoModalOpen(false)}
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
