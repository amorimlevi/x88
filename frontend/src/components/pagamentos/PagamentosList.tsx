import { useState } from 'react'
import { Calendar, Filter, Euro, Clock, CheckCircle, XCircle, User, Eye, X } from 'lucide-react'
import { formatEuro, formatDateTime, formatDate } from '../../utils/formatters'
import PagamentoDetailsModal from './PagamentoDetailsModal'
import DatePicker from '../ui/DatePicker'

interface Pagamento {
  id: string
  funcionarioId: string
  funcionarioNome: string
  tipo: 'salario' | 'adiantamento' | 'viagem' | 'bonus' | 'desconto'
  valor: number
  descricao: string
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'pago' | 'cancelado' | 'agendado'
  dataPagamento: string
  dataVencimento?: string
  metodoPagamento?: 'pix' | 'transferencia' | 'dinheiro' | 'cartao'
  comprovante?: string
  observacoes?: string
  origem: 'manual' | 'app_terceiro'
}

type FilterPeriod = 'semanal' | 'mensal' | 'anual' | 'todos'
type FilterStatus = 'todos' | 'pago' | 'pendente' | 'agendado' | 'rejeitado'

const PagamentosList = () => {
  const [periodFilter, setPeriodFilter] = useState<FilterPeriod>('mensal')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('todos')
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // Dados mock - em produção viriam da API
  const [pagamentos] = useState<Pagamento[]>([
    {
      id: '1',
      funcionarioId: '1',
      funcionarioNome: 'João Silva',
      tipo: 'salario',
      valor: 1200,
      descricao: 'Salário Janeiro 2024',
      status: 'pago',
      dataPagamento: '2024-01-25T10:30:00',
      metodoPagamento: 'transferencia',
      comprovante: 'comprovante-001.pdf',
      origem: 'manual'
    },
    {
      id: '2',
      funcionarioId: '2',
      funcionarioNome: 'Maria Santos',
      tipo: 'viagem',
      valor: 350,
      descricao: 'Viagem Lisboa-Porto',
      status: 'pago',
      dataPagamento: '2024-01-20T14:15:00',
      metodoPagamento: 'pix',
      origem: 'app_terceiro'
    },
    {
      id: '3',
      funcionarioId: '1',
      funcionarioNome: 'João Silva',
      tipo: 'adiantamento',
      valor: 500,
      descricao: 'Adiantamento emergência médica',
      status: 'aprovado',
      dataPagamento: '2024-01-30T16:00:00',
      dataVencimento: '2024-02-15T00:00:00',
      origem: 'manual'
    },
    {
      id: '4',
      funcionarioId: '3',
      funcionarioNome: 'Pedro Costa',
      tipo: 'bonus',
      valor: 200,
      descricao: 'Bónus por performance',
      status: 'pendente',
      dataPagamento: '2024-02-01T12:00:00',
      dataVencimento: '2024-02-01T00:00:00',
      origem: 'manual'
    },
    {
      id: '5',
      funcionarioId: '2',
      funcionarioNome: 'Maria Santos',
      tipo: 'salario',
      valor: 1800,
      descricao: 'Salário Fevereiro 2024',
      status: 'agendado',
      dataPagamento: '2024-02-25T10:00:00',
      dataVencimento: '2024-02-25T00:00:00',
      origem: 'manual'
    },
    {
      id: '6',
      funcionarioId: '1',
      funcionarioNome: 'João Silva',
      tipo: 'desconto',
      valor: -100,
      descricao: 'Desconto por falta',
      status: 'pago',
      dataPagamento: '2024-01-15T09:00:00',
      metodoPagamento: 'transferencia',
      origem: 'manual'
    }
  ])

  const getFilteredPagamentos = () => {
    const now = new Date()
    let filteredByPeriod = pagamentos

    // Filter by custom date range if both dates are provided
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Include the entire end date
      
      filteredByPeriod = pagamentos.filter(pagamento => {
        const pagamentoDate = new Date(pagamento.dataPagamento || pagamento.dataVencimento || '')
        return pagamentoDate >= start && pagamentoDate <= end
      })
    } else if (startDate) {
      // Filter by start date only
      const start = new Date(startDate)
      filteredByPeriod = pagamentos.filter(pagamento => {
        const pagamentoDate = new Date(pagamento.dataPagamento || pagamento.dataVencimento || '')
        return pagamentoDate >= start
      })
    } else if (endDate) {
      // Filter by end date only
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      filteredByPeriod = pagamentos.filter(pagamento => {
        const pagamentoDate = new Date(pagamento.dataPagamento || pagamento.dataVencimento || '')
        return pagamentoDate <= end
      })
    } else if (periodFilter !== 'todos') {
      // Use period filter only if no custom dates are set
      const periodStartDate = new Date()
      
      switch (periodFilter) {
        case 'semanal':
          periodStartDate.setDate(now.getDate() - 7)
          break
        case 'mensal':
          periodStartDate.setMonth(now.getMonth() - 1)
          break
        case 'anual':
          periodStartDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filteredByPeriod = pagamentos.filter(pagamento => {
        const pagamentoDate = new Date(pagamento.dataPagamento || pagamento.dataVencimento || '')
        return pagamentoDate >= periodStartDate
      })
    }

    if (statusFilter !== 'todos') {
      filteredByPeriod = filteredByPeriod.filter(pagamento => pagamento.status === statusFilter)
    }

    return filteredByPeriod.sort((a, b) => {
      const dateA = new Date(a.dataPagamento || a.dataVencimento || '')
      const dateB = new Date(b.dataPagamento || b.dataVencimento || '')
      return dateB.getTime() - dateA.getTime()
    })
  }

  const filteredPagamentos = getFilteredPagamentos()

  const getTotalPago = () => {
    return pagamentos
      .filter(p => p.status === 'pago')
      .reduce((total, p) => total + p.valor, 0)
  }

  const getTotalPendente = () => {
    return pagamentos
      .filter(p => ['pendente', 'aprovado', 'agendado'].includes(p.status))
      .reduce((total, p) => total + p.valor, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-500/20 text-green-400'
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400'
      case 'aprovado': return 'bg-blue-500/20 text-blue-400'
      case 'agendado': return 'bg-purple-500/20 text-purple-400'
      case 'rejeitado': return 'bg-red-500/20 text-red-400'
      case 'cancelado': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'salario': return 'bg-primary-500/20 text-primary-400'
      case 'viagem': return 'bg-blue-500/20 text-blue-400'
      case 'adiantamento': return 'bg-orange-500/20 text-orange-400'
      case 'bonus': return 'bg-green-500/20 text-green-400'
      case 'desconto': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago': return <CheckCircle className="w-4 h-4" />
      case 'rejeitado': return <XCircle className="w-4 h-4" />
      case 'agendado': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const handleViewDetails = (pagamento: Pagamento) => {
    setSelectedPagamento(pagamento)
    setIsDetailsModalOpen(true)
  }

  const clearDateFilters = () => {
    setStartDate('')
    setEndDate('')
  }

  const hasDateFilters = startDate || endDate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Pagamentos</h1>
          <p className="text-dark-600 mt-2">
            Histórico e gestão de pagamentos da frota
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Total Pago</p>
              <p className="text-2xl font-bold text-green-400">{formatEuro(getTotalPago())}</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Pendente/Agendado</p>
              <p className="text-2xl font-bold text-yellow-400">{formatEuro(getTotalPendente())}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Este Mês</p>
              <p className="text-2xl font-bold text-primary-500">
                {formatEuro(pagamentos
                  .filter(p => {
                    const date = new Date(p.dataPagamento || p.dataVencimento || '')
                    const now = new Date()
                    return date.getMonth() === now.getMonth() && 
                           date.getFullYear() === now.getFullYear()
                  })
                  .reduce((total, p) => total + (p.status === 'pago' ? p.valor : 0), 0)
                )}
              </p>
            </div>
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Euro className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Total Transações</p>
              <p className="text-2xl font-bold text-white">{pagamentos.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">{pagamentos.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="space-y-4">
          {/* Date Range Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <DatePicker
              label="Data Inicial"
              value={startDate}
              onChange={setStartDate}
              placeholder="Selecionar data inicial"
            />
            
            <DatePicker
              label="Data Final"
              value={endDate}
              onChange={setEndDate}
              placeholder="Selecionar data final"
            />

            {hasDateFilters && (
              <button
                onClick={clearDateFilters}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                title="Limpar filtros de data"
              >
                <X className="w-4 h-4" />
                Limpar Datas
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Period Filter - only show when no custom dates */}
            {!hasDateFilters && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-dark-600" />
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value as FilterPeriod)}
                  className="px-3 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="todos">Todos os períodos</option>
                  <option value="semanal">Última semana</option>
                  <option value="mensal">Último mês</option>
                  <option value="anual">Último ano</option>
                </select>
              </div>
            )}

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-dark-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="px-3 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="todos">Todos os estados</option>
                <option value="pago">Pagos</option>
                <option value="pendente">Pendentes</option>
                <option value="agendado">Agendados</option>
                <option value="rejeitado">Rejeitados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Pagamentos Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-300">
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Colaborador</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Tipo</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Descrição</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Valor</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Data</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Estado</th>
                <th className="text-right py-3 px-4 text-dark-600 font-medium">Acções</th>
              </tr>
            </thead>
            <tbody>
              {filteredPagamentos.map((pagamento) => (
                <tr key={pagamento.id} className="border-b border-dark-300 hover:bg-dark-200/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium">{pagamento.funcionarioNome}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(pagamento.tipo)}`}>
                      {pagamento.tipo.charAt(0).toUpperCase() + pagamento.tipo.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white">{pagamento.descricao}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-semibold ${pagamento.valor >= 0 ? 'text-primary-500' : 'text-red-500'}`}>
                      {formatEuro(Math.abs(pagamento.valor))}
                      {pagamento.valor < 0 && ' (desconto)'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      {pagamento.dataPagamento ? (
                        <div>
                          <p className="text-white text-sm">{formatDate(pagamento.dataPagamento)}</p>
                          <p className="text-dark-600 text-xs">{formatDateTime(pagamento.dataPagamento).split(' ')[1]}</p>
                        </div>
                      ) : pagamento.dataVencimento ? (
                        <div>
                          <p className="text-yellow-400 text-sm">{formatDate(pagamento.dataVencimento)}</p>
                          <p className="text-dark-600 text-xs">Vencimento</p>
                        </div>
                      ) : (
                        <span className="text-dark-600 text-sm">--</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(pagamento.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pagamento.status)}`}>
                        {pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button 
                        onClick={() => handleViewDetails(pagamento)}
                        className="p-2 text-dark-600 hover:text-primary-500 hover:bg-dark-200 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPagamentos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-600">Nenhum pagamento encontrado para os filtros seleccionados.</p>
          </div>
        )}
      </div>

      {/* Pagamentos Futuros Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Próximos Pagamentos</h3>
        <div className="space-y-3">
          {pagamentos
            .filter(p => p.status === 'agendado' || (p.dataVencimento && new Date(p.dataVencimento) > new Date()))
            .slice(0, 5)
            .map((pagamento) => (
              <div key={pagamento.id} className="flex items-center justify-between p-3 bg-dark-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{pagamento.funcionarioNome}</p>
                    <p className="text-dark-600 text-sm">{pagamento.descricao}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary-500 font-semibold">{formatEuro(pagamento.valor)}</p>
                  <p className="text-dark-600 text-xs">
                    {pagamento.dataVencimento && formatDate(pagamento.dataVencimento)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Details Modal */}
      <PagamentoDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedPagamento(null)
        }}
        pagamento={selectedPagamento}
      />
    </div>
  )
}

export default PagamentosList
