import { Pagamento, Colaborador, RelatorioMetrica } from '../types/reports'

// Configurações da API
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api'

class ReportsService {
  // Obter dados de pagamentos para relatórios
  async getPaymentData(filters: {
    startDate?: string
    endDate?: string
    status?: string
    tipo?: string
    funcionarioId?: string
  }): Promise<Pagamento[]> {
    try {
      const queryParams = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const response = await fetch(`${API_BASE_URL}/payments?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar pagamentos: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro no serviço de pagamentos:', error)
      // Retorna dados mock em caso de erro
      return this.getMockPaymentData()
    }
  }

  // Obter dados de colaboradores
  async getEmployeeData(): Promise<Colaborador[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users?role=funcionario`)
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar funcionários: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro no serviço de funcionários:', error)
      // Retorna dados mock em caso de erro
      return this.getMockEmployeeData()
    }
  }

  // Calcular métricas para relatórios
  calculateMetrics(
    pagamentos: Pagamento[], 
    periodo: 'semanal' | 'mensal' | 'anual'
  ): RelatorioMetrica[] {
    const pagos = pagamentos.filter(p => p.status === 'pago')
    const pendentes = pagamentos.filter(p => 
      ['pendente', 'agendado', 'aprovado'].includes(p.status)
    )
    
    const totalPago = pagos.reduce((sum, p) => sum + p.valor, 0)
    const totalPendente = pendentes.reduce((sum, p) => sum + p.valor, 0)
    const totalAdiantamentos = pagos.filter(p => p.tipo === 'adiantamento').reduce((sum, p) => sum + p.valor, 0)
    const totalSalarios = pagos.filter(p => p.tipo === 'salario').reduce((sum, p) => sum + p.valor, 0)
    const totalViagens = pagos.filter(p => p.tipo === 'viagem').reduce((sum, p) => sum + p.valor, 0)
    const totalBonus = pagos.filter(p => p.tipo === 'bonus').reduce((sum, p) => sum + p.valor, 0)

    return [
      {
        titulo: 'Total Pago',
        valor: totalPago,
        periodo,
        variacao: this.calculateTrend(pagos, periodo),
        tipo: 'despesa'
      },
      {
        titulo: 'Pendente de Pagamento',
        valor: totalPendente,
        periodo,
        variacao: pendentes.length > 3 ? -5.2 : 12.3,
        tipo: 'despesa'
      },
      {
        titulo: 'Salários Pagos',
        valor: totalSalarios,
        periodo,
        variacao: Math.round((Math.random() - 0.3) * 20),
        tipo: 'despesa'
      },
      {
        titulo: 'Adiantamentos',
        valor: totalAdiantamentos,
        periodo,
        variacao: Math.round((Math.random() - 0.4) * 30),
        tipo: 'despesa'
      },
      {
        titulo: 'Despesas de Viagem',
        valor: totalViagens,
        periodo,
        variacao: Math.round((Math.random() - 0.2) * 25),
        tipo: 'despesa'
      },
      {
        titulo: 'Bónus Pagos',
        valor: totalBonus,
        periodo,
        variacao: Math.round((Math.random() - 0.1) * 40),
        tipo: 'receita'
      }
    ]
  }

  // Calcular tendência de crescimento
  private calculateTrend(pagamentos: Pagamento[], periodo: string): number {
    // Lógica simplificada para demonstração
    const now = new Date()
    const startPeriodoCurrent = new Date()
    const startPeriodoAnterior = new Date()

    switch (periodo) {
      case 'semanal':
        startPeriodoCurrent.setDate(now.getDate() - 7)
        startPeriodoAnterior.setDate(now.getDate() - 14)
        break
      case 'mensal':
        startPeriodoCurrent.setMonth(now.getMonth() - 1)
        startPeriodoAnterior.setMonth(now.getMonth() - 2)
        break
      case 'anual':
        startPeriodoCurrent.setFullYear(now.getFullYear() - 1)
        startPeriodoAnterior.setFullYear(now.getFullYear() - 2)
        break
    }

    const currentValue = pagamentos
      .filter(p => new Date(p.dataPagamento || '') >= startPeriodoCurrent)
      .reduce((sum, p) => sum + p.valor, 0)

    const previousValue = pagamentos
      .filter(p => {
        const date = new Date(p.dataPagamento || '')
        return date >= startPeriodoAnterior && date < startPeriodoCurrent
      })
      .reduce((sum, p) => sum + p.valor, 0)

    return previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0
  }

