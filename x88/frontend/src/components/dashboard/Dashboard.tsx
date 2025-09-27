import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import StatsCards from './StatsCards'
import ColaboradoresList from '../colaboradores/ColaboradoresList'

import { historicoService } from '../../services/historicoService'
import { solicitacoesService } from '../../services/solicitacoesService'

import HistoricoList from '../historico/HistoricoList'
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
  const [ultimosPagamentos, setUltimosPagamentos] = useState<any[]>([])
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState<any[]>([])

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

  // Função para atualizar últimos pagamentos baseado no histórico
  const atualizarUltimosPagamentos = () => {
    const historico = historicoService.obterHistorico()
    const pagamentos = historico
      .filter(item => item.tipo === 'pagamento' && item.status === 'pago')
      .sort((a, b) => {
        // Ordenar por data e hora mais recente primeiro
        const dataA = new Date(`${a.data}T${a.hora}:00`)
        const dataB = new Date(`${b.data}T${b.hora}:00`)
        return dataB.getTime() - dataA.getTime()
      })
      .slice(0, 10) // Limitar aos 10 mais recentes
      .map(item => ({
        id: item.id,
        nome: item.funcionario,
        iniciais: item.funcionarioIniciais,
        valor: item.valor,
        viagem: item.descricao,
        tempo: calcularTempoDecorrido(item.data, item.hora)
      }))
    
    // Se temos pagamentos do histórico, usar apenas eles; senão combinar com dados mock
    const pagamentosFinal = pagamentos.length > 0 
      ? pagamentos 
      : [...pagamentos, ...ultimosPagamentosData].slice(0, 10)
    
    setUltimosPagamentos(pagamentosFinal)
  }

  // Função para calcular tempo decorrido
  const calcularTempoDecorrido = (data: string, hora: string) => {
    const agora = new Date()
    const dataPagamento = new Date(`${data}T${hora}:00`)
    const diffMs = agora.getTime() - dataPagamento.getTime()
    
    const diffMinutos = Math.floor(diffMs / (1000 * 60))
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffSemanas = Math.floor(diffDias / 7)
    const diffMeses = Math.floor(diffDias / 30)
    
    if (diffMinutos < 60) return `${diffMinutos}m`
    if (diffHoras < 24) return `${diffHoras}h`
    if (diffDias < 7) return `${diffDias}d`
    if (diffSemanas < 4) return `${diffSemanas}w`
    return `${diffMeses}m`
  }

  // Função para atualizar solicitações pendentes
  const atualizarSolicitacoesPendentes = () => {
    const pendentes = solicitacoesService.obterSolicitacoesPendentes()
    const solicitacoesFormatadas = pendentes.map(solicitacao => 
      solicitacoesService.converterParaDashboard(solicitacao)
    )
    setSolicitacoesPendentes(solicitacoesFormatadas)
  }

  // Effect para carregar dados iniciais e configurar listeners
  useEffect(() => {
    atualizarUltimosPagamentos()
    atualizarSolicitacoesPendentes()
    
    // Configurar listeners para atualizações em tempo real
    const unsubscribeHistorico = historicoService.addListener(() => {
      atualizarUltimosPagamentos()
    })
    
    const unsubscribeSolicitacoes = solicitacoesService.addListener(() => {
      atualizarSolicitacoesPendentes()
    })
    
    return () => {
      unsubscribeHistorico()
      unsubscribeSolicitacoes()
    }
  }, [])
  
  
  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message
    })
  }
  


  // Usar dados dinâmicos das solicitações
  const solicitacoesMock = solicitacoesPendentes

  // Usar dados dinâmicos dos últimos pagamentos
  

  const handleSolicitacaoClick = (solicitacao: any) => {
    console.log('Clicando em solicitação:', solicitacao)
    setSelectedSolicitacao(solicitacao)
    // Não muda a seção ativa - apenas abre o modal
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

  const handlePagamentoClick = () => {
    // Redirecionar para o histórico com foco no pagamento específico
    setActiveSection('historico')
    // Poderiam adicionar um estado para filtrar o histórico por esse pagamento específico
  }

  const handleSolicitacaoAprovada = (solicitacao: any) => {
    // Nota: O registro no histórico e atualização do status já foram feitos no SolicitacoesList
    // Aqui só precisamos mostrar a notificação
    
    // Mostrar notificação
    showNotification('success', 'Solicitação Aprovada', `A solicitação de ${solicitacao.funcionarioNome || solicitacao.nome} foi aprovada e adicionada aos últimos pagamentos.`)
  }

  const handleSolicitacaoNegada = (solicitacao: any) => {
    // Nota: O registro no histórico e atualização do status já foram feitos no SolicitacoesList
    // Aqui só precisamos mostrar a notificação

    // Mostrar notificação
    showNotification('info', 'Solicitação Negada', `A solicitação de ${solicitacao.funcionarioNome || solicitacao.nome} foi negada.`)
  }



  const handleSavePagamento = (pagamento: any) => {
    console.log('Novo pagamento criado:', pagamento)
    
    // Registrar pagamento no histórico
    historicoService.registrarNovoPagamento(pagamento)
    
    showNotification('success', 'Pagamento Criado', `Pagamento de ${pagamento.valor} criado com sucesso.`)
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
          onSelectAdiantamento={() => {}}
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
                
                <div 
                  className="space-y-1 overflow-y-auto pr-2" 
                  style={{ maxHeight: '300px' }}
                >
                {solicitacoesMock.map((solicitacao) => (
                <div 
                  key={solicitacao.id} 
                  onClick={() => {
                    console.log('Clique detectado na solicitação:', solicitacao);
                    handleSolicitacaoClick(solicitacao);
                  }}
                  className="py-2 px-4 list-item relative cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  style={{ zIndex: 1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-black dark:text-white text-sm font-medium">{solicitacao.iniciais}</span>
                      </div>
                      <div>
                        <p className="text-black dark:text-white font-medium text-base leading-none hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer">{solicitacao.nome}</p>
                        <p className="text-neutral-600 dark:text-gray-300 text-sm leading-none mt-1">Adiantamento</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm">€ {solicitacao.valor},00</p>
                    </div>
                  </div>
                  <div className="flex justify-end -mt-2">
                    <p className="text-neutral-500 dark:text-gray-400 text-xs leading-none">há {
                      solicitacao.tempo === '1h' ? '1 hora' :
                      solicitacao.tempo === '2h' ? '2 horas' :
                      solicitacao.tempo === '3h' ? '3 horas' :
                      solicitacao.tempo === '4h' ? '4 horas' :
                      solicitacao.tempo === '5h' ? '5 horas' :
                      solicitacao.tempo === '6h' ? '6 horas' :
                      solicitacao.tempo === '8h' ? '8 horas' :
                      solicitacao.tempo === '12h' ? '12 horas' :
                      solicitacao.tempo === '1d' ? '1 dia' :
                      solicitacao.tempo === '2d' ? '2 dias' :
                      solicitacao.tempo
                    }</p>
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
                
                <div 
                  className="space-y-1 overflow-y-auto pr-2" 
                  style={{ maxHeight: '300px' }}
                >
                {ultimosPagamentos.map((pagamento) => (
                <div 
                key={pagamento.id} 
                onClick={handlePagamentoClick}
                className="py-2 px-4 list-item relative overflow-hidden cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                <div className="flex items-start justify-between">
                <div className="flex items-start">
                <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-black dark:text-white text-sm font-medium">{pagamento.iniciais}</span>
                </div>
                  <p className="text-black dark:text-white font-medium text-base leading-none mt-1">{pagamento.nome}</p>
                </div>
                  <p className="text-brand-600 dark:text-brand-400 font-semibold text-base leading-none mt-1">€ {pagamento.valor},00</p>
                </div>
                <div className="flex justify-between -mt-4">
                <p className="text-neutral-600 dark:text-gray-300 text-sm ml-[52px] leading-none">Pagamento - {pagamento.viagem}</p>
                  <p className="text-neutral-500 dark:text-gray-400 text-sm leading-none">há {
                    pagamento.tempo === '1d' ? '1 dia' :
                    pagamento.tempo === '2d' ? '2 dias' :
                    pagamento.tempo === '3d' ? '3 dias' :
                    pagamento.tempo === '5d' ? '5 dias' :
                    pagamento.tempo === '1w' ? '1 semana' :
                    pagamento.tempo === '2w' ? '2 semanas' :
                    pagamento.tempo === '3w' ? '3 semanas' :
                    pagamento.tempo === '1m' ? '1 mês' :
                    pagamento.tempo
                  }</p>
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
              <HistoricoList />
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
                onApproved={handleSolicitacaoAprovada}
                onDenied={handleSolicitacaoNegada}
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
          onDenied={handleSolicitacaoNegada}
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
