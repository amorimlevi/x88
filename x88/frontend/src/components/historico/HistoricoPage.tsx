import { useState, useMemo, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, TrendingUp, Calendar, ThumbsUp, ThumbsDown, DollarSign, Minus, Wallet } from 'lucide-react'
import DatePicker from '../ui/DatePicker'
import { formatEuro } from '../../utils/formatters'
import { historicoService } from '../../services/historicoService'


interface HistoricoProps {}

// Tipos para o histórico
type TipoAcao = 'solicitacao' | 'pagamento' | 'cancelamento'
type StatusAcao = 'pendente' | 'pago' | 'cancelado'

interface HistoricoItem {
  id: string
  data: string
  hora: string
  tipo: TipoAcao
  status: StatusAcao
  funcionario: string
  funcionarioIniciais: string
  valor: number
  descricao: string
  detalhes?: string
}

// Mock data será fornecido pelo historicoService
const mockHistoricoData: HistoricoItem[] = []

const HistoricoPage = ({}: HistoricoProps) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<TipoAcao | 'todos'>('todos')
  const [filtroStatus, setFiltroStatus] = useState<StatusAcao | 'todos'>('todos')
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const [showPagamentosModal, setShowPagamentosModal] = useState(false)
  const [showModalType, setShowModalType] = useState<string>('')
  const [modalData, setModalData] = useState<any>({})
  
  // Debug: Log do estado do modal
  useEffect(() => {
    console.log('Estado do modal mudou:', showPagamentosModal);
  }, [showPagamentosModal])

  // Listener para atualizações em tempo real
  useEffect(() => {
    const unsubscribe = historicoService.addListener(() => {
      setUpdateTrigger(prev => prev + 1)
    })
    
    return unsubscribe
  }, [])

  // Obter dados do serviço de histórico
  const historicoCompleto = useMemo(() => {
    return [...mockHistoricoData, ...historicoService.obterHistorico()]
  }, [updateTrigger])

  // Filtrar dados com base nas seleções
  const dadosFiltrados = useMemo(() => {
    return historicoCompleto.filter(item => {
      // Filtro por data
      const itemDate = new Date(item.data)
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null
      
      if (start && itemDate < start) return false
      if (end && itemDate > end) return false
      
      // Filtro por tipo
      if (filtroTipo !== 'todos' && item.tipo !== filtroTipo) return false
      
      // Filtro por status
      if (filtroStatus !== 'todos' && item.status !== filtroStatus) return false
      
      return true
    })
  }, [historicoCompleto, startDate, endDate, filtroTipo, filtroStatus])

  // Calcular estatísticas
  const estatisticas = useMemo(() => {
    const totalSolicitacoes = dadosFiltrados.filter(item => item.tipo === 'solicitacao').length
    const totalPagamentos = dadosFiltrados.filter(item => item.tipo === 'pagamento').length
    const totalCancelamentos = dadosFiltrados.filter(item => item.tipo === 'cancelamento').length
    const pagamentosAprovados = dadosFiltrados.filter(item => item.tipo === 'pagamento' && item.status === 'pago').length
    const pagamentosRecusados = dadosFiltrados.filter(item => item.tipo === 'pagamento' && item.status === 'cancelado').length
    
    const valorTotal = dadosFiltrados.reduce((acc, item) => {
      if (item.tipo === 'pagamento' && item.status === 'pago') {
        return acc + item.valor
      }
      return acc
    }, 0)

    // Calcular valor bruto total (todos os pagamentos realizados)
    const valorBrutoTotal = dadosFiltrados.reduce((acc, item) => {
      if (item.tipo === 'pagamento' && item.status === 'pago') {
        return acc + item.valor
      }
      return acc
    }, 0)

    // Calcular valor retido (10% do valor bruto)
    const valorRetido = valorBrutoTotal * 0.10

    // Calcular valor líquido (valor bruto - 10%)
    const valorLiquido = valorBrutoTotal - valorRetido

    return {
      totalSolicitacoes,
      totalPagamentos,
      totalCancelamentos,
      pagamentosAprovados,
      pagamentosRecusados,
      valorTotal,
      valorBrutoTotal,
      valorLiquido,
      valorRetido
    }
  }, [dadosFiltrados])

  const limparFiltros = () => {
    setStartDate('')
    setEndDate('')
    setFiltroTipo('todos')
    setFiltroStatus('todos')
  }

  const handleCardClick = (type: string, data: any) => {
    setShowModalType(type)
    setModalData(data)
  }

  const closeModal = () => {
    setShowModalType('')
    setModalData({})
    setShowPagamentosModal(false)
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-1">Relatórios</h1>
        <p className="text-body mt-2">
          Visualize todas as atividades detalhadamente por período
        </p>
      </div>

      {/* Filtros */}
      <div className="card bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Filtros de Período
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dadosFiltrados.length} registros encontrados
                </p>
              </div>
            </div>

            <button
              onClick={limparFiltros}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DatePicker
              label="📅 Data Inicial"
              value={startDate}
              onChange={setStartDate}
              placeholder="Selecionar data inicial"
            />
            
            <DatePicker
              label="📅 Data Final"
              value={endDate}
              onChange={setEndDate}
              placeholder="Selecionar data final"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Ação
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as TipoAcao | 'todos')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="todos">Todas as ações</option>
                <option value="solicitacao">Solicitações</option>
                <option value="pagamento">Pagamentos</option>
                <option value="cancelamento">Cancelamentos</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as StatusAcao | 'todos')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="todos">Todos os status</option>
                <option value="pendente">Pendentes</option>
                <option value="pago">Pagos</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>
          </div>
        </div>
      </div>



      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <div 
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => handleCardClick('solicitacoes', {
            title: 'Solicitações',
            count: estatisticas.totalSolicitacoes,
            items: dadosFiltrados.filter(item => item.tipo === 'solicitacao')
          })}
          title="Clique para ver detalhes das solicitações"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm font-medium mb-1 group-hover:text-blue-600 transition-colors">
                Solicitações
              </p>
              <p className="text-2xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors">
                {estatisticas.totalSolicitacoes}
              </p>
              <p className="text-xs text-blue-600 font-medium">
                ✨ Clique para detalhes
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="text-blue-600" size={26} />
            </div>
          </div>
        </div>

        <div 
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group relative select-none"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Card clicado! Abrindo modal...');
            setShowPagamentosModal(true);
          }}
          style={{ 
            pointerEvents: 'auto',
            userSelect: 'none',
            zIndex: 1
          }}
          title="Clique para ver detalhes dos pagamentos realizados"
        >
          <div className="flex items-center justify-between pointer-events-none">
            <div>
              <p className="text-black text-sm font-medium mb-1 group-hover:text-green-600 transition-colors">
                Pagamentos Realizados
              </p>
              <p className="text-2xl font-bold text-black mb-2 group-hover:text-green-600 transition-colors">
                {estatisticas.totalPagamentos}
              </p>
              <p className="text-xs text-green-600 font-semibold">
                ✨ Clique para ver detalhes ✨
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="text-green-600" size={26} />
            </div>
          </div>
          {/* Overlay invisível para garantir que todo o card seja clicável */}
          <div className="absolute inset-0 bg-transparent hover:bg-green-50 hover:bg-opacity-20 rounded-lg transition-colors"></div>
        </div>

        <div 
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => handleCardClick('cancelamentos', {
            title: 'Cancelamentos',
            count: estatisticas.totalCancelamentos,
            items: dadosFiltrados.filter(item => item.tipo === 'cancelamento')
          })}
          title="Clique para ver detalhes dos cancelamentos"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm font-medium mb-1 group-hover:text-red-600 transition-colors">
                Cancelamentos
              </p>
              <p className="text-2xl font-bold text-black mb-2 group-hover:text-red-600 transition-colors">
                {estatisticas.totalCancelamentos}
              </p>
              <p className="text-xs text-red-600 font-medium">
                ✨ Clique para detalhes
              </p>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <XCircle className="text-red-600" size={26} />
            </div>
          </div>
        </div>

        <div 
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => handleCardClick('valor-total', {
            title: 'Valor Total',
            valor: estatisticas.valorTotal,
            items: dadosFiltrados.filter(item => item.tipo === 'pagamento' && item.status === 'pago')
          })}
          title="Clique para ver detalhes do valor total"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm font-medium mb-1 group-hover:text-brand-600 transition-colors">
                Valor Total
              </p>
              <p className="text-2xl font-bold text-black mb-2 group-hover:text-brand-600 transition-colors">
                {formatEuro(estatisticas.valorTotal)}
              </p>
              <p className="text-xs text-brand-600 font-medium">
                ✨ Clique para detalhes
              </p>
            </div>
            <div className="w-12 h-12 bg-brand-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="text-brand-600" size={26} />
            </div>
          </div>
        </div>

        {/* Card Pagamentos Aprovados */}
        <div 
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => handleCardClick('pagamentos-aprovados', {
            title: 'Pagamentos Aprovados',
            count: estatisticas.pagamentosAprovados,
            items: dadosFiltrados.filter(item => item.tipo === 'pagamento' && item.status === 'pago')
          })}
          title="Clique para ver detalhes dos pagamentos aprovados"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm font-medium mb-1 group-hover:text-green-600 transition-colors">
                Pagamentos Aprovados
              </p>
              <p className="text-2xl font-bold text-black mb-2 group-hover:text-green-600 transition-colors">
                {estatisticas.pagamentosAprovados}
              </p>
              <p className="text-xs text-green-600 font-medium">
                ✨ Clique para detalhes
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ThumbsUp className="text-green-600" size={26} />
            </div>
          </div>
        </div>

        {/* Card Pagamentos Recusados */}
        <div 
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => handleCardClick('pagamentos-recusados', {
            title: 'Pagamentos Recusados',
            count: estatisticas.pagamentosRecusados,
            items: dadosFiltrados.filter(item => item.tipo === 'pagamento' && item.status === 'cancelado')
          })}
          title="Clique para ver detalhes dos pagamentos recusados"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm font-medium mb-1 group-hover:text-red-600 transition-colors">
                Pagamentos Recusados
              </p>
              <p className="text-2xl font-bold text-black mb-2 group-hover:text-red-600 transition-colors">
                {estatisticas.pagamentosRecusados}
              </p>
              <p className="text-xs text-red-600 font-medium">
                ✨ Clique para detalhes
              </p>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ThumbsDown className="text-red-600" size={26} />
            </div>
          </div>
        </div>

        {/* Card Valor Bruto Total */}
        <div 
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => handleCardClick('valor-bruto-total', {
            title: 'Valor Bruto Total',
            valor: estatisticas.valorBrutoTotal,
            items: dadosFiltrados.filter(item => item.tipo === 'pagamento' && item.status === 'pago')
          })}
          title="Clique para ver detalhes do valor bruto total"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm font-medium mb-1 group-hover:text-blue-600 transition-colors">
                Valor Bruto Total
              </p>
              <p className="text-2xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors">
                {formatEuro(estatisticas.valorBrutoTotal)}
              </p>
              <p className="text-xs text-blue-600 font-medium">
                ✨ Clique para detalhes
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="text-blue-600" size={26} />
            </div>
          </div>
        </div>

        {/* Card Valor Líquido */}
        <div 
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => handleCardClick('valor-liquido', {
            title: 'Valor Líquido',
            valor: estatisticas.valorLiquido,
            items: dadosFiltrados.filter(item => item.tipo === 'pagamento' && item.status === 'pago')
          })}
          title="Clique para ver detalhes do valor líquido"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm font-medium mb-1 group-hover:text-teal-600 transition-colors">
                Valor Líquido
              </p>
              <p className="text-2xl font-bold text-black mb-2 group-hover:text-teal-600 transition-colors">
                {formatEuro(estatisticas.valorLiquido)}
              </p>
              <p className="text-xs text-teal-600 font-medium">
                ✨ Clique para detalhes
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="text-teal-600" size={26} />
            </div>
          </div>
        </div>

        {/* Card Valor Retido */}
        <div 
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => handleCardClick('valor-retido', {
            title: 'Valor Retido (10%)',
            valor: estatisticas.valorRetido,
            items: dadosFiltrados.filter(item => item.tipo === 'pagamento' && item.status === 'pago')
          })}
          title="Clique para ver detalhes do valor retido"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black text-sm font-medium mb-1 group-hover:text-orange-600 transition-colors">
                Valor Retido
              </p>
              <p className="text-2xl font-bold text-black mb-2 group-hover:text-orange-600 transition-colors">
                {formatEuro(estatisticas.valorRetido)}
              </p>
              <p className="text-xs text-orange-600 font-medium">
                ✨ Clique para detalhes
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Minus className="text-orange-600" size={26} />
            </div>
          </div>
        </div>
      </div>



      {/* Modal Universal para Detalhes dos Cards */}
      {(showModalType || showPagamentosModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  {showPagamentosModal ? 'Pagamentos Realizados' : modalData.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {showPagamentosModal 
                    ? `${dadosFiltrados.filter(item => item.tipo === 'pagamento' && item.status === 'pago').length} pagamentos no período`
                    : `${modalData.items?.length || 0} itens encontrados ${modalData.valor ? `- Total: ${formatEuro(modalData.valor)}` : ''}`
                  }
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {(showPagamentosModal 
                  ? dadosFiltrados.filter(item => item.tipo === 'pagamento' && item.status === 'pago')
                  : modalData.items || []
                ).map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.tipo === 'pagamento' && item.status === 'pago' ? 'bg-green-500' :
                          item.tipo === 'pagamento' && item.status === 'cancelado' ? 'bg-red-500' :
                          item.tipo === 'solicitacao' ? 'bg-blue-500' :
                          item.tipo === 'cancelamento' ? 'bg-red-500' : 'bg-gray-500'
                        }`}>
                          {item.tipo === 'pagamento' && item.status === 'pago' && <DollarSign className="w-5 h-5 text-white" />}
                          {item.tipo === 'pagamento' && item.status === 'cancelado' && <XCircle className="w-5 h-5 text-white" />}
                          {item.tipo === 'solicitacao' && <Clock className="w-5 h-5 text-white" />}
                          {item.tipo === 'cancelamento' && <XCircle className="w-5 h-5 text-white" />}
                        </div>
                        <div className={`w-5 h-5 ${
                          item.status === 'pago' ? 'text-green-500' :
                          item.status === 'cancelado' ? 'text-red-500' :
                          'text-blue-500'
                        }`}>
                          {item.status === 'pago' && <CheckCircle className="w-5 h-5" />}
                          {item.status === 'cancelado' && <XCircle className="w-5 h-5" />}
                          {item.status === 'pendente' && <Clock className="w-5 h-5" />}
                        </div>
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          item.status === 'pago' ? 'text-green-600' :
                          item.status === 'cancelado' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {item.tipo === 'pagamento' ? `Pagamento ${item.status === 'pago' ? 'realizado' : 'cancelado'}` :
                           item.tipo === 'solicitacao' ? 'Solicitação' :
                           'Cancelamento'} {item.valor ? formatEuro(item.valor) : ''}
                        </h3>
                        <p className="text-black dark:text-white font-medium">
                          Funcionário: {item.funcionario}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Data: {new Date(item.data).toLocaleDateString('pt-PT')} às {item.hora}
                        </p>
                        {item.descricao && (
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            {item.descricao}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === 'pago' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          item.status === 'cancelado' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                          'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        }`}>
                          {item.status === 'pago' ? 'Pago' :
                           item.status === 'cancelado' ? 'Cancelado' :
                           'Pendente'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          item.tipo === 'pagamento' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                          item.tipo === 'solicitacao' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                          'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                        }`}>
                          {item.tipo === 'pagamento' ? 'Pagamento' :
                           item.tipo === 'solicitacao' ? 'Solicitação' :
                           'Cancelamento'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(showPagamentosModal 
                ? dadosFiltrados.filter(item => item.tipo === 'pagamento' && item.status === 'pago').length === 0
                : !modalData.items || modalData.items.length === 0
              ) && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum item encontrado para os filtros selecionados.
                  </p>
                </div>
              )}
            </div>

            {/* Footer do Modal */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {showPagamentosModal 
                  ? `Total: ${formatEuro(dadosFiltrados.filter(item => item.tipo === 'pagamento' && item.status === 'pago').reduce((sum, item) => sum + item.valor, 0))}`
                  : modalData.valor 
                    ? `Total: ${formatEuro(modalData.valor)}`
                    : `${modalData.count || 0} itens`
                }
              </div>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoricoPage
