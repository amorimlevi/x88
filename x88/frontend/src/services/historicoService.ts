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
  private generateMockData(): HistoricoItem[] {
    const funcionarios = [
      { nome: 'João Silva', iniciais: 'JS' },
      { nome: 'Maria Santos', iniciais: 'MS' },
      { nome: 'Pedro Costa', iniciais: 'PC' },
      { nome: 'Ana Ferreira', iniciais: 'AF' },
      { nome: 'Carlos Oliveira', iniciais: 'CO' },
      { nome: 'Sofia Rodrigues', iniciais: 'SR' },
      { nome: 'Miguel Almeida', iniciais: 'MA' },
      { nome: 'Rita Pereira', iniciais: 'RP' },
      { nome: 'Bruno Mendes', iniciais: 'BM' },
      { nome: 'Catarina Lima', iniciais: 'CL' },
      { nome: 'Eduardo Sousa', iniciais: 'ES' },
      { nome: 'Patricia Martins', iniciais: 'PM' },
      { nome: 'Rui Tavares', iniciais: 'RT' },
      { nome: 'Helena Carvalho', iniciais: 'HC' },
      { nome: 'André Gomes', iniciais: 'AG' }
    ];

    const detalhesMotivos = [
      'Adiantamento para emergência médica',
      'Despesas de viagem de trabalho',
      'Adiantamento para despesas familiares',
      'Pagamento de conta urgente',
      'Reparação de veículo próprio',
      'Despesas educacionais',
      'Emergência doméstica',
      'Adiantamento de salário',
      'Compra de material de trabalho',
      'Despesas médicas',
      'Pagamento de renda',
      'Manutenção de equipamento',
      'Formação profissional',
      'Despesas de transporte',
      'Situação financeira temporária'
    ];

    const mockData: HistoricoItem[] = [];
    
    // Gerar dados dos últimos 3 meses
    for (let i = 0; i < 90; i++) {
      const dataAtual = new Date();
      dataAtual.setDate(dataAtual.getDate() - i);
      
      // Mais transações em dias úteis
      const isDiaUtil = dataAtual.getDay() >= 1 && dataAtual.getDay() <= 5;
      const numTransacoesDia = isDiaUtil ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 3);
      
      for (let j = 0; j < numTransacoesDia; j++) {
        const funcionario = funcionarios[Math.floor(Math.random() * funcionarios.length)];
        const isAprovado = Math.random() > 0.15; // 85% aprovação
        const valor = Math.floor(Math.random() * 1200) + 100; // Entre 100 e 1300 euros
        const hora = `${String(Math.floor(Math.random() * 10) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
        const motivo = detalhesMotivos[Math.floor(Math.random() * detalhesMotivos.length)];
        
        mockData.push({
          id: `mock_${dataAtual.getTime()}_${j}_${Math.random().toString(36).substr(2, 9)}`,
          data: dataAtual.toISOString().split('T')[0],
          hora,
          tipo: isAprovado ? 'pagamento' : (Math.random() > 0.5 ? 'cancelamento' : 'negacao'),
          status: isAprovado ? 'pago' : (Math.random() > 0.5 ? 'cancelado' : 'negado'),
          funcionario: funcionario.nome,
          funcionarioIniciais: funcionario.iniciais,
          valor,
          descricao: isAprovado ? 'Pagamento realizado' : (Math.random() > 0.5 ? 'Pagamento cancelado' : 'Solicitação negada'),
          detalhes: motivo
        });
      }
    }

    // Adicionar algumas solicitações pendentes
    for (let i = 0; i < 5; i++) {
      const funcionario = funcionarios[Math.floor(Math.random() * funcionarios.length)];
      const valor = Math.floor(Math.random() * 800) + 200;
      const hoje = new Date();
      const hora = `${String(Math.floor(Math.random() * 10) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
      
      mockData.push({
        id: `pending_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
        data: hoje.toISOString().split('T')[0],
        hora,
        tipo: 'solicitacao',
        status: 'pendente',
        funcionario: funcionario.nome,
        funcionarioIniciais: funcionario.iniciais,
        valor,
        descricao: 'Solicitação pendente',
        detalhes: detalhesMotivos[Math.floor(Math.random() * detalhesMotivos.length)]
      });
    }

    // Ordenar por data e hora (mais recentes primeiro)
    return mockData.sort((a, b) => {
      const dateCompare = b.data.localeCompare(a.data);
      if (dateCompare !== 0) return dateCompare;
      return b.hora.localeCompare(a.hora);
    });
  }

  private historico: HistoricoItem[] = this.generateMockData()
  private listeners: Array<() => void> = []

  // Método para limpar todos os dados (útil para testes)
  limparHistorico() {
    this.historico = []
    this.notifyListeners()
  }

  // Método para regenerar dados mock
  regenerarDadosMock() {
    this.historico = this.generateMockData()
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

  // Calcular valor total dos pagamentos do dia (valor líquido - 10% de desconto)
  obterValorPagamentosDoDia(): number {
    const pagamentosDoDia = this.obterPagamentosDoDia()
    return pagamentosDoDia.reduce((total, pagamento) => total + (pagamento.valor * 0.9), 0)
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
