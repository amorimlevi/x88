import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  funcionarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID do funcionário é obrigatório']
  },
  gestorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID do gestor é obrigatório']
  },
  tipo: {
    type: String,
    enum: ['salario', 'adiantamento', 'viagem', 'bonus', 'desconto'],
    required: [true, 'Tipo de pagamento é obrigatório']
  },
  valor: {
    type: Number,
    required: [true, 'Valor é obrigatório'],
    min: [0.01, 'Valor deve ser maior que zero']
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    maxlength: [500, 'Descrição não pode exceder 500 caracteres']
  },
  status: {
    type: String,
    enum: ['pendente', 'aprovado', 'rejeitado', 'pago', 'cancelado'],
    default: 'pendente'
  },
  // Dados da viagem (para pagamentos de viagem)
  viagem: {
    origem: String,
    destino: String,
    distancia: Number,
    dataInicio: Date,
    dataFim: Date,
    combustivel: Number,
    pedagio: Number,
    outros: Number
  },
  // Dados do adiantamento
  adiantamento: {
    motivo: String,
    dataVencimento: Date,
    juros: {
      type: Number,
      default: 0
    }
  },
  // Histórico de status
  historico: [{
    status: String,
    data: {
      type: Date,
      default: Date.now
    },
    observacao: String,
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // Dados do pagamento
  dataPagamento: Date,
  metodoPagamento: {
    type: String,
    enum: ['pix', 'transferencia', 'dinheiro', 'cartao'],
    required: function() { return this.status === 'pago' }
  },
  comprovante: {
    type: String, // URL do comprovante
    required: function() { return this.status === 'pago' }
  },
  observacoes: String
}, {
  timestamps: true
})

// Índices para melhor performance
paymentSchema.index({ funcionarioId: 1, createdAt: -1 })
paymentSchema.index({ gestorId: 1, status: 1 })
paymentSchema.index({ tipo: 1, status: 1 })

// Middleware para adicionar ao histórico quando status muda
paymentSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.historico.push({
      status: this.status,
      data: new Date(),
      observacao: `Status alterado para ${this.status}`
    })
  }
  next()
})

// Método para calcular total da viagem
paymentSchema.methods.calcularTotalViagem = function() {
  if (this.tipo === 'viagem' && this.viagem) {
    const { combustivel = 0, pedagio = 0, outros = 0 } = this.viagem
    return combustivel + pedagio + outros
  }
  return this.valor
}

// Método para verificar se o pagamento pode ser aprovado
paymentSchema.methods.podeSerAprovado = function() {
  return ['pendente', 'rejeitado'].includes(this.status)
}

export default mongoose.model('Payment', paymentSchema)
