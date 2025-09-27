// Serviço para gerenciar dados de solicitações

export interface Solicitacao {
  id: string
  funcionarioId: string
  funcionarioNome: string
  tipo: 'adiantamento' | 'ferias' | 'folga' | 'reembolso' | 'ajuste_salario'
  valor?: number
  descricao: string
  justificativa: string
  datasolicitacao: string
  dataVencimento?: string
  status: 'pendente' | 'aprovada' | 'negada' | 'em_analise'
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  documentos?: string[]
  observacoes?: string
}

class SolicitacoesService {
  private solicitacoes: Solicitacao[] = [
    {
      id: '1',
      funcionarioId: '1',
      funcionarioNome: 'João da Silva',
      tipo: 'adiantamento',
      valor: 750,
      descricao: 'Adiantamento para emergência médica',
      justificativa: 'Preciso realizar uma consulta médica urgente para minha esposa. O plano de saúde não cobre todos os custos e preciso do adiantamento para cobrir as despesas.',
      datasolicitacao: '2024-01-25T10:30:00',
      dataVencimento: '2024-02-15T00:00:00',
      status: 'pendente',
      prioridade: 'alta',
      documentos: ['recibo_medico.pdf', 'comprovante_consulta.jpg']
    },
    {
      id: '2',
      funcionarioId: '2',
      funcionarioNome: 'Maria Santos',
      tipo: 'adiantamento',
      valor: 320,
      descricao: 'Adiantamento para despesas pessoais',
      justificativa: 'Preciso de um adiantamento para cobrir algumas despesas pessoais urgentes.',
      datasolicitacao: '2024-01-20T14:15:00',
      dataVencimento: '2024-02-10T00:00:00',
      status: 'pendente',
      prioridade: 'media',
      documentos: ['justificativa_despesas.pdf']
    },
    {
      id: '3',
      funcionarioId: '3',
      funcionarioNome: 'Pedro Costa',
      tipo: 'adiantamento',
      valor: 480,
      descricao: 'Adiantamento para despesas familiares',
      justificativa: 'Preciso de adiantamento para cobrir despesas familiares urgentes.',
      datasolicitacao: '2024-01-24T16:20:00',
      dataVencimento: '2024-02-20T00:00:00',
      status: 'pendente',
      prioridade: 'alta',
      documentos: ['comprovante_despesas.pdf']
    },
    {
      id: '4',
      funcionarioId: '4',
      funcionarioNome: 'Ana Ferreira',
      tipo: 'adiantamento',
      valor: 600,
      descricao: 'Adiantamento reparação carro pessoal',
      justificativa: 'Meu carro pessoal que uso para o trabalho quebrou e precisa de reparo urgente. Solicito adiantamento para cobrir os custos.',
      datasolicitacao: '2024-01-24T09:20:00',
      dataVencimento: '2024-02-20T00:00:00',
      status: 'pendente',
      prioridade: 'urgente',
      documentos: ['orcamento_oficina.pdf']
    },
    {
      id: '5',
      funcionarioId: '5',
      funcionarioNome: 'Carlos Oliveira',
      tipo: 'adiantamento',
      valor: 420,
      descricao: 'Adiantamento para curso profissionalizante',
      justificativa: 'Preciso fazer um curso para me especializar e preciso do adiantamento para pagar a matrícula.',
      datasolicitacao: '2024-01-23T11:45:00',
      dataVencimento: '2024-02-25T00:00:00',
      status: 'pendente',
      prioridade: 'media',
      documentos: ['proposta_curso.pdf']
    },
    {
      id: '6',
      funcionarioId: '6',
      funcionarioNome: 'Lucia Miranda',
      tipo: 'adiantamento',
      valor: 850,
      descricao: 'Adiantamento para reforma residencial',
      justificativa: 'Preciso fazer uma reforma urgente na minha casa devido a vazamentos e preciso do adiantamento.',
      datasolicitacao: '2024-01-22T14:20:00',
      dataVencimento: '2024-02-28T00:00:00',
      status: 'pendente',
      prioridade: 'alta',
      documentos: ['orcamento_reforma.pdf', 'fotos_vazamento.jpg']
    },
    {
      id: '7',
      funcionarioId: '7',
      funcionarioNome: 'Rafael Sousa',
      tipo: 'adiantamento',
      valor: 290,
      descricao: 'Adiantamento para medicamentos',
      justificativa: 'Preciso comprar medicamentos para tratamento médico contínuo.',
      datasolicitacao: '2024-01-21T16:30:00',
      dataVencimento: '2024-02-15T00:00:00',
      status: 'pendente',
      prioridade: 'alta',
      documentos: ['receita_medica.pdf']
    },
    {
      id: '8',
      funcionarioId: '8',
      funcionarioNome: 'Beatriz Lima',
      tipo: 'adiantamento',
      valor: 520,
      descricao: 'Adiantamento para emergência familiar',
      justificativa: 'Situação familiar urgente que requer suporte financeiro imediato.',
      datasolicitacao: '2024-01-20T10:15:00',
      dataVencimento: '2024-02-20T00:00:00',
      status: 'pendente',
      prioridade: 'urgente',
      documentos: ['documentos_familia.pdf']
    },
    {
      id: '9',
      funcionarioId: '9',
      funcionarioNome: 'Diego Ribeiro',
      tipo: 'adiantamento',
      valor: 380,
      descricao: 'Adiantamento para equipamentos de trabalho',
      justificativa: 'Preciso comprar equipamentos específicos para melhor desempenho no trabalho.',
      datasolicitacao: '2024-01-19T13:00:00',
      dataVencimento: '2024-02-18T00:00:00',
      status: 'pendente',
      prioridade: 'media',
      documentos: ['lista_equipamentos.pdf']
    },
    {
      id: '10',
      funcionarioId: '10',
      funcionarioNome: 'Camila Alves',
      tipo: 'adiantamento',
      valor: 670,
      descricao: 'Adiantamento para tratamento dentário',
      justificativa: 'Preciso fazer tratamento dentário urgente e não tenho cobertura completa no plano.',
      datasolicitacao: '2024-01-18T15:45:00',
      dataVencimento: '2024-02-22T00:00:00',
      status: 'pendente',
      prioridade: 'alta',
      documentos: ['orcamento_dentista.pdf', 'plano_tratamento.pdf']
    },
    {
      id: '11',
      funcionarioId: '11',
      funcionarioNome: 'Carlos Ferreira',
      tipo: 'ajuste_salario',
      valor: 200,
      descricao: 'Solicitação aumento salarial',
      justificativa: 'Trabalho na empresa há 2 anos e gostaria de solicitar revisão salarial baseada na minha performance e dedicação.',
      datasolicitacao: '2024-01-21T11:30:00',
      status: 'aprovada',
      prioridade: 'baixa'
    },
    {
      id: '12',
      funcionarioId: '12',
      funcionarioNome: 'Sofia Lima',
      tipo: 'folga',
      descricao: 'Folga para casamento',
      justificativa: 'Vou me casar dia 28 de janeiro e gostaria de solicitar folga para os preparativos e cerimônia.',
      datasolicitacao: '2024-01-15T13:45:00',
      status: 'negada',
      prioridade: 'media',
      observacoes: 'Período muito próximo, não é possível reorganizar a escala.'
    }
  ]

