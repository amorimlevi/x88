import { useState, useEffect } from 'react'
import { Clock, User, Check, X, Eye, AlertCircle, Calendar, Euro, FileText } from 'lucide-react'
import { formatEuro, formatDateTime } from '../../utils/formatters'
import { historicoService } from '../../services/historicoService'
import { relatoriosService } from '../../services/relatoriosService'

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
  selectedAdiantamentoId?: string | null
  modalOnly?: boolean
  onClose?: () => void
  onApproved?: (solicitacao: any) => void
  onDenied?: (solicitacao: any) => void
}

const SolicitacoesList = ({ selectedSolicitacao: propSelectedSolicitacao, selectedAdiantamentoId, modalOnly = false, onClose, onApproved, onDenied }: Props) => {
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'aprovada' | 'negada' | 'em_analise'>('pendente')
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Dados mock - em produção viriam da API
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([
    {
      id: 'adv_001',
      funcionarioId: '1',
      funcionarioNome: 'Ricardo Mendes',
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
      id: 'adv_002',
      funcionarioId: '2',
      funcionarioNome: 'Beatriz Almeida',
      tipo: 'adiantamento',
      valor: 300,
      descricao: 'Adiantamento para manutenção veículo pessoal',
      justificativa: 'Meu veículo pessoal que uso para o trabalho quebrou e precisa de reparo urgente para eu continuar trabalhando.',
      datasolicitacao: '2024-01-25T08:15:00',
      dataVencimento: '2024-02-10T00:00:00',
      status: 'pendente',
      prioridade: 'media',
      documentos: ['orcamento_oficina.pdf']
    },
    {
      id: '1',
      funcionarioId: '1',
      funcionarioNome: 'Ricardo Mendes',
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
      funcionarioNome: 'Beatriz Almeida',
      tipo: 'ferias',
      descricao: 'Solicitação de férias - Dezembro',
      justificativa: 'Gostaria de tirar férias entre 15 e 30 de dezembro para passar as festas de fim de ano com a família.',
      datasolicitacao: '2024-01-20T14:15:00',
      status: 'pendente',
      prioridade: 'media'
    },
    {
      id: '3',
      funcionarioId: '3',
      funcionarioNome: 'Gabriel Rodrigues',
      tipo: 'reembolso',
      valor: 120,
      descricao: 'Reembolso combustível viagem extra',
      justificativa: 'Fiz uma viagem adicional a pedido da empresa para entrega urgente. Anexo os comprovantes de combustível.',
      datasolicitacao: '2024-01-22T16:45:00',
      status: 'em_analise',
      prioridade: 'media',
      documentos: ['nota_combustivel_1.jpg', 'nota_combustivel_2.jpg']
    },
    {
      id: '4',
      funcionarioId: '4',
      funcionarioNome: 'Larissa Pereira',
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
      funcionarioNome: 'Diego Carvalho',
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
      funcionarioNome: 'Fernanda Ribeiro',
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

  // Efeito para abrir automaticamente o modal quando um adiantamento é selecionado via notificação
  useEffect(() => {
    if (selectedAdiantamentoId) {
      const solicitacaoEncontrada = solicitacoes.find(s => s.id === selectedAdiantamentoId)
      if (solicitacaoEncontrada) {
        setSelectedSolicitacao(solicitacaoEncontrada)
        setIsModalOpen(true)
      }
    }
  }, [selectedAdiantamentoId, solicitacoes])

  const getFilteredSolicitacoes = () => {
    if (statusFilter === 'todos') {
      return solicitacoes
    }
    return solicitacoes.filter(s => s.status === statusFilter)
  }

  const filteredSolicitacoes = getFilteredSolicitacoes()

  const handleAprovar = (id: string) => {
    setSolicitacoes(prev => prev.map(s => {
      if (s.id === id) {
        const solicitacaoAtualizada = { ...s, status: 'aprovada' as const }
        
        // Registrar no histórico e relatórios
        historicoService.registrarAprovacao({
          nome: s.funcionarioNome,
          iniciais: s.funcionarioNome.split(' ').map(n => n[0]).join(''),
          valor: s.valor || 0,
          viagem: s.descricao,
          observacoes: s.observacoes
        })
        
        relatoriosService.registrarAprovacao({
          nome: s.funcionarioNome,
          valor: s.valor || 0,
          viagem: s.descricao,
          observacoes: s.observacoes
        })
        
        console.log('💰 Pagamento aprovado e registrado no histórico:', s.funcionarioNome)
        
        return solicitacaoAtualizada
      }
      return s
    }))
  }

  const handleNegar = (id: string, motivo?: string) => {
    setSolicitacoes(prev => prev.map(s => {
      if (s.id === id) {
        const solicitacaoAtualizada = { ...s, status: 'negada' as const }
        
        // Registrar no histórico e relatórios
        historicoService.registrarNegacao({
          nome: s.funcionarioNome,
          iniciais: s.funcionarioNome.split(' ').map(n => n[0]).join(''),
          valor: s.valor || 0,
          viagem: s.descricao,
          observacoes: s.observacoes
        }, motivo || 'Solicitação negada pelo administrador')
        
        relatoriosService.registrarNegacao({
          nome: s.funcionarioNome,
          valor: s.valor || 0,
          viagem: s.descricao,
          observacoes: s.observacoes
        }, motivo || 'Solicitação negada pelo administrador')
        
        console.log('🚫 Pagamento cancelado e registrado no histórico:', s.funcionarioNome)
        
        return solicitacaoAtualizada
      }
      return s
    }))
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

  // Se modalOnly for true, renderiza apenas o modal
  if (modalOnly) {
    return (
      <>
        {/* Modal de Detalhes */}
        {isModalOpen && selectedSolicitacao && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-dark-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Detalhes da Solicitação</h2>
                  <button 
                    onClick={() => {
                      setIsModalOpen(false)
                      if (onClose) onClose()
                    }}
                    className="text-white dark:text-dark-600 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm font-bold">Colaborador</label>
                      <p className="text-white font-medium">{selectedSolicitacao.funcionarioNome}</p>
                    </div>
                    <div>
                      <label className="text-white text-sm font-bold">Tipo</label>
                      <p className="text-white font-medium capitalize">{selectedSolicitacao.tipo}</p>
                    </div>
                    <div>
                      <label className="text-white text-sm font-bold">Status</label>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSolicitacao.status)}`}>
                          {selectedSolicitacao.status === 'pendente' ? 'Pendente' : selectedSolicitacao.status}
                        </span>
                      </div>
                    </div>
                    {selectedSolicitacao.valor && (
                    <>
                    <div>
                      <label className="text-white text-sm font-bold">Valor Solicitado</label>
                        <p className="text-white font-semibold text-lg">{formatEuro(selectedSolicitacao.valor)}</p>
                        </div>
                       <div>
                         <label className="text-white text-sm font-bold">Valor Líquido (após dedução de 10%)</label>
                         <p className="text-green-400 font-bold text-xl">{formatEuro(selectedSolicitacao.valor * 0.9)}</p>
                         <p className="text-gray-400 text-xs">Taxa de serviço: {formatEuro(selectedSolicitacao.valor * 0.1)}</p>
                       </div>
                     </>
                   )}
                    <div>
                      <label className="text-white text-sm font-bold">Data da Solicitação</label>
                      <p className="text-white">{formatDateTime(selectedSolicitacao.datasolicitacao)}</p>
                    </div>
                  </div>



                  {selectedSolicitacao.observacoes && (
                    <div>
                      <label className="text-white text-sm font-bold">Observações</label>
                      <p className="text-white">{selectedSolicitacao.observacoes}</p>
                    </div>
                  )}

                  {selectedSolicitacao.status === 'pendente' && (
                    <div className="flex gap-4 pt-4 border-t border-dark-300">
                      <button 
                        onClick={() => {
                          handleAprovar(selectedSolicitacao.id)
                          setIsModalOpen(false)
                          if (onApproved) onApproved(selectedSolicitacao)
                          if (onClose) onClose()
                        }}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Aprovar
                      </button>
                      <button 
                        onClick={() => {
                          handleNegar(selectedSolicitacao.id)
                          setIsModalOpen(false)
                          if (onDenied) onDenied(selectedSolicitacao)
                          if (onClose) onClose()
                        }}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
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
      </>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-8 w-8 text-primary-500" />
            <h1 className="text-3xl font-bold text-black dark:text-white">Solicitações Pendentes</h1>
          </div>
          <p className="text-dark-600">
            Gerencie todas as solicitações dos colaboradores
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Em Análise</p>
              <p className="text-2xl font-bold text-black dark:text-white">
              {solicitacoes.filter(s => s.status === 'em_analise').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
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
              { value: 'todos', label: 'Todos', count: solicitacoes.length },
              { value: 'pendente', label: 'Pendentes', count: solicitacoes.filter(s => s.status === 'pendente').length },
              { value: 'em_analise', label: 'Em Análise', count: solicitacoes.filter(s => s.status === 'em_analise').length },
              { value: 'aprovada', label: 'Aprovadas', count: solicitacoes.filter(s => s.status === 'aprovada').length },
              { value: 'negada', label: 'Negadas', count: solicitacoes.filter(s => s.status === 'negada').length }
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

      {/* Solicitações Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-300">
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Colaborador</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Tipo</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Descrição</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Valor</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Prioridade</th>
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
                  <span className="text-white text-sm font-medium">
                  {solicitacao.funcionarioNome.split(' ').map(name => name.charAt(0)).join('').slice(0, 2).toUpperCase()}
                  </span>
                  </div>
                  <span className="text-black dark:text-white font-medium">{solicitacao.funcionarioNome}</span>
                  </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getTipoIcon(solicitacao.tipo)}
                      <span className="text-primary-400 capitalize">{solicitacao.tipo}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-black dark:text-white">{solicitacao.descricao}</span>
                    {solicitacao.documentos && solicitacao.documentos.length > 0 && (
                      <p className="text-blue-400 text-xs mt-1">
                        📎 {solicitacao.documentos.length} documento(s)
                      </p>
                    )}
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadeColor(solicitacao.prioridade)}`}>
                      {solicitacao.prioridade.charAt(0).toUpperCase() + solicitacao.prioridade.slice(1)}
                    </span>
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
                        className="p-2 text-dark-600 hover:text-primary-500 hover:bg-dark-200 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {solicitacao.status === 'pendente' && (
                        <>
                          <button 
                            onClick={() => handleAprovar(solicitacao.id)}
                            className="p-2 text-dark-600 hover:text-green-500 hover:bg-dark-200 rounded-lg transition-colors"
                            title="Aprovar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleNegar(solicitacao.id)}
                            className="p-2 text-dark-600 hover:text-red-500 hover:bg-dark-200 rounded-lg transition-colors"
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

      {/* Alertas para Solicitações Urgentes */}
      {solicitacoes.filter(s => s.prioridade === 'urgente' && s.status === 'pendente').length > 0 && (
        <div className="card bg-red-600 border border-red-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-bold mb-2">Solicitações Urgentes</h3>
              <p className="text-white text-sm mb-4">
                Existem {solicitacoes.filter(s => s.prioridade === 'urgente' && s.status === 'pendente').length} solicitações urgentes que precisam de atenção imediata.
              </p>
              <div className="space-y-2">
                {solicitacoes
                  .filter(s => s.prioridade === 'urgente' && s.status === 'pendente')
                  .map(sol => (
                    <div key={sol.id} className="flex items-center justify-between bg-red-700 p-3 rounded-lg">
                    <div>
                    <p className="text-white font-bold">{sol.funcionarioNome}</p>
                    <p className="text-white text-sm">{sol.descricao}</p>
                    </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAprovar(sol.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Aprovar
                        </button>
                        <button 
                          onClick={() => handleNegar(sol.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Negar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {isModalOpen && selectedSolicitacao && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Detalhes da Solicitação</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white dark:text-dark-600 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-bold">Colaborador</label>
                    <p className="text-white font-medium">{selectedSolicitacao.funcionarioNome}</p>
                  </div>
                  <div>
                    <label className="text-white text-sm font-bold">Tipo</label>
                    <p className="text-white font-medium capitalize">{selectedSolicitacao.tipo}</p>
                  </div>
                  <div>
                    <label className="text-white text-sm font-bold">Status</label>
                    <div className="mt-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSolicitacao.status)}`}>
                        {selectedSolicitacao.status === 'pendente' ? 'Pendente' : selectedSolicitacao.status}
                      </span>
                    </div>
                  </div>
                  {selectedSolicitacao.valor && (
                    <>
                      <div>
                        <label className="text-white text-sm font-bold">Valor Solicitado</label>
                        <p className="text-white font-semibold text-lg">{formatEuro(selectedSolicitacao.valor)}</p>
                      </div>
                      <div>
                        <label className="text-white text-sm font-bold">Valor Líquido (após dedução de 10%)</label>
                        <p className="text-green-400 font-bold text-xl">{formatEuro(selectedSolicitacao.valor * 0.9)}</p>
                        <p className="text-gray-400 text-xs">Taxa de serviço: {formatEuro(selectedSolicitacao.valor * 0.1)}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="text-white text-sm font-bold">Data da Solicitação</label>
                    <p className="text-white">{formatDateTime(selectedSolicitacao.datasolicitacao)}</p>
                  </div>
                </div>



                {selectedSolicitacao.observacoes && (
                  <div>
                    <label className="text-white text-sm font-bold">Observações</label>
                    <p className="text-white">{selectedSolicitacao.observacoes}</p>
                  </div>
                )}

                {selectedSolicitacao.status === 'pendente' && (
                  <div className="flex gap-4 pt-4 border-t border-dark-300">
                    <button 
                      onClick={() => {
                        handleAprovar(selectedSolicitacao.id)
                        setIsModalOpen(false)
                        if (onApproved) onApproved(selectedSolicitacao)
                      }}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Aprovar
                    </button>
                    <button 
                      onClick={() => {
                        handleNegar(selectedSolicitacao.id)
                        setIsModalOpen(false)
                        if (onDenied) onDenied(selectedSolicitacao)
                      }}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
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
