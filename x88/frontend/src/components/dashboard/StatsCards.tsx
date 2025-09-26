import { UsersIcon, PaymentsIcon, AdvanceIcon, ReportsIcon } from '../ui/Icons'
import { FileText } from 'lucide-react'
import AlarmClockIcon from '../ui/icons/AlarmClockIcon'
import ReceiptIcon from '../ui/icons/ReceiptIcon'
import ThreeDotsIcon from '../ui/icons/ThreeDotsIcon'
import RetentionIcon from '../ui/icons/RetentionIcon'
import { formatEuro } from '../../utils/formatters'

interface StatsCardsProps {
  onSectionChange: (section: string) => void
}

const StatsCards = ({ onSectionChange }: StatsCardsProps) => {
  // Dados mock para adiantamentos (para calcular valor retido)
  const adiantamentos = [
    { valor: 500, status: 'pago' },
    { valor: 300, status: 'pago' },
    { valor: 750, status: 'aprovado' },
    { valor: 200, status: 'aprovado' },
    { valor: 400, status: 'pago' },
    { valor: 600, status: 'aprovado' }
  ]

  const TAXA_RETENCAO = 0.10 // 10%
  
  const calcularValorRetido = (valorBruto: number) => {
    return valorBruto * TAXA_RETENCAO
  }

  const getTotalRetidoPorStatus = (status: string) => {
    return adiantamentos
      .filter(a => a.status === status)
      .reduce((total, a) => total + calcularValorRetido(a.valor), 0)
  }

  const totalRetido = getTotalRetidoPorStatus('pago') + getTotalRetidoPorStatus('aprovado')

  const stats = [
    {
      title: 'Solicitações',
      value: '18',
      change: '6 pendentes',
      changeType: 'positive' as const,
      icon: AlarmClockIcon,
      color: 'bg-blue-300',
      section: 'solicitacoes'
    },
    {
      title: 'Pagamentos Realizados',
      value: '€ 48.300',
      change: '+12% vs mês anterior',
      changeType: 'positive' as const,
      icon: ReceiptIcon,
      color: 'bg-green-300',
      section: 'pagamentos'
    },
    {
      title: 'Adiantamentos Pendentes',
      value: '€ 2.400',
      change: '5 solicitações',
      changeType: 'positive' as const,
      icon: ThreeDotsIcon,
      color: 'bg-yellow-300',
      section: 'historico'
    },
    {
      title: 'Retido (Casa)',
      value: formatEuro(totalRetido),
      change: '10% de retenção',
      changeType: 'neutral' as const,
      icon: RetentionIcon,
      color: 'bg-purple-200',
      section: 'historico'
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
                    : stat.changeType === 'neutral'
                    ? 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                    : 'text-neutral-500 dark:text-dark-600 group-hover:text-neutral-600 dark:group-hover:text-dark-500'
                }`}>
                  {stat.change}
                </p>
              </div>
              
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {Icon === AlarmClockIcon ? (
                  <AlarmClockIcon className="text-black" size={28} />
                ) : Icon === ReceiptIcon ? (
                  <ReceiptIcon className="text-black" size={26} />
                ) : Icon === ThreeDotsIcon ? (
                  <ThreeDotsIcon className="text-black" size={26} />
                ) : Icon === RetentionIcon ? (
                  <RetentionIcon className="text-black" size={26} />
                ) : (
                  <Icon className="text-black dark:text-white" size={26} />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards
