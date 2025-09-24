import { DollarSign, Users, CreditCard, TrendingUp } from 'lucide-react'

const StatsCards = () => {
  const stats = [
    {
      title: 'Total de Colaboradores',
      value: '24',
      change: '+2 este mês',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Pagamentos Realizados',
      value: '€ 48.300',
      change: '+12% vs mês anterior',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-primary-500'
    },
    {
      title: 'Adiantamentos Pendentes',
      value: '€ 2.400',
      change: '5 solicitações',
      changeType: 'positive' as const,
      icon: CreditCard,
      color: 'bg-orange-500'
    },
    {
      title: 'Poupança do Mês',
      value: '€ 5.200',
      change: '+8% vs planeado',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <div key={index} className="card hover:bg-dark-200 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-dark-600 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className={`text-xs ${
                  stat.changeType === 'positive' 
                    ? 'text-primary-500' 
                    : 'text-dark-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards
