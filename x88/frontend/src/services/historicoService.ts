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
  private historico: HistoricoItem[] = []
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
