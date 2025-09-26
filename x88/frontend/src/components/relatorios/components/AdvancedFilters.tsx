import { useState } from 'react'
import { Filter, X, Search, Download, RefreshCw } from 'lucide-react'
import DatePicker from '../../ui/DatePicker'
import Select from '../../ui/Select'
import { FiltroTempo, TipoRelatorio, StatusFiltro, TipoPagamentoFiltro } from '../../../types/reports'

interface AdvancedFiltersProps {
  filtroTempo: FiltroTempo
  setFiltroTempo: (filtro: FiltroTempo) => void
  tipoRelatorio: TipoRelatorio
  setTipoRelatorio: (tipo: TipoRelatorio) => void
  startDate: string
  setStartDate: (date: string) => void
  endDate: string
  setEndDate: (date: string) => void
  onExportData: () => void
  onClearFilters: () => void
  onRefreshData: () => void
  isLoading?: boolean
  totalRecords?: number
}

const AdvancedFilters = ({
  filtroTempo,
  setFiltroTempo,
  tipoRelatorio,
  setTipoRelatorio,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onExportData,
  onClearFilters,
  onRefreshData,
  isLoading = false,
  totalRecords = 0
}: AdvancedFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFiltro>('todos')
  const [tipoFilter, setTipoFilter] = useState<TipoPagamentoFiltro>('todos')
  const [funcionarioSearch, setFuncionarioSearch] = useState('')
  const [valorMinimo, setValorMinimo] = useState('')
  const [valorMaximo, setValorMaximo] = useState('')

  const hasCustomDates = startDate || endDate
  const hasActiveFilters = statusFilter !== 'todos' || tipoFilter !== 'todos' || funcionarioSearch || valorMinimo || valorMaximo || hasCustomDates

  const handleClearAll = () => {
    setStartDate('')
    setEndDate('')
    setFiltroTempo('mensal')
    setStatusFilter('todos')
    setTipoFilter('todos')
    setFuncionarioSearch('')
    setValorMinimo('')
    setValorMaximo('')
    onClearFilters()
  }

  const quickDateFilters = [
    { label: 'Hoje', value: 'hoje' as FiltroTempo },
    { label: 'Esta semana', value: 'semanal' as FiltroTempo },
    { label: 'Este mês', value: 'mensal' as FiltroTempo },
    { label: 'Este ano', value: 'anual' as FiltroTempo }
  ]

  return (
    <div className="card bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="space-y-6">
        {/* Header dos Filtros */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Filtros Avançados
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalRecords} registros encontrados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Limpar todos os filtros"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={onRefreshData}
              disabled={isLoading}
              className="p-2 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="Atualizar dados"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-3 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              {showAdvanced ? 'Ocultar' : 'Avançado'}
            </button>

            <button
              onClick={onExportData}
              className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Filtros Rápidos de Data */}
        <div className="flex flex-wrap gap-2">
          {quickDateFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFiltroTempo(filter.value)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                filtroTempo === filter.value && !hasCustomDates
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Filtros Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <Select
            label="📊 Tipo de Relatório"
            value={tipoRelatorio}
            onChange={(value) => setTipoRelatorio(value as TipoRelatorio)}
            options={[
              { value: 'geral', label: 'Relatório Geral' },
              { value: 'pagamentos', label: 'Pagamentos Realizados' },
              { value: 'adiantamentos', label: 'Adiantamentos' },
              { value: 'funcionarios', label: 'Por Funcionário' },
              { value: 'faturamento', label: 'Faturamento' },
              { value: 'poupanca', label: 'Análise de Poupança' }
            ]}
          />

          {!hasCustomDates && (
            <Select
              label="⏰ Período"
              value={filtroTempo}
              onChange={(value) => setFiltroTempo(value as FiltroTempo)}
              options={[
                { value: 'hoje', label: 'Hoje' },
                { value: 'semanal', label: 'Última semana' },
                { value: 'mensal', label: 'Último mês' },
                { value: 'anual', label: 'Último ano' }
              ]}
            />
          )}
        </div>

        {/* Filtros Avançados */}
        {showAdvanced && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-md font-medium text-black dark:text-white mb-4 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Filtros Detalhados
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                label="Status do Pagamento"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as StatusFiltro)}
                options={[
                  { value: 'todos', label: 'Todos os status' },
                  { value: 'pago', label: 'Pagos' },
                  { value: 'pendente', label: 'Pendentes' },
                  { value: 'agendado', label: 'Agendados' },
                  { value: 'cancelado', label: 'Cancelados' }
                ]}
              />

              <Select
                label="Tipo de Pagamento"
                value={tipoFilter}
                onChange={(value) => setTipoFilter(value as TipoPagamentoFiltro)}
                options={[
                  { value: 'todos', label: 'Todos os tipos' },
                  { value: 'salario', label: 'Salários' },
                  { value: 'adiantamento', label: 'Adiantamentos' },
                  { value: 'viagem', label: 'Despesas de Viagem' },
                  { value: 'bonus', label: 'Bónus' }
                ]}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Buscar Funcionário
                </label>
                <input
                  type="text"
                  value={funcionarioSearch}
                  onChange={(e) => setFuncionarioSearch(e.target.value)}
                  placeholder="Nome do funcionário..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </div>
            </div>

            {/* Filtros de Valor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Valor Mínimo (€)
                </label>
                <input
                  type="number"
                  value={valorMinimo}
                  onChange={(e) => setValorMinimo(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Valor Máximo (€)
                </label>
                <input
                  type="number"
                  value={valorMaximo}
                  onChange={(e) => setValorMaximo(e.target.value)}
                  placeholder="999999.99"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </div>
            </div>

            {/* Resumo dos Filtros Ativos */}
            {hasActiveFilters && (
              <div className="mt-4 p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg border border-brand-200 dark:border-brand-800">
                <h5 className="text-sm font-medium text-brand-800 dark:text-brand-200 mb-2">
                  Filtros Ativos:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {hasCustomDates && (
                    <span className="px-2 py-1 bg-brand-500 text-white rounded text-xs">
                      {startDate} - {endDate}
                    </span>
                  )}
                  {statusFilter !== 'todos' && (
                    <span className="px-2 py-1 bg-brand-500 text-white rounded text-xs">
                      Status: {statusFilter}
                    </span>
                  )}
                  {tipoFilter !== 'todos' && (
                    <span className="px-2 py-1 bg-brand-500 text-white rounded text-xs">
                      Tipo: {tipoFilter}
                    </span>
                  )}
                  {funcionarioSearch && (
                    <span className="px-2 py-1 bg-brand-500 text-white rounded text-xs">
                      Funcionário: {funcionarioSearch}
                    </span>
                  )}
                  {(valorMinimo || valorMaximo) && (
                    <span className="px-2 py-1 bg-brand-500 text-white rounded text-xs">
                      Valor: €{valorMinimo || '0'} - €{valorMaximo || '∞'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdvancedFilters
