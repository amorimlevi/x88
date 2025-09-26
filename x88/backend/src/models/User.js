import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
    select: false // Não incluir senha nas consultas por padrão
  },
  tipo: {
    type: String,
    enum: ['gestor', 'funcionario'],
    required: [true, 'Tipo de usuário é obrigatório']
  },
  cpf: {
    type: String,
    required: [true, 'CPF é obrigatório'],
    unique: true,
    match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00']
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    match: [/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (00) 00000-0000']
  },
  endereco: {
    rua: String,
    numero: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String
  },
  // Campos específicos para gestores
  empresa: {
    type: String,
    required: function() { return this.tipo === 'gestor' }
  },
  cnpj: {
    type: String,
    required: function() { return this.tipo === 'gestor' },
    match: [/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ deve estar no formato 00.000.000/0000-00']
  },
  // Campos específicos para funcionários
  gestorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.tipo === 'funcionario' }
  },
  cargo: {
    type: String,
    required: function() { return this.tipo === 'funcionario' }
  },
  salario: {
    type: Number,
    required: function() { return this.tipo === 'funcionario' }
  },
  dataContratacao: {
    type: Date,
    required: function() { return this.tipo === 'funcionario' }
  },
  status: {
    type: String,
    enum: ['ativo', 'inativo', 'suspenso'],
    default: 'ativo'
  },
  avatar: {
    type: String,
    default: null
  },
  ultimoLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next()
  
  this.senha = await bcrypt.hash(this.senha, 12)
  next()
})

// Método para verificar senha
userSchema.methods.verificarSenha = async function(senhaCandidata) {
  return await bcrypt.compare(senhaCandidata, this.senha)
}

// Método para obter dados públicos do usuário
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.senha
  return user
}

export default mongoose.model('User', userSchema)
