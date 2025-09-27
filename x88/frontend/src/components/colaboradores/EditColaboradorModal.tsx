import { useState, useEffect } from 'react'
import { X, User, Mail, Phone, Briefcase, CreditCard, Building2, Smartphone } from 'lucide-react'

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
    mbway?: string
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

interface EditColaboradorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (colaborador: Colaborador) => void
  colaborador: Colaborador | null
}

const EditColaboradorModal = ({ isOpen, onClose, onSave, colaborador }: EditColaboradorModalProps) => {
  const [formData, setFormData] = useState<Colaborador>({
    id: '',
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    salario: 0,
    dataContratacao: '',
    status: 'ativo',
    origem: 'manual',
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      codigoPostal: ''
    },
    dadosBancarios: {
      banco: '',
      agencia: '',
      conta: '',
      tipoConta: 'corrente',
      titular: '',
      iban: '',
      swift: '',
      mbway: ''
    },
    documentos: {
      rg: '',
      cpf: '',
      cnh: '',
      dataValidadeCnh: ''
    },
    observacoes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Preencher o formulário com os dados do colaborador quando o modal abrir
  useEffect(() => {
    if (colaborador && isOpen) {
      setFormData({
        ...colaborador,
        endereco: colaborador.endereco || {
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          codigoPostal: ''
        },
        dadosBancarios: colaborador.dadosBancarios || {
          banco: '',
          agencia: '',
          conta: '',
          tipoConta: 'corrente',
          titular: '',
          iban: '',
          swift: '',
          mbway: ''
        },
        documentos: colaborador.documentos || {
          rg: '',
          cpf: '',
          cnh: '',
          dataValidadeCnh: ''
        }
      })
    }
  }, [colaborador, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório'
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório'
    if (!formData.cargo.trim()) newErrors.cargo = 'Cargo é obrigatório'


    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const updatedColaborador = {
        ...formData,
        dataUltimaAtualizacao: new Date().toISOString()
      }
      onSave(updatedColaborador)
      onClose()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-200 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-300">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Editar Colaborador
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-200 dark:hover:bg-dark-300 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-black dark:text-dark-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Informações Básicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-white dark:bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white ${
                    errors.nome ? 'border-red-500' : 'border-dark-300'
                  }`}
                  placeholder="Nome completo do colaborador"
                />
                {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-white dark:bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-dark-300'
                  }`}
                  placeholder="email@exemplo.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-white dark:bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white ${
                    errors.telefone ? 'border-red-500' : 'border-dark-300'
                  }`}
                  placeholder="(XX) XXXXX-XXXX"
                />
                {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Cargo *
                </label>
                <select
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-white dark:bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white ${
                    errors.cargo ? 'border-red-500' : 'border-dark-300'
                  }`}
                >
                  <option value="">Selecione um cargo</option>
                  <option value="Condutor">Condutor</option>
                </select>
                {errors.cargo && <p className="text-red-500 text-sm mt-1">{errors.cargo}</p>}
              </div>



              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="suspenso">Suspenso</option>
                </select>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              <Building2 className="w-5 h-5 inline mr-2" />
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  Rua
                </label>
                <input
                  type="text"
                  name="endereco.rua"
                  value={formData.endereco?.rua || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                  placeholder="Nome da rua"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  Número
                </label>
                <input
                  type="text"
                  name="endereco.numero"
                  value={formData.endereco?.numero || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                  placeholder="Nº"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  name="endereco.bairro"
                  value={formData.endereco?.bairro || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                  placeholder="Bairro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  name="endereco.cidade"
                  value={formData.endereco?.cidade || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                  placeholder="Cidade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="endereco.codigoPostal"
                  value={formData.endereco?.codigoPostal || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                  placeholder="0000-000"
                />
              </div>
            </div>
          </div>

          {/* Dados Bancários */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              <CreditCard className="w-5 h-5 inline mr-2" />
              Dados Bancários
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  Banco
                </label>
                <input
                  type="text"
                  name="dadosBancarios.banco"
                  value={formData.dadosBancarios?.banco || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                  placeholder="Nome do banco"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  Agência
                </label>
                <input
                  type="text"
                  name="dadosBancarios.agencia"
                  value={formData.dadosBancarios?.agencia || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                  placeholder="Código da agência"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  Conta
                </label>
                <input
                  type="text"
                  name="dadosBancarios.conta"
                  value={formData.dadosBancarios?.conta || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                  placeholder="Número da conta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  Tipo de Conta
                </label>
                <select
                  name="dadosBancarios.tipoConta"
                  value={formData.dadosBancarios?.tipoConta || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="corrente">Conta Corrente</option>
                  <option value="poupanca">Conta Poupança</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  Titular da Conta
                </label>
                <input
                  type="text"
                  name="dadosBancarios.titular"
                  value={formData.dadosBancarios?.titular || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                  placeholder="Nome do titular"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  IBAN
                </label>
                <input
                  type="text"
                  name="dadosBancarios.iban"
                  value={formData.dadosBancarios?.iban || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                  placeholder="PT50 0000 0000 0000 0000 0000 0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-dark-600 mb-2">
                  <Smartphone className="w-4 h-4 inline mr-2" />
                  MB WAY
                </label>
                <input
                  type="tel"
                  name="dadosBancarios.mbway"
                  value={formData.dadosBancarios?.mbway || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white"
                  placeholder="+351 XXX XXX XXX"
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-4">
              Observações
            </h3>
            <textarea
              name="observacoes"
              value={formData.observacoes || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 bg-white dark:bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black dark:text-white resize-none"
              placeholder="Observações adicionais sobre o colaborador..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-300">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-black dark:text-dark-600 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditColaboradorModal
