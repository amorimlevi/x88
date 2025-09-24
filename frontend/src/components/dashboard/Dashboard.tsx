import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import StatsCards from './StatsCards'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex h-screen bg-black">
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

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-dark-600 mt-2">
                Visão geral da sua frota e pagamentos
              </p>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            {/* Recent Activity */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Solicitações Pendentes */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    Solicitações Pendentes
                  </h3>
                  <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-full">
                    5 novas
                  </span>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">JD</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">João da Silva</p>
                          <p className="text-dark-600 text-sm">Adiantamento - Viagem SP</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-primary-500 font-semibold">€ 500,00</p>
                        <p className="text-dark-600 text-xs">há 2 horas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Últimos Pagamentos */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    Últimos Pagamentos
                  </h3>
                  <button className="text-primary-500 text-sm font-medium hover:text-primary-400">
                    Ver todos
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                        <div>
                          <p className="text-white font-medium">Maria Santos</p>
                          <p className="text-dark-600 text-sm">Pagamento viagem RJ</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">€ 1.200,00</p>
                        <p className="text-dark-600 text-xs">Ontem</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
