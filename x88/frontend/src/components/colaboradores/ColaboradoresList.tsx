import { useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Phone, Mail, Calendar, Euro, Eye } from 'lucide-react'
import AddColaboradorModal from './AddColaboradorModal'
import ColaboradorDetailsModal from './ColaboradorDetailsModal'
import { formatEuro, formatDate } from '../../utils/formatters'

interface Colaborador {
  id: string
  nome: string
  email: string
  telefone: string
  cargo: string
  salario: number
  dataContratacao: string
  status: 'ativo' | 'inativo' | 'suspenso'
  avatar?: string
  origem: 'manual' | 'app_terceiro'
  endereco?: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    codigoPostal: string
  }
  dadosBancarios?: {
    banco: string
    agencia: string
    conta: string
    tipoConta: 'corrente' | 'poupanca'
    titular: string
    iban?: string
    swift?: string
    mbway?: string // Número de telefone para MBWay
  }
  documentos?: {
    rg?: string
    cpf?: string
    cnh?: string
    dataValidadeCnh?: string
  }
  observacoes?: string
  dataUltimaAtualizacao?: string
}

interface ColaboradoresListProps {
  externalSearchTerm?: string
}

const ColaboradoresList = ({ externalSearchTerm = '' }: ColaboradoresListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'inativo' | 'suspenso'>('todos')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Dados mock - em produção viriam da API
  const [colaboradores] = useState<Colaborador[]>([
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao.silva@empresa.pt',
      telefone: '(21) 99999-0001',
      cargo: 'Condutor',
      salario: 1200,
      dataContratacao: '2023-01-15',
      status: 'ativo',
      origem: 'manual',
      endereco: {
        rua: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cidade: 'Lisboa',
        codigoPostal: '1000-001'
      },
      dadosBancarios: {
        banco: 'Banco Santander Totta',
        agencia: '0123',
        conta: '12345678-9',
        tipoConta: 'corrente',
        titular: 'João Silva',
        iban: 'PT50 0123 4567 8901 2345 6789 0',
        mbway: '+351 21 999-0001'
      },
      documentos: {
        rg: '12.345.678-9',
        cpf: '123.456.789-00',
        cnh: 'AB123456789',
        dataValidadeCnh: '2025-12-31'
      },
      observacoes: 'Funcionário pontual e dedicado. Tem experiência em rotas urbanas.',
      dataUltimaAtualizacao: '2024-01-20T10:30:00'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria.santos@empresa.pt',
      telefone: '(21) 99999-0002',
      cargo: 'Coordenadora',
      salario: 1800,
      dataContratacao: '2022-08-10',
      status: 'ativo',
      origem: 'app_terceiro',
      endereco: {
        rua: 'Avenida da Liberdade',
        numero: '456',
        bairro: 'Avenidas Novas',
        cidade: 'Lisboa',
        codigoPostal: '1250-096'
      },
      dadosBancarios: {
        banco: 'Caixa Geral de Depósitos',
        agencia: '0456',
        conta: '98765432-1',
        tipoConta: 'corrente',
        titular: 'Maria Santos',
        iban: 'PT50 0456 7890 1234 5678 9012 3',
        mbway: '+351 21 999-0002'
      },
      documentos: {
        rg: '98.765.432-1',
        cpf: '987.654.321-00',
        cnh: 'CD987654321',
        dataValidadeCnh: '2026-06-15'
      },
      observacoes: 'Coordenadora experiente, excelente gestão de equipe. Responsável pelo treinamento de novos motoristas.',
      dataUltimaAtualizacao: '2024-01-18T15:45:00'
    },
    {
      id: '3',
      nome: 'Pedro Costa',
      email: 'pedro.costa@empresa.pt',
      telefone: '(21) 99999-0003',
      cargo: 'Condutor',
      salario: 1150,
      dataContratacao: '2023-03-20',
      status: 'suspenso',
      origem: 'manual',
      endereco: {
        rua: 'Rua do Comércio',
        numero: '789',
        bairro: 'Baixa',
        cidade: 'Porto',
        codigoPostal: '4000-001'
      },
      dadosBancarios: {
        banco: 'Millennium BCP',
        agencia: '0789',
        conta: '11111111-1',
        tipoConta: 'poupanca',
        titular: 'Pedro Costa',
        iban: 'PT50 0789 0123 4567 8901 2345 6',
        mbway: '+351 21 999-0003'
      },
      documentos: {
        rg: '11.111.111-1',
        cpf: '111.111.111-11',
        cnh: 'EF111111111',
        dataValidadeCnh: '2024-03-30'
      },
      observacoes: 'Suspenso temporariamente por questões disciplinares. Aguardando revisão do caso.',
      dataUltimaAtualizacao: '2024-01-10T08:20:00'
    }
  ])

  const filteredColaboradores = colaboradores.filter(colaborador => {
    const effectiveSearchTerm = externalSearchTerm || searchTerm
    const matchesSearch = colaborador.nome.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
                         colaborador.email.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
                         colaborador.cargo.toLowerCase().includes(effectiveSearchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'todos' || colaborador.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500/20 text-green-400'
      case 'inativo': return 'bg-gray-500/20 text-gray-400'
      case 'suspenso': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getOrigemBadge = (origem: string) => {
    return origem === 'manual' 
      ? 'bg-blue-500/20 text-blue-400' 
      : 'bg-purple-500/20 text-purple-400'
  }

  const handleViewDetails = (colaborador: Colaborador) => {
    setSelectedColaborador(colaborador)
    setIsDetailsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Colaboradores</h1>
          <p className="text-dark-600 mt-2">
            Gerir colaboradores da frota
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Colaborador
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Total</p>
              <p className="text-2xl font-bold text-black dark:text-white">{colaboradores.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-black dark:text-white font-bold">{colaboradores.length}</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Activos</p>
              <p className="text-2xl font-bold text-black dark:text-white">
              {colaboradores.filter(c => c.status === 'ativo').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-black dark:text-white font-bold">
                {colaboradores.filter(c => c.status === 'ativo').length}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Suspensos</p>
              <p className="text-2xl font-bold text-black dark:text-white">
              {colaboradores.filter(c => c.status === 'suspenso').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-black dark:text-white font-bold">
                {colaboradores.filter(c => c.status === 'suspenso').length}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Folha Salarial</p>
              <p className="text-2xl font-bold text-black dark:text-white">
              {formatEuro(colaboradores.reduce((sum, c) => sum + c.salario, 0))}
              </p>
            </div>
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Euro className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-600" />
            <input
              type="text"
              placeholder="Pesquisar colaboradores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-200 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-dark-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="todos">Todos os estados</option>
              <option value="ativo">Activos</option>
              <option value="inativo">Inativos</option>
              <option value="suspenso">Suspensos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Colaboradores Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-300">
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Colaborador</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Cargo</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Contacto</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Salário</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Estado</th>
                <th className="text-left py-3 px-4 text-dark-600 font-medium">Origem</th>
                <th className="text-right py-3 px-4 text-dark-600 font-medium">Acções</th>
              </tr>
            </thead>
            <tbody>
              {filteredColaboradores.map((colaborador) => (
                <tr key={colaborador.id} className="border-b border-dark-300 hover:bg-dark-200/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                      {colaborador.nome.split(' ').map(name => name.charAt(0)).join('').slice(0, 2).toUpperCase()}
                      </span>
                      </div>
                      <div>
                        <p className="text-black dark:text-white font-medium">{colaborador.nome}</p>
                        <p className="text-black dark:text-white text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(colaborador.dataContratacao)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-black dark:text-white">{colaborador.cargo}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <p className="text-black dark:text-white text-sm flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {colaborador.email}
                      </p>
                      <p className="text-black dark:text-white text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {colaborador.telefone}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-primary-500 font-medium">
                      {formatEuro(colaborador.salario)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(colaborador.status)}`}>
                      {colaborador.status.charAt(0).toUpperCase() + colaborador.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrigemBadge(colaborador.origem)}`}>
                      {colaborador.origem === 'manual' ? 'Manual' : 'App Terceiro'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button 
                        onClick={() => handleViewDetails(colaborador)}
                        className="p-2 text-dark-600 hover:text-primary-500 hover:bg-dark-200 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-dark-600 hover:text-primary-500 hover:bg-dark-200 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-dark-600 hover:text-red-500 hover:bg-dark-200 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredColaboradores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-600">Nenhum colaborador encontrado.</p>
          </div>
        )}
      </div>

      {/* Add Colaborador Modal */}
      <AddColaboradorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(data) => {
          console.log('Novo colaborador:', data)
          setIsAddModalOpen(false)
        }}
      />

      {/* Colaborador Details Modal */}
      <ColaboradorDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedColaborador(null)
        }}
        colaborador={selectedColaborador}
      />
    </div>
  )
}

export default ColaboradoresList
