import { useState } from 'react'
import { SettingsIcon, UsersIcon, PaymentsIcon, AdvanceIcon, ProfileIcon } from '../ui/Icons'
import ConfiguracoesColaboradores from './ConfiguracoesColaboradores'
import ConfiguracoesPagamento from './ConfiguracoesPagamento'
import ConfiguracoesAdiantamento from './ConfiguracoesAdiantamento'
import ConfiguracoesPerfil from './ConfiguracoesPerfil'

const ConfiguracoesList = () => {
  const [activeTab, setActiveTab] = useState('perfil')

  const tabs = [
    { id: 'perfil', name: 'Perfil', icon: ProfileIcon },
    { id: 'colaboradores', name: 'Colaboradores', icon: UsersIcon },
    { id: 'pagamento', name: 'Pagamento', icon: PaymentsIcon },
    { id: 'adiantamento', name: 'Adiantamento', icon: AdvanceIcon }
  ]

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="text-brand-600 dark:text-brand-400" size="xl" />
          <h1 className="heading-1">Configurações</h1>
        </div>
        <p className="text-body">
          Configure as preferências e parâmetros gerais do sistema
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-8">
        <div className="border-b border-light-border dark:border-dark-border">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                      : 'border-transparent text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:border-light-border dark:hover:border-dark-border'
                  }`}
                >
                  <IconComponent size="md" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'perfil' && <ConfiguracoesPerfil />}
        {activeTab === 'colaboradores' && <ConfiguracoesColaboradores />}
        {activeTab === 'pagamento' && <ConfiguracoesPagamento />}
        {activeTab === 'adiantamento' && <ConfiguracoesAdiantamento />}
      </div>
    </div>
  )
}

export default ConfiguracoesList
