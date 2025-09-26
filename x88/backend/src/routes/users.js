import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Listar usuários
router.get('/', async (req, res) => {
  try {
    const { role, status } = req.query;
    let filter = {};
    
    if (role) filter.userType = role;
    if (status) filter.status = status;

    const users = await User.find(filter).select('-senha');
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-senha');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar usuário
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(400).json({ message: error.message });
  }
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-senha');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(400).json({ message: error.message });
  }
});

// Deletar usuário
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
