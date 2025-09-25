import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext'
import { UserProvider } from './contexts/UserContext'
import Login from './components/auth/Login'
import Dashboard from './components/dashboard/Dashboard'
import './App.css'

const queryClient = new QueryClient()

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <ThemeProvider>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <div className="container-app">
              <Routes>
                <Route path="/" element={
                  isAuthenticated ? 
                    <Dashboard /> : 
                    <Login onLogin={() => setIsAuthenticated(true)} />
                } />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
              </Routes>
            </div>
          </Router>
        </QueryClientProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
