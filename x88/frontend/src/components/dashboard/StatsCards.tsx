import { PaymentsIcon, AdvanceIcon, ReportsIcon } from '../ui/Icons'
import AlarmClockIcon from '../ui/icons/AlarmClockIcon'
import ReceiptIcon from '../ui/icons/ReceiptIcon'
import ThreeDotsIcon from '../ui/icons/ThreeDotsIcon'
import RetentionIcon from '../ui/icons/RetentionIcon'
import { formatEuro } from '../../utils/formatters'
import { solicitacoesService } from '../../services/solicitacoesService'
import { historicoService } from '../../services/historicoService'
import { useEffect, useState } from 'react'

interface StatsCardsProps {
  onSectionChange: (section: string) => void
}

const StatsCards = ({ onSectionChange }: StatsCardsProps) => {
  const [solicitacoesDoDia, setSolicitacoesDoDia] = useState(0)
  const [pagamentosDoDia, setPagamentosDoDia] = useState(0)
  const [adiantamentosPendentesDoDia, setAdiantamentosPendentesDoDia] = useState(0)
  const [valorRetidoDoDia, setValorRetidoDoDia] = useState(0)

  useEffect(() => {
    const atualizarDadosDiarios = () => {
      // Atualizar solicitações do dia
      const solicitacoes = solicitacoesService.obterSolicitacoesDoDia()
      setSolicitacoesDoDia(solicitacoes.length)

      // Atualizar pagamentos do dia
      const valorPagamentos = historicoService.obterValorPagamentosDoDia()
      setPagamentosDoDia(valorPagamentos)

      // Atualizar adiantamentos pendentes do dia
      const valorAdiantamentosPendentes = solicitacoesService.obterValorAdiantamentosPendentesDoDia()
      setAdiantamentosPendentesDoDia(valorAdiantamentosPendentes)

      // Atualizar valor retido do dia
      const valorRetido = solicitacoesService.obterValorRetidoDoDia()
      setValorRetidoDoDia(valorRetido)
    }

    // Atualizar inicialmente
    atualizarDadosDiarios()

    // Adicionar listeners para atualizações
    const unsubscribeSolicitacoes = solicitacoesService.addListener(atualizarDadosDiarios)
    const unsubscribeHistorico = historicoService.addListener(atualizarDadosDiarios)

    // Atualizar a meia-noite
    const agora = new Date()
    const proximaMeiaNoite = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1)
    const tempoAteMeiaNoite = proximaMeiaNoite.getTime() - agora.getTime()

    const timeout = setTimeout(() => {
      atualizarDadosDiarios()
      // Configurar intervalo diário após a primeira atualização
      const interval = setInterval(atualizarDadosDiarios, 24 * 60 * 60 * 1000)
      
      return () => clearInterval(interval)
    }, tempoAteMeiaNoite)

    return () => {
      unsubscribeSolicitacoes()
      unsubscribeHistorico()
      clearTimeout(timeout)
    }
  }, [])

  const solicitacoesPendentes = solicitacoesService.obterSolicitacoesPendentes().length

  const pagamentosHoje = historicoService.obterPagamentosDoDia()
  const adiantamentosPendentesHoje = solicitacoesService.obterAdiantamentosPendentesDoDia()

  const stats = [
    {
      title: 'Solicitações Hoje',
      value: solicitacoesDoDia.toString(),
      change: `${solicitacoesPendentes} pendentes total`,
      changeType: 'positive' as const,
      icon: AlarmClockIcon,
      color: 'bg-blue-300',
      section: 'solicitacoes'
    },
    {
      title: 'Pagamentos Hoje',
      value: formatEuro(pagamentosDoDia),
      change: `${pagamentosHoje.length} pagamentos realizados`,
      changeType: 'positive' as const,
      icon: ReceiptIcon,
      color: 'bg-green-300',
      section: 'historico'
    },
    {
      title: 'Adiantamentos Pendentes Hoje',
      value: formatEuro(adiantamentosPendentesDoDia),
      change: `${adiantamentosPendentesHoje.length} solicitações`,
      changeType: 'positive' as const,
      icon: ThreeDotsIcon,
      color: 'bg-yellow-300',
      section: 'historico'
    },
    {
      title: 'Retido Hoje (Casa)',
      value: formatEuro(valorRetidoDoDia),
      change: '10% de retenção do dia',
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
