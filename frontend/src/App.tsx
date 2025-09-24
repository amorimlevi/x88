import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './components/auth/Login'
import Dashboard from './components/dashboard/Dashboard'
import './App.css'

const queryClient = new QueryClient()

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-black">
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
  )
}

export default App
