import { useState } from 'react'
import { X, Euro, User, Calendar, Check } from 'lucide-react'

interface AddPagamentoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (pagamento: any) => void
}

const AddPagamentoModal = ({ isOpen, onClose, onSave }: AddPagamentoModalProps) => {
  const [formData, setFormData] = useState({
    funcionarioNome: '',
    funcionarioId: '',
    valor: '',
    metodoPagamento: 'mbway',
    observacoes: '',
    dataPagamento: new Date().toISOString().split('T')[0] // Data atual
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.funcionarioNome.trim()) {
      newErrors.funcionarioNome = 'Nome do funcionário é obrigatório'
    }
    
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero'
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
        tipo: 'adiantamento', // Valor fixo
        valor: parseFloat(formData.valor),
        descricao: 'Adiantamento salarial', // Valor padrão
        dataPagamento: new Date().toISOString(),
        metodoPagamento: formData.metodoPagamento,
        observacoes: formData.observacoes,
        status: 'pendente'
      }
      
      onSave(novoPagamento)
      onClose()
      
      // Reset form
      setFormData({
        funcionarioNome: '',
        funcionarioId: '',
        valor: '',
        metodoPagamento: 'mbway',
        observacoes: '',
        dataPagamento: new Date().toISOString().split('T')[0] // Resetar com data atual
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

  // Calcular valor líquido (90% do valor solicitado)
  const calcularValorLiquido = (valorSolicitado: string): number => {
    const valor = parseFloat(valorSolicitado) || 0
    return valor * 0.9 // 90% do valor (retira 10%)
  }

  // Calcular taxa de serviço (10% do valor)
  const calcularTaxaServico = (valorSolicitado: string): number => {
    const valor = parseFloat(valorSolicitado) || 0
    return valor * 0.1 // 10% do valor
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
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações do Funcionário */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Informações do Beneficiário</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Nome do Funcionário *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500 dark:text-black" />
                  <input
                    type="text"
                    value={formData.funcionarioNome}
                    onChange={(e) => handleChange('funcionarioNome', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 text-black ${
                      errors.funcionarioNome ? 'border-red-500' : 'border-dark-300'
                    }`}
                    placeholder="Digite o nome do funcionário"
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
              <div className="col-span-1 md:col-span-2">
                <label className="block text-white font-medium mb-2">
                  Valor Solicitado (€) *
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500 dark:text-black" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valor}
                    onChange={(e) => handleChange('valor', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-dark-200 border rounded-lg focus:ring-2 focus:ring-primary-500 text-black ${
                      errors.valor ? 'border-red-500' : 'border-dark-300'
                    }`}
                    placeholder="0,00"
                  />
                </div>
                {errors.valor && (
                  <p className="text-red-500 text-sm mt-1">{errors.valor}</p>
                )}

                {/* Cálculos automáticos */}
                {formData.valor && parseFloat(formData.valor) > 0 && (
                  <div className="mt-3 p-4 bg-dark-200 rounded-lg border border-dark-300">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-dark-600 text-sm">Taxa de serviço (10%):</span>
                        <span className="text-red-400 font-medium">
                          €{calcularTaxaServico(formData.valor).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-dark-300 pt-2">
                        <span className="text-white font-medium">Valor Líquido a Pagar:</span>
                        <span className="text-green-400 font-bold text-lg">
                          €{calcularValorLiquido(formData.valor).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Data do Pagamento
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500 dark:text-black" />
                  <input
                    type="date"
                    value={formData.dataPagamento}
                    onChange={(e) => handleChange('dataPagamento', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
                  />
                </div>
                <p className="text-white text-xs mt-1">Data atual definida automaticamente</p>
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
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black"
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
                  className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-black resize-none"
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
