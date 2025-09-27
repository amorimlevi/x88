import axios from 'axios'

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5001/api' 
  : '/api'

interface ContaAReceber {
  id: string
  funcionarioId: string
  funcionarioNome: string
  adiantamentoId: string
  valorOriginal: number
  valorPendente: number
  valorDesconto: number
  dataAdiantamento: string
  dataVencimento: string
  dataDesconto?: string
  status: 'pendente' | 'parcial' | 'quitado' | 'vencido'
  descricao: string
  observacoes?: string
  parcelasTotal?: number
  parcelasDescontadas?: number
  historico?: Array<{
    data: string
    acao: string
    valor?: number
    descricao: string
    usuario?: string
  }>
}

interface CriarContaAReceber {
  funcionarioId: string
  funcionarioNome: string
  valorOriginal: number
  dataVencimento: string
  descricao: string
  observacoes?: string
  parcelasTotal?: number
}

interface Estatisticas {
  totalPendente: number
  totalOriginal: number
  totalDesconto: number
  contasPendentes: number
  contasParciais: number
  contasQuitadas: number
  contasVencidas: number
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

class ContasAReceberService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    }
  }

  // Listar contas a receber
  async listarContas(params?: {
    status?: string
    funcionarioId?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<ContaAReceber[]>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/contas-a-receber`,
        {
          ...this.getAuthHeaders(),
          params
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao listar contas a receber')
    }
  }

  // Obter conta por ID
  async obterContaPorId(id: string): Promise<ApiResponse<ContaAReceber>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/contas-a-receber/${id}`,
        this.getAuthHeaders()
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao obter conta a receber')
    }
  }

  // Criar nova conta a receber
  async criarConta(data: CriarContaAReceber): Promise<ApiResponse<ContaAReceber>> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/contas-a-receber`,
        data,
        this.getAuthHeaders()
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar conta a receber')
    }
  }

  // Registrar desconto
  async registrarDesconto(
    id: string, 
    data: { valor: number; descricao?: string }
  ): Promise<ApiResponse<ContaAReceber>> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/contas-a-receber/${id}/desconto`,
        data,
        this.getAuthHeaders()
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao registrar desconto')
    }
  }

  // Atualizar conta
  async atualizarConta(
    id: string, 
    data: Partial<CriarContaAReceber>
  ): Promise<ApiResponse<ContaAReceber>> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/contas-a-receber/${id}`,
        data,
        this.getAuthHeaders()
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar conta a receber')
    }
  }

  // Excluir conta
  async excluirConta(id: string): Promise<ApiResponse<null>> {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/contas-a-receber/${id}`,
        this.getAuthHeaders()
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao excluir conta a receber')
    }
  }

  // Obter estatísticas
  async obterEstatisticas(): Promise<ApiResponse<Estatisticas>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/contas-a-receber/estatisticas`,
        this.getAuthHeaders()
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao obter estatísticas')
    }
  }

  // Obter contas vencidas
  async obterContasVencidas(): Promise<ApiResponse<ContaAReceber[]>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/contas-a-receber/vencidas`,
        this.getAuthHeaders()
      )
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao obter contas vencidas')
    }
  }

  // Métodos utilitários locais (para funcionar sem backend)
  obterContasLocal(): ContaAReceber[] {
    const contas = localStorage.getItem('contas-a-receber')
    return contas ? JSON.parse(contas) : []
  }

  salvarContasLocal(contas: ContaAReceber[]): void {
    localStorage.setItem('contas-a-receber', JSON.stringify(contas))
  }

  adicionarContaLocal(conta: Omit<ContaAReceber, 'id'>): ContaAReceber {
    const contas = this.obterContasLocal()
    const novaConta: ContaAReceber = {
      ...conta,
      id: Date.now().toString()
    }
    contas.push(novaConta)
    this.salvarContasLocal(contas)
    return novaConta
  }

  atualizarContaLocal(id: string, updates: Partial<ContaAReceber>): ContaAReceber | null {
    const contas = this.obterContasLocal()
    const index = contas.findIndex(c => c.id === id)
    
    if (index === -1) return null
    
    contas[index] = { ...contas[index], ...updates }
    this.salvarContasLocal(contas)
    return contas[index]
  }

  excluirContaLocal(id: string): boolean {
    const contas = this.obterContasLocal()
    const novasContas = contas.filter(c => c.id !== id)
    
    if (novasContas.length === contas.length) return false
    
    this.salvarContasLocal(novasContas)
    return true
  }
}

// Singleton
export const contasAReceberService = new ContasAReceberService()
export type { ContaAReceber, CriarContaAReceber, Estatisticas }
