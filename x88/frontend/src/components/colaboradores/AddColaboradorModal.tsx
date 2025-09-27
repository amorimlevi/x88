import { useState } from 'react'
import { X, User, Mail, Phone, Briefcase, CreditCard, Building2, Hash, Smartphone } from 'lucide-react'

interface AddColaboradorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ColaboradorData) => void
}

interface ColaboradorData {
  nome: string
  email: string
  telefone: string
  cargo: string
  endereco: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    codigoPostal: string
  }
  dadosBancarios: {
    banco: string
    agencia: string
    conta: string
    tipoConta: 'corrente' | 'poupanca'
    iban: string
    titular: string
    mbway?: string
  }
}

const AddColaboradorModal = ({ isOpen, onClose, onSave }: AddColaboradorModalProps) => {
  const [formData, setFormData] = useState<ColaboradorData>({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
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
      iban: '',
      titular: '',
      mbway: ''
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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
      onSave(formData)
      // Reset form
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
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
          iban: '',
          titular: '',
          mbway: ''
        }
      })
      setErrors({})
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpar erro do campo quando o utilizador começa a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value
      }
    }))
  }

  const handleBankingChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dadosBancarios: {
        ...prev.dadosBancarios,
        [field]: value
      }
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-dark-100 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Novo Colaborador</h2>
              <p className="text-white text-sm">Adicionar novo colaborador à frota</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Pessoais */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500 text-black ${
                    errors.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="João Silva"
                />
                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500 text-black ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="joao@empresa.pt"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500 text-black ${
                    errors.telefone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+351 912 345 678"
                />
                {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Cargo *
                </label>
                <select
                  value={formData.cargo}
                  onChange={(e) => handleInputChange('cargo', e.target.value)}
                  className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-primary-500 text-black ${
                    errors.cargo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar cargo</option>
                  <option value="Condutor">Condutor</option>
                </select>
                {errors.cargo && <p className="text-red-500 text-xs mt-1">{errors.cargo}</p>}
              </div>
            </div>
          </div>

          {/* Dados Bancários */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Dados Bancários</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Banco
                </label>
                <input
                  type="text"
                  value={formData.dadosBancarios.banco}
                  onChange={(e) => handleBankingChange('banco', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                  placeholder="Banco de Portugal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Hash className="w-4 h-4 inline mr-2" />
                  Agência
                </label>
                <input
                  type="text"
                  value={formData.dadosBancarios.agencia}
                  onChange={(e) => handleBankingChange('agencia', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                  placeholder="Código da agência"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Conta
                </label>
                <input
                  type="text"
                  value={formData.dadosBancarios.conta}
                  onChange={(e) => handleBankingChange('conta', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                  placeholder="Número da conta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Tipo de Conta
                </label>
                <select
                  value={formData.dadosBancarios.tipoConta}
                  onChange={(e) => handleBankingChange('tipoConta', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="corrente">Conta Corrente</option>
                  <option value="poupanca">Conta Poupança</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Titular da Conta
                </label>
                <input
                  type="text"
                  value={formData.dadosBancarios.titular}
                  onChange={(e) => handleBankingChange('titular', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                  placeholder="Nome do titular"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  IBAN
                </label>
                <input
                  type="text"
                  value={formData.dadosBancarios.iban}
                  onChange={(e) => handleBankingChange('iban', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                  placeholder="PT50 0000 0000 00000000000 00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Smartphone className="w-4 h-4 inline mr-2" />
                  MB Way (Opcional)
                </label>
                <input
                  type="tel"
                  value={formData.dadosBancarios.mbway}
                  onChange={(e) => handleBankingChange('mbway', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                  placeholder="+351 912 345 678"
                />
              </div>
            </div>
          </div>

          {/* Endereço (Opcional) */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Endereço (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-white mb-2">
                  Rua
                </label>
                <input
                  type="text"
                  value={formData.endereco.rua}
                  onChange={(e) => handleAddressChange('rua', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                  placeholder="Rua das Flores"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Número
                </label>
                <input
                  type="text"
                  value={formData.endereco.numero}
                  onChange={(e) => handleAddressChange('numero', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                  placeholder="123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  value={formData.endereco.bairro}
                  onChange={(e) => handleAddressChange('bairro', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                  placeholder="Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.endereco.cidade}
                  onChange={(e) => handleAddressChange('cidade', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                  placeholder="Lisboa"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={formData.endereco.codigoPostal}
                  onChange={(e) => handleAddressChange('codigoPostal', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                  placeholder="1000-001"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-300">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-white hover:text-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Guardar Colaborador
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddColaboradorModal
