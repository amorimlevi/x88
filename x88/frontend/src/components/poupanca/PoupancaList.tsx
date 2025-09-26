import { useState } from 'react'
import { PiggyBank, TrendingUp, TrendingDown, Calendar, Euro, Target, Award, AlertCircle } from 'lucide-react'
import { formatEuro } from '../../utils/formatters'

interface PoupancaMensal {
  id: string
  mes: string
  ano: number
  valorPoupado: number
  valorPlanejado: number
  gastoTotal: number
  receitaTotal: number
  percentualEconomia: number
  categoria: {
    combustivel: number
    manutencao: number
    salarios: number
    outros: number
  }
  observacoes?: string
}

const PoupancaList = () => {
  const [selectedYear, setSelectedYear] = useState(2024)

  // Dados mock - em produção viriam da API
  const [poupancaMensal] = useState<PoupancaMensal[]>([
    {
      id: '1',
      mes: 'Janeiro',
      ano: 2024,
      valorPoupado: 5200,
      valorPlanejado: 4800,
      gastoTotal: 35800,
      receitaTotal: 41000,
      percentualEconomia: 12.7,
      categoria: {
        combustivel: 15000,
        manutencao: 8500,
        salarios: 10800,
        outros: 1500
      }
    },
    {
      id: '2',
      mes: 'Fevereiro',
      ano: 2024,
      valorPoupado: 4800,
      valorPlanejado: 4800,
      gastoTotal: 36200,
      receitaTotal: 41000,
      percentualEconomia: 11.7,
      categoria: {
        combustivel: 15800,
        manutencao: 9200,
        salarios: 10000,
        outros: 1200
      }
    },
    {
      id: '3',
      mes: 'Março',
      ano: 2024,
      valorPoupado: 6100,
      valorPlanejado: 4800,
      gastoTotal: 34900,
      receitaTotal: 41000,
      percentualEconomia: 14.9,
      categoria: {
        combustivel: 14200,
        manutencao: 7800,
        salarios: 11500,
        outros: 1400
      },
      observacoes: 'Economia extra devido à redução de combustível'
    },
    {
      id: '4',
      mes: 'Dezembro',
      ano: 2023,
      valorPoupado: 3200,
      valorPlanejado: 4000,
      gastoTotal: 37800,
      receitaTotal: 41000,
      percentualEconomia: 7.8,
      categoria: {
        combustivel: 16500,
        manutencao: 12800,
        salarios: 7000,
        outros: 1500
      }
    }
  ])

  const getPoupancaFiltrada = () => {
    return poupancaMensal.filter(p => p.ano === selectedYear)
  }

  const poupancaFiltrada = getPoupancaFiltrada()

  const getTotalPoupado = () => {
    return poupancaFiltrada.reduce((total, p) => total + p.valorPoupado, 0)
  }

  const getTotalPlanejado = () => {
    return poupancaFiltrada.reduce((total, p) => total + p.valorPlanejado, 0)
  }

  const getMediaPercentual = () => {
    if (poupancaFiltrada.length === 0) return 0
    return poupancaFiltrada.reduce((total, p) => total + p.percentualEconomia, 0) / poupancaFiltrada.length
  }

  const getMelhorMes = () => {
    if (poupancaFiltrada.length === 0) return null
    return poupancaFiltrada.reduce((melhor, atual) => 
      atual.valorPoupado > melhor.valorPoupado ? atual : melhor
    )
  }

  const getPerformanceColor = (atual: number, planejado: number) => {
    const percentual = (atual / planejado) * 100
    if (percentual >= 110) return 'text-green-400'
    if (percentual >= 90) return 'text-primary-500'
    if (percentual >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const melhorMes = getMelhorMes()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <PiggyBank className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-black dark:text-white">Poupança Mensal</h1>
          </div>
          <p className="text-dark-600">
            Controle de economias e análise de desempenho financeiro
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="input-primary"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Total Poupado</p>
              <p className="text-2xl font-bold text-green-400">{formatEuro(getTotalPoupado())}</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Meta Anual</p>
              <p className="text-2xl font-bold text-primary-500">{formatEuro(getTotalPlanejado())}</p>
            </div>
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Média Mensal</p>
              <p className="text-2xl font-bold text-blue-400">
                {poupancaFiltrada.length > 0 ? formatEuro(getTotalPoupado() / poupancaFiltrada.length) : '€ 0'}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">% Economia Média</p>
              <p className="text-2xl font-bold text-purple-400">{getMediaPercentual().toFixed(1)}%</p>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Melhor Mês Card */}
      {melhorMes && (
        <div className="card bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-800/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-green-400 font-semibold text-lg">Melhor Mês de {selectedYear}</h3>
              <p className="text-green-300">
                {melhorMes.mes} - {formatEuro(melhorMes.valorPoupado)} poupados 
                ({melhorMes.percentualEconomia.toFixed(1)}% de economia)
              </p>
              {melhorMes.observacoes && (
                <p className="text-green-200 text-sm mt-1">{melhorMes.observacoes}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Poupanças */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Histórico Mensal - {selectedYear}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-300">
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Mês</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Valor Poupado</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Meta</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Performance</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">% Economia</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Receita Total</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Gasto Total</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Observações</th>
              </tr>
            </thead>
            <tbody>
              {poupancaFiltrada
                .sort((a, b) => {
                  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
                  return meses.indexOf(a.mes) - meses.indexOf(b.mes)
                })
                .map((poupanca) => {
                  const performance = (poupanca.valorPoupado / poupanca.valorPlanejado) * 100
                  const isPositive = poupanca.valorPoupado >= poupanca.valorPlanejado
                  
                  return (
                    <tr key={poupanca.id} className="border-b border-dark-300 hover:bg-dark-200/50">
                      <td className="py-4 px-4">
                        <span className="text-black dark:text-white font-medium">{poupanca.mes}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-green-400 font-semibold">
                          {formatEuro(poupanca.valorPoupado)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-primary-500 font-medium">
                          {formatEuro(poupanca.valorPlanejado)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`font-semibold ${getPerformanceColor(poupanca.valorPoupado, poupanca.valorPlanejado)}`}>
                            {performance.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-purple-400 font-medium">
                          {poupanca.percentualEconomia.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-primary-400">
                          {formatEuro(poupanca.receitaTotal)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-yellow-400">
                          {formatEuro(poupanca.gastoTotal)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {poupanca.observacoes ? (
                          <span className="text-dark-600 text-sm">{poupanca.observacoes}</span>
                        ) : (
                          <span className="text-dark-600 text-sm">--</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        {poupancaFiltrada.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-600">Nenhum dado de poupança encontrado para {selectedYear}.</p>
          </div>
        )}
      </div>

      {/* Breakdown por Categoria */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">Gastos por Categoria - Último Mês</h3>
        {poupancaFiltrada.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(poupancaFiltrada[0].categoria).map(([categoria, valor]) => (
              <div key={categoria} className="bg-dark-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Euro className="w-5 h-5 text-primary-500" />
                  <h4 className="text-black dark:text-white font-medium capitalize">{categoria}</h4>
                </div>
                <p className="text-2xl font-bold text-primary-500">{formatEuro(valor)}</p>
                <p className="text-dark-600 text-sm mt-1">
                  {((valor / poupancaFiltrada[0].gastoTotal) * 100).toFixed(1)}% do total
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Dica de Gestão</h4>
            <p className="text-blue-300 text-sm">
              Analise as categorias com maior gasto para identificar oportunidades de economia. 
              Defina metas realistas baseadas no histórico de desempenho.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoupancaList
