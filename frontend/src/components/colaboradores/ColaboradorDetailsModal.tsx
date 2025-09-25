import { X, User, Mail, Phone, Briefcase, Euro, Calendar, MapPin, CreditCard, Building2, Hash, CheckCircle, AlertCircle, Smartphone } from 'lucide-react'
import { formatEuro, formatDateTime } from '../../utils/formatters'

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
      <div className="bg-dark-100 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-300">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {colaborador.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">{colaborador.nome}</h2>
              <p className="text-dark-600 text-sm">ID: {colaborador.id}</p>
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
            className="text-dark-600 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informações Pessoais */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-dark-600" />
                <div>
                  <p className="text-dark-600 text-sm">Email</p>
                  <p className="text-white font-medium">{colaborador.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-dark-600" />
                <div>
                  <p className="text-dark-600 text-sm">Telefone</p>
                  <p className="text-white font-medium">{colaborador.telefone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações Profissionais */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Informações Profissionais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-dark-600" />
                <div>
                  <p className="text-dark-600 text-sm">Cargo</p>
                  <p className="text-white font-medium">{colaborador.cargo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Euro className="w-5 h-5 text-dark-600" />
                <div>
                  <p className="text-dark-600 text-sm">Salário Mensal</p>
                  <p className="text-primary-500 font-bold text-lg">{formatEuro(colaborador.salario)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-dark-600" />
                <div>
                  <p className="text-dark-600 text-sm">Data de Contratação</p>
                  <p className="text-white font-medium">{formatDateTime(colaborador.dataContratacao).split(' ')[0]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          {colaborador.endereco && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Endereço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-dark-600 mt-0.5" />
                  <div>
                    <p className="text-dark-600 text-sm">Endereço Completo</p>
                    <p className="text-white font-medium">
                      {colaborador.endereco.rua}, {colaborador.endereco.numero}
                    </p>
                    <p className="text-dark-600 text-sm">
                      {colaborador.endereco.bairro}, {colaborador.endereco.cidade}
                    </p>
                    <p className="text-dark-600 text-sm">CEP: {colaborador.endereco.codigoPostal}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MBWay - Destaque especial para método português */}
          {colaborador.dadosBancarios?.mbway && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-green-400 font-medium text-lg">MBWay Disponível</p>
                  <p className="text-white font-bold text-xl">{colaborador.dadosBancarios.mbway}</p>
                  <p className="text-green-300 text-sm">Transferências instantâneas por telemóvel • Portugal</p>
                </div>
              </div>
            </div>
          )}

          {/* Dados Bancários */}
          {colaborador.dadosBancarios && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Dados Bancários
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-dark-600" />
                  <div>
                    <p className="text-dark-600 text-sm">Banco</p>
                    <p className="text-white font-medium">{colaborador.dadosBancarios.banco}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-dark-600" />
                  <div>
                    <p className="text-dark-600 text-sm">Agência</p>
                    <p className="text-white font-medium">{colaborador.dadosBancarios.agencia}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-dark-600" />
                  <div>
                    <p className="text-dark-600 text-sm">Conta</p>
                    <p className="text-white font-medium">{colaborador.dadosBancarios.conta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-dark-600" />
                  <div>
                    <p className="text-dark-600 text-sm">Tipo de Conta</p>
                    <p className="text-white font-medium">
                      {colaborador.dadosBancarios.tipoConta === 'corrente' ? 'Conta Corrente' : 'Conta Poupança'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-dark-600" />
                  <div>
                    <p className="text-dark-600 text-sm">Titular</p>
                    <p className="text-white font-medium">{colaborador.dadosBancarios.titular}</p>
                  </div>
                </div>
                {colaborador.dadosBancarios.iban && (
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-dark-600" />
                    <div>
                      <p className="text-dark-600 text-sm">IBAN</p>
                      <p className="text-primary-500 font-medium">{colaborador.dadosBancarios.iban}</p>
                    </div>
                  </div>
                )}
                {colaborador.dadosBancarios.mbway && (
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-dark-600 text-sm">MBWay</p>
                      <p className="text-green-500 font-medium">{colaborador.dadosBancarios.mbway}</p>
                      <p className="text-dark-600 text-xs">Transferências por telemóvel</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documentos */}
          {colaborador.documentos && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Documentos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {colaborador.documentos.rg && (
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-dark-600" />
                    <div>
                      <p className="text-dark-600 text-sm">RG</p>
                      <p className="text-white font-medium">{colaborador.documentos.rg}</p>
                    </div>
                  </div>
                )}
                {colaborador.documentos.cpf && (
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-dark-600" />
                    <div>
                      <p className="text-dark-600 text-sm">CPF</p>
                      <p className="text-white font-medium">{colaborador.documentos.cpf}</p>
                    </div>
                  </div>
                )}
                {colaborador.documentos.cnh && (
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-dark-600" />
                    <div>
                      <p className="text-dark-600 text-sm">CNH</p>
                      <p className="text-white font-medium">{colaborador.documentos.cnh}</p>
                      {colaborador.documentos.dataValidadeCnh && (
                        <p className="text-dark-600 text-xs">
                          Válida até: {formatDateTime(colaborador.documentos.dataValidadeCnh).split(' ')[0]}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Observações */}
          {colaborador.observacoes && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Observações</h3>
              <div className="bg-dark-200 rounded-lg p-4">
                <p className="text-white">{colaborador.observacoes}</p>
              </div>
            </div>
          )}

          {/* Informações do Sistema */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Informações do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${colaborador.origem === 'manual' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                <div>
                  <p className="text-dark-600 text-sm">Origem</p>
                  <p className="text-white font-medium">
                    {colaborador.origem === 'manual' ? 'Criado Manualmente' : 'Aplicação Terceiro'}
                  </p>
                </div>
              </div>
              {colaborador.dataUltimaAtualizacao && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-dark-600" />
                  <div>
                    <p className="text-dark-600 text-sm">Última Atualização</p>
                    <p className="text-white font-medium">{formatDateTime(colaborador.dataUltimaAtualizacao)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-dark-300">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Fechar
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              // TODO: Implementar funcionalidade de edição
              console.log('Editando colaborador:', colaborador.id)
            }}
          >
            Editar Colaborador
          </button>
        </div>
      </div>
    </div>
  )
}

export default ColaboradorDetailsModal
