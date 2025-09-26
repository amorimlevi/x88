// Serviço para gerenciar pagamentos via API

interface PaymentData {
  funcionarioId: string
  funcionarioNome: string
  tipo: 'adiantamento' | 'ferias' | 'folga' | 'reembolso' | 'ajuste_salario'
  valor: number
  descricao: string
  justificativa: string
  status: 'pendente' | 'aprovado' | 'pago' | 'cancelado'
  dataPagamento?: string
  dataVencimento?: string
  observacoes?: string
}

class PaymentsService {
  private baseURL = 'http://localhost:3001/api/payments'

  // Criar novo pagamento quando aprovado
  async criarPagamento(solicitacao: any): Promise<any> {
    try {
      const paymentData: PaymentData = {
        funcionarioId: solicitacao.funcionarioId,
        funcionarioNome: solicitacao.funcionarioNome,
        tipo: solicitacao.tipo,
        valor: solicitacao.valor,
        descricao: solicitacao.descricao,
        justificativa: solicitacao.justificativa,
        status: 'pago',
        dataPagamento: new Date().toISOString(),
        dataVencimento: solicitacao.dataVencimento,
        observacoes: solicitacao.observacoes
      }

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error(`Erro ao criar pagamento: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao criar pagamento:', error)
      throw error
    }
  }

  // Listar pagamentos
  async listarPagamentos(filtros?: any): Promise<any[]> {
    try {
      const params = new URLSearchParams()
      
      if (filtros) {
        Object.keys(filtros).forEach(key => {
          if (filtros[key] && filtros[key] !== 'todos') {
            params.append(key, filtros[key])
          }
        })
      }

      const url = params.toString() ? `${this.baseURL}?${params}` : this.baseURL
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Erro ao buscar pagamentos: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error)
      throw error
    }
  }

  // Buscar pagamento por ID
  async buscarPagamento(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar pagamento: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error)
      throw error
    }
  }

  // Atualizar pagamento
  async atualizarPagamento(id: string, dados: Partial<PaymentData>): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      })

      if (!response.ok) {
        throw new Error(`Erro ao atualizar pagamento: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error)
      throw error
    }
  }

  // Deletar pagamento
  async deletarPagamento(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Erro ao deletar pagamento: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Erro ao deletar pagamento:', error)
      throw error
    }
  }

  // Obter estatísticas
  async obterEstatisticas(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/stats/overview`)

      if (!response.ok) {
        throw new Error(`Erro ao obter estatísticas: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      throw error
    }
  }
}

// Instância singleton
export const paymentsService = new PaymentsService()
export default paymentsService
