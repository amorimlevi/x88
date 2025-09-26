import { useState, useEffect } from 'react'
import { Clock, Check, X, Eye, Calendar, Euro, FileText } from 'lucide-react'
import { formatEuro, formatDateTime } from '../../utils/formatters'
import { historicoService } from '../../services/historicoService'

interface Solicitacao {
  id: string
  funcionarioId: string
  funcionarioNome: string
  tipo: 'adiantamento' | 'ferias' | 'folga' | 'reembolso' | 'ajuste_salario'
  valor?: number
  descricao: string
  justificativa: string
  datasolicitacao: string
  dataVencimento?: string
  status: 'pendente' | 'aprovada' | 'negada' | 'em_analise'
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  documentos?: string[]
  observacoes?: string
}

interface Props {
  selectedSolicitacao?: any
}

const SolicitacoesList = ({ selectedSolicitacao: propSelectedSolicitacao }: Props) => {
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'aprovada' | 'negada' | 'em_analise'>('pendente')
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Dados mock - em produção viriam da API
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([
    {
      id: '1',
      funcionarioId: '1',
      funcionarioNome: 'João da Silva',
      tipo: 'adiantamento',
      valor: 500,
      descricao: 'Adiantamento para emergência médica',
      justificativa: 'Preciso realizar uma consulta médica urgente para minha esposa. O plano de saúde não cobre todos os custos e preciso do adiantamento para cobrir as despesas.',
      datasolicitacao: '2024-01-25T10:30:00',
      dataVencimento: '2024-02-15T00:00:00',
      status: 'pendente',
      prioridade: 'alta',
      documentos: ['recibo_medico.pdf', 'comprovante_consulta.jpg']
    },
    {
      id: '2',
      funcionarioId: '2',
      funcionarioNome: 'Maria Santos',
      tipo: 'ferias',
      descricao: 'Solicitação de férias - Dezembro',
      justificativa: 'Gostaria de tirar férias entre 15 e 30 de dezembro para passar as festas de fim de ano com a família.',
      datasolicitacao: '2024-01-20T14:15:00',
      status: 'pendente',
      prioridade: 'media'
    },

    {
      id: '4',
      funcionarioId: '4',
      funcionarioNome: 'Ana Oliveira',
      tipo: 'adiantamento',
      valor: 800,
      descricao: 'Adiantamento reparação carro pessoal',
      justificativa: 'Meu carro pessoal que uso para o trabalho quebrou e precisa de reparo urgente. Solicito adiantamento para cobrir os custos.',
      datasolicitacao: '2024-01-24T09:20:00',
      dataVencimento: '2024-02-20T00:00:00',
      status: 'pendente',
      prioridade: 'urgente',
      documentos: ['orcamento_oficina.pdf']
    },
    {
      id: '5',
      funcionarioId: '5',
      funcionarioNome: 'Carlos Ferreira',
      tipo: 'ajuste_salario',
      valor: 200,
      descricao: 'Solicitação aumento salarial',
      justificativa: 'Trabalho na empresa há 2 anos e gostaria de solicitar revisão salarial baseada na minha performance e dedicação.',
      datasolicitacao: '2024-01-21T11:30:00',
      status: 'aprovada',
      prioridade: 'baixa'
    },
    {
      id: '6',
      funcionarioId: '6',
      funcionarioNome: 'Sofia Lima',
      tipo: 'folga',
      descricao: 'Folga para casamento',
      justificativa: 'Vou me casar dia 28 de janeiro e gostaria de solicitar folga para os preparativos e cerimônia.',
      datasolicitacao: '2024-01-15T13:45:00',
      status: 'negada',
      prioridade: 'media',
      observacoes: 'Período muito próximo, não é possível reorganizar a escala.'
    }
  ])

  // Efeito para mostrar detalhes quando uma solicitação é selecionada no dashboard
  useEffect(() => {
    if (propSelectedSolicitacao) {
      // Encontrar a solicitação correspondente pelos dados
      const solicitacaoEncontrada = solicitacoes.find(s => 
        s.funcionarioNome === propSelectedSolicitacao.nome
      )
      if (solicitacaoEncontrada) {
        setSelectedSolicitacao(solicitacaoEncontrada)
        setIsModalOpen(true)
      }
    } else {
      // Se não há solicitação selecionada, fechar modal
      setSelectedSolicitacao(null)
      setIsModalOpen(false)
    }
  }, [propSelectedSolicitacao])

  const getFilteredSolicitacoes = () => {
    if (statusFilter === 'todos') {
      return solicitacoes
    }
    return solicitacoes.filter(s => s.status === statusFilter)
  }

  const filteredSolicitacoes = getFilteredSolicitacoes()

  const handleAprovar = (id: string) => {
    const solicitacao = solicitacoes.find(s => s.id === id)
    if (solicitacao) {
      // Atualizar estado local
      setSolicitacoes(prev => prev.map(s => 
        s.id === id ? { ...s, status: 'aprovada' as const } : s
      ))
      
      // Registrar no histórico
      historicoService.registrarAprovacao({
        nome: solicitacao.funcionarioNome,
        iniciais: solicitacao.funcionarioNome.split(' ').map(n => n[0]).join(''),
        valor: solicitacao.valor || 0,
        viagem: solicitacao.descricao
      })
    }
  }

  const handleNegar = (id: string) => {
    const solicitacao = solicitacoes.find(s => s.id === id)
    if (solicitacao) {
      // Atualizar estado local
      setSolicitacoes(prev => prev.map(s => 
        s.id === id ? { ...s, status: 'negada' as const } : s
      ))
      
      // Registrar no histórico
      historicoService.registrarNegacao({
        nome: solicitacao.funcionarioNome,
        iniciais: solicitacao.funcionarioNome.split(' ').map(n => n[0]).join(''),
        valor: solicitacao.valor || 0,
        viagem: solicitacao.descricao
      }, 'Solicitação negada pelo administrador')
    }
  }

  const handleViewDetails = (solicitacao: Solicitacao) => {
    setSelectedSolicitacao(solicitacao)
    setIsModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada': return 'bg-green-500/20 text-green-400'
      case 'negada': return 'bg-red-500/20 text-red-400'
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400'
      case 'em_analise': return 'bg-blue-500/20 text-blue-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-500/20 text-red-400'
      case 'alta': return 'bg-orange-500/20 text-orange-400'
      case 'media': return 'bg-blue-500/20 text-blue-400'
      case 'baixa': return 'bg-green-500/20 text-green-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'adiantamento': return <Euro className="w-4 h-4" />
      case 'ferias': return <Calendar className="w-4 h-4" />
      case 'reembolso': return <FileText className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6 pb-96">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-black dark:text-white">Solicitações</h1>
          </div>
          <p className="text-dark-600">
            Gerencie todas as solicitações dos colaboradores
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Pendentes</p>
              <p className="text-2xl font-bold text-black dark:text-white">
              {solicitacoes.filter(s => s.status === 'pendente').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Aprovadas</p>
              <p className="text-2xl font-bold text-black dark:text-white">
              {solicitacoes.filter(s => s.status === 'aprovada').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Negadas</p>
              <p className="text-2xl font-bold text-black dark:text-white">
              {solicitacoes.filter(s => s.status === 'negada').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>


      </div>

      {/* Filters */}
      <div className="card">
        {/* Desktop Filters */}
        <div className="hidden md:flex flex-wrap items-center gap-4">
          <h3 className="text-lg font-semibold text-white">Filtrar por Status:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'todos', label: 'Todos', count: solicitacoes.length, color: 'gray' },
              { value: 'pendente', label: 'Pendentes', count: solicitacoes.filter(s => s.status === 'pendente').length, color: 'yellow' },
              { value: 'aprovada', label: 'Aprovadas', count: solicitacoes.filter(s => s.status === 'aprovada').length, color: 'green' },
              { value: 'negada', label: 'Negadas', count: solicitacoes.filter(s => s.status === 'negada').length, color: 'red' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  statusFilter === filter.value
                    ? filter.color === 'yellow' 
                      ? 'bg-yellow-500 text-black border-yellow-500'
                      : filter.color === 'green'
                      ? 'bg-green-500 text-white border-green-500'
                      : filter.color === 'red'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-gray-500 text-white border-gray-500'
                    : 'bg-dark-200 text-dark-600 border-dark-300 hover:bg-dark-300 hover:text-white hover:border-dark-400'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="block md:hidden">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Filtrar por Status</h3>
          <div className="flex gap-1">
            {[
              { value: 'todos', label: 'Todos', count: solicitacoes.length, color: 'gray' },
              { value: 'pendente', label: 'Pendentes', count: solicitacoes.filter(s => s.status === 'pendente').length, color: 'yellow' },
              { value: 'aprovada', label: 'Aprovadas', count: solicitacoes.filter(s => s.status === 'aprovada').length, color: 'green' },
              { value: 'negada', label: 'Negadas', count: solicitacoes.filter(s => s.status === 'negada').length, color: 'red' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value as any)}
                className={`flex-1 px-1 py-2 rounded-lg text-xs font-medium transition-colors border text-center ${
                  statusFilter === filter.value
                    ? filter.color === 'yellow' 
                      ? 'bg-yellow-500 text-black border-yellow-500'
                      : filter.color === 'green'
                      ? 'bg-green-500 text-white border-green-500'
                      : filter.color === 'red'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-gray-500 text-white border-gray-500'
                    : 'bg-dark-200 text-dark-600 border-dark-300 hover:bg-dark-300 hover:text-white hover:border-dark-400'
                }`}
              >
                <div className="leading-tight">{filter.label}</div>
                <div className="text-xs opacity-75">({filter.count})</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Solicitações Table - Desktop */}
      <div className="card overflow-hidden hidden md:block">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-300">
              <th className="text-left py-3 px-4 text-dark-600 font-medium">Colaborador</th>
              <th className="text-left py-3 px-4 text-dark-600 font-medium">Valor Solicitado</th>
              <th className="text-left py-3 px-4 text-dark-600 font-medium">Valor Líquido</th>
              <th className="text-left py-3 px-4 text-dark-600 font-medium">Data</th>
              <th className="text-left py-3 px-4 text-dark-600 font-medium">Status</th>
              <th className="text-right py-3 px-4 text-dark-600 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSolicitacoes.map((solicitacao) => (
                <tr key={solicitacao.id} className="border-b border-dark-300 hover:bg-dark-200/50">
                  <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black dark:text-white text-sm font-medium">
                  {solicitacao.funcionarioNome.split(' ').map(name => name.charAt(0)).join('').slice(0, 2).toUpperCase()}
                  </span>
                  </div>
                  <span className="text-black dark:text-white font-medium">{solicitacao.funcionarioNome}</span>
                  </div>
                  </td>
                  <td className="py-4 px-4">
                    {solicitacao.valor ? (
                      <span className="text-primary-500 font-semibold">
                        {formatEuro(solicitacao.valor)}
                      </span>
                    ) : (
                      <span className="text-dark-600">--</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {solicitacao.valor ? (
                      <span className="text-green-500 font-semibold">
                        {formatEuro(solicitacao.valor * 0.9)}
                      </span>
                    ) : (
                      <span className="text-dark-600">--</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-black dark:text-white text-sm">{formatDateTime(solicitacao.datasolicitacao).split(' ')[0]}</p>
                      <p className="text-black dark:text-white text-xs">{formatDateTime(solicitacao.datasolicitacao).split(' ')[1]}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(solicitacao.status)}`}>
                      {solicitacao.status.charAt(0).toUpperCase() + solicitacao.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button 
                        onClick={() => handleViewDetails(solicitacao)}
                        className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {solicitacao.status === 'pendente' && (
                        <>
                          <button 
                            onClick={() => handleAprovar(solicitacao.id)}
                            className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors"
                            title="Aprovar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleNegar(solicitacao.id)}
                            className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                            title="Negar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSolicitacoes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-600">Nenhuma solicitação encontrada para o filtro selecionado.</p>
          </div>
        )}
      </div>

      {/* Solicitações Cards - Mobile */}
      <div className="block md:hidden space-y-3">
        {filteredSolicitacoes.map((solicitacao) => (
          <div key={solicitacao.id} className="card">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-black dark:text-white text-sm font-medium">
                  {solicitacao.funcionarioNome.split(' ').map(name => name.charAt(0)).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0 pt-2">
                <h3 className="text-white font-medium truncate">{solicitacao.funcionarioNome}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(solicitacao.status)}`}>
                {solicitacao.status.charAt(0).toUpperCase() + solicitacao.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                {solicitacao.valor ? (
                  <div className="text-left">
                    <p className="text-dark-600 text-xs">Valor Solicitado</p>
                    <p className="text-primary-500 font-semibold text-sm">{formatEuro(solicitacao.valor)}</p>
                  </div>
                ) : null}
                {solicitacao.valor ? (
                  <div className="text-left">
                    <p className="text-dark-600 text-xs">Valor Líquido</p>
                    <p className="text-green-500 font-semibold text-sm">{formatEuro(solicitacao.valor * 0.9)}</p>
                  </div>
                ) : null}
                <div className="text-left">
                  <p className="text-dark-600 text-xs">Data</p>
                  <p className="text-white text-sm">{formatDateTime(solicitacao.datasolicitacao).split(' ')[0]}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleViewDetails(solicitacao)}
                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver detalhes
              </button>
              {solicitacao.status === 'pendente' && (
                <>
                  <button 
                    onClick={() => handleAprovar(solicitacao.id)}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center"
                    title="Aprovar"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleNegar(solicitacao.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center justify-center"
                    title="Negar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {filteredSolicitacoes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-600">Nenhuma solicitação encontrada para o filtro selecionado.</p>
          </div>
        )}
      </div>



      {/* Modal de Detalhes */}
      {isModalOpen && selectedSolicitacao && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin shadow-2xl border border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Detalhes da Solicitação</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-dark-600 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Colaborador */}
                <div>
                  <label className="text-dark-600 text-sm block mb-1">Colaborador</label>
                  <p className="text-black dark:text-white font-bold text-xl">{selectedSolicitacao.funcionarioNome}</p>
                </div>

                {/* Tipo */}
                <div>
                  <label className="text-dark-600 text-sm block mb-1">Tipo</label>
                  <p className="text-black dark:text-white font-bold text-xl capitalize">{selectedSolicitacao.tipo}</p>
                </div>

                {/* Status */}
                <div>
                  <label className="text-dark-600 text-sm block mb-2">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSolicitacao.status)}`}>
                    {selectedSolicitacao.status.charAt(0).toUpperCase() + selectedSolicitacao.status.slice(1)}
                  </span>
                </div>

                {/* Valor Solicitado */}
                {selectedSolicitacao.valor && (
                  <div>
                    <label className="text-dark-600 text-sm block mb-1">Valor Solicitado</label>
                    <p className="text-black dark:text-white font-bold text-2xl">{formatEuro(selectedSolicitacao.valor)}</p>
                  </div>
                )}

                {/* Valor Líquido */}
                {selectedSolicitacao.valor && (
                  <div>
                    <label className="text-dark-600 text-sm block mb-1">Valor Líquido (após dedução de 10%)</label>
                    <p className="text-green-500 font-bold text-2xl">{formatEuro(selectedSolicitacao.valor * 0.9)}</p>
                    <p className="text-dark-600 text-sm mt-1">Taxa de serviço: {formatEuro(selectedSolicitacao.valor * 0.1)}</p>
                  </div>
                )}

                {/* Data da Solicitação */}
                <div>
                  <label className="text-dark-600 text-sm block mb-1">Data da Solicitação</label>
                  <p className="text-black dark:text-white font-bold text-xl">{formatDateTime(selectedSolicitacao.datasolicitacao)}</p>
                </div>

                {/* Linha separadora */}
                <div className="border-t border-dark-300 my-6"></div>

                {selectedSolicitacao.status === 'pendente' && (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        handleAprovar(selectedSolicitacao.id)
                        setIsModalOpen(false)
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Aprovar
                    </button>
                    <button 
                      onClick={() => {
                        handleNegar(selectedSolicitacao.id)
                        setIsModalOpen(false)
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Negar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SolicitacoesList
