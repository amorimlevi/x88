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
  { id: 1, nome: 'Maria Santos', viagem: 'Salário Janeiro', valor: 1200, tempo: '1d', iniciais: 'MS' },
  { id: 2, nome: 'João Silva', viagem: 'Bonificação', valor: 800, tempo: '2d', iniciais: 'JS' },
  { id: 3, nome: 'Ana Costa', viagem: 'Adiantamento', valor: 950, tempo: '3d', iniciais: 'AC' },
  { id: 4, nome: 'Carlos Pereira', viagem: 'Reembolso', valor: 600, tempo: '5d', iniciais: 'CP' },
  { id: 5, nome: 'Pedro Oliveira', viagem: 'Salário Janeiro', valor: 1350, tempo: '1w', iniciais: 'PO' },
  { id: 6, nome: 'Lucia Fernandes', viagem: 'Hora Extra', valor: 420, tempo: '1w', iniciais: 'LF' },
  { id: 7, nome: 'Rafael Santos', viagem: 'Adiantamento', valor: 750, tempo: '2w', iniciais: 'RS' },
  { id: 8, nome: 'Beatriz Lima', viagem: 'Salário Janeiro', valor: 1100, tempo: '2w', iniciais: 'BL' },
  { id: 9, nome: 'Diego Costa', viagem: 'Comissão', valor: 890, tempo: '3w', iniciais: 'DC' },
  { id: 10, nome: 'Camila Silva', viagem: 'Bonificação', valor: 650, tempo: '1m', iniciais: 'CS' }
]
