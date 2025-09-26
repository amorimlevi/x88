import express from 'express';
import Payment from '../models/Payment.js';

const router = express.Router();

// Listar pagamentos com filtros
router.get('/', async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      status, 
      tipo, 
      funcionarioId 
    } = req.query;
    
    let filter = {};
    
    // Filtro por datas
    if (startDate || endDate) {
      filter.$or = [];
      if (startDate && endDate) {
        filter.$or.push(
          {
            dataPagamento: {
              $gte: new Date(startDate),
              $lte: new Date(endDate + 'T23:59:59')
            }
          },
          {
            dataVencimento: {
              $gte: new Date(startDate),
              $lte: new Date(endDate + 'T23:59:59')
            }
          }
        );
      }
    }
    
    // Filtros adicionais
    if (status && status !== 'todos') filter.status = status;
    if (tipo && tipo !== 'geral') filter.tipo = tipo;
    if (funcionarioId) filter.funcionarioId = funcionarioId;

    const payments = await Payment.find(filter)
      .populate('funcionarioId', 'nome')
      .sort({ dataPagamento: -1, dataVencimento: -1 });
    
    res.json(payments);
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar pagamento por ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('funcionarioId', 'nome email')
      .populate('gestorId', 'nome empresa');
    
    if (!payment) {
      return res.status(404).json({ message: 'Pagamento não encontrado' });
    }
    
    res.json(payment);
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar novo pagamento
router.post('/', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    
    const populatedPayment = await Payment.findById(payment._id)
      .populate('funcionarioId', 'nome')
      .populate('gestorId', 'nome empresa');
    
    res.status(201).json(populatedPayment);
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(400).json({ message: error.message });
  }
});

// Atualizar pagamento
router.put('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('funcionarioId', 'nome')
     .populate('gestorId', 'nome empresa');
    
    if (!payment) {
      return res.status(404).json({ message: 'Pagamento não encontrado' });
    }
    
    res.json(payment);
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error);
    res.status(400).json({ message: error.message });
  }
});

// Deletar pagamento
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Pagamento não encontrado' });
    }
    res.json({ message: 'Pagamento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pagamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Estatísticas de pagamentos
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$valor' }
        }
      }
    ]);
    
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
