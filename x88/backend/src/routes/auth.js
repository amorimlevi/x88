import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(senha, user.senha);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '24h' }
    );

    // Atualizar último login
    user.ultimoLogin = new Date();
    await user.save();

    res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        userType: user.userType,
        empresa: user.empresa,
        cargo: user.cargo
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Registro
router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    
    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(userData.senha, 12);
    
    // Criar usuário
    const user = new User({
      ...userData,
      senha: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
