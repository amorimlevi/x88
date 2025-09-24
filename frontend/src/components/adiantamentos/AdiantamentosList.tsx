import { useState } from 'react'
import { Filter, Euro, Clock, CheckCircle, XCircle, User, Eye, FileText, AlertCircle, X } from 'lucide-react'
import { formatEuro, formatDateTime, formatDate } from '../../utils/formatters'
import AdiantamentoDetailsModal from './AdiantamentoDetailsModal'
import DatePicker from '../ui/DatePicker'

interface Adiantamento {
  id: string
  funcionarioId: string
  funcionarioNome: string
  cargo: string
  valor: number
  motivo: string
  descricao?: string
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'pago' | 'cancelado'
  dataSolicitacao: string
  dataVencimentoDesejada: string
  dataPagamento?: string
  justificativa?: string
  documentoComprovativo?: string
  observacoesGestor?: string
  urgencia: 'baixa' | 'media' | 'alta' | 'critica'
  origem: 'app_motorista' | 'manual'
}

type FilterStatus = 'todos' | 'pendente' | 'aprovado' | 'rejeitado' | 'pago'
type FilterUrgencia = 'todos' | 'baixa' | 'media' | 'alta' | 'critica'

const AdiantamentosList = () => {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('todos')
  const [urgenciaFilter, setUrgenciaFilter] = useState<FilterUrgencia>('todos')
  const [selectedAdiantamento, setSelectedAdiantamento] = useState<Adiantamento | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // Dados mock - em produção viriam da API
  const [adiantamentos] = useState<Adiantamento[]>([
    {
      id: '1',
      funcionarioId: '1',
      funcionarioNome: 'João Silva',
      cargo: 'Motorista',
      valor: 500,
      motivo: 'Emergência médica',
      descricao: 'Necessidade de pagamento de consulta médica urgente para familiar',
      status: 'pendente',
      dataSolicitacao: '2024-01-20T09:30:00',
      dataVencimentoDesejada: '2024-01-22T17:00:00',
      justificativa: 'Situação de emergência familiar que requer atenção imediata',
      urgencia: 'alta',
      origem: 'app_motorista'
    },
    {
      id: '2',
      funcionarioId: '2',
      funcionarioNome: 'Maria Santos',
      cargo: 'Motorista',
      valor: 300,
      motivo: 'Manutenção veículo pessoal',
      descricao: 'Reparo urgente no veículo pessoal para continuar trabalhando',
      status: 'aprovado',
      dataSolicitacao: '2024-01-18T14:15:00',
      dataVencimentoDesejada: '2024-01-20T12:00:00',
      dataPagamento: '2024-01-19T16:30:00',
      observacoesGestor: 'Aprovado devido à necessidade operacional',
      urgencia: 'media',
      origem: 'app_motorista'
    },
    {
      id: '3',
      funcionarioId: '3',
      funcionarioNome: 'Pedro Costa',
      cargo: 'Motorista',
      valor: 200,
      motivo: 'Despesas familiares',
      descricao: 'Pagamento de contas familiares em atraso',
      status: 'rejeitado',
      dataSolicitacao: '2024-01-17T11:45:00',
      dataVencimentoDesejada: '2024-01-19T08:00:00',
      observacoesGestor: 'Solicitação não atende aos critérios de urgência estabelecidos',
      urgencia: 'baixa',
      origem: 'app_motorista'
    },
    {
      id: '4',
      funcionarioId: '4',
      funcionarioNome: 'Ana Oliveira',
      cargo: 'Motorista',
      valor: 800,
      motivo: 'Emergência familiar',
      descricao: 'Hospitalização de familiar direto',
      status: 'pago',
      dataSolicitacao: '2024-01-15T07:20:00',
      dataVencimentoDesejada: '2024-01-16T10:00:00',
      dataPagamento: '2024-01-15T18:00:00',
      observacoesGestor: 'Aprovado e pago no mesmo dia devido à urgência crítica',
      documentoComprovativo: 'comprovante_hospitalar.pdf',
      urgencia: 'critica',
      origem: 'app_motorista'
    },
    {
      id: '5',
      funcionarioId: '1',
      funcionarioNome: 'João Silva',
      cargo: 'Motorista',
      valor: 250,
      motivo: 'Combustível veículo pessoal',
      descricao: 'Abastecimento para viagem de trabalho urgente',
      status: 'pendente',
      dataSolicitacao: '2024-01-22T12:30:00',
      dataVencimentoDesejada: '2024-01-23T06:00:00',
      urgencia: 'media',
      origem: 'app_motorista'
    }
  ])

  const getFilteredAdiantamentos = () => {
    let filtered = adiantamentos

    // Filter by custom date range if dates are provided
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      
      filtered = filtered.filter(adiantamento => {
        const solicitacaoDate = new Date(adiantamento.dataSolicitacao)
        return solicitacaoDate >= start && solicitacaoDate <= end
      })
    } else if (startDate) {
      const start = new Date(startDate)
      filtered = filtered.filter(adiantamento => {
        const solicitacaoDate = new Date(adiantamento.dataSolicitacao)
        return solicitacaoDate >= start
      })
    } else if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      filtered = filtered.filter(adiantamento => {
        const solicitacaoDate = new Date(adiantamento.dataSolicitacao)
        return solicitacaoDate <= end
      })
    }

    if (statusFilter !== 'todos') {
      filtered = filtered.filter(adiantamento => adiantamento.status === statusFilter)
    }

    if (urgenciaFilter !== 'todos') {
      filtered = filtered.filter(adiantamento => adiantamento.urgencia === urgenciaFilter)
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.dataSolicitacao)
      const dateB = new Date(b.dataSolicitacao)
      return dateB.getTime() - dateA.getTime()
    })
  }

  const filteredAdiantamentos = getFilteredAdiantamentos()

  const getTotalPorStatus = (status: string) => {
    return adiantamentos
      .filter(a => a.status === status)
      .reduce((total, a) => total + a.valor, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-500/20 text-green-400'
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400'
      case 'aprovado': return 'bg-blue-500/20 text-blue-400'
      case 'rejeitado': return 'bg-red-500/20 text-red-400'
      case 'cancelado': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'critica': return 'bg-red-500/20 text-red-400'
      case 'alta': return 'bg-orange-500/20 text-orange-400'
      case 'media': return 'bg-yellow-500/20 text-yellow-400'
      case 'baixa': return 'bg-green-500/20 text-green-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago': return <CheckCircle className="w-4 h-4" />
      case 'rejeitado': return <XCircle className="w-4 h-4" />
      case 'pendente': return <Clock className="w-4 h-4" />
      case 'aprovado': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getUrgenciaIcon = (urgencia: string) => {
    switch (urgencia) {
      case 'critica': return <AlertCircle className="w-4 h-4" />
      case 'alta': return <AlertCircle className="w-4 h-4" />
      case 'media': return <Clock className="w-4 h-4" />
      case 'baixa': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const handleViewDetails = (adiantamento: Adiantamento) => {
    setSelectedAdiantamento(adiantamento)
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
          <h1 className="text-3xl font-bold text-white">Adiantamentos</h1>
          <p className="text-dark-600 mt-2">
            Gestão de solicitações de adiantamento de pagamentos da frota
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-400">{formatEuro(getTotalPorStatus('pendente'))}</p>
              <p className="text-dark-600 text-xs">{adiantamentos.filter(a => a.status === 'pendente').length} solicitações</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Aprovados</p>
              <p className="text-2xl font-bold text-blue-400">{formatEuro(getTotalPorStatus('aprovado'))}</p>
              <p className="text-dark-600 text-xs">{adiantamentos.filter(a => a.status === 'aprovado').length} solicitações</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Pagos</p>
              <p className="text-2xl font-bold text-green-400">{formatEuro(getTotalPorStatus('pago'))}</p>
              <p className="text-dark-600 text-xs">{adiantamentos.filter(a => a.status === 'pago').length} pagamentos</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Euro className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Total Solicitações</p>
              <p className="text-2xl font-bold text-white">{adiantamentos.length}</p>
              <p className="text-dark-600 text-xs">{formatEuro(adiantamentos.reduce((total, a) => total + a.valor, 0))}</p>
            </div>
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
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
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-dark-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="px-3 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="todos">Todos os estados</option>
                <option value="pendente">Pendentes</option>
                <option value="aprovado">Aprovados</option>
                <option value="pago">Pagos</option>
                <option value="rejeitado">Rejeitados</option>
              </select>
            </div>

            {/* Urgencia Filter */}
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-dark-600" />
              <select
                value={urgenciaFilter}
                onChange={(e) => setUrgenciaFilter(e.target.value as FilterUrgencia)}
                className="px-3 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="todos">Todas as urgências</option>
                <option value="critica">Crítica</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Adiantamentos Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-300">
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Motorista</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Motivo</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Valor</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Urgência</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Data Solicitação</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Vencimento Desejado</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Estado</th>
                <th className="text-right py-3 px-4 text-dark-600 font-medium">Acções</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdiantamentos.map((adiantamento) => (
                <tr key={adiantamento.id} className="border-b border-dark-300 hover:bg-dark-200/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-white font-medium">{adiantamento.funcionarioNome}</span>
                        <p className="text-dark-600 text-xs">{adiantamento.cargo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="text-white font-medium">{adiantamento.motivo}</span>
                      {adiantamento.descricao && (
                        <p className="text-dark-600 text-sm truncate max-w-xs" title={adiantamento.descricao}>
                          {adiantamento.descricao}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-primary-500 font-semibold">
                      {formatEuro(adiantamento.valor)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getUrgenciaIcon(adiantamento.urgencia)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgenciaColor(adiantamento.urgencia)}`}>
                        {adiantamento.urgencia.charAt(0).toUpperCase() + adiantamento.urgencia.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white text-sm">{formatDate(adiantamento.dataSolicitacao)}</p>
                      <p className="text-dark-600 text-xs">{formatDateTime(adiantamento.dataSolicitacao).split(' ')[1]}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-yellow-400 text-sm">{formatDate(adiantamento.dataVencimentoDesejada)}</p>
                      <p className="text-dark-600 text-xs">{formatDateTime(adiantamento.dataVencimentoDesejada).split(' ')[1]}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(adiantamento.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(adiantamento.status)}`}>
                        {adiantamento.status.charAt(0).toUpperCase() + adiantamento.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button 
                        onClick={() => handleViewDetails(adiantamento)}
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

        {filteredAdiantamentos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-600">Nenhum adiantamento encontrado para os filtros seleccionados.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AdiantamentoDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedAdiantamento(null)
        }}
        adiantamento={selectedAdiantamento}
      />
    </div>
  )
}

export default AdiantamentosList
