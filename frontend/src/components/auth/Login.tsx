import { useState } from 'react'
import { User, Lock, Truck } from 'lucide-react'

interface LoginProps {
  onLogin: () => void
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<'gestor' | 'funcionario'>('gestor')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui implementaremos a autenticação real
    onLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-dark-100 to-dark-200">
      <div className="max-w-md w-full mx-4">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-xl mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">X88</h1>
          <p className="text-dark-600 mt-2">Gestão de Pagamento de Frota</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-3">
                Tipo de utilizador
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('gestor')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    userType === 'gestor'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-300 hover:border-dark-400'
                  }`}
                >
                  <div className="text-center">
                    <User className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Gestor</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('funcionario')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    userType === 'funcionario'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-300 hover:border-dark-400'
                  }`}
                >
                  <div className="text-center">
                    <Truck className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Colaborador</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-700 mb-2">
                Palavra-passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
          <p className="text-sm text-dark-600">
          Esqueceu a sua palavra-passe?{' '}
          <a href="#" className="text-primary-500 hover:text-primary-400 font-medium">
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
