import { useState } from 'react'
import { Save, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'

const ConfiguracoesAdiantamento = () => {
  const [config, setConfig] = useState({
    enableAdvances: true,
    maxAdvanceAmount: 1000,
    maxAdvancesPerMonth: 2,
    minDaysBetweenAdvances: 15,
    requireManagerApproval: true,
    autoApproval: false,
    autoApprovalLimit: 300,
    deductFromSalary: true,
    interestRate: 0,
    requireJustification: true,
    minJustificationLength: 50,
    allowRecurringAdvances: false,
    maxOutstandingAdvances: 3,
    emergencyAdvanceLimit: 500,
    workingDaysForApproval: 2,
    notifyOnAdvanceRequest: true,
    requireCollateral: false,
    collateralPercentage: 10
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
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">Configurações de Adiantamento</h3>
        
        <div className="space-y-6">
          {/* Habilitar Adiantamentos */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-black dark:text-white font-medium">Habilitar Sistema de Adiantamentos</label>
              <p className="text-dark-600 text-sm mt-1">
                Permitir que colaboradores solicitem adiantamentos salariais
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableAdvances}
                onChange={(e) => handleConfigChange('enableAdvances', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {config.enableAdvances && (
            <>
              {/* Valores Máximos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Valor Máximo por Adiantamento (€)
                  </label>
                  <input
                    type="number"
                    value={config.maxAdvanceAmount}
                    onChange={(e) => handleConfigChange('maxAdvanceAmount', Number(e.target.value))}
                    className="input-primary w-full"
                    placeholder="1000"
                  />
                  <p className="text-dark-600 text-sm mt-1">
                    Valor máximo que pode ser solicitado por vez
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Adiantamentos por Mês
                  </label>
                  <input
                    type="number"
                    value={config.maxAdvancesPerMonth}
                    onChange={(e) => handleConfigChange('maxAdvancesPerMonth', Number(e.target.value))}
                    className="input-primary w-full"
                    placeholder="2"
                  />
                  <p className="text-dark-600 text-sm mt-1">
                    Número máximo de adiantamentos por mês
                  </p>
                </div>
              </div>

              {/* Intervalo entre Adiantamentos */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Intervalo Mínimo Entre Adiantamentos (dias)
                </label>
                <input
                  type="number"
                  value={config.minDaysBetweenAdvances}
                  onChange={(e) => handleConfigChange('minDaysBetweenAdvances', Number(e.target.value))}
                  className="input-primary w-full max-w-xs"
                  placeholder="15"
                />
                <p className="text-dark-600 text-sm mt-1">
                  Período mínimo de espera entre solicitações
                </p>
              </div>

              {/* Aprovação Automática */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-black dark:text-white font-medium">Aprovação Automática</label>
                    <p className="text-dark-600 text-sm mt-1">
                      Aprovar automaticamente adiantamentos abaixo do limite estabelecido
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

                {config.autoApproval && (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Limite para Aprovação Automática (€)
                    </label>
                    <input
                      type="number"
                      value={config.autoApprovalLimit}
                      onChange={(e) => handleConfigChange('autoApprovalLimit', Number(e.target.value))}
                      className="input-primary w-full max-w-xs"
                      placeholder="300"
                    />
                  </div>
                )}
              </div>

              {/* Aprovação do Gerente */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-black dark:text-white font-medium">Aprovação do Gerente Obrigatória</label>
                  <p className="text-dark-600 text-sm mt-1">
                    Todos os adiantamentos devem ser aprovados por um gerente
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

              {/* Dedução do Salário */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-black dark:text-white font-medium">Deduzir Automaticamente do Salário</label>
                  <p className="text-dark-600 text-sm mt-1">
                    Descontar o valor do adiantamento automaticamente do próximo salário
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.deductFromSalary}
                    onChange={(e) => handleConfigChange('deductFromSalary', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              {/* Taxa de Juros */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Taxa de Juros (% ao mês)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={config.interestRate}
                  onChange={(e) => handleConfigChange('interestRate', Number(e.target.value))}
                  className="input-primary w-full max-w-xs"
                  placeholder="0"
                />
                <p className="text-dark-600 text-sm mt-1">
                  Taxa de juros aplicada sobre o valor do adiantamento (0 para sem juros)
                </p>
              </div>

              {/* Justificativa Obrigatória */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-black dark:text-white font-medium">Exigir Justificativa</label>
                    <p className="text-dark-600 text-sm mt-1">
                      Colaborador deve informar o motivo do adiantamento
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.requireJustification}
                      onChange={(e) => handleConfigChange('requireJustification', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                {config.requireJustification && (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Tamanho Mínimo da Justificativa (caracteres)
                    </label>
                    <input
                      type="number"
                      value={config.minJustificationLength}
                      onChange={(e) => handleConfigChange('minJustificationLength', Number(e.target.value))}
                      className="input-primary w-full max-w-xs"
                      placeholder="50"
                    />
                  </div>
                )}
              </div>

              {/* Configurações Adicionais */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-black dark:text-white font-medium">Permitir Adiantamentos Recorrentes</label>
                    <p className="text-dark-600 text-sm mt-1">
                      Colaboradores podem configurar adiantamentos automáticos mensais
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.allowRecurringAdvances}
                      onChange={(e) => handleConfigChange('allowRecurringAdvances', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Máximo de Adiantamentos Pendentes
                  </label>
                  <input
                    type="number"
                    value={config.maxOutstandingAdvances}
                    onChange={(e) => handleConfigChange('maxOutstandingAdvances', Number(e.target.value))}
                    className="input-primary w-full max-w-xs"
                    placeholder="3"
                  />
                  <p className="text-dark-600 text-sm mt-1">
                    Número máximo de adiantamentos não quitados por colaborador
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Limite para Adiantamento de Emergência (€)
                  </label>
                  <input
                    type="number"
                    value={config.emergencyAdvanceLimit}
                    onChange={(e) => handleConfigChange('emergencyAdvanceLimit', Number(e.target.value))}
                    className="input-primary w-full max-w-xs"
                    placeholder="500"
                  />
                  <p className="text-dark-600 text-sm mt-1">
                    Valor que pode ser aprovado imediatamente em casos de emergência
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Dias Úteis para Aprovação
                  </label>
                  <input
                    type="number"
                    value={config.workingDaysForApproval}
                    onChange={(e) => handleConfigChange('workingDaysForApproval', Number(e.target.value))}
                    className="input-primary w-full max-w-xs"
                    placeholder="2"
                  />
                  <p className="text-dark-600 text-sm mt-1">
                    Prazo máximo em dias úteis para aprovação de adiantamentos
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-black dark:text-white font-medium">Notificar sobre Solicitações</label>
                    <p className="text-dark-600 text-sm mt-1">
                      Enviar notificações quando houver novas solicitações de adiantamento
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.notifyOnAdvanceRequest}
                      onChange={(e) => handleConfigChange('notifyOnAdvanceRequest', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </>
          )}
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

      {/* Statistics Card */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4">Estatísticas de Adiantamentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary-500" />
              <div>
                <p className="text-dark-600 text-sm">Adiantamentos este mês</p>
                <p className="text-black dark:text-white text-2xl font-bold">23</p>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-dark-600 text-sm">Valor total (€)</p>
                <p className="text-black dark:text-white text-2xl font-bold">12.450</p>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-dark-600 text-sm">Pendentes</p>
                <p className="text-black dark:text-white text-2xl font-bold">5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Dica</h4>
            <p className="text-blue-300 text-sm">
              Configure limites adequados para evitar problemas de fluxo de caixa. 
              Considere o salário médio dos colaboradores ao definir os valores máximos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfiguracoesAdiantamento
