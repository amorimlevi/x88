// Dados compartilhados dos últimos pagamentos para sincronização entre componentes

export interface PagamentoData {
  id: number
  nome: string
  viagem: string
  valor: number
  tempo: string
  iniciais: string
}

export const ultimosPagamentosData: PagamentoData[] = [
  { id: 1, nome: 'Maria Santos', viagem: 'Viagem RJ', valor: 1200, tempo: '1d', iniciais: 'MS' },
  { id: 2, nome: 'João Silva', viagem: 'Viagem SP', valor: 800, tempo: '2d', iniciais: 'JS' },
  { id: 3, nome: 'Ana Costa', viagem: 'Viagem BH', valor: 950, tempo: '3d', iniciais: 'AC' },
  { id: 4, nome: 'Carlos Pereira', viagem: 'Viagem Porto', valor: 600, tempo: '5d', iniciais: 'CP' }
]
