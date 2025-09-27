import express from 'express'
import { body, param } from 'express-validator'
import {
  listarContasAReceber,
  obterContaPorId,
  criarContaAReceber,
  registrarDesconto,
  obterEstatisticas,
  obterContasVencidas,
  atualizarConta,
  excluirConta
} from '../controllers/contasAReceberController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticate)

// Validações
const validarCriacaoConta = [
  body('funcionarioId').notEmpty().withMessage('ID do funcionário é obrigatório'),
  body('funcionarioNome').notEmpty().withMessage('Nome do funcionário é obrigatório'),
  body('valorOriginal').isFloat({ min: 0.01 }).withMessage('Valor original deve ser maior que zero'),
  body('dataVencimento').isISO8601().withMessage('Data de vencimento deve ser uma data válida'),
  body('descricao').notEmpty().withMessage('Descrição é obrigatória')
]

const validarDesconto = [
  param('id').isMongoId().withMessage('ID inválido'),
  body('valor').isFloat({ min: 0.01 }).withMessage('Valor do desconto deve ser maior que zero'),
  body('descricao').optional().isString()
]

const validarId = [
  param('id').isMongoId().withMessage('ID inválido')
]

const validarAtualizacao = [
  param('id').isMongoId().withMessage('ID inválido'),
  body('valorOriginal').optional().isFloat({ min: 0.01 }),
  body('dataVencimento').optional().isISO8601(),
  body('descricao').optional().notEmpty(),
  body('funcionarioNome').optional().notEmpty()
]

// Rotas
router.get('/estatisticas', obterEstatisticas)
router.get('/vencidas', obterContasVencidas)
router.get('/', listarContasAReceber)
router.get('/:id', validarId, obterContaPorId)
router.post('/', validarCriacaoConta, criarContaAReceber)
router.post('/:id/desconto', validarDesconto, registrarDesconto)
router.put('/:id', validarAtualizacao, atualizarConta)
router.delete('/:id', validarId, excluirConta)

export default router
