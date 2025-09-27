// Serviço para gerenciar dados do histórico

export interface HistoricoItem {
  id: string
  data: string
  hora: string
  tipo: 'solicitacao' | 'pagamento' | 'cancelamento' | 'aprovacao' | 'negacao'
  status: 'pendente' | 'aprovado' | 'pago' | 'cancelado' | 'negado'
  funcionario: string
  funcionarioIniciais: string
  valor: number
  descricao: string
  detalhes?: string
}

class HistoricoService {
  private historico: HistoricoItem[] = [
    // Pagamentos de hoje
    {
      id: '1',
      data: new Date().toISOString().split('T')[0],
      hora: '09:30',
      tipo: 'pagamento',
      status: 'pago',
      funcionario: 'João Silva',
      funcionarioIniciais: 'JS',
      valor: 750,
      descricao: 'Pagamento realizado',
      detalhes: 'Adiantamento para emergência médica'
    },
    {
      id: '2',
      data: new Date().toISOString().split('T')[0],
      hora: '14:20',
      tipo: 'pagamento',
      status: 'pago',
      funcionario: 'Maria Santos',
      funcionarioIniciais: 'MS',
      valor: 320,
      descricao: 'Pagamento realizado',
      detalhes: 'Adiantamento para despesas pessoais'
    },
    // Pagamentos de ontem
    {
      id: '3',
      data: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hora: '10:15',
      tipo: 'pagamento',
      status: 'pago',
      funcionario: 'Pedro Costa',
      funcionarioIniciais: 'PC',
      valor: 480,
      descricao: 'Pagamento realizado',
      detalhes: 'Adiantamento para despesas familiares'
    }
  ]
  private listeners: Array<() => void> = []

  // Método para limpar todos os dados (útil para testes)
  limparHistorico() {
    this.historico = []
    this.notifyListeners()
  }

  // Adicionar nova entrada ao histórico
  adicionarEntrada(entrada: Omit<HistoricoItem, 'id' | 'data' | 'hora'>): HistoricoItem {
    const agora = new Date()
    const novaEntrada: HistoricoItem = {
      ...entrada,
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data: agora.toISOString().split('T')[0], // YYYY-MM-DD
      hora: agora.toTimeString().slice(0, 5) // HH:MM
    }

    this.historico.unshift(novaEntrada) // Adiciona no início da lista
    this.notifyListeners()
    return novaEntrada
  }

  // Registrar aprovação de solicitação (como pagamento)
  registrarAprovacao(solicitacao: any): HistoricoItem {
    return this.adicionarEntrada({
      tipo: 'pagamento',
      status: 'pago',
      funcionario: solicitacao.nome,
      funcionarioIniciais: solicitacao.iniciais,
      valor: solicitacao.valor,
      descricao: 'Pagamento aprovado',
      detalhes: `Adiantamento para ${solicitacao.viagem || 'viagem'} aprovado e processado`
    })
  }

  // Registrar negação de solicitação (como cancelamento)
  registrarNegacao(solicitacao: any, motivo?: string): HistoricoItem {
    return this.adicionarEntrada({
      tipo: 'cancelamento',
      status: 'cancelado',
      funcionario: solicitacao.nome,
      funcionarioIniciais: solicitacao.iniciais,
      valor: solicitacao.valor,
      descricao: 'Pagamento cancelado',
      detalhes: motivo || 'Solicitação negada e pagamento cancelado'
    })
  }

  // Registrar pagamento realizado
  registrarPagamento(solicitacao: any): HistoricoItem {
    return this.adicionarEntrada({
      tipo: 'pagamento',
      status: 'pago',
      funcionario: solicitacao.nome,
      funcionarioIniciais: solicitacao.iniciais,
      valor: solicitacao.valor,
      descricao: 'Pagamento realizado',
      detalhes: `Pagamento de adiantamento processado`
    })
  }

  // Registrar novo pagamento criado via dashboard
  registrarNovoPagamento(pagamento: any): HistoricoItem {
    return this.adicionarEntrada({
      tipo: 'pagamento',
      status: 'pago',
      funcionario: pagamento.funcionarioNome,
      funcionarioIniciais: pagamento.funcionarioNome.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
      valor: pagamento.valor,
      descricao: 'Pagamento criado',
      detalhes: `Pagamento via ${pagamento.metodoPagamento || 'dashboard'}`
    })
  }

  // Registrar nova solicitação
  registrarSolicitacao(solicitacao: any): HistoricoItem {
    return this.adicionarEntrada({
      tipo: 'solicitacao',
      status: 'pendente',
      funcionario: solicitacao.nome,
      funcionarioIniciais: solicitacao.iniciais,
      valor: solicitacao.valor,
      descricao: 'Nova solicitação',
      detalhes: `Solicitação de adiantamento para ${solicitacao.viagem || 'viagem'}`
    })
  }

  // Obter todo o histórico
  obterHistorico(): HistoricoItem[] {
    return [...this.historico]
  }

  // Obter pagamentos do dia atual
  obterPagamentosDoDia(): HistoricoItem[] {
    const hoje = new Date().toISOString().split('T')[0]
    return this.historico.filter(item => 
      item.tipo === 'pagamento' && 
      item.status === 'pago' && 
      item.data === hoje
    )
  }

  // Calcular valor total dos pagamentos do dia
  obterValorPagamentosDoDia(): number {
    const pagamentosDoDia = this.obterPagamentosDoDia()
    return pagamentosDoDia.reduce((total, pagamento) => total + pagamento.valor, 0)
  }

  // Filtrar histórico por data
  filtrarPorData(dataInicio?: string, dataFim?: string): HistoricoItem[] {
    return this.historico.filter(item => {
      if (dataInicio && item.data < dataInicio) return false
      if (dataFim && item.data > dataFim) return false
      return true
    })
  }

  // Obter estatísticas
  obterEstatisticas(dataInicio?: string, dataFim?: string) {
    const historicoFiltrado = this.filtrarPorData(dataInicio, dataFim)
    
    return {
      totalSolicitacoes: historicoFiltrado.filter(item => item.tipo === 'solicitacao').length,
      totalPagamentos: historicoFiltrado.filter(item => item.tipo === 'pagamento').length,
      totalCancelamentos: historicoFiltrado.filter(item => item.tipo === 'cancelamento').length,
      totalAprovacoes: historicoFiltrado.filter(item => item.tipo === 'aprovacao').length,
      totalNegacoes: historicoFiltrado.filter(item => item.tipo === 'negacao').length,
      valorTotal: historicoFiltrado
        .filter(item => item.tipo === 'pagamento' && item.status === 'pago')
        .reduce((acc, item) => acc + item.valor, 0)
    }
  }

  // Sistema de listeners para atualização em tempo real
  addListener(callback: () => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback())
  }
}

// Instância singleton
export const historicoService = new HistoricoService()
export default historicoService
