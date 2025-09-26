import { createContext, useContext, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'gestor' | 'funcionario'
}

interface UserContextType {
  user: User | null
  updateUser: (user: Partial<User>) => void
  setUser: (user: User) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: React.ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  // Mock user data - em produção viria da autenticação
  const [user, setUserState] = useState<User>({
    id: '1',
    name: 'Gestor Principal',
    email: 'gestor@x88.com',
    role: 'gestor'
  })

  const updateUser = (updates: Partial<User>) => {
    setUserState(prev => prev ? { ...prev, ...updates } : prev)
  }

  const setUser = (newUser: User) => {
    setUserState(newUser)
  }

  return (
    <UserContext.Provider value={{ user, updateUser, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
