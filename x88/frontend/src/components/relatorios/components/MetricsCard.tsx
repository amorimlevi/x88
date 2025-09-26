import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { RelatorioMetrica } from '../../../types/reports'
import { formatEuro } from '../../../utils/formatters'

interface MetricsCardProps {
  metrica: RelatorioMetrica
  isLoading?: boolean
  onClick?: () => void
}

const MetricsCard = ({ metrica, isLoading = false, onClick }: MetricsCardProps) => {
  const getTrendIcon = () => {
    if (metrica.variacao === undefined) return null
    
    if (metrica.variacao > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />
    } else if (metrica.variacao < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />
    } else {
      return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    if (metrica.variacao === undefined) return ''
    
    if (metrica.variacao > 0) return 'text-green-500'
    if (metrica.variacao < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  const getCardColor = () => {
    switch (metrica.tipo) {
      case 'receita':
        return 'border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20'
      case 'despesa':
        return 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20'
      default:
        return 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20'
    }
  }

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`card ${getCardColor()} ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} group`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-dark-600 text-sm font-medium mb-1">
            {metrica.titulo}
          </p>
          <p className="text-2xl font-bold text-black dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {formatEuro(metrica.valor)}
          </p>
          
          {/* Indicador de período */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-600 uppercase tracking-wide">
              {metrica.periodo}
            </span>
            
            {/* Variação percentual */}
            {metrica.variacao !== undefined && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {metrica.variacao > 0 ? '+' : ''}{metrica.variacao.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Ícone da métrica */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          metrica.tipo === 'receita' ? 'bg-green-500' : 
          metrica.tipo === 'despesa' ? 'bg-red-500' : 'bg-blue-500'
        } group-hover:scale-110 transition-transform`}>
          {metrica.icone ? (
            <span className="text-white text-lg">{metrica.icone}</span>
          ) : (
            <span className="text-white text-lg">€</span>
          )}
        </div>
      </div>

      {/* Barra de progresso opcional */}
      {metrica.variacao !== undefined && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center text-xs text-dark-600 mb-2">
            <span>Variação vs período anterior</span>
            <span className={getTrendColor()}>
              {metrica.variacao > 0 ? 'Crescimento' : metrica.variacao < 0 ? 'Redução' : 'Estável'}
            </span>
          </div>
          
          {/* Barra visual da variação */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-500 ${
                metrica.variacao > 0 ? 'bg-green-500' : 
                metrica.variacao < 0 ? 'bg-red-500' : 'bg-gray-400'
              }`}
              style={{ 
                width: `${Math.min(Math.abs(metrica.variacao || 0), 100)}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MetricsCard
