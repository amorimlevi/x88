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

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<any>(null)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

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
        <Header onMenuClick={toggleSidebar} />

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
                
                <div className="grid grid-cols-2 gap-2">
                {solicitacoesMock.map((solicitacao) => (
                <div 
                  key={solicitacao.id} 
                  onClick={() => handleSolicitacaoClick(solicitacao)}
                  className="flex items-center justify-center py-3 px-2 list-item min-h-[60px] relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                >
                <div className="flex flex-col items-center justify-center text-center w-full">
                <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-black dark:text-white text-sm font-medium">{solicitacao.iniciais}</span>
                </div>
                <p className="text-black dark:text-white font-medium text-xs leading-tight mb-1">{solicitacao.nome}</p>
                <p className="text-neutral-600 dark:text-gray-300 text-xs leading-tight mb-2">{solicitacao.viagem}</p>
                <p className="text-brand-600 dark:text-brand-400 font-semibold text-xs leading-tight mb-1">€ {solicitacao.valor}</p>
                <p className="text-neutral-500 dark:text-gray-400 text-xs leading-tight">{solicitacao.tempo}</p>
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
                
                <div className="grid grid-cols-2 gap-2">
                  {pagamentosMock.map((pagamento) => (
                  <div 
                    key={pagamento.id} 
                    onClick={() => handlePagamentoClick(pagamento)}
                    className="flex items-center justify-center py-3 px-2 list-item min-h-[60px] relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className="flex flex-col items-center justify-center text-center w-full">
                    <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center mb-2">
                      <span className="text-black dark:text-white text-sm font-medium">{pagamento.iniciais}</span>
                     </div>
                     <p className="text-black dark:text-white font-medium text-xs leading-tight mb-1">{pagamento.nome}</p>
                    <p className="text-neutral-600 dark:text-gray-300 text-xs leading-tight mb-2">{pagamento.viagem}</p>
                    <p className="text-black dark:text-white font-semibold text-xs leading-tight mb-1">€ {pagamento.valor}</p>
                    <p className="text-neutral-500 dark:text-gray-400 text-xs leading-tight">{pagamento.tempo}</p>
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
    </div>
  )
}

export default Dashboard
