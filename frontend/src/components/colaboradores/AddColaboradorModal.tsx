import { useState } from 'react'
import { X, User, Mail, Phone, Briefcase, Euro, Calendar } from 'lucide-react'

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
  salario: number
  dataContratacao: string
  endereco: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    codigoPostal: string
  }
}

const AddColaboradorModal = ({ isOpen, onClose, onSave }: AddColaboradorModalProps) => {
  const [formData, setFormData] = useState<ColaboradorData>({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    salario: 0,
    dataContratacao: new Date().toISOString().split('T')[0],
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      codigoPostal: ''
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório'
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório'
    if (!formData.cargo.trim()) newErrors.cargo = 'Cargo é obrigatório'
    if (formData.salario <= 0) newErrors.salario = 'Salário deve ser maior que zero'
    if (!formData.dataContratacao) newErrors.dataContratacao = 'Data de contratação é obrigatória'

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
        salario: 0,
        dataContratacao: new Date().toISOString().split('T')[0],
        endereco: {
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          codigoPostal: ''
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-100 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Novo Colaborador</h2>
              <p className="text-dark-600 text-sm">Adicionar novo colaborador à frota</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-dark-600 hover:text-white transition-colors"
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
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 text-white ${
                    errors.nome ? 'border-red-500' : 'border-dark-300'
                  }`}
                  placeholder="João Silva"
                />
                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 text-white ${
                    errors.email ? 'border-red-500' : 'border-dark-300'
                  }`}
                  placeholder="joao@empresa.pt"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 text-white ${
                    errors.telefone ? 'border-red-500' : 'border-dark-300'
                  }`}
                  placeholder="(21) 99999-9999"
                />
                {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Data de Contratação *
                </label>
                <input
                  type="date"
                  value={formData.dataContratacao}
                  onChange={(e) => handleInputChange('dataContratacao', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 text-white ${
                    errors.dataContratacao ? 'border-red-500' : 'border-dark-300'
                  }`}
                />
                {errors.dataContratacao && <p className="text-red-500 text-xs mt-1">{errors.dataContratacao}</p>}
              </div>
            </div>
          </div>

          {/* Informações Profissionais */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Informações Profissionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Cargo *
                </label>
                <select
                  value={formData.cargo}
                  onChange={(e) => handleInputChange('cargo', e.target.value)}
                  className={`w-full px-4 py-3 bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 text-white ${
                    errors.cargo ? 'border-red-500' : 'border-dark-300'
                  }`}
                >
                  <option value="">Seleccionar cargo</option>
                  <option value="Condutor">Condutor</option>
                  <option value="Coordenador">Coordenador</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Mecânico">Mecânico</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
                {errors.cargo && <p className="text-red-500 text-xs mt-1">{errors.cargo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  <Euro className="w-4 h-4 inline mr-2" />
                  Salário Mensal (€) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salario || ''}
                  onChange={(e) => handleInputChange('salario', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-3 bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 text-white ${
                    errors.salario ? 'border-red-500' : 'border-dark-300'
                  }`}
                  placeholder="1200.00"
                />
                {errors.salario && <p className="text-red-500 text-xs mt-1">{errors.salario}</p>}
              </div>
            </div>
          </div>

          {/* Endereço (Opcional) */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Endereço (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Rua
                </label>
                <input
                  type="text"
                  value={formData.endereco.rua}
                  onChange={(e) => handleAddressChange('rua', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
                  placeholder="Rua das Flores"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Número
                </label>
                <input
                  type="text"
                  value={formData.endereco.numero}
                  onChange={(e) => handleAddressChange('numero', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
                  placeholder="123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  value={formData.endereco.bairro}
                  onChange={(e) => handleAddressChange('bairro', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
                  placeholder="Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.endereco.cidade}
                  onChange={(e) => handleAddressChange('cidade', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
                  placeholder="Lisboa"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={formData.endereco.codigoPostal}
                  onChange={(e) => handleAddressChange('codigoPostal', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-white"
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
              className="px-6 py-3 text-dark-600 hover:text-white transition-colors"
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
