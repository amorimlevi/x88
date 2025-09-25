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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

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
                      onClick={() => setActiveSection('solicitacoes')}
                      className="text-brand-600 dark:text-brand-500 text-sm font-medium hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
                    >
                      Ver todas
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-center py-3 px-2 list-item min-h-[60px] relative overflow-hidden">
                <div className="flex flex-col items-center justify-center text-center w-full">
                <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm font-medium">JD</span>
                </div>
                <p className="text-black dark:text-white font-medium text-xs leading-tight mb-1">João da Silva</p>
                <p className="text-neutral-600 dark:text-gray-300 text-xs leading-tight mb-2">Viagem SP</p>
                <p className="text-brand-600 dark:text-brand-400 font-semibold text-xs leading-tight mb-1">€ 500</p>
                <p className="text-neutral-500 dark:text-gray-400 text-xs leading-tight">2h</p>
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
                  <button className="text-brand-600 dark:text-brand-500 text-sm font-medium hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
                    Ver todos
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center justify-center py-3 px-2 list-item min-h-[60px] relative overflow-hidden">
                    <div className="flex flex-col items-center justify-center text-center w-full">
                    <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white text-sm font-medium">MS</span>
                     </div>
                     <p className="text-black dark:text-white font-medium text-xs leading-tight mb-1">Maria Santos</p>
                    <p className="text-neutral-600 dark:text-gray-300 text-xs leading-tight mb-2">Viagem RJ</p>
                    <p className="text-black dark:text-white font-semibold text-xs leading-tight mb-1">€ 1.200</p>
                    <p className="text-neutral-500 dark:text-gray-400 text-xs leading-tight">1d</p>
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
              <SolicitacoesList />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
