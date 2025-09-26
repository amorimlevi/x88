// Serviço para gerenciar dados dos relatórios

export interface RelatorioItem {
  id: string
  data: string
  funcionario: string
  tipo: 'adiantamento' | 'pagamento' | 'cancelamento'
  valor: number
  status: 'pendente' | 'aprovado' | 'pago' | 'cancelado' | 'negado'
  detalhes: string
  observacoes?: string
}

class RelatoriosService {
  private dados: RelatorioItem[] = []
  private listeners: Array<() => void> = []

  // Método para limpar todos os dados (útil para testes)
  limparDados() {
    this.dados = []
    this.notifyListeners()
  }

  // Adicionar nova entrada aos relatórios
  adicionarDado(dado: Omit<RelatorioItem, 'id'>): RelatorioItem {
    const novoDado: RelatorioItem = {
      ...dado,
      id: `rel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    this.dados.push(novoDado)
    this.notifyListeners()
    return novoDado
  }

  // Registrar aprovação para relatório (como pagamento)
  registrarAprovacao(solicitacao: any): RelatorioItem {
    return this.adicionarDado({
      data: new Date().toISOString().split('T')[0],
      funcionario: solicitacao.nome,
      tipo: 'pagamento',
      valor: solicitacao.valor,
      status: 'pago',
      detalhes: `Pagamento aprovado para ${solicitacao.viagem || 'viagem'}`,
      observacoes: solicitacao.observacoes
    })
  }

  // Registrar negação para relatório (como cancelamento)
  registrarNegacao(solicitacao: any, motivo?: string): RelatorioItem {
    return this.adicionarDado({
      data: new Date().toISOString().split('T')[0],
      funcionario: solicitacao.nome,
      tipo: 'cancelamento',
      valor: solicitacao.valor,
      status: 'cancelado',
      detalhes: `Pagamento cancelado para ${solicitacao.viagem || 'viagem'}`,
      observacoes: motivo || 'Negado pelo sistema'
    })
  }

  // Registrar pagamento para relatório
  registrarPagamento(solicitacao: any): RelatorioItem {
    return this.adicionarDado({
      data: new Date().toISOString().split('T')[0],
      funcionario: solicitacao.nome,
      tipo: 'pagamento',
      valor: solicitacao.valor,
      status: 'pago',
      detalhes: `Pagamento de adiantamento realizado`,
      observacoes: 'Pagamento processado com sucesso'
    })
  }

  // Registrar solicitação para relatório
  registrarSolicitacao(solicitacao: any): RelatorioItem {
    return this.adicionarDado({
      data: new Date().toISOString().split('T')[0],
      funcionario: solicitacao.nome,
      tipo: 'adiantamento',
      valor: solicitacao.valor,
      status: 'pendente',
      detalhes: `Solicitação de adiantamento para ${solicitacao.viagem || 'viagem'}`,
      observacoes: solicitacao.observacoes
    })
  }

  // Obter todos os dados
  obterDados(): RelatorioItem[] {
    return [...this.dados]
  }

  // Filtrar dados por período
  filtrarPorPeriodo(dataInicio?: string, dataFim?: string): RelatorioItem[] {
    return this.dados.filter(item => {
      if (dataInicio && item.data < dataInicio) return false
      if (dataFim && item.data > dataFim) return false
      return true
    })
  }

  // Obter estatísticas para relatórios
  obterEstatisticas(dataInicio?: string, dataFim?: string) {
    const dadosFiltrados = this.filtrarPorPeriodo(dataInicio, dataFim)
    
    return {
      totalItens: dadosFiltrados.length,
      adiantamentosAprovados: dadosFiltrados.filter(item => 
        item.tipo === 'adiantamento' && item.status === 'aprovado'
      ).length,
      adiantamentosNegados: dadosFiltrados.filter(item => 
        item.tipo === 'adiantamento' && item.status === 'negado'
      ).length,
      pagamentosRealizados: dadosFiltrados.filter(item => 
        item.tipo === 'pagamento' && item.status === 'pago'
      ).length,
      valorTotalPago: dadosFiltrados
        .filter(item => item.tipo === 'pagamento' && item.status === 'pago')
        .reduce((acc, item) => acc + item.valor, 0),
      valorTotalSolicitado: dadosFiltrados
        .filter(item => item.tipo === 'adiantamento')
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
export const relatoriosService = new RelatoriosService()
export default relatoriosService
