import { UsersIcon, PaymentsIcon, AdvanceIcon, ReportsIcon } from '../ui/Icons'

interface StatsCardsProps {
  onSectionChange: (section: string) => void
}

const StatsCards = ({ onSectionChange }: StatsCardsProps) => {
  const stats = [
    {
      title: 'Total de Colaboradores',
      value: '24',
      change: '+2 este mês',
      changeType: 'positive' as const,
      icon: UsersIcon,
      color: 'bg-brand-600 dark:bg-brand-500',
      section: 'funcionarios'
    },
    {
      title: 'Pagamentos Realizados',
      value: '€ 48.300',
      change: '+12% vs mês anterior',
      changeType: 'positive' as const,
      icon: PaymentsIcon,
      color: 'bg-brand-600 dark:bg-brand-500',
      section: 'pagamentos'
    },
    {
      title: 'Adiantamentos Pendentes',
      value: '€ 2.400',
      change: '5 solicitações',
      changeType: 'positive' as const,
      icon: AdvanceIcon,
      color: 'bg-orange-500',
      section: 'adiantamentos'
    },
    {
      title: 'Relatórios Gerados',
      value: '12',
      change: '+3 este mês',
      changeType: 'positive' as const,
      icon: ReportsIcon,
      color: 'bg-purple-500',
      section: 'relatorios'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <div 
            key={index} 
            className="card hover:bg-neutral-100 dark:hover:bg-gray-700 hover:scale-105 transition-all cursor-pointer group"
            onClick={() => onSectionChange(stat.section)}
            title={`Clique para ir para ${stat.title}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-neutral-600 dark:text-white text-sm font-medium mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-black dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                  {stat.value}
                </p>
                <p className={`text-xs transition-colors ${
                  stat.changeType === 'positive' 
                    ? 'text-brand-600 dark:text-brand-500 group-hover:text-brand-700 dark:group-hover:text-brand-400' 
                    : 'text-neutral-500 dark:text-dark-600 group-hover:text-neutral-600 dark:group-hover:text-dark-500'
                }`}>
                  {stat.change}
                </p>
              </div>
              
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="text-white" size="lg" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards
