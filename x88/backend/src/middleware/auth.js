import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Middleware para verificar token JWT 
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ 
        message: 'Acesso negado. Token não fornecido.' 
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-senha')

    if (!user) {
      return res.status(401).json({ 
        message: 'Token inválido. Usuário não encontrado.' 
      })
    }

    if (user.status !== 'ativo') {
      return res.status(401).json({ 
        message: 'Conta inativa. Entre em contato com o administrador.' 
      })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ 
      message: 'Token inválido.' 
    })
  }
}

// Middleware para verificar se é gestor
export const requireGestor = (req, res, next) => {
  if (req.user.tipo !== 'gestor') {
    return res.status(403).json({ 
      message: 'Acesso negado. Apenas gestores podem acessar este recurso.' 
    })
  }
  next()
}

// Middleware para verificar se é funcionário
export const requireFuncionario = (req, res, next) => {
  if (req.user.tipo !== 'funcionario') {
    return res.status(403).json({ 
      message: 'Acesso negado. Apenas funcionários podem acessar este recurso.' 
    })
  }
  next()
}

// Middleware para verificar se o usuário pode acessar os dados (próprios ou de seus funcionários)
export const checkAccess = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId || req.body.funcionarioId

    // Se for gestor, pode acessar dados de seus funcionários
    if (req.user.tipo === 'gestor') {
      if (targetUserId && targetUserId !== req.user._id.toString()) {
        const targetUser = await User.findById(targetUserId)
        
        if (!targetUser || targetUser.gestorId?.toString() !== req.user._id.toString()) {
          return res.status(403).json({ 
            message: 'Acesso negado. Você não pode acessar dados deste usuário.' 
          })
        }
      }
    } else {
      // Se for funcionário, só pode acessar próprios dados
      if (targetUserId && targetUserId !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: 'Acesso negado. Você só pode acessar seus próprios dados.' 
        })
      }
    }

    next()
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro interno do servidor.' 
    })
  }
}

// Gerar token JWT
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  )
}
