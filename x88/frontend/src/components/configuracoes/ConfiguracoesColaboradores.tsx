import { useState } from 'react'
import { Save, AlertCircle, CheckCircle } from 'lucide-react'

const ConfiguracoesColaboradores = () => {
  const [config, setConfig] = useState({
    autoApproval: false,
    maxDailyExpense: 200,
    requirePhotoReceipt: true,
    allowWeekendExpenses: false,
    requireManagerApproval: true,
    notifyOnNewEmployee: true,
    employeeCanEditProfile: true,
    maxAdvanceAmount: 1000
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleConfigChange = (key: string, value: boolean | number) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">Configurações de Colaboradores</h3>
        
        <div className="space-y-6">
          {/* Aprovação Automática */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-black dark:text-white font-medium">Aprovação Automática de Despesas</label>
              <p className="text-dark-600 text-sm mt-1">
                Aprovar automaticamente despesas dentro do limite estabelecido
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoApproval}
                onChange={(e) => handleConfigChange('autoApproval', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Limite Diário */}
          <div>
            <label className="block text-white font-medium mb-2">
              Limite Máximo Diário de Despesas (€)
            </label>
            <input
              type="number"
              value={config.maxDailyExpense}
              onChange={(e) => handleConfigChange('maxDailyExpense', Number(e.target.value))}
              className="input-primary w-full max-w-xs"
              placeholder="200"
            />
            <p className="text-dark-600 text-sm mt-1">
              Valor máximo que um colaborador pode gastar por dia
            </p>
          </div>

          {/* Comprovantes Obrigatórios */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-black dark:text-white font-medium">Foto de Comprovante Obrigatória</label>
              <p className="text-dark-600 text-sm mt-1">
                Exigir foto do recibo/nota fiscal para todas as despesas
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.requirePhotoReceipt}
                onChange={(e) => handleConfigChange('requirePhotoReceipt', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Despesas de Final de Semana */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-black dark:text-white font-medium">Permitir Despesas em Fins de Semana</label>
              <p className="text-dark-600 text-sm mt-1">
                Colaboradores podem registrar despesas aos sábados e domingos
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.allowWeekendExpenses}
                onChange={(e) => handleConfigChange('allowWeekendExpenses', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Aprovação do Gerente */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-black dark:text-white font-medium">Aprovação do Gerente Obrigatória</label>
              <p className="text-dark-600 text-sm mt-1">
                Todas as despesas devem ser aprovadas por um gerente
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.requireManagerApproval}
                onChange={(e) => handleConfigChange('requireManagerApproval', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Notificação Novo Funcionário */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-black dark:text-white font-medium">Notificar sobre Novos Colaboradores</label>
              <p className="text-dark-600 text-sm mt-1">
                Enviar notificação quando um novo colaborador for adicionado
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.notifyOnNewEmployee}
                onChange={(e) => handleConfigChange('notifyOnNewEmployee', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Edição de Perfil */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-black dark:text-white font-medium">Colaborador Pode Editar Perfil</label>
              <p className="text-dark-600 text-sm mt-1">
                Permitir que colaboradores editem suas próprias informações
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.employeeCanEditProfile}
                onChange={(e) => handleConfigChange('employeeCanEditProfile', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Limite de Adiantamento */}
          <div>
            <label className="block text-white font-medium mb-2">
              Limite Máximo de Adiantamento (€)
            </label>
            <input
              type="number"
              value={config.maxAdvanceAmount}
              onChange={(e) => handleConfigChange('maxAdvanceAmount', Number(e.target.value))}
              className="input-primary w-full max-w-xs"
              placeholder="1000"
            />
            <p className="text-dark-600 text-sm mt-1">
              Valor máximo que um colaborador pode solicitar como adiantamento
            </p>
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
      <div className="bg-primary-900/20 border border-primary-800/30 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-primary-400 font-medium mb-1">Informação Importante</h4>
            <p className="text-primary-300 text-sm">
              As alterações nas configurações de colaboradores afetarão todos os novos registros. 
              Despesas já submetidas não serão afetadas pelas mudanças.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfiguracoesColaboradores
