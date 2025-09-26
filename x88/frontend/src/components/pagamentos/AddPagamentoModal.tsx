import { useState } from 'react'
import { X, Euro, User, Calendar, FileText, CreditCard, Check } from 'lucide-react'

interface AddPagamentoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (pagamento: any) => void
}

const AddPagamentoModal = ({ isOpen, onClose, onSave }: AddPagamentoModalProps) => {
  const [formData, setFormData] = useState({
    funcionarioNome: '',
    funcionarioId: '',
    tipo: 'adiantamento',
    valor: '',
    descricao: '',
    dataVencimento: '',
    metodoPagamento: 'mbway',
    observacoes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.funcionarioNome.trim()) {
      newErrors.funcionarioNome = 'Nome do colaborador é obrigatório'
    }
    
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero'
    }
    
    if (!formData.dataVencimento) {
      newErrors.dataVencimento = 'Data de pagamento é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const novoPagamento = {
        id: Date.now().toString(),
        funcionarioId: formData.funcionarioId || Date.now().toString(),
        funcionarioNome: formData.funcionarioNome,
        valor: parseFloat(formData.valor),
        dataVencimento: formData.dataVencimento,
        dataPagamento: new Date().toISOString(),
        metodoPagamento: formData.metodoPagamento,
        observacoes: formData.observacoes,
        status: 'aprovado'
      }
      
      onSave(novoPagamento)
      onClose()
      
      // Reset form
      setFormData({
        funcionarioNome: '',
        funcionarioId: '',
        tipo: 'adiantamento',
        valor: '',
        descricao: '',
        dataVencimento: '',
        metodoPagamento: 'mbway',
        observacoes: ''
      })
      setErrors({})
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-dark-100 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Euro className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Novo Pagamento</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-dark-600 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações do Funcionário */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Informações do Colaborador</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Nome do Colaborador *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500 dark:text-black" />
                  <input
                    type="text"
                    value={formData.funcionarioNome}
                    onChange={(e) => handleChange('funcionarioNome', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 text-black dark:text-black ${
                      errors.funcionarioNome ? 'border-red-500' : 'border-dark-300'
                    }`}
                    placeholder="Digite o nome do colaborador"
                  />
                </div>
                {errors.funcionarioNome && (
                  <p className="text-red-500 text-sm mt-1">{errors.funcionarioNome}</p>
                )}
              </div>


            </div>
          </div>

          {/* Detalhes do Pagamento */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Detalhes do Pagamento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Valor Solicitado *
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500 dark:text-black" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valor}
                    onChange={(e) => handleChange('valor', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 text-black dark:text-black ${
                      errors.valor ? 'border-red-500' : 'border-dark-300'
                    }`}
                    placeholder="0,00"
                  />
                </div>
                {errors.valor && (
                  <p className="text-red-500 text-sm mt-1">{errors.valor}</p>
                )}
                
                {/* Mostrar cálculo automático */}
                {formData.valor && parseFloat(formData.valor) > 0 && (
                  <div className="mt-3 p-3 bg-dark-300 rounded-lg border border-dark-400">
                    <div className="text-white text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Valor Bruto:</span>
                        <span className="font-medium">€ {parseFloat(formData.valor).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-red-400">
                        <span>Dedução (10%):</span>
                        <span className="font-medium">- € {(parseFloat(formData.valor) * 0.10).toFixed(2)}</span>
                      </div>
                      <hr className="border-dark-500" />
                      <div className="flex justify-between text-green-400 font-semibold">
                        <span>Valor Líquido:</span>
                        <span>€ {(parseFloat(formData.valor) * 0.90).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Data de Pagamento *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500 dark:text-black" />
                  <input
                    type="date"
                    value={formData.dataVencimento}
                    onChange={(e) => handleChange('dataVencimento', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 text-black dark:text-black ${
                      errors.dataVencimento ? 'border-red-500' : 'border-dark-300'
                    }`}
                  />
                </div>
                {errors.dataVencimento && (
                  <p className="text-red-500 text-sm mt-1">{errors.dataVencimento}</p>
                )}
              </div>
            </div>


          </div>

          {/* Método de Pagamento */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Método de Pagamento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Método
                </label>
                <select
                  value={formData.metodoPagamento}
                  onChange={(e) => handleChange('metodoPagamento', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black dark:text-black"
                >
                  <option value="mbway">MB WAY</option>
                  <option value="transferencia">Transferência Bancária</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao">Cartão de Crédito</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleChange('observacoes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black dark:text-black resize-none"
                  placeholder="Observações adicionais (opcional)"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-300">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              <X className="w-4 h-4" />
              Negar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              <Check className="w-4 h-4" />
              Aprovar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPagamentoModal
