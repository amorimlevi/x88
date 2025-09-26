import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useTheme } from '../../contexts/ThemeContext'
import { ProfileIcon, EditIcon, CheckIcon, XIcon } from '../ui/Icons'
import { ThemeToggle } from '../ui/ThemeToggle'

const ConfiguracoesPerfil = () => {
  const { user, updateUser } = useUser()
  const { theme } = useTheme()
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(user?.name || '')

  const handleSaveName = () => {
    if (newName.trim()) {
      updateUser({ name: newName.trim() })
      setIsEditingName(false)
    }
  }

  const handleCancelEdit = () => {
    setNewName(user?.name || '')
    setIsEditingName(false)
  }

  if (!user) return null

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-soft">
            <ProfileIcon className="text-black dark:text-white" size="xl" />
          </div>
          <div className="flex-1">
            <h2 className="heading-2 mb-2">Perfil do Usuário</h2>
            <p className="text-body mb-4">
              Gerencie suas informações pessoais e preferências do sistema
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
              {user.role === 'gestor' ? 'Gestor' : 'Colaborador'}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card">
        <h3 className="heading-3 mb-6">Informações Pessoais</h3>
        
        <div className="space-y-6">
          {/* Nome */}
          <div>
          <label className="block text-sm font-medium text-black dark:text-dark-text-primary mb-2">
          Nome Completo
          </label>
          {isEditingName ? (
          <div className="flex items-center gap-3">
          <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="input flex-1"
          placeholder="Digite seu nome completo"
          autoFocus
          />
          <button
          onClick={handleSaveName}
          className="btn-primary p-3"
          disabled={!newName.trim()}
          >
          <CheckIcon size="md" />
          </button>
          <button
          onClick={handleCancelEdit}
          className="btn-secondary p-3"
          >
          <XIcon size="md" />
          </button>
          </div>
          ) : (
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-dark-surface rounded-xl border border-neutral-200 dark:border-dark-border">
          <span className="font-medium text-black dark:text-dark-text-primary">
          {user.name}
          </span>
          <button
          onClick={() => setIsEditingName(true)}
          className="btn-ghost p-2"
          >
          <EditIcon size="sm" />
          </button>
          </div>
          )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-dark-text-primary mb-2">
              Email
            </label>
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-dark-surface rounded-xl border border-neutral-200 dark:border-dark-border">
              <span className="text-neutral-600 dark:text-dark-text-secondary">
                {user.email}
              </span>
              <span className="text-xs text-neutral-500 dark:text-dark-text-muted bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                Não editável
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-dark-text-muted mt-2">
              O email é usado para autenticação e não pode ser alterado
            </p>
          </div>

          {/* ID do Usuário */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-dark-text-primary mb-2">
              ID do Usuário
            </label>
            <div className="p-4 bg-neutral-50 dark:bg-dark-surface rounded-xl border border-neutral-200 dark:border-dark-border">
              <span className="text-sm text-neutral-500 dark:text-dark-text-muted font-mono">
                {user.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="card">
        <h3 className="heading-3 mb-6">Aparência</h3>
        
        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-black dark:text-dark-text-primary mb-1">
                Modo de Tema
              </h4>
              <p className="text-sm text-body">
                Escolha entre o modo claro e escuro
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600 dark:text-dark-text-secondary">
                {theme === 'light' ? 'Modo Claro' : 'Modo Escuro'}
              </span>
              <ThemeToggle />
            </div>
          </div>

          {/* Theme Preview */}
          <div className="p-4 bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border">
            <h5 className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
              Visualização do Tema Atual
            </h5>
            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-square bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border"></div>
              <div className="aspect-square bg-brand-500 rounded-lg"></div>
              <div className="aspect-square bg-light-text-primary dark:bg-dark-text-primary rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="card">
        <h3 className="heading-3 mb-6">Segurança da Conta</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary">
                Alterar Palavra-passe
              </h4>
              <p className="text-sm text-body">
                Atualize sua palavra-passe por segurança
              </p>
            </div>
            <button className="btn-outline">
              Alterar
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-light-text-primary dark:text-dark-text-primary">
                Autenticação de Dois Fatores
              </h4>
              <p className="text-sm text-body">
                Adicione uma camada extra de segurança
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-light-text-muted dark:text-dark-text-muted">
                Desativado
              </span>
              <button className="btn-outline">
                Configurar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="card">
        <h3 className="heading-3 mb-6">Resumo de Atividade</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-light-surface dark:bg-dark-surface rounded-xl">
            <div className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-1">
              12
            </div>
            <div className="text-sm text-body">
              Sessões este mês
            </div>
          </div>
          <div className="text-center p-4 bg-light-surface dark:bg-dark-surface rounded-xl">
            <div className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-1">
              3h
            </div>
            <div className="text-sm text-body">
              Tempo online hoje
            </div>
          </div>
          <div className="text-center p-4 bg-light-surface dark:bg-dark-surface rounded-xl">
            <div className="text-2xl font-bold text-brand-600 dark:text-brand-400 mb-1">
              98%
            </div>
            <div className="text-sm text-body">
              Disponibilidade
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfiguracoesPerfil
