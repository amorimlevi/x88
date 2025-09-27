import ContaAReceber from '../models/ContaAReceber.js'
import { validationResult } from 'express-validator'

// Listar todas as contas a receber
export const listarContasAReceber = async (req, res) => {
  try {
    const { status, funcionarioId, page = 1, limit = 50 } = req.query
    
    // Construir filtro
    const filter = {}
    if (status && status !== 'todos') {
      filter.status = status
    }
    if (funcionarioId) {
      filter.funcionarioId = funcionarioId
    }
    
    // Calcular skip para paginação
    const skip = (page - 1) * limit
    
    // Buscar contas com paginação
    const contas = await ContaAReceber.find(filter)
      .populate('funcionarioId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
    
    // Contar total de documentos
    const total = await ContaAReceber.countDocuments(filter)
    
    res.json({
      success: true,
      data: contas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao listar contas a receber:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Obter uma conta específica por ID
export const obterContaPorId = async (req, res) => {
  try {
    const { id } = req.params
    
    const conta = await ContaAReceber.findById(id)
      .populate('funcionarioId', 'name email')
      .populate('historico.usuario', 'name email')
    
    if (!conta) {
      return res.status(404).json({
        success: false,
        message: 'Conta a receber não encontrada'
      })
    }
    
    res.json({
      success: true,
      data: conta
    })
  } catch (error) {
    console.error('Erro ao obter conta a receber:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Criar nova conta a receber
export const criarContaAReceber = async (req, res) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      })
    }
    
    const {
      funcionarioId,
      funcionarioNome,
      valorOriginal,
      dataVencimento,
      descricao,
      observacoes,
      parcelasTotal
    } = req.body
    
    // Gerar ID único para o adiantamento
    const ultimaConta = await ContaAReceber.findOne().sort({ createdAt: -1 })
    const numeroSequencial = ultimaConta ? 
      (parseInt(ultimaConta.adiantamentoId.split('-')[1]) || 0) + 1 : 1
    const adiantamentoId = `ADV-${numeroSequencial.toString().padStart(3, '0')}`
    
    // Criar nova conta
    const novaConta = new ContaAReceber({
      funcionarioId,
      funcionarioNome,
      adiantamentoId,
      valorOriginal,
      valorPendente: valorOriginal,
      dataAdiantamento: new Date(),
      dataVencimento: new Date(dataVencimento),
      descricao,
      observacoes,
      parcelasTotal,
      historico: [{
        acao: 'criacao',
        descricao: 'Conta a receber criada',
        usuario: req.user.id
      }]
    })
    
    await novaConta.save()
    
    // Retornar conta criada com dados populados
    const contaCriada = await ContaAReceber.findById(novaConta._id)
      .populate('funcionarioId', 'name email')
    
    res.status(201).json({
      success: true,
      message: 'Conta a receber criada com sucesso',
      data: contaCriada
    })
  } catch (error) {
    console.error('Erro ao criar conta a receber:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Registrar desconto na conta
export const registrarDesconto = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      })
    }
    
    const { id } = req.params
    const { valor, descricao } = req.body
    
    const conta = await ContaAReceber.findById(id)
    
    if (!conta) {
      return res.status(404).json({
        success: false,
        message: 'Conta a receber não encontrada'
      })
    }
    
    if (valor > conta.valorPendente) {
      return res.status(400).json({
        success: false,
        message: 'Valor do desconto não pode ser maior que o valor pendente'
      })
    }
    
    // Registrar desconto
    await conta.registrarDesconto(valor, descricao, req.user.id)
    
    // Retornar conta atualizada
    const contaAtualizada = await ContaAReceber.findById(id)
      .populate('funcionarioId', 'name email')
    
    res.json({
      success: true,
      message: 'Desconto registrado com sucesso',
      data: contaAtualizada
    })
  } catch (error) {
    console.error('Erro ao registrar desconto:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Obter estatísticas das contas a receber
export const obterEstatisticas = async (req, res) => {
  try {
    const estatisticas = await ContaAReceber.getEstatisticas()
    
    res.json({
      success: true,
      data: estatisticas
    })
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Obter contas vencidas
export const obterContasVencidas = async (req, res) => {
  try {
    const contasVencidas = await ContaAReceber.getContasVencidas()
      .populate('funcionarioId', 'name email')
      .sort({ dataVencimento: 1 })
    
    res.json({
      success: true,
      data: contasVencidas
    })
  } catch (error) {
    console.error('Erro ao obter contas vencidas:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Atualizar conta a receber
export const atualizarConta = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      })
    }
    
    const { id } = req.params
    const updates = req.body
    
    // Não permitir atualização direta de campos calculados
    delete updates.valorPendente
    delete updates.valorDesconto
    delete updates.status
    delete updates.adiantamentoId
    
    const conta = await ContaAReceber.findByIdAndUpdate(
      id,
      { 
        ...updates,
        $push: {
          historico: {
            acao: 'atualizacao',
            descricao: 'Conta a receber atualizada',
            usuario: req.user.id
          }
        }
      },
      { new: true, runValidators: true }
    ).populate('funcionarioId', 'name email')
    
    if (!conta) {
      return res.status(404).json({
        success: false,
        message: 'Conta a receber não encontrada'
      })
    }
    
    res.json({
      success: true,
      message: 'Conta a receber atualizada com sucesso',
      data: conta
    })
  } catch (error) {
    console.error('Erro ao atualizar conta a receber:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}

// Excluir conta a receber
export const excluirConta = async (req, res) => {
  try {
    const { id } = req.params
    
    const conta = await ContaAReceber.findByIdAndDelete(id)
    
    if (!conta) {
      return res.status(404).json({
        success: false,
        message: 'Conta a receber não encontrada'
      })
    }
    
    res.json({
      success: true,
      message: 'Conta a receber excluída com sucesso'
    })
  } catch (error) {
    console.error('Erro ao excluir conta a receber:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
}
