import { useState } from 'react'
import { Filter, X, Calendar, Download, RefreshCw } from 'lucide-react'
import DatePicker from '../../ui/DatePicker'
import { FiltroTempo, TipoRelatorio } from '../../../types/reports'

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
  const hasCustomDates = startDate || endDate
  const hasActiveFilters = hasCustomDates

  const handleClearAll = () => {
    setStartDate('')
    setEndDate('')
    setFiltroTempo('mensal')
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
                Filtros por Período
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

        {/* Calendários */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-black dark:text-white">Data Inicial</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Início do período</p>
              </div>
            </div>
            <DatePicker
              label=""
              value={startDate}
              onChange={(date) => {
                setStartDate(date)
                setFiltroTempo('customizado')
              }}
              placeholder="Selecionar data inicial"
            />
          </div>
          
          <div className="card bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-black dark:text-white">Data Final</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fim do período</p>
              </div>
            </div>
            <DatePicker
              label=""
              value={endDate}
              onChange={(date) => {
                setEndDate(date)
                setFiltroTempo('customizado')
              }}
              placeholder="Selecionar data final"
            />
          </div>

          <div className="card bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-black dark:text-white">Período Selecionado</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {startDate && endDate ? (
                    <>
                      {new Date(startDate).toLocaleDateString('pt-PT')} - {new Date(endDate).toLocaleDateString('pt-PT')}
                    </>
                  ) : startDate ? (
                    <>A partir de {new Date(startDate).toLocaleDateString('pt-PT')}</>
                  ) : endDate ? (
                    <>Até {new Date(endDate).toLocaleDateString('pt-PT')}</>
                  ) : (
                    'Nenhum período personalizado'
                  )}
                </p>
              </div>
            </div>
            {hasCustomDates && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                      Período Ativo
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-300">
                      {startDate && endDate && (
                        <>
                          {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} dias
                        </>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={handleClearAll}
                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  )
}

export default AdvancedFilters
