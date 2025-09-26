import { useState, useMemo, useEffect } from 'react'
import { FileText, Clock, CheckCircle, XCircle, TrendingUp, Calendar, Activity } from 'lucide-react'
import DatePicker from '../ui/DatePicker'
import { formatEuro } from '../../utils/formatters'
import { historicoService } from '../../services/historicoService'

interface HistoricoProps {}

// Tipos para o histórico
type TipoAcao = 'solicitacao' | 'pagamento' | 'cancelamento'
type StatusAcao = 'pendente' | 'pago' | 'cancelado'

interface HistoricoItem {
  id: string
  data: string
  hora: string
  tipo: TipoAcao
  status: StatusAcao
  funcionario: string
  funcionarioIniciais: string
  valor: number
  descricao: string
  detalhes?: string
}

// Mock data - ZERADO para ver modificações em tempo real
const mockHistoricoData: HistoricoItem[] = []

const HistoricoPage = ({}: HistoricoProps) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<TipoAcao | 'todos'>('todos')
  const [filtroStatus, setFiltroStatus] = useState<StatusAcao | 'todos'>('todos')
  const [updateTrigger, setUpdateTrigger] = useState(0)

  // Listener para atualizações em tempo real
  useEffect(() => {
    // Limpar dados iniciais para ver modificações em tempo real
    historicoService.limparHistorico()
    
    const unsubscribe = historicoService.addListener(() => {
      setUpdateTrigger(prev => prev + 1)
    })
    
    return unsubscribe
  }, [])

  // Obter dados do serviço de histórico
  const historicoCompleto = useMemo(() => {
    return [...mockHistoricoData, ...historicoService.obterHistorico()]
  }, [updateTrigger])

  // Filtrar dados com base nas seleções
  const dadosFiltrados = useMemo(() => {
    return historicoCompleto.filter(item => {
      // Filtro por data
      const itemDate = new Date(item.data)
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null
      
      if (start && itemDate < start) return false
      if (end && itemDate > end) return false
      
      // Filtro por tipo
      if (filtroTipo !== 'todos' && item.tipo !== filtroTipo) return false
      
      // Filtro por status
      if (filtroStatus !== 'todos' && item.status !== filtroStatus) return false
      
      return true
    })
  }, [historicoCompleto, startDate, endDate, filtroTipo, filtroStatus])

  // Calcular estatísticas
  const estatisticas = useMemo(() => {
    const totalSolicitacoes = dadosFiltrados.filter(item => item.tipo === 'solicitacao').length
    const totalPagamentos = dadosFiltrados.filter(item => item.tipo === 'pagamento').length
    const totalCancelamentos = dadosFiltrados.filter(item => item.tipo === 'cancelamento').length
    const valorTotal = dadosFiltrados.reduce((acc, item) => {
      if (item.tipo === 'pagamento' && item.status === 'pago') {
        return acc + item.valor
      }
      return acc
    }, 0)

    return {
      totalSolicitacoes,
      totalPagamentos,
      totalCancelamentos,
      valorTotal
    }
  }, [dadosFiltrados])

  const limparFiltros = () => {
    setStartDate('')
    setEndDate('')
    setFiltroTipo('todos')
    setFiltroStatus('todos')
  }

  const getIconeByTipo = (tipo: TipoAcao) => {
    switch (tipo) {
      case 'solicitacao': return Clock
      case 'pagamento': return CheckCircle
      case 'cancelamento': return XCircle
      default: return FileText
    }
  }

  const getCorByStatus = (status: StatusAcao) => {
    switch (status) {
      case 'pendente': return 'text-yellow-600 bg-yellow-100'
      case 'pago': return 'text-green-600 bg-green-100'
      case 'cancelado': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-1">Histórico de Atividades</h1>
        <p className="text-body mt-2">
          Visualize todas as atividades detalhadamente por período
        </p>
      </div>

      {/* Filtros */}
      <div className="card bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Filtros de Período
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dadosFiltrados.length} registros encontrados
                </p>
              </div>
            </div>

            <button
              onClick={limparFiltros}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DatePicker
              label="📅 Data Inicial"
              value={startDate}
              onChange={setStartDate}
              placeholder="Selecionar data inicial"
            />
            
            <DatePicker
              label="📅 Data Final"
              value={endDate}
              onChange={setEndDate}
              placeholder="Selecionar data final"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Ação
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as TipoAcao | 'todos')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="todos">Todas as ações</option>
                <option value="solicitacao">Solicitações</option>
                <option value="pagamento">Pagamentos</option>
                <option value="cancelamento">Cancelamentos</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as StatusAcao | 'todos')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="todos">Todos os status</option>
                <option value="pendente">Pendentes</option>
                <option value="pago">Pagos</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 dark:text-white text-sm font-medium mb-1">
                Solicitações
              </p>
              <p className="text-2xl font-bold text-black dark:text-white mb-2">
                {estatisticas.totalSolicitacoes}
              </p>
              <p className="text-xs text-blue-600">
                No período selecionado
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
              <Clock className="text-blue-600" size={26} />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 dark:text-white text-sm font-medium mb-1">
                Pagamentos
              </p>
              <p className="text-2xl font-bold text-black dark:text-white mb-2">
                {estatisticas.totalPagamentos}
              </p>
              <p className="text-xs text-green-600">
                Realizados
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-green-600" size={26} />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 dark:text-white text-sm font-medium mb-1">
                Cancelamentos
              </p>
              <p className="text-2xl font-bold text-black dark:text-white mb-2">
                {estatisticas.totalCancelamentos}
              </p>
              <p className="text-xs text-red-600">
                Cancelados
              </p>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center">
              <XCircle className="text-red-600" size={26} />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 dark:text-white text-sm font-medium mb-1">
                Valor Total
              </p>
              <p className="text-2xl font-bold text-black dark:text-white mb-2">
                {formatEuro(estatisticas.valorTotal)}
              </p>
              <p className="text-xs text-brand-600">
                Pagamentos realizados
              </p>
            </div>
            <div className="w-12 h-12 bg-brand-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-brand-600" size={26} />
            </div>
          </div>
        </div>
      </div>

      {/* Lista do Histórico */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-brand-600" />
          <h3 className="heading-3">Timeline de Atividades</h3>
        </div>

        <div className="space-y-4">
          {dadosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum registro encontrado para os filtros selecionados.
              </p>
            </div>
          ) : (
            dadosFiltrados.map((item) => {
              const Icone = getIconeByTipo(item.tipo)
              
              return (
                <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{item.funcionarioIniciais}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Icone className="w-4 h-4 text-brand-600" />
                          <h4 className="text-black dark:text-white font-medium">
                            {item.funcionario}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getCorByStatus(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                          {item.descricao}
                        </p>
                        {item.detalhes && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            {item.detalhes}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-black dark:text-white font-semibold">
                          {formatEuro(item.valor)}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {new Date(item.data).toLocaleDateString('pt-PT')} às {item.hora}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default HistoricoPage