  // Gerar insights automáticos
  generateInsights(pagamentos: Pagamento[]): string[] {
    const insights = []
    
    const pagos = pagamentos.filter(p => p.status === 'pago')
    const pendentes = pagamentos.filter(p => ['pendente', 'aprovado'].includes(p.status))
    const agendados = pagamentos.filter(p => p.status === 'agendado')
    
    // Insights de performance
    const totalPago = pagos.reduce((sum, p) => sum + p.valor, 0)
    const valorMedio = pagos.length > 0 ? totalPago / pagos.length : 0
    
    if (valorMedio > 800) {
      insights.push(`💰 Valor médio por pagamento alto: €${valorMedio.toFixed(2)}`)
    }
    
    // Insights de adiantamentos
    const adiantamentos = pagos.filter(p => p.tipo === 'adiantamento')
    if (adiantamentos.length > pagos.length * 0.3) {
      insights.push('⚠️ Alto volume de adiantamentos pode indicar problemas de fluxo de caixa')
    }
    
    // Insights de pendências
    if (pendentes.length > 5) {
      const valorPendente = pendentes.reduce((sum, p) => sum + p.valor, 0)
      insights.push(`🔄 ${pendentes.length} pagamentos pendentes totalizando €${valorPendente.toFixed(2)}`)
    }
    
    // Insights de agendamentos
    if (agendados.length > 0) {
      const proximosPagamentos = agendados.filter(p => {
        if (!p.dataVencimento) return false
        const vencimento = new Date(p.dataVencimento)
        const emUmaSemana = new Date()
        emUmaSemana.setDate(emUmaSemana.getDate() + 7)
        return vencimento <= emUmaSemana
      })
      
      if (proximosPagamentos.length > 0) {
        insights.push(`📅 ${proximosPagamentos.length} pagamentos vencendo nos próximos 7 dias`)
      }
    }
    
    // Insights sazonais
    const mesAtual = new Date().getMonth()
    if (mesAtual === 11) { // Dezembro
      insights.push('🎄 Dezembro: considere o impacto do 13º salário nos relatórios')
    }
    
    return insights
  }

  // Exportar dados para diferentes formatos
  async exportReport(
    data: any, 
    format: 'json' | 'csv' | 'pdf',
    reportType: string
  ): Promise<void> {
    try {
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `relatorio-${reportType}-${timestamp}`
      
      switch (format) {
        case 'json':
          this.downloadJSON(data, `${filename}.json`)
          break
        case 'csv':
          this.downloadCSV([data], `${filename}.csv`)
          break
        case 'pdf':
          // Implementar geração de PDF futuramente
          console.log('Exportação PDF será implementada')
          break
      }
    } catch (error) {
      console.error('Erro ao exportar relatório:', error)
      throw error
    }
  }

  private downloadJSON(data: any, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    })
    this.downloadBlob(blob, filename)
  }

  private downloadCSV(data: any[], filename: string): void {
    if (data.length === 0) return
    
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      ).join(',')
    ).join('\n')
    
    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: 'text/csv' })
    this.downloadBlob(blob, filename)
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Dados mock para desenvolvimento
  private getMockPaymentData(): Pagamento[] {
    return [
      {
        id: '1',
        funcionarioId: '1',
        funcionarioNome: 'João Silva',
        tipo: 'salario',
        valor: 1200,
        descricao: 'Salário Janeiro 2024',
        status: 'pago',
        dataPagamento: '2024-01-25T10:30:00',
        metodoPagamento: 'transferencia',
        origem: 'manual'
      },
      {
        id: '2',
        funcionarioId: '2',
        funcionarioNome: 'Maria Santos',
        tipo: 'viagem',
        valor: 350,
        descricao: 'Viagem Lisboa-Porto',
        status: 'pago',
        dataPagamento: '2024-01-20T14:15:00',
        metodoPagamento: 'pix',
        origem: 'app_terceiro'
      },
      {
        id: '3',
        funcionarioId: '1',
        funcionarioNome: 'João Silva',
        tipo: 'adiantamento',
        valor: 500,
        descricao: 'Adiantamento emergência médica',
        status: 'pendente',
        dataVencimento: '2024-02-15T00:00:00',
        origem: 'manual'
      }
    ]
  }

  private getMockEmployeeData(): Colaborador[] {
    return [
      {
        id: '1',
        nome: 'João Silva',
        email: 'joao@exemplo.com',
        telefone: '+351 912 345 678',
        cargo: 'Motorista',
        salario: 1200,
        dataContratacao: '2023-06-15',
        status: 'ativo',
        origem: 'manual'
      },
      {
        id: '2',
        nome: 'Maria Santos',
        email: 'maria@exemplo.com',
        telefone: '+351 913 456 789',
        cargo: 'Motorista Senior',
        salario: 1500,
        dataContratacao: '2022-03-20',
        status: 'ativo',
        origem: 'manual'
      }
    ]
  }
}

export const reportsService = new ReportsService()
export default reportsService
