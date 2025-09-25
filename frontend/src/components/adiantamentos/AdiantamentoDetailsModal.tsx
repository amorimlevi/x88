import { X, User, Euro, Calendar, Clock, FileText, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { formatEuro, formatDateTime } from '../../utils/formatters'

interface Adiantamento {
  id: string
  funcionarioId: string
  funcionarioNome: string
  cargo: string
  valor: number
  motivo: string
  descricao?: string
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'pago' | 'cancelado'
  dataSolicitacao: string
  dataVencimentoDesejada: string
  dataPagamento?: string
  justificativa?: string
  documentoComprovativo?: string
  observacoesGestor?: string
  urgencia: 'baixa' | 'media' | 'alta' | 'critica'
  origem: 'app_motorista' | 'manual'
}

interface AdiantamentoDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  adiantamento: Adiantamento | null
}

const AdiantamentoDetailsModal = ({ isOpen, onClose, adiantamento }: AdiantamentoDetailsModalProps) => {
  if (!isOpen || !adiantamento) return null

  // Constantes e cálculos de retenção
  const TAXA_RETENCAO = 0.10 // 10%
  const valorLiquido = adiantamento.valor * (1 - TAXA_RETENCAO)
  const valorRetido = adiantamento.valor * TAXA_RETENCAO

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pendente':
        return { label: 'Pendente', icon: <Clock className="w-5 h-5" />, color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' }
      case 'aprovado':
        return { label: 'Aprovado', icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-blue-500', bgColor: 'bg-blue-500/20' }
      case 'rejeitado':
        return { label: 'Rejeitado', icon: <XCircle className="w-5 h-5" />, color: 'text-red-500', bgColor: 'bg-red-500/20' }
      case 'pago':
        return { label: 'Pago', icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-green-500', bgColor: 'bg-green-500/20' }
      case 'cancelado':
        return { label: 'Cancelado', icon: <XCircle className="w-5 h-5" />, color: 'text-gray-500', bgColor: 'bg-gray-500/20' }
      default:
        return { label: 'Desconhecido', icon: <Clock className="w-5 h-5" />, color: 'text-gray-500', bgColor: 'bg-gray-500/20' }
    }
  }

  const getUrgenciaInfo = (urgencia: string) => {
    switch (urgencia) {
      case 'critica':
        return { label: 'Crítica', color: 'text-red-500', bgColor: 'bg-red-500/20' }
      case 'alta':
        return { label: 'Alta', color: 'text-orange-500', bgColor: 'bg-orange-500/20' }
      case 'media':
        return { label: 'Média', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' }
      case 'baixa':
        return { label: 'Baixa', color: 'text-green-500', bgColor: 'bg-green-500/20' }
      default:
        return { label: 'Desconhecida', color: 'text-gray-500', bgColor: 'bg-gray-500/20' }
    }
  }

  const statusInfo = getStatusInfo(adiantamento.status)
  const urgenciaInfo = getUrgenciaInfo(adiantamento.urgencia)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-dark-100 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Euro className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Detalhes do Adiantamento</h2>
              <p className="text-dark-600 text-sm">Solicitação #{adiantamento.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-dark-600 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status e Urgência */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className={`flex items-center gap-3 p-4 rounded-lg ${statusInfo.bgColor}`}>
                <div className={statusInfo.color}>
                  {statusInfo.icon}
                </div>
                <div>
                  <p className="text-dark-600 text-sm">Estado</p>
                  <p className={`font-semibold ${statusInfo.color}`}>{statusInfo.label}</p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className={`flex items-center gap-3 p-4 rounded-lg ${urgenciaInfo.bgColor}`}>
                <div className={urgenciaInfo.color}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-dark-600 text-sm">Urgência</p>
                  <p className={`font-semibold ${urgenciaInfo.color}`}>{urgenciaInfo.label}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Motorista */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Informações do Motorista</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-dark-600" />
                <div>
                  <p className="text-dark-600 text-sm">Nome</p>
                  <p className="text-black dark:text-white font-medium">{adiantamento.funcionarioNome}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-dark-600" />
                <div>
                  <p className="text-dark-600 text-sm">Cargo</p>
                  <p className="text-black dark:text-white font-medium">{adiantamento.cargo}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Aviso de Retenção */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-amber-400 font-medium">Sistema de Retenção Ativo</p>
                <p className="text-amber-300 text-sm">10% do valor solicitado será retido pela casa em todos os adiantamentos.</p>
              </div>
            </div>
          </div>

          {/* Detalhes do Adiantamento */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Detalhes da Solicitação</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Euro className="w-5 h-5 text-dark-600 mt-0.5" />
                <div>
                  <p className="text-dark-600 text-sm">Valor Solicitado (Bruto)</p>
                  <p className="text-black dark:text-white font-bold text-xl">{formatEuro(adiantamento.valor)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Euro className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="text-dark-600 text-sm">Valor Líquido (Motorista Recebe)</p>
                  <p className="text-primary-500 font-bold text-xl">{formatEuro(valorLiquido)}</p>
                  <p className="text-dark-600 text-xs">Após retenção de 10%</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Euro className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-dark-600 text-sm">Valor Retido (Casa)</p>
                  <p className="text-red-500 font-bold text-lg">{formatEuro(valorRetido)}</p>
                  <p className="text-dark-600 text-xs">10% de retenção</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-dark-600 mt-0.5" />
                <div>
                  <p className="text-dark-600 text-sm">Motivo</p>
                  <p className="text-black dark:text-white font-medium">{adiantamento.motivo}</p>
                </div>
              </div>

              {adiantamento.descricao && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-dark-600 mt-0.5" />
                  <div>
                    <p className="text-dark-600 text-sm">Descrição</p>
                    <p className="text-black dark:text-white">{adiantamento.descricao}</p>
                  </div>
                </div>
              )}

              {adiantamento.justificativa && (
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-dark-600 mt-0.5" />
                  <div>
                    <p className="text-dark-600 text-sm">Justificativa</p>
                    <p className="text-black dark:text-white">{adiantamento.justificativa}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Datas */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Cronologia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-dark-600 mt-0.5" />
                <div>
                  <p className="text-dark-600 text-sm">Data da Solicitação</p>
                  <p className="text-black dark:text-white font-medium">{formatDateTime(adiantamento.dataSolicitacao)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-dark-600 mt-0.5" />
                <div>
                  <p className="text-dark-600 text-sm">Vencimento Desejado</p>
                  <p className="text-yellow-400 font-medium">{formatDateTime(adiantamento.dataVencimentoDesejada)}</p>
                </div>
              </div>

              {adiantamento.dataPagamento && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-dark-600 text-sm">Data do Pagamento</p>
                    <p className="text-green-400 font-medium">{formatDateTime(adiantamento.dataPagamento)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Observações do Gestor */}
          {adiantamento.observacoesGestor && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Observações do Gestor</h3>
              <div className="bg-dark-200 rounded-lg p-4">
                <p className="text-black dark:text-white">{adiantamento.observacoesGestor}</p>
              </div>
            </div>
          )}

          {/* Documento Comprovativo */}
          {adiantamento.documentoComprovativo && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Documento Comprovativo</h3>
              <div className="flex items-center gap-3 p-4 bg-dark-200 rounded-lg">
                <FileText className="w-8 h-8 text-primary-500" />
                <div>
                  <p className="text-black dark:text-white font-medium">{adiantamento.documentoComprovativo}</p>
                  <p className="text-dark-600 text-sm">Documento anexado pelo motorista</p>
                </div>
              </div>
            </div>
          )}

          {/* Origem da Solicitação */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Origem</h3>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${adiantamento.origem === 'app_motorista' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
              <p className="text-black dark:text-white">
                {adiantamento.origem === 'app_motorista' ? 'Aplicação do Motorista' : 'Criado Manualmente'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {adiantamento.status === 'pendente' && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-dark-300">
            <button
              className="btn-secondary"
              onClick={() => {
                // TODO: Implementar funcionalidade de rejeição
                console.log('Rejeitando adiantamento:', adiantamento.id)
              }}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rejeitar
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                // TODO: Implementar funcionalidade de aprovação
                console.log('Aprovando adiantamento:', adiantamento.id)
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Aprovar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdiantamentoDetailsModal
