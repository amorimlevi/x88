import { useState, useEffect } from 'react'
import { FileText, BarChart3, Clock, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react'
import { formatEuro, formatDate, formatDateTime } from '../../utils/formatters'
import { Pagamento, FiltroTempo, TipoRelatorio, RelatorioMetrica } from '../../types/reports'
import { reportsService } from '../../services/reportsService'
import MetricsCard from './components/MetricsCard'
import ReportChart from './components/ReportChart'
import AdvancedFilters from './components/AdvancedFilters'

const RelatoriosList = () => {
  const [filtroTempo, setFiltroTempo] = useState<FiltroTempo>('mensal')
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>('geral')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCharts, setShowCharts] = useState(true)

  // Carregar dados quando os filtros mudarem
  useEffect(() => {
    loadReportData()
  }, [filtroTempo, tipoRelatorio, startDate, endDate])

  const loadReportData = async () => {
    setIsLoading(true)
    try {
      const filters = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        ...(tipoRelatorio !== 'geral' && { tipo: tipoRelatorio })
      }
      const data = await reportsService.getPaymentData(filters)
      setPagamentos(data)
    } catch (error) {
      console.error('Erro ao carregar dados dos relatórios:', error)
      // Fallback para dados mock em desenvolvimento
      setPagamentos([
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
    } finally {
      setIsLoading(false)
    }
  }

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

  // Usar o serviço para calcular métricas
  const calcularMetricas = (): RelatorioMetrica[] => {
    const filtro = filtroTempo === 'hoje' ? 'semanal' : filtroTempo
    return reportsService.calculateMetrics(getFilteredPagamentos(), filtro as 'semanal' | 'mensal' | 'anual')
  }

  const metricas = calcularMetricas()
  const filteredPagamentos = getFilteredPagamentos()

  const clearDateFilters = () => {
    setStartDate('')
    setEndDate('')
    setFiltroTempo('mensal')
  }

  const exportarRelatorio = async () => {
    try {
      const dados = {
        periodo: filtroTempo === 'customizado' ? `${startDate} - ${endDate}` : filtroTempo,
        tipo: tipoRelatorio,
        metricas,
        transacoes: filteredPagamentos,
        totalPagamentos: filteredPagamentos.length,
        valorTotal: filteredPagamentos.reduce((sum, p) => sum + p.valor, 0),
        dataGeracao: new Date().toLocaleDateString('pt-PT')
      }
      
      await reportsService.exportReport(dados, 'json', tipoRelatorio)
    } catch (error) {
      console.error('Erro ao exportar relatório:', error)
    }
  }

  const refreshData = () => {
    loadReportData()
  }

  // Usar o serviço para gerar insights
  const gerarInsights = () => {
    return reportsService.generateInsights(filteredPagamentos)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Relatórios Avançados</h1>
          <p className="text-dark-600 mt-2">
            Análise completa e inteligente de pagamentos, faturamento e métricas financeiras
          </p>
          <div className="flex items-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-dark-600">{filteredPagamentos.filter(p => p.status === 'pago').length} Pagos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-dark-600">{filteredPagamentos.filter(p => ['pendente', 'aprovado'].includes(p.status)).length} Pendentes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-dark-600">{filteredPagamentos.filter(p => p.status === 'agendado').length} Agendados</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className={`btn-secondary flex items-center gap-2 ${showCharts ? 'bg-brand-500 text-white' : ''}`}
          >
            <BarChart3 className="w-5 h-5" />
            {showCharts ? 'Ocultar Gráficos' : 'Mostrar Gráficos'}
          </button>
          <button
            onClick={() => {
              const insights = gerarInsights()
              console.log('📊 Análise Inteligente:', {
                periodo: filtroTempo,
                totalTransacoes: filteredPagamentos.length,
                valorTotal: filteredPagamentos.reduce((sum, p) => sum + p.valor, 0),
                insights,
                metricas
              })
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <Lightbulb className="w-5 h-5" />
            Análise IA
          </button>
        </div>
      </div>

      {/* Filtros Avançados */}
      <AdvancedFilters
        filtroTempo={filtroTempo}
        setFiltroTempo={setFiltroTempo}
        tipoRelatorio={tipoRelatorio}
        setTipoRelatorio={setTipoRelatorio}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onExportData={exportarRelatorio}
        onClearFilters={clearDateFilters}
        onRefreshData={refreshData}
        isLoading={isLoading}
        totalRecords={filteredPagamentos.length}
      />

      {/* Métricas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricas.map((metrica, index) => (
          <MetricsCard
            key={index}
            metrica={metrica}
            isLoading={isLoading}
            onClick={() => {
              console.log('Métrica clicada:', metrica)
              // Futuramente pode abrir modal com detalhes
            }}
          />
        ))}
      </div>

      {/* Gráficos */}
      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReportChart
            data={filteredPagamentos}
            type="bar"
            title="Distribuição por Tipo de Pagamento"
          />
          
          <ReportChart
            data={filteredPagamentos.filter(p => p.status === 'pago')}
            type="pie"
            title="Composição dos Pagamentos Realizados"
          />
          
          <ReportChart
            data={filteredPagamentos}
            type="line"
            title="Evolução Temporal dos Pagamentos"
            className="lg:col-span-2"
          />
        </div>
      )}

      {/* Resumo por Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-500" />
            Resumo por Status de Pagamento
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{filteredPagamentos.length} transações</span>
            <span>•</span>
            <span>{formatEuro(filteredPagamentos.reduce((sum, p) => sum + p.valor, 0))} total</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['pago', 'pendente', 'agendado'].map((status) => {
            const statusPagamentos = filteredPagamentos.filter(p => 
              status === 'pago' ? p.status === 'pago' :
              status === 'pendente' ? ['pendente', 'aprovado'].includes(p.status) :
              p.status === 'agendado'
            )
            const total = statusPagamentos.reduce((sum, p) => sum + p.valor, 0)
            const count = statusPagamentos.length
            const percentage = filteredPagamentos.length > 0 ? (count / filteredPagamentos.length * 100).toFixed(1) : '0'

            return (
              <div key={status} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  {status === 'pago' && <CheckCircle className="w-6 h-6 text-green-500" />}
                  {status === 'pendente' && <AlertCircle className="w-6 h-6 text-yellow-500" />}
                  {status === 'agendado' && <Clock className="w-6 h-6 text-blue-500" />}
                  <div className="flex-1">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      {status === 'pago' ? 'Pagamentos Realizados' :
                       status === 'pendente' ? 'Aguardando Pagamento' :
                       'Pagamentos Agendados'}
                    </p>
                    <p className="text-black dark:text-white font-bold text-xl">{formatEuro(total)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{count} transações</span>
                  <span className={`font-medium ${
                    status === 'pago' ? 'text-green-600' :
                    status === 'pendente' ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {percentage}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
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
                      <p className="text-black dark:text-white text-sm">
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
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {pagamento.funcionarioNome.split(' ').map(name => name.charAt(0)).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-black dark:text-white font-medium">{pagamento.funcionarioNome}</span>
                    </div>
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
                    <span className="text-black dark:text-white">{pagamento.descricao}</span>
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
                      <span className="text-black dark:text-white text-sm">
                        {pagamento.metodoPagamento.charAt(0).toUpperCase() + pagamento.metodoPagamento.slice(1)}
                      </span>
                    ) : (
                      <span className="text-black dark:text-white text-sm">--</span>
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

      {/* Insights Inteligentes */}
      <div className="card bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border border-brand-200 dark:border-brand-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-brand-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Insights Inteligentes
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Análise automática dos seus dados financeiros
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-brand-500 text-white rounded-full text-xs font-medium">
            IA
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gerarInsights().map((insight, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-brand-200 dark:border-brand-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-brand-500 rounded-full mt-2"></div>
                <p className="text-black dark:text-white text-sm leading-relaxed">{insight}</p>
              </div>
            </div>
          ))}
          {gerarInsights().length === 0 && (
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Sem insights significativos para o período selecionado
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Experimente expandir o período ou incluir mais dados
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resumo Final Expandido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Próximos Pagamentos
          </h3>
          <div className="space-y-3">
            {filteredPagamentos
              .filter(p => ['pendente', 'agendado', 'aprovado'].includes(p.status))
              .slice(0, 5)
              .map((pagamento) => (
                <div key={pagamento.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {pagamento.funcionarioNome.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-black dark:text-white text-sm font-medium">{pagamento.funcionarioNome}</span>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{pagamento.descricao}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-orange-600 dark:text-orange-400 font-bold">{formatEuro(pagamento.valor)}</span>
                    {pagamento.dataVencimento && (
                      <p className="text-xs text-gray-500">{formatDate(pagamento.dataVencimento)}</p>
                    )}
                  </div>
                </div>
              ))}
            {filteredPagamentos.filter(p => ['pendente', 'agendado', 'aprovado'].includes(p.status)).length === 0 && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum pagamento pendente</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Principais Categorias
          </h3>
          <div className="space-y-3">
            {['salario', 'adiantamento', 'viagem', 'bonus'].map((tipo) => {
              const pagamentosTipo = filteredPagamentos.filter(p => p.tipo === tipo && p.status === 'pago')
              const total = pagamentosTipo.reduce((sum, p) => sum + p.valor, 0)
              const count = pagamentosTipo.length
              const totalGeral = filteredPagamentos.filter(p => p.status === 'pago').reduce((sum, p) => sum + p.valor, 0)
              const percentage = totalGeral > 0 ? ((total / totalGeral) * 100).toFixed(1) : '0'
              
              return total > 0 && (
                <div key={tipo} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      tipo === 'salario' ? 'bg-blue-500' :
                      tipo === 'adiantamento' ? 'bg-orange-500' :
                      tipo === 'viagem' ? 'bg-purple-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <span className="text-black dark:text-white text-sm font-medium">
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </span>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{count} transações</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{formatEuro(total)}</span>
                    <p className="text-xs text-gray-500">{percentage}%</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RelatoriosList
