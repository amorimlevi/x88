import { X, User, Euro, Calendar, FileText, CreditCard, MapPin } from 'lucide-react'
import { formatEuro, formatDateTime } from '../../utils/formatters'

interface Pagamento {
  id: string
  funcionarioId: string
  funcionarioNome: string
  tipo: 'salario' | 'adiantamento' | 'viagem' | 'bonus' | 'desconto'
  valor: number
  descricao: string
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'pago' | 'cancelado' | 'agendado'
  dataPagamento?: string
  dataVencimento?: string
  metodoPagamento?: 'pix' | 'transferencia' | 'dinheiro' | 'cartao'
  comprovante?: string
  observacoes?: string
  origem: 'manual' | 'app_terceiro'
}

interface PagamentoDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  pagamento: Pagamento | null
}

const PagamentoDetailsModal = ({ isOpen, onClose, pagamento }: PagamentoDetailsModalProps) => {
  if (!isOpen || !pagamento) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'aprovado': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'agendado': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'rejeitado': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'cancelado': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTipoInfo = (tipo: string) => {
    switch (tipo) {
      case 'salario': 
        return { label: 'Salário', icon: '💰', color: 'text-primary-500' }
      case 'viagem': 
        return { label: 'Viagem', icon: '🚛', color: 'text-blue-500' }
      case 'adiantamento': 
        return { label: 'Adiantamento', icon: '⏰', color: 'text-orange-500' }
      case 'bonus': 
        return { label: 'Bónus', icon: '🎉', color: 'text-green-500' }
      case 'desconto': 
        return { label: 'Desconto', icon: '⚠️', color: 'text-red-500' }
      default: 
        return { label: tipo, icon: '💼', color: 'text-gray-500' }
    }
  }

  const getMetodoPagamento = (metodo?: string) => {
    switch (metodo) {
      case 'pix': return 'PIX'
      case 'transferencia': return 'Transferência Bancária'
      case 'dinheiro': return 'Dinheiro'
      case 'cartao': return 'Cartão'
      case 'desconto_salario': return 'Desconto no Salário'
      default: return 'Não definido'
    }
  }

  const tipoInfo = getTipoInfo(pagamento.tipo)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-dark-100 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{tipoInfo.icon}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Detalhes do Pagamento</h2>
              <p className="text-dark-600 text-sm">#{pagamento.id}</p>
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
          {/* Status Badge */}
          <div className="flex justify-center">
            <div className={`px-4 py-2 rounded-lg border ${getStatusColor(pagamento.status)}`}>
              <span className="font-medium">
                {pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colaborador */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-dark-600">
                <User className="w-4 h-4" />
                Colaborador
              </label>
              <div className="flex items-center gap-3 p-3 bg-dark-200 rounded-lg">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {pagamento.funcionarioNome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white font-medium">{pagamento.funcionarioNome}</span>
              </div>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-dark-600">
                <FileText className="w-4 h-4" />
                Tipo de Pagamento
              </label>
              <div className="p-3 bg-dark-200 rounded-lg">
                <span className={`font-medium ${tipoInfo.color}`}>
                  {tipoInfo.label}
                </span>
              </div>
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-dark-600">
                <Euro className="w-4 h-4" />
                Valor
              </label>
              <div className="p-3 bg-dark-200 rounded-lg">
                <span className={`text-2xl font-bold ${pagamento.valor >= 0 ? 'text-primary-500' : 'text-red-500'}`}>
                  {formatEuro(Math.abs(pagamento.valor))}
                  {pagamento.valor < 0 && ' (desconto)'}
                </span>
              </div>
            </div>

            {/* Origem */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-dark-600">
                <MapPin className="w-4 h-4" />
                Origem
              </label>
              <div className="p-3 bg-dark-200 rounded-lg">
                <span className="text-white">
                  {pagamento.origem === 'manual' ? 'Cadastro Manual' : 'Aplicativo Terceiro'}
                </span>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-dark-600">
              <FileText className="w-4 h-4" />
              Descrição
            </label>
            <div className="p-4 bg-dark-200 rounded-lg">
              <p className="text-white">{pagamento.descricao}</p>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pagamento.dataPagamento && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-dark-600">
                  <Calendar className="w-4 h-4" />
                  Data do Pagamento
                </label>
                <div className="p-3 bg-dark-200 rounded-lg">
                  <p className="text-white">{formatDateTime(pagamento.dataPagamento)}</p>
                </div>
              </div>
            )}

            {pagamento.dataVencimento && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-dark-600">
                  <Calendar className="w-4 h-4" />
                  {pagamento.status === 'agendado' ? 'Data Agendada' : 'Data de Vencimento'}
                </label>
                <div className="p-3 bg-dark-200 rounded-lg">
                  <p className="text-white">{formatDateTime(pagamento.dataVencimento)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Método de Pagamento */}
          {pagamento.metodoPagamento && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-dark-600">
                <CreditCard className="w-4 h-4" />
                Método de Pagamento
              </label>
              <div className="p-3 bg-dark-200 rounded-lg">
                <span className="text-white">{getMetodoPagamento(pagamento.metodoPagamento)}</span>
              </div>
            </div>
          )}

          {/* Comprovante */}
          {pagamento.comprovante && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-dark-600">
                <FileText className="w-4 h-4" />
                Comprovante
              </label>
              <div className="p-3 bg-dark-200 rounded-lg">
                <button className="text-primary-500 hover:text-primary-400 underline">
                  {pagamento.comprovante}
                </button>
              </div>
            </div>
          )}

          {/* Observações */}
          {pagamento.observacoes && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-600">
                Observações
              </label>
              <div className="p-4 bg-dark-200 rounded-lg">
                <p className="text-white">{pagamento.observacoes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-dark-300">
          <button
            onClick={onClose}
            className="px-6 py-3 text-dark-600 hover:text-white transition-colors"
          >
            Fechar
          </button>
          
          {pagamento.status === 'pendente' && (
            <>
              <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                Rejeitar
              </button>
              <button className="btn-primary">
                Aprovar
              </button>
            </>
          )}

          {pagamento.status === 'aprovado' && (
            <button className="btn-primary">
              Efectuar Pagamento
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PagamentoDetailsModal
