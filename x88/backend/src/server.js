import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Routes imports
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import paymentRoutes from './routes/payments.js'
import contasAReceberRoutes from './routes/contasAReceber.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

// Middleware
app.use(helmet())
app.use(limiter)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/x88_gestao')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro na conexão MongoDB:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/contas-a-receber', contasAReceberRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'X88 Backend API funcionando',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor X88 rodando na porta ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})
