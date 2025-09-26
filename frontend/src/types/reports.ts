// Tipos principais para o sistema de relatórios
export interface Pagamento {
  id: string
  funcionarioId: string
  funcionarioNome: string
  tipo: 'salario' | 'adiantamento' | 'viagem' | 'bonus' | 'desconto'
  valor: number
  descricao: string
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'pago' | 'cancelado' | 'agendado'
  dataPagamento?: string
  dataVencimento?: string
  metodoPagamento?: 'pix' | 'transferencia' | 'dinheiro' | 'cartao' | 'mbway'
  comprovante?: string
  observacoes?: string
  origem: 'manual' | 'app_terceiro'
  
  // Dados específicos de viagem
  viagem?: {
    origem: string
    destino: string
    distancia: number
    combustivel: number
    pedagio: number
    outros?: number
  }
  
  // Dados específicos de adiantamento
  adiantamento?: {
    motivo: string
    juros: number
    parcelas?: number
    valorParcela?: number
  }
}

export interface Colaborador {
  id: string
  nome: string
  email: string
  telefone: string
  cargo: string
  salario: number
  dataContratacao: string
  status: 'ativo' | 'inativo' | 'suspenso'
  endereco?: {
    rua: string
    cidade: string
    codigoPostal: string
    pais: string
  }
  dadosBancarios?: {
    iban?: string
    mbway?: string
    banco: string
  }
  documentos?: {
    cc?: string
    nif?: string
    cartaConducao?: string
  }
  origem: 'manual' | 'app_terceiro'
}

export interface Adiantamento {
  id: string
  funcionarioId: string
  funcionarioNome: string
  valor: number
  motivo: string
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'pago' | 'cancelado'
  urgencia: 'baixa' | 'media' | 'alta' | 'critica'
  dataSolicitacao: string
  dataVencimentoDesejada: string
  dataAprovacao?: string
  aprovadoPor?: string
  observacoes?: string
  origem: 'app_motorista' | 'manual'
}

export interface ContaAReceber {
  id: string
  funcionarioId: string
  funcionarioNome: string
  adiantamentoId: string
  valorOriginal: number
  valorPendente: number
  valorDesconto: number
  status: 'pendente' | 'parcial' | 'quitado' | 'vencido'
  parcelasTotal?: number
  parcelasDescontadas?: number
  proximoVencimento?: string
}

export interface RelatorioMetrica {
  titulo: string
  valor: number
  periodo: string
  variacao?: number
  tipo: 'receita' | 'despesa' | 'saldo'
  icone?: string
  cor?: string
}

export interface DashboardStats {
  totalFuncionarios: number
  funcionariosAtivos: number
  totalPagamentosHoje: number
  valorTotalPagamentosHoje: number
  adiantamentosPendentes: number
  valorAdiantamentosPendentes: number
  contasAReceber: number
  valorContasAReceber: number
}

export interface PoupancaMensal {
  id: string
  mes: string
  ano: number
  valorPoupado: number
  valorPlanejado: number
  gastoTotal: number
  receitaTotal: number
  percentualEconomia: number
  categoria: {
    combustivel: number
    manutencao: number
    salarios: number
    adiantamentos: number
    bonus: number
    outros: number
  }
  metas?: {
    reducaoCombustivel: number
    otimizacaoSalarios: number
    controleAdiantamentos: number
  }
}

// Tipos para filtros e configurações
export type FiltroTempo = 'hoje' | 'semanal' | 'mensal' | 'anual' | 'customizado'
export type TipoRelatorio = 'geral' | 'pagamentos' | 'adiantamentos' | 'faturamento' | 'funcionarios' | 'poupanca'
export type StatusFiltro = 'todos' | 'pago' | 'pendente' | 'agendado' | 'cancelado'
export type TipoPagamentoFiltro = 'todos' | 'salario' | 'adiantamento' | 'viagem' | 'bonus'
export type FormatoExportacao = 'json' | 'csv' | 'excel' | 'pdf'

// Configurações de relatório
export interface RelatorioConfig {
  titulo: string
  periodo: FiltroTempo
  tipoRelatorio: TipoRelatorio
  filtros: {
    status?: StatusFiltro
    tipo?: TipoPagamentoFiltro
    funcionarioId?: string
    startDate?: string
    endDate?: string
  }
  incluirGraficos: boolean
  incluirInsights: boolean
  formatoExportacao: FormatoExportacao
}

// Dados para gráficos
export interface DadosGrafico {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
    borderWidth?: number
  }[]
}

// Performance por funcionário
export interface PerformanceFuncionario {
  funcionarioId: string
  funcionarioNome: string
  totalRecebido: number
  numeroTransacoes: number
  valorMedio: number
  adiantamentosUtilizados: number
  percentualAdiantamentos: number
  status: 'excelente' | 'bom' | 'regular' | 'preocupante'
}

// Análise temporal
export interface Analisetemporal {
  periodo: string
  valor: number
  tipo: string
  crescimento: number
  transacoes: number
}

// Alertas e notificações
export interface AlertaRelatorio {
  id: string
  tipo: 'info' | 'warning' | 'error' | 'success'
  titulo: string
  mensagem: string
  acao?: {
    texto: string
    callback: () => void
  }
}

// Configurações do usuário para relatórios
export interface PreferenciasRelatorio {
  formatoDataPadrao: 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd'
  moedaPadrao: 'EUR' | 'USD' | 'BRL'
  periodoDefaultDashboard: FiltroTempo
  exportacaoAutomatica: boolean
  receberAlertas: boolean
  tiposAlertaAtivos: string[]
}

// Exportar apenas tipos - não há export default necessário para tipos
