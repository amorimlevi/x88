import { useState } from 'react'
import { ProfileIcon } from '../ui/Icons'
import { ThemeToggle } from '../ui/ThemeToggle'
import { EyeIcon, EyeOffIcon } from '../ui/Icons'

interface LoginProps {
  onLogin: () => void
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<'gestor' | 'funcionario'>('gestor')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui implementaremos a autenticação real
    onLogin()
  }

  return (
    <div className="container-app flex items-center justify-center px-4">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl mb-6 shadow-soft">
            <svg 
              className="w-10 h-10 text-white" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm6 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
            </svg>
          </div>
          <h1 className="heading-1 mb-2">X88</h1>
          <p className="text-body">Gestão Profissional de Pagamento de Frota</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                Tipo de Utilizador
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('gestor')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    userType === 'gestor'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                      : 'border-light-border dark:border-dark-border hover:border-brand-300 dark:hover:border-brand-700'
                  }`}
                >
                  <div className="text-center">
                    <ProfileIcon className="mx-auto mb-2" size="lg" />
                    <span className="text-sm font-medium">Gestor</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('funcionario')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    userType === 'funcionario'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                      : 'border-light-border dark:border-dark-border hover:border-brand-300 dark:hover:border-brand-700'
                  }`}
                >
                  <div className="text-center">
                    <svg 
                      className="w-6 h-6 mx-auto mb-2" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M1 3h15l-1 9H2z" />
                      <path d="M16 8h4l-2 9H6" />
                      <circle cx="7" cy="19" r="2" />
                      <circle cx="17" cy="19" r="2" />
                    </svg>
                    <span className="text-sm font-medium">Colaborador</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Palavra-passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary"
                >
                  {showPassword ? <EyeOffIcon size="md" /> : <EyeIcon size="md" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <svg 
                className="w-4 h-4" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <circle cx="12" cy="16" r="1" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-body">
              Esqueceu a sua palavra-passe?{' '}
              <a href="#" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors">
                Recuperar
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
