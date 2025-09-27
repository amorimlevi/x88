import { X, User, Mail, Phone, Briefcase, MapPin, CreditCard, Building2, Hash, CheckCircle, AlertCircle, Smartphone } from 'lucide-react'

interface Colaborador {
  id: string
  nome: string
  email: string
  telefone: string
  cargo: string
  salario: number
  dataContratacao: string
  status: 'ativo' | 'inativo' | 'suspenso'
  avatar?: string
  origem: 'manual' | 'app_terceiro'
  endereco?: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    codigoPostal: string
  }
  dadosBancarios?: {
    banco: string
    agencia: string
    conta: string
    tipoConta: 'corrente' | 'poupanca'
    titular: string
    iban?: string
    swift?: string
    mbway?: string // Número de telefone para MBWay
  }
  documentos?: {
    rg?: string
    cpf?: string
    cnh?: string
    dataValidadeCnh?: string
  }
  observacoes?: string
  dataUltimaAtualizacao?: string
}

interface ColaboradorDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  colaborador: Colaborador | null
}

const ColaboradorDetailsModal = ({ isOpen, onClose, colaborador }: ColaboradorDetailsModalProps) => {
  if (!isOpen || !colaborador) return null

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ativo':
        return { label: 'Ativo', icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-500', bgColor: 'bg-green-500/20' }
      case 'inativo':
        return { label: 'Inativo', icon: <AlertCircle className="w-5 h-5" />, color: 'text-gray-500', bgColor: 'bg-gray-500/20' }
      case 'suspenso':
        return { label: 'Suspenso', icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-500', bgColor: 'bg-red-500/20' }
      default:
        return { label: 'Desconhecido', icon: <AlertCircle className="w-5 h-5" />, color: 'text-gray-500', bgColor: 'bg-gray-500/20' }
    }
  }

  const statusInfo = getStatusInfo(colaborador.status)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-dark-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-dark-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {colaborador.nome.split(' ').map(name => name.charAt(0)).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">{colaborador.nome}</h2>
                <p className="text-white text-sm">ID: {colaborador.id}</p>
                <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full ${statusInfo.bgColor}`}>
                  <div className={statusInfo.color}>
                    {statusInfo.icon}
                  </div>
                  <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informações Pessoais */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white" />
                <div>
                  <p className="text-white text-sm">Email</p>
                  <p className="text-white font-medium">{colaborador.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white" />
                <div>
                  <p className="text-white text-sm">Telefone</p>
                  <p className="text-white font-medium">{colaborador.telefone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Profissionais */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-white" />
                <div>
                  <p className="text-white text-sm">Cargo</p>
                  <p className="text-white font-semibold text-lg">{colaborador.cargo}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          {colaborador.endereco && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-white mt-0.5" />
                  <div>
                    <p className="text-white text-sm">Endereço Completo</p>
                    <p className="text-white font-medium">
                      {colaborador.endereco.rua}, {colaborador.endereco.numero}
                    </p>
                    <p className="text-white text-sm">
                      {colaborador.endereco.bairro}, {colaborador.endereco.cidade}
                    </p>
                    <p className="text-white text-sm">CEP: {colaborador.endereco.codigoPostal}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dados Bancários */}
          {colaborador.dadosBancarios && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-white text-sm">Banco</p>
                    <p className="text-white font-medium">{colaborador.dadosBancarios.banco}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-white text-sm">Agência</p>
                    <p className="text-white font-medium">{colaborador.dadosBancarios.agencia}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-white text-sm">Conta</p>
                    <p className="text-white font-medium">{colaborador.dadosBancarios.conta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-white text-sm">Tipo de Conta</p>
                    <p className="text-white font-medium">
                      {colaborador.dadosBancarios.tipoConta === 'corrente' ? 'Conta Corrente' : 'Conta Poupança'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-white text-sm">Titular</p>
                    <p className="text-white font-medium">{colaborador.dadosBancarios.titular}</p>
                  </div>
                </div>
                {colaborador.dadosBancarios.iban && (
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-white" />
                    <div>
                      <p className="text-white text-sm">IBAN</p>
                      <p className="text-white font-medium">{colaborador.dadosBancarios.iban}</p>
                    </div>
                  </div>
                )}
                {colaborador.dadosBancarios.mbway && (
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white text-sm">MBWay</p>
                      <p className="text-green-400 font-medium">{colaborador.dadosBancarios.mbway}</p>
                      <p className="text-white text-xs">Transferências por telemóvel</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
        
        {/* Fechar */}
        <div className="p-6 border-t border-dark-300">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ColaboradorDetailsModal
