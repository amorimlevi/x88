import { useState } from 'react'
import { Euro, Clock, CheckCircle, XCircle, User, Eye, Calendar, DollarSign, AlertTriangle } from 'lucide-react'
import { formatEuro, formatDate } from '../../utils/formatters'

interface ContaAReceber {
  id: string
  funcionarioId: string
  funcionarioNome: string
  adiantamentoId: string
  valorOriginal: number
  valorPendente: number
  valorDesconto: number
  dataAdiantamento: string
  dataVencimento: string
  dataDesconto?: string
  status: 'pendente' | 'parcial' | 'quitado' | 'vencido'
  descricao: string
  observacoes?: string
  parcelasTotal?: number
  parcelasDescontadas?: number
}

const ContasAReceber = () => {
  // Dados mock - em produção viriam da API
  const [contasAReceber] = useState<ContaAReceber[]>([
    {
      id: '1',
      funcionarioId: '1',
      funcionarioNome: 'João Silva',
      adiantamentoId: 'ADV-001',
      valorOriginal: 500,
      valorPendente: 500,
      valorDesconto: 0,
      dataAdiantamento: '2024-01-15T10:30:00',
      dataVencimento: '2024-02-15T00:00:00',
      status: 'pendente',
      descricao: 'Adiantamento emergência médica',
      observacoes: 'Desconto em 2 parcelas no salário'
    },
    {
      id: '2',
      funcionarioId: '2',
      funcionarioNome: 'Maria Santos',
      adiantamentoId: 'ADV-002',
      valorOriginal: 800,
      valorPendente: 400,
      valorDesconto: 400,
      dataAdiantamento: '2024-01-10T14:15:00',
      dataVencimento: '2024-01-25T00:00:00',
      dataDesconto: '2024-01-25T09:00:00',
      status: 'parcial',
      descricao: 'Adiantamento viagem família',
      parcelasTotal: 2,
      parcelasDescontadas: 1
    },
    {
      id: '3',
      funcionarioId: '3',
      funcionarioNome: 'Pedro Costa',
      adiantamentoId: 'ADV-003',
      valorOriginal: 300,
      valorPendente: 0,
      valorDesconto: 300,
      dataAdiantamento: '2024-01-05T16:00:00',
      dataVencimento: '2024-01-20T00:00:00',
      dataDesconto: '2024-01-20T10:30:00',
      status: 'quitado',
      descricao: 'Adiantamento reparação carro'
    },
    {
      id: '4',
      funcionarioId: '4',
      funcionarioNome: 'Ana Oliveira',
      adiantamentoId: 'ADV-004',
      valorOriginal: 1000,
      valorPendente: 1000,
      valorDesconto: 0,
      dataAdiantamento: '2024-01-20T11:00:00',
      dataVencimento: '2024-01-30T00:00:00',
      status: 'vencido',
      descricao: 'Adiantamento emergência familiar'
    },
    {
      id: '5',
      funcionarioId: '1',
      funcionarioNome: 'João Silva',
      adiantamentoId: 'ADV-005',
      valorOriginal: 250,
      valorPendente: 125,
      valorDesconto: 125,
      dataAdiantamento: '2024-01-25T09:30:00',
      dataVencimento: '2024-02-25T00:00:00',
      dataDesconto: '2024-02-01T08:00:00',
      status: 'parcial',
      descricao: 'Adiantamento despesas pessoais',
      parcelasTotal: 2,
      parcelasDescontadas: 1
    }
  ])

  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'parcial' | 'quitado' | 'vencido'>('todos')

  const getFilteredContas = () => {
    if (statusFilter === 'todos') {
      return contasAReceber
    }
    return contasAReceber.filter(conta => conta.status === statusFilter)
  }

  const filteredContas = getFilteredContas()

  const getTotalPendente = () => {
    return contasAReceber.reduce((total, conta) => total + conta.valorPendente, 0)
  }

  const getTotalOriginal = () => {
    return contasAReceber.reduce((total, conta) => total + conta.valorOriginal, 0)
  }

  const getTotalDesconto = () => {
    return contasAReceber.reduce((total, conta) => total + conta.valorDesconto, 0)
  }

  const getContasVencidas = () => {
    return contasAReceber.filter(conta => conta.status === 'vencido').length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quitado': return 'bg-green-500/20 text-green-400'
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400'
      case 'parcial': return 'bg-blue-500/20 text-blue-400'
      case 'vencido': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'quitado': return <CheckCircle className="w-4 h-4" />
      case 'vencido': return <XCircle className="w-4 h-4" />
      case 'parcial': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const isVencido = (dataVencimento: string, status: string) => {
    if (status === 'quitado') return false
    return new Date(dataVencimento) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">Contas a Receber</h2>
          <p className="text-dark-600 mt-2">
            Adiantamentos concedidos pendentes de desconto
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Total a Receber</p>
              <p className="text-2xl font-bold text-yellow-400">{formatEuro(getTotalPendente())}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Total Adiantado</p>
              <p className="text-2xl font-bold text-primary-500">{formatEuro(getTotalOriginal())}</p>
            </div>
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Euro className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Já Descontado</p>
              <p className="text-2xl font-bold text-green-400">{formatEuro(getTotalDesconto())}</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Contas Vencidas</p>
              <p className="text-2xl font-bold text-red-400">{getContasVencidas()}</p>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-lg font-semibold text-white">Filtrar por Status:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'todos', label: 'Todos', count: contasAReceber.length },
              { value: 'pendente', label: 'Pendentes', count: contasAReceber.filter(c => c.status === 'pendente').length },
              { value: 'parcial', label: 'Parciais', count: contasAReceber.filter(c => c.status === 'parcial').length },
              { value: 'vencido', label: 'Vencidas', count: contasAReceber.filter(c => c.status === 'vencido').length },
              { value: 'quitado', label: 'Quitadas', count: contasAReceber.filter(c => c.status === 'quitado').length }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-200 text-dark-600 hover:bg-dark-300 hover:text-white'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contas Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-300">
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Colaborador</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">ID Adiantamento</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Descrição</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Valor Original</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Pendente</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Progresso</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Vencimento</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Status</th>
                <th className="text-right py-3 px-4 text-dark-600 font-medium">Acções</th>
              </tr>
            </thead>
            <tbody>
              {filteredContas.map((conta) => {
                const progressPercentage = ((conta.valorOriginal - conta.valorPendente) / conta.valorOriginal) * 100
                const vencido = isVencido(conta.dataVencimento, conta.status)
                
                return (
                  <tr key={conta.id} className="border-b border-dark-300 hover:bg-dark-200/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{conta.funcionarioNome}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-primary-400 font-mono text-sm">{conta.adiantamentoId}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white">{conta.descricao}</span>
                      {conta.observacoes && (
                        <p className="text-dark-600 text-xs mt-1">{conta.observacoes}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-primary-500 font-semibold">
                        {formatEuro(conta.valorOriginal)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${conta.valorPendente > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {formatEuro(conta.valorPendente)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-dark-300 rounded-full h-2">
                            <div 
                              className="bg-primary-500 h-2 rounded-full transition-all"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-dark-600 min-w-[40px]">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                        {conta.parcelasTotal && (
                          <p className="text-xs text-dark-600">
                            {conta.parcelasDescontadas || 0}/{conta.parcelasTotal} parcelas
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className={`text-sm font-medium ${vencido ? 'text-red-400' : 'text-white'}`}>
                          {formatDate(conta.dataVencimento)}
                        </p>
                        {vencido && conta.status !== 'quitado' && (
                          <p className="text-red-400 text-xs">Vencida</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(conta.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conta.status)}`}>
                          {conta.status.charAt(0).toUpperCase() + conta.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button 
                          className="p-2 text-dark-600 hover:text-primary-500 hover:bg-dark-200 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {conta.status !== 'quitado' && (
                          <button 
                            className="p-2 text-dark-600 hover:text-green-500 hover:bg-dark-200 rounded-lg transition-colors"
                            title="Marcar como desconto no salário"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredContas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-600">Nenhuma conta a receber encontrada para o filtro selecionado.</p>
          </div>
        )}
      </div>

      {/* Alertas para Contas Vencidas */}
      {contasAReceber.filter(c => c.status === 'vencido').length > 0 && (
        <div className="card bg-red-900/20 border border-red-800/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-400 font-medium mb-2">Contas Vencidas</h3>
              <p className="text-red-300 text-sm mb-4">
                Existem {getContasVencidas()} contas vencidas que precisam de atenção imediata.
              </p>
              <div className="space-y-2">
                {contasAReceber
                  .filter(c => c.status === 'vencido')
                  .slice(0, 3)
                  .map(conta => (
                    <div key={conta.id} className="flex items-center justify-between bg-red-800/20 p-3 rounded-lg">
                      <div>
                        <p className="text-black dark:text-white font-medium">{conta.funcionarioNome}</p>
                        <p className="text-black dark:text-white text-sm">{conta.descricao}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-400 font-semibold">{formatEuro(conta.valorPendente)}</p>
                        <p className="text-red-500 text-xs">
                          Venceu em {formatDate(conta.dataVencimento)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Próximos Vencimentos */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Próximos Vencimentos</h3>
        <div className="space-y-3">
          {contasAReceber
            .filter(c => c.status !== 'quitado' && c.status !== 'vencido')
            .sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())
            .slice(0, 5)
            .map((conta) => (
              <div key={conta.id} className="flex items-center justify-between p-3 bg-dark-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{conta.funcionarioNome}</p>
                    <p className="text-dark-600 text-sm">{conta.descricao}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-semibold">{formatEuro(conta.valorPendente)}</p>
                  <p className="text-dark-600 text-xs">
                    Vence em {formatDate(conta.dataVencimento)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ContasAReceber
