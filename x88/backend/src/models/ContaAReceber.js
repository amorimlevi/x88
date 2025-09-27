import mongoose from 'mongoose'

const ContaAReceberSchema = new mongoose.Schema({
  funcionarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  funcionarioNome: {
    type: String,
    required: true
  },
  adiantamentoId: {
    type: String,
    required: true,
    unique: true
  },
  valorOriginal: {
    type: Number,
    required: true,
    min: 0
  },
  valorPendente: {
    type: Number,
    required: true,
    min: 0
  },
  valorDesconto: {
    type: Number,
    default: 0,
    min: 0
  },
  dataAdiantamento: {
    type: Date,
    required: true
  },
  dataVencimento: {
    type: Date,
    required: true
  },
  dataDesconto: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pendente', 'parcial', 'quitado', 'vencido'],
    default: 'pendente'
  },
  descricao: {
    type: String,
    required: true
  },
  observacoes: {
    type: String
  },
  parcelasTotal: {
    type: Number,
    min: 1
  },
  parcelasDescontadas: {
    type: Number,
    default: 0,
    min: 0
  },
  historico: [{
    data: {
      type: Date,
      default: Date.now
    },
    acao: {
      type: String,
      required: true
    },
    valor: {
      type: Number
    },
    descricao: String,
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
})

// Middleware para atualizar o status automaticamente
ContaAReceberSchema.pre('save', function(next) {
  // Atualizar status baseado nos valores
  if (this.valorPendente === 0) {
    this.status = 'quitado'
  } else if (this.valorDesconto > 0 && this.valorPendente > 0) {
    this.status = 'parcial'
  } else if (new Date() > this.dataVencimento && this.valorPendente > 0) {
    this.status = 'vencido'
  } else if (this.valorPendente === this.valorOriginal) {
    this.status = 'pendente'
  }
  
  next()
})

// Método para registrar desconto
ContaAReceberSchema.methods.registrarDesconto = function(valor, descricao, usuario) {
  this.valorDesconto += valor
  this.valorPendente -= valor
  
  if (this.parcelasTotal) {
    this.parcelasDescontadas += 1
  }
  
  // Adicionar ao histórico
  this.historico.push({
    acao: 'desconto',
    valor,
    descricao: descricao || `Desconto de ${valor}€`,
    usuario
  })
  
  return this.save()
}

// Método estático para obter contas vencidas
ContaAReceberSchema.statics.getContasVencidas = function() {
  return this.find({
    dataVencimento: { $lt: new Date() },
    valorPendente: { $gt: 0 }
  })
}

// Método estático para obter estatísticas
ContaAReceberSchema.statics.getEstatisticas = async function() {
  const pipeline = [
    {
      $group: {
        _id: null,
        totalPendente: { $sum: '$valorPendente' },
        totalOriginal: { $sum: '$valorOriginal' },
        totalDesconto: { $sum: '$valorDesconto' },
        contasPendentes: { $sum: { $cond: [{ $eq: ['$status', 'pendente'] }, 1, 0] } },
        contasParciais: { $sum: { $cond: [{ $eq: ['$status', 'parcial'] }, 1, 0] } },
        contasQuitadas: { $sum: { $cond: [{ $eq: ['$status', 'quitado'] }, 1, 0] } },
        contasVencidas: { $sum: { $cond: [{ $eq: ['$status', 'vencido'] }, 1, 0] } }
      }
    }
  ]
  
  const result = await this.aggregate(pipeline)
  return result[0] || {
    totalPendente: 0,
    totalOriginal: 0,
    totalDesconto: 0,
    contasPendentes: 0,
    contasParciais: 0,
    contasQuitadas: 0,
    contasVencidas: 0
  }
}

export default mongoose.model('ContaAReceber', ContaAReceberSchema)