  private listeners: Array<() => void> = []

  // Obter todas as solicitações
  obterSolicitacoes(): Solicitacao[] {
    return [...this.solicitacoes]
  }

  // Obter solicitações por status
  obterSolicitacoesPorStatus(status: Solicitacao['status']): Solicitacao[] {
    return this.solicitacoes.filter(s => s.status === status)
  }

  // Obter solicitações pendentes para o dashboard
  obterSolicitacoesPendentes(): Solicitacao[] {
    return this.obterSolicitacoesPorStatus('pendente')
  }

  // Obter solicitações do dia atual
  obterSolicitacoesDoDia(): Solicitacao[] {
    const hoje = new Date()
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
    const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999)

    return this.solicitacoes.filter(solicitacao => {
      const dataSolicitacao = new Date(solicitacao.datasolicitacao)
      return dataSolicitacao >= inicioHoje && dataSolicitacao <= fimHoje
    })
  }

  // Obter adiantamentos pendentes do dia atual
  obterAdiantamentosPendentesDoDia(): Solicitacao[] {
    const hoje = new Date()
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
    const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999)

    return this.solicitacoes.filter(solicitacao => {
      const dataSolicitacao = new Date(solicitacao.datasolicitacao)
      return dataSolicitacao >= inicioHoje && dataSolicitacao <= fimHoje &&
             solicitacao.tipo === 'adiantamento' && 
             solicitacao.status === 'pendente'
    })
  }

  // Calcular valor total dos adiantamentos pendentes do dia
  obterValorAdiantamentosPendentesDoDia(): number {
    const adiantamentosDoDia = this.obterAdiantamentosPendentesDoDia()
    return adiantamentosDoDia.reduce((total, adiantamento) => total + (adiantamento.valor || 0), 0)
  }

  // Calcular valor retido do dia (10% dos adiantamentos aprovados/pagos do dia)
  obterValorRetidoDoDia(): number {
    const hoje = new Date()
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
    const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999)

    const adiantamentosDoDia = this.solicitacoes.filter(solicitacao => {
      const dataSolicitacao = new Date(solicitacao.datasolicitacao)
      return dataSolicitacao >= inicioHoje && dataSolicitacao <= fimHoje &&
             solicitacao.tipo === 'adiantamento' && 
             (solicitacao.status === 'aprovada' || solicitacao.status === 'pendente')
    })

    const TAXA_RETENCAO = 0.10
    return adiantamentosDoDia.reduce((total, adiantamento) => {
      return total + ((adiantamento.valor || 0) * TAXA_RETENCAO)
    }, 0)
  }

  // Atualizar status de uma solicitação
  atualizarStatus(id: string, novoStatus: Solicitacao['status']): boolean {
    const index = this.solicitacoes.findIndex(s => s.id === id)
    if (index !== -1) {
      this.solicitacoes[index].status = novoStatus
      this.notifyListeners()
      return true
    }
    return false
  }

  // Adicionar nova solicitação
  adicionarSolicitacao(solicitacao: Omit<Solicitacao, 'id'>): Solicitacao {
    const novaSolicitacao: Solicitacao = {
      ...solicitacao,
      id: `sol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    this.solicitacoes.unshift(novaSolicitacao)
    this.notifyListeners()
    return novaSolicitacao
  }

  // Obter solicitação por ID
  obterSolicitacaoPorId(id: string): Solicitacao | undefined {
    return this.solicitacoes.find(s => s.id === id)
  }

  // Calcular tempo decorrido desde a solicitação
  calcularTempoDecorrido(datasolicitacao: string): string {
    const agora = new Date()
    const dataSolicitacao = new Date(datasolicitacao)
    const diffMs = Math.abs(agora.getTime() - dataSolicitacao.getTime()) // Usar valor absoluto para evitar negativos
    
    const diffMinutos = Math.floor(diffMs / (1000 * 60))
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMinutos < 60) return `${diffMinutos}m`
    if (diffHoras < 24) return `${diffHoras}h`
    if (diffDias < 7) return `${diffDias}d`
    if (diffDias < 30) return `${Math.floor(diffDias / 7)}w`
    return `${Math.floor(diffDias / 30)}m`
  }

  // Converter solicitação para formato do dashboard
  converterParaDashboard(solicitacao: Solicitacao) {
    return {
      id: solicitacao.id,
      nome: solicitacao.funcionarioNome,
      viagem: solicitacao.descricao,
      valor: solicitacao.valor || 0,
      tempo: this.calcularTempoDecorrido(solicitacao.datasolicitacao),
      iniciais: solicitacao.funcionarioNome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    }
  }

  // Obter estatísticas
  obterEstatisticas() {
    return {
      total: this.solicitacoes.length,
      pendentes: this.solicitacoes.filter(s => s.status === 'pendente').length,
      aprovadas: this.solicitacoes.filter(s => s.status === 'aprovada').length,
      negadas: this.solicitacoes.filter(s => s.status === 'negada').length,
      em_analise: this.solicitacoes.filter(s => s.status === 'em_analise').length
    }
  }

  // Sistema de listeners para atualizações em tempo real
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
export const solicitacoesService = new SolicitacoesService()
export default solicitacoesService
