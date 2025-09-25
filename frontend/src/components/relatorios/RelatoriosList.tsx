import { useState } from 'react'
import { Calendar, TrendingUp, TrendingDown, Euro, FileText, Download, BarChart3, PieChart, X, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { formatEuro, formatDate, formatDateTime } from '../../utils/formatters'
import DatePicker from '../ui/DatePicker'
import Select from '../ui/Select'

// Interfaces para tipagem
interface Pagamento {
  id: string
  funcionarioId: string
  funcionarioNome: string
  tipo: 'salario' | 'adiantamento' | 'viagem' | 'bonus' | 'desconto'
  valor: number
  descricao: string
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'pago' | 'cancelado' | 'agendado'
  dataPagamento?: string
  dataVencimento?: string
  metodoPagamento?: 'pix' | 'transferencia' | 'dinheiro' | 'cartao'
  origem: 'manual' | 'app_terceiro'
}

interface RelatorioMetrica {
  titulo: string
  valor: number
  periodo: string
  variacao?: number
  tipo: 'receita' | 'despesa' | 'saldo'
}

type FiltroTempo = 'semanal' | 'mensal' | 'anual' | 'customizado'
type TipoRelatorio = 'geral' | 'pagamentos' | 'adiantamentos' | 'faturamento'

const RelatoriosList = () => {
  const [filtroTempo, setFiltroTempo] = useState<FiltroTempo>('mensal')
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>('geral')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // Dados mock mais extensos para relatórios
  const [pagamentos] = useState<Pagamento[]>([
    // Dados do mês atual
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
      status: 'pago',
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
      status: 'pago',
      dataPagamento: '2024-01-28T12:00:00',
      origem: 'manual'
    },
    // Dados pendentes
    {
      id: '5',
      funcionarioId: '2',
      funcionarioNome: 'Maria Santos',
      tipo: 'salario',
      valor: 1800,
      descricao: 'Salário Fevereiro 2024',
      status: 'agendado',
      dataVencimento: '2024-02-25T00:00:00',
      origem: 'manual'
    },
    {
      id: '6',
      funcionarioId: '4',
      funcionarioNome: 'Ana Oliveira',
      tipo: 'adiantamento',
      valor: 300,
      descricao: 'Adiantamento combustível',
      status: 'pendente',
      dataVencimento: '2024-02-05T00:00:00',
      origem: 'app_terceiro'
    },
    // Dados do mês passado para comparação
    {
      id: '7',
      funcionarioId: '1',
      funcionarioNome: 'João Silva',
      tipo: 'salario',
      valor: 1200,
      descricao: 'Salário Dezembro 2023',
      status: 'pago',
      dataPagamento: '2023-12-25T10:30:00',
      metodoPagamento: 'transferencia',
      origem: 'manual'
    },
    {
      id: '8',
      funcionarioId: '2',
      funcionarioNome: 'Maria Santos',
      tipo: 'salario',
      valor: 1800,
      descricao: 'Salário Dezembro 2023',
      status: 'pago',
      dataPagamento: '2023-12-25T10:30:00',
      metodoPagamento: 'transferencia',
      origem: 'manual'
    }
  ])

  const getDataRange = () => {
    const now = new Date()
    let start = new Date()
    let end = new Date()

    if (startDate && endDate) {
      return {
        start: new Date(startDate),
        end: new Date(endDate + 'T23:59:59')
      }
    }

    switch (filtroTempo) {
      case 'semanal':
        start.setDate(now.getDate() - 7)
        break
      case 'mensal':
        start.setMonth(now.getMonth() - 1)
        break
      case 'anual':
        start.setFullYear(now.getFullYear() - 1)
        break
    }

    return { start, end }
  }

  const getFilteredPagamentos = () => {
    const { start, end } = getDataRange()
    
    return pagamentos.filter(pagamento => {
      const pagamentoDate = new Date(pagamento.dataPagamento || pagamento.dataVencimento || '')
      const inDateRange = pagamentoDate >= start && pagamentoDate <= end
      
      if (tipoRelatorio === 'geral') return inDateRange
      if (tipoRelatorio === 'pagamentos') return inDateRange && pagamento.status === 'pago'
      if (tipoRelatorio === 'adiantamentos') return inDateRange && pagamento.tipo === 'adiantamento'
      if (tipoRelatorio === 'faturamento') return inDateRange && pagamento.status === 'pago'
      
      return inDateRange
    })
  }

  const calcularMetricas = (): RelatorioMetrica[] => {
    const filteredPagamentos = getFilteredPagamentos()
    
    const pagos = filteredPagamentos.filter(p => p.status === 'pago')
    const pendentes = filteredPagamentos.filter(p => ['pendente', 'agendado', 'aprovado'].includes(p.status))
    
    const totalPago = pagos.reduce((sum, p) => sum + p.valor, 0)
    const totalPendente = pendentes.reduce((sum, p) => sum + p.valor, 0)
    const totalAdiantamentos = pagos.filter(p => p.tipo === 'adiantamento').reduce((sum, p) => sum + p.valor, 0)
    const totalSalarios = pagos.filter(p => p.tipo === 'salario').reduce((sum, p) => sum + p.valor, 0)

    // Calcular variação em relação ao período anterior (mock)
    const variacaoPago = Math.round((Math.random() - 0.5) * 20) // -10% a +10%
    const variacaoPendente = Math.round((Math.random() - 0.5) * 30) // -15% a +15%

    return [
      {
        titulo: 'Total Pago',
        valor: totalPago,
        periodo: filtroTempo,
        variacao: variacaoPago,
        tipo: 'despesa'
      },
      {
        titulo: 'Pendente de Pagamento',
        valor: totalPendente,
        periodo: filtroTempo,
        variacao: variacaoPendente,
        tipo: 'despesa'
      },
      {
        titulo: 'Adiantamentos Pagos',
        valor: totalAdiantamentos,
        periodo: filtroTempo,
        variacao: Math.round((Math.random() - 0.5) * 25),
        tipo: 'despesa'
      },
      {
        titulo: 'Salários Pagos',
        valor: totalSalarios,
        periodo: filtroTempo,
        variacao: Math.round((Math.random() - 0.5) * 15),
        tipo: 'despesa'
      }
    ]
  }

  const metricas = calcularMetricas()
  const filteredPagamentos = getFilteredPagamentos()

  const clearDateFilters = () => {
    setStartDate('')
    setEndDate('')
    setFiltroTempo('mensal')
  }

  const hasCustomDates = startDate || endDate

  const exportarRelatorio = () => {
    // TODO: Implementar funcionalidade de exportação
    console.log('Exportando relatório...', { filtroTempo, tipoRelatorio, metricas })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Relatórios</h1>
          <p className="text-dark-600 mt-2">
            Análise completa de pagamentos, faturamento e métricas financeiras
          </p>
        </div>
        <button
          onClick={exportarRelatorio}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar Relatório
        </button>
      </div>

      {/* Filtros */}
      <div className="card bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-300/50 shadow-2xl">
        <div className="space-y-6">
          {/* Header dos Filtros */}
          <div className="flex items-center gap-3 pb-4 border-b border-dark-300/30">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Filtros de Análise</h3>
          </div>

          {/* Filtros de Data e Período */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DatePicker
              label="📅 Data Inicial"
              value={startDate}
              onChange={(date) => {
                setStartDate(date)
                setFiltroTempo('customizado')
              }}
              placeholder="Selecionar data inicial"
            />
            
            <DatePicker
              label="📅 Data Final"
              value={endDate}
              onChange={(date) => {
                setEndDate(date)
                setFiltroTempo('customizado')
              }}
              placeholder="Selecionar data final"
            />

            {hasCustomDates && (
              <div className="flex items-end">
                <button
                  onClick={clearDateFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  title="Limpar filtros de data"
                >
                  <X className="w-4 h-4" />
                  Limpar Datas
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Filtro de Período */}
            {!hasCustomDates && (
              <Select
                label="⏰ Período de Análise"
                value={filtroTempo}
                onChange={(value) => setFiltroTempo(value as FiltroTempo)}
                options={[
                  { value: 'semanal', label: 'Última semana' },
                  { value: 'mensal', label: 'Último mês' },
                  { value: 'anual', label: 'Último ano' }
                ]}
                icon={<Calendar className="w-5 h-5" />}
              />
            )}

            {/* Tipo de Relatório */}
            <Select
              label="📊 Tipo de Relatório"
              value={tipoRelatorio}
              onChange={(value) => setTipoRelatorio(value as TipoRelatorio)}
              options={[
                { value: 'geral', label: 'Relatório Geral' },
                { value: 'pagamentos', label: 'Apenas Pagamentos Realizados' },
                { value: 'adiantamentos', label: 'Apenas Adiantamentos' },
                { value: 'faturamento', label: 'Faturamento' }
              ]}
              icon={<BarChart3 className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {/* Métricas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((metrica, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-600 text-sm">{metrica.titulo}</p>
                <p className="text-2xl font-bold text-white">{formatEuro(metrica.valor)}</p>
                {metrica.variacao !== undefined && (
                  <div className="flex items-center gap-1 mt-1">
                    {metrica.variacao >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${metrica.variacao >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metrica.variacao >= 0 ? '+' : ''}{metrica.variacao}%
                    </span>
                  </div>
                )}
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                metrica.tipo === 'receita' ? 'bg-green-500' : 
                metrica.tipo === 'despesa' ? 'bg-red-500' : 'bg-blue-500'
              }`}>
                <Euro className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo por Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Resumo por Status de Pagamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['pago', 'pendente', 'agendado'].map((status) => {
            const statusPagamentos = filteredPagamentos.filter(p => 
              status === 'pago' ? p.status === 'pago' :
              status === 'pendente' ? ['pendente', 'aprovado'].includes(p.status) :
              p.status === 'agendado'
            )
            const total = statusPagamentos.reduce((sum, p) => sum + p.valor, 0)
            const count = statusPagamentos.length

            return (
              <div key={status} className="bg-dark-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  {status === 'pago' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {status === 'pendente' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                  {status === 'agendado' && <Clock className="w-5 h-5 text-blue-500" />}
                  <div>
                    <p className="text-dark-600 text-sm">
                      {status === 'pago' ? 'Pagamentos Realizados' :
                       status === 'pendente' ? 'Aguardando Pagamento' :
                       'Pagamentos Agendados'}
                    </p>
                    <p className="text-white font-bold text-lg">{formatEuro(total)}</p>
                    <p className="text-dark-600 text-xs">{count} transações</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Transações do Período
          </h3>
          <span className="text-dark-600 text-sm">{filteredPagamentos.length} registros</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-300">
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Data</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Funcionário</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Tipo</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Descrição</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Valor</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Método</th>
              </tr>
            </thead>
            <tbody>
              {filteredPagamentos.map((pagamento) => (
                <tr key={pagamento.id} className="border-b border-dark-300 hover:bg-dark-200/50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white text-sm">
                        {formatDate(pagamento.dataPagamento || pagamento.dataVencimento || '')}
                      </p>
                      {pagamento.dataPagamento && (
                        <p className="text-dark-600 text-xs">
                          {formatDateTime(pagamento.dataPagamento).split(' ')[1]}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-medium">{pagamento.funcionarioNome}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pagamento.tipo === 'salario' ? 'bg-blue-500/20 text-blue-400' :
                      pagamento.tipo === 'adiantamento' ? 'bg-orange-500/20 text-orange-400' :
                      pagamento.tipo === 'bonus' ? 'bg-green-500/20 text-green-400' :
                      pagamento.tipo === 'viagem' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {pagamento.tipo.charAt(0).toUpperCase() + pagamento.tipo.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white">{pagamento.descricao}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-semibold ${
                      pagamento.valor >= 0 ? 'text-primary-500' : 'text-red-500'
                    }`}>
                      {formatEuro(Math.abs(pagamento.valor))}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pagamento.status === 'pago' ? 'bg-green-500/20 text-green-400' :
                      pagamento.status === 'pendente' ? 'bg-yellow-500/20 text-yellow-400' :
                      pagamento.status === 'agendado' ? 'bg-blue-500/20 text-blue-400' :
                      pagamento.status === 'aprovado' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {pagamento.metodoPagamento ? (
                      <span className="text-white text-sm">
                        {pagamento.metodoPagamento.charAt(0).toUpperCase() + pagamento.metodoPagamento.slice(1)}
                      </span>
                    ) : (
                      <span className="text-white text-sm">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPagamentos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-600">Nenhuma transação encontrada para o período selecionado.</p>
          </div>
        )}
      </div>

      {/* Resumo Final */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Resumo do Relatório</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-2">Próximos Pagamentos</h4>
            <div className="space-y-2">
              {filteredPagamentos
                .filter(p => ['pendente', 'agendado', 'aprovado'].includes(p.status))
                .slice(0, 3)
                .map((pagamento) => (
                  <div key={pagamento.id} className="flex items-center justify-between p-2 bg-dark-200 rounded">
                    <span className="text-white text-sm">{pagamento.funcionarioNome}</span>
                    <span className="text-primary-500 font-medium">{formatEuro(pagamento.valor)}</span>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-2">Principais Categorias</h4>
            <div className="space-y-2">
              {['salario', 'adiantamento', 'viagem'].map((tipo) => {
                const total = filteredPagamentos
                  .filter(p => p.tipo === tipo && p.status === 'pago')
                  .reduce((sum, p) => sum + p.valor, 0)
                return total > 0 && (
                  <div key={tipo} className="flex items-center justify-between p-2 bg-dark-200 rounded">
                    <span className="text-white text-sm">
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </span>
                    <span className="text-primary-500 font-medium">{formatEuro(total)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RelatoriosList
