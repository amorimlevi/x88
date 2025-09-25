import { useState } from 'react'
import { Save, AlertCircle, CheckCircle, CreditCard } from 'lucide-react'

const ConfiguracoesPagamento = () => {
  const [config, setConfig] = useState({
    paymentMethod: 'bank_transfer',
    autoPayment: false,
    paymentDays: [1, 15], // Dias do mês para pagamento
    requireTwoApprovals: true,
    minAmountTwoApprovals: 500,
    maxSinglePayment: 5000,
    bankDetails: {
      accountName: 'X88 EMPRESA',
      accountNumber: '12345678901',
      routingNumber: '001234567',
      bankName: 'Banco Exemplo'
    },
    notifyBeforePayment: true,
    paymentConfirmationRequired: true,
    allowPartialPayments: false
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleConfigChange = (key: string, value: any) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      setConfig(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }))
    } else {
      setConfig(prev => ({
        ...prev,
        [key]: value
      }))
    }
  }

  const handlePaymentDaysChange = (day: number, checked: boolean) => {
    if (checked) {
      setConfig(prev => ({
        ...prev,
        paymentDays: [...prev.paymentDays, day].sort((a, b) => a - b)
      }))
    } else {
      setConfig(prev => ({
        ...prev,
        paymentDays: prev.paymentDays.filter(d => d !== day)
      }))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">Configurações de Pagamento</h3>
        
        <div className="space-y-6">
          {/* Método de Pagamento */}
          <div>
            <label className="block text-white font-medium mb-3">
              Método de Pagamento Padrão
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'bank_transfer', name: 'Transferência Bancária', desc: 'Pagamento via transferência' },
                { id: 'pix', name: 'PIX', desc: 'Pagamento instantâneo' },
                { id: 'check', name: 'Cheque', desc: 'Pagamento tradicional' }
              ].map((method) => (
                <label key={method.id} className="relative">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={config.paymentMethod === method.id}
                    onChange={(e) => handleConfigChange('paymentMethod', e.target.value)}
                    className="sr-only peer"
                  />
                  <div className="p-4 border border-dark-700 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-900/20 hover:border-dark-500 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-5 w-5 text-primary-500" />
                      <span className="text-black dark:text-white font-medium">{method.name}</span>
                    </div>
                    <p className="text-dark-600 text-sm">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Pagamento Automático */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-black dark:text-white font-medium">Pagamento Automático</label>
              <p className="text-dark-600 text-sm mt-1">
                Processar pagamentos automaticamente nos dias programados
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoPayment}
                onChange={(e) => handleConfigChange('autoPayment', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Dias de Pagamento */}
          <div>
            <label className="block text-white font-medium mb-3">
              Dias de Pagamento do Mês
            </label>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <label key={day} className="relative">
                  <input
                    type="checkbox"
                    checked={config.paymentDays.includes(day)}
                    onChange={(e) => handlePaymentDaysChange(day, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-10 border border-dark-700 rounded-lg flex items-center justify-center text-sm cursor-pointer peer-checked:bg-primary-600 peer-checked:border-primary-600 peer-checked:text-white hover:border-dark-500 transition-colors">
                    {day}
                  </div>
                </label>
              ))}
            </div>
            <p className="text-dark-600 text-sm mt-2">
              Selecione os dias do mês em que os pagamentos devem ser processados
            </p>
          </div>

          {/* Dupla Aprovação */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-black dark:text-white font-medium">Exigir Dupla Aprovação</label>
              <p className="text-dark-600 text-sm mt-1">
                Pagamentos acima do limite precisam de duas aprovações
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.requireTwoApprovals}
                onChange={(e) => handleConfigChange('requireTwoApprovals', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {config.requireTwoApprovals && (
            <div>
              <label className="block text-white font-medium mb-2">
                Valor Mínimo para Dupla Aprovação (€)
              </label>
              <input
                type="number"
                value={config.minAmountTwoApprovals}
                onChange={(e) => handleConfigChange('minAmountTwoApprovals', Number(e.target.value))}
                className="input-primary w-full max-w-xs"
                placeholder="500"
              />
            </div>
          )}

          {/* Valor Máximo por Pagamento */}
          <div>
            <label className="block text-white font-medium mb-2">
              Valor Máximo por Pagamento (€)
            </label>
            <input
              type="number"
              value={config.maxSinglePayment}
              onChange={(e) => handleConfigChange('maxSinglePayment', Number(e.target.value))}
              className="input-primary w-full max-w-xs"
              placeholder="5000"
            />
            <p className="text-dark-600 text-sm mt-1">
              Pagamentos acima deste valor precisarão ser divididos
            </p>
          </div>
        </div>
      </div>

      {/* Dados Bancários */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">Dados Bancários da Empresa</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Nome da Conta
            </label>
            <input
              type="text"
              value={config.bankDetails.accountName}
              onChange={(e) => handleConfigChange('bankDetails.accountName', e.target.value)}
              className="input-primary w-full"
              placeholder="Nome da empresa"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Número da Conta
            </label>
            <input
              type="text"
              value={config.bankDetails.accountNumber}
              onChange={(e) => handleConfigChange('bankDetails.accountNumber', e.target.value)}
              className="input-primary w-full"
              placeholder="12345678901"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Código do Banco
            </label>
            <input
              type="text"
              value={config.bankDetails.routingNumber}
              onChange={(e) => handleConfigChange('bankDetails.routingNumber', e.target.value)}
              className="input-primary w-full"
              placeholder="001234567"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Nome do Banco
            </label>
            <input
              type="text"
              value={config.bankDetails.bankName}
              onChange={(e) => handleConfigChange('bankDetails.bankName', e.target.value)}
              className="input-primary w-full"
              placeholder="Nome do banco"
            />
          </div>
        </div>
      </div>

      {/* Configurações Adicionais */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">Configurações Adicionais</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-black dark:text-white font-medium">Notificar Antes do Pagamento</label>
              <p className="text-dark-600 text-sm mt-1">
                Enviar notificação 24h antes de processar pagamentos
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.notifyBeforePayment}
                onChange={(e) => handleConfigChange('notifyBeforePayment', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-black dark:text-white font-medium">Confirmação de Pagamento Obrigatória</label>
              <p className="text-dark-600 text-sm mt-1">
                Exigir confirmação manual antes de processar cada pagamento
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.paymentConfirmationRequired}
                onChange={(e) => handleConfigChange('paymentConfirmationRequired', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-black dark:text-white font-medium">Permitir Pagamentos Parciais</label>
              <p className="text-dark-600 text-sm mt-1">
                Colaboradores podem receber pagamentos em parcelas
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.allowPartialPayments}
                onChange={(e) => handleConfigChange('allowPartialPayments', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-dark-700">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </button>
          
          {saveSuccess && (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span>Configurações salvas com sucesso!</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-yellow-400 font-medium mb-1">Atenção</h4>
            <p className="text-yellow-300 text-sm">
              Mudanças nas configurações de pagamento afetarão todos os futuros processos de pagamento. 
              Verifique cuidadosamente os dados bancários antes de salvar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfiguracoesPagamento
