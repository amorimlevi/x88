import { useState } from 'react'
import { BarChart3, PieChart, LineChart, TrendingUp } from 'lucide-react'
import { Pagamento } from '../../../types/reports'
import { formatEuro } from '../../../utils/formatters'

interface ReportChartProps {
  data: Pagamento[]
  type: 'bar' | 'pie' | 'line'
  title: string
  className?: string
}

const ReportChart = ({ data, type, title, className = '' }: ReportChartProps) => {
  const [activeChart, setActiveChart] = useState<'value' | 'count'>('value')

  // Processar dados por tipo de pagamento
  const getChartData = () => {
    const groupedData = data.reduce((acc, payment) => {
      const tipo = payment.tipo
      if (!acc[tipo]) {
        acc[tipo] = { valor: 0, count: 0, color: getColorByType(tipo) }
      }
      acc[tipo].valor += payment.valor
      acc[tipo].count += 1
      return acc
    }, {} as Record<string, { valor: number; count: number; color: string }>)

    return Object.entries(groupedData).map(([tipo, data]) => ({
      tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
      valor: data.valor,
      count: data.count,
      color: data.color
    }))
  }

  // Processar dados por mês
  const getMonthlyData = () => {
    const monthlyData = data.reduce((acc, payment) => {
      if (!payment.dataPagamento) return acc
      
      const date = new Date(payment.dataPagamento)
      const month = date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' })
      
      if (!acc[month]) {
        acc[month] = { valor: 0, count: 0 }
      }
      acc[month].valor += payment.valor
      acc[month].count += 1
      return acc
    }, {} as Record<string, { valor: number; count: number }>)

    return Object.entries(monthlyData)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([month, data]) => ({
        month,
        valor: data.valor,
        count: data.count
      }))
  }

  const getColorByType = (tipo: string): string => {
    const colors: Record<string, string> = {
      salario: '#3B82F6', // blue
      adiantamento: '#F59E0B', // amber
      viagem: '#8B5CF6', // violet
      bonus: '#10B981', // emerald
      desconto: '#EF4444' // red
    }
    return colors[tipo] || '#6B7280'
  }

  const chartData = getChartData()
  const monthlyData = getMonthlyData()
  const maxValue = Math.max(...chartData.map(d => activeChart === 'value' ? d.valor : d.count))

  const renderBarChart = () => (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveChart('value')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            activeChart === 'value' 
              ? 'bg-brand-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          Por Valor
        </button>
        <button
          onClick={() => setActiveChart('count')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            activeChart === 'count' 
              ? 'bg-brand-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          Por Quantidade
        </button>
      </div>

      {/* Barras do gráfico */}
      <div className="space-y-3">
        {chartData.map((item) => {
          const value = activeChart === 'value' ? item.valor : item.count
          const percentage = (value / maxValue) * 100
          
          return (
            <div key={item.tipo} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-black dark:text-white">
                  {item.tipo}
                </span>
                <span className="text-sm font-bold text-black dark:text-white">
                  {activeChart === 'value' ? formatEuro(value) : `${value} transações`}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: item.color,
                    transform: `translateX(-100%)`,
                    animation: `slideIn 0.7s ease-out forwards`
                  }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{((value / maxValue) * 100).toFixed(1)}% do total</span>
                <span>
                  {activeChart === 'value' 
                    ? `${item.count} transações` 
                    : formatEuro(item.valor)
                  }
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderPieChart = () => {
    const total = chartData.reduce((sum, item) => sum + (activeChart === 'value' ? item.valor : item.count), 0)
    let currentAngle = 0

    return (
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Gráfico de Pizza SVG */}
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
            <circle cx="100" cy="100" r="90" fill="transparent" />
            {chartData.map((item) => {
              const value = activeChart === 'value' ? item.valor : item.count
              const percentage = (value / total) * 100
              const angle = (percentage / 100) * 360
              const startAngle = currentAngle
              const endAngle = currentAngle + angle
              currentAngle += angle

              const startX = 100 + 90 * Math.cos((startAngle * Math.PI) / 180)
              const startY = 100 + 90 * Math.sin((startAngle * Math.PI) / 180)
              const endX = 100 + 90 * Math.cos((endAngle * Math.PI) / 180)
              const endY = 100 + 90 * Math.sin((endAngle * Math.PI) / 180)
              
              const largeArc = angle > 180 ? 1 : 0
              
              const pathData = [
                `M 100 100`,
                `L ${startX} ${startY}`,
                `A 90 90 0 ${largeArc} 1 ${endX} ${endY}`,
                'Z'
              ].join(' ')

              return (
                <path
                  key={item.tipo}
                  d={pathData}
                  fill={item.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  strokeWidth="2"
                  stroke="white"
                />
              )
            })}
          </svg>
          
          {/* Centro do gráfico com total */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-black dark:text-white">
                {activeChart === 'value' ? formatEuro(total) : total}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {activeChart === 'value' ? 'Total' : 'Transações'}
              </div>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setActiveChart('value')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                activeChart === 'value' 
                  ? 'bg-brand-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              Valor
            </button>
            <button
              onClick={() => setActiveChart('count')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                activeChart === 'count' 
                  ? 'bg-brand-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              Quantidade
            </button>
          </div>

          {chartData.map((item) => {
            const value = activeChart === 'value' ? item.valor : item.count
            const percentage = ((value / total) * 100).toFixed(1)
            
            return (
              <div key={item.tipo} className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 transition-colors">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-black dark:text-white">{item.tipo}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-black dark:text-white">
                    {activeChart === 'value' ? formatEuro(value) : `${value}x`}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {percentage}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderLineChart = () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Evolução mensal dos pagamentos
      </div>
      
      {monthlyData.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Dados insuficientes para gráfico temporal
        </div>
      ) : (
        <div className="space-y-2">
        {monthlyData.map((item) => (
        <div key={item.month} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
              <span className="text-sm font-medium text-black dark:text-white">
                {item.month}
              </span>
              <div className="text-right">
                <div className="text-sm font-bold text-brand-600 dark:text-brand-400">
                  {formatEuro(item.valor)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.count} transações
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const getIcon = () => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="w-5 h-5" />
      case 'pie':
        return <PieChart className="w-5 h-5" />
      case 'line':
        return <LineChart className="w-5 h-5" />
      default:
        return <TrendingUp className="w-5 h-5" />
    }
  }

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        {getIcon()}
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {title}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({data.length} registros)
        </span>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum dado disponível para exibir o gráfico
          </p>
        </div>
      ) : (
        <>
          {type === 'bar' && renderBarChart()}
          {type === 'pie' && renderPieChart()}
          {type === 'line' && renderLineChart()}
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

export default ReportChart
