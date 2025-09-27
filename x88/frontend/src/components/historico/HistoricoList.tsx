import { useState, useEffect } from 'react';
import { 
  SearchIcon, 
  CheckIcon, 
  XIcon
} from '../ui/Icons';

interface HistoricoItem {
  id: number;
  tipo: 'pagamento' | 'solicitacao' | 'recusa';
  descricao: string;
  valor?: number;
  data: string;
  status: 'concluido' | 'pendente' | 'recusado';
  usuario: string;
  observacoes?: string;
}

export default function HistoricoList() {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroData, setFiltroData] = useState<string>('');
  const [pesquisa, setPesquisa] = useState<string>('');

  useEffect(() => {
    // Dados mockados para demonstração
    const dadosHistorico: HistoricoItem[] = [
      {
        id: 1,
        tipo: 'pagamento',
        descricao: 'Pagamento de salário - Janeiro 2024',
        valor: 3500.00,
        data: '2024-01-31',
        status: 'concluido',
        usuario: 'João Silva',
        observacoes: 'Pagamento processado via PIX'
      },
      {
        id: 2,
        tipo: 'solicitacao',
        descricao: 'Solicitação de férias - 15 dias',
        data: '2024-01-25',
        status: 'concluido',
        usuario: 'Maria Santos',
        observacoes: 'Aprovado pela gerência'
      },
      {
        id: 3,
        tipo: 'recusa',
        descricao: 'Solicitação de hora extra',
        data: '2024-01-20',
        status: 'recusado',
        usuario: 'Pedro Costa',
        observacoes: 'Não aprovado - orçamento mensal excedido'
      },
      {
        id: 4,
        tipo: 'pagamento',
        descricao: 'Bonificação por desempenho',
        valor: 500.00,
        data: '2024-01-15',
        status: 'concluido',
        usuario: 'Ana Lima',
        observacoes: 'Meta alcançada no trimestre'
      },
      {
        id: 5,
        tipo: 'solicitacao',
        descricao: 'Solicitação de mudança de turno',
        data: '2024-01-10',
        status: 'pendente',
        usuario: 'Carlos Oliveira',
        observacoes: 'Em análise pelo RH'
      },
      {
        id: 6,
        tipo: 'pagamento',
        descricao: 'Reembolso de despesas médicas',
        valor: 150.00,
        data: '2024-01-05',
        status: 'concluido',
        usuario: 'Lucia Ferreira',
        observacoes: 'Comprovantes aprovados'
      }
    ];

    setHistorico(dadosHistorico);
  }, []);

  const historicoFiltrado = historico.filter(item => {
    const matchTipo = filtroTipo === 'todos' || item.tipo === filtroTipo;
    const matchStatus = filtroStatus === 'todos' || item.status === filtroStatus;
    const matchData = !filtroData || item.data.includes(filtroData);
    const matchPesquisa = !pesquisa || 
      item.descricao.toLowerCase().includes(pesquisa.toLowerCase()) ||
      item.usuario.toLowerCase().includes(pesquisa.toLowerCase());

    return matchTipo && matchStatus && matchData && matchPesquisa;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckIcon className="text-green-500" size="md" />;
      case 'pendente':
        return <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'recusado':
        return <XIcon className="text-red-500" size="md" />;
      default:
        return <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'pagamento':
        return <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>;
      case 'solicitacao':
        return <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4V7m0 4a2 2 0 100 4H16a2 2 0 100-4h-4z" /></svg>;
      case 'recusa':
        return <XIcon className="text-red-600" size="md" />;
      default:
        return <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
  };

  const formatarValor = (valor?: number) => {
    if (!valor) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const exportarHistorico = () => {
    const csvContent = [
      ['Tipo', 'Descrição', 'Valor', 'Data', 'Status', 'Usuário', 'Observações'],
      ...historicoFiltrado.map(item => [
        item.tipo,
        item.descricao,
        item.valor ? formatarValor(item.valor) : '',
        formatarData(item.data),
        item.status,
        item.usuario,
        item.observacoes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historico.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Histórico</h2>
          <button
            onClick={exportarHistorico}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 text-gray-400" size="sm" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos os tipos</option>
            <option value="pagamento">Pagamentos</option>
            <option value="solicitacao">Solicitações</option>
            <option value="recusa">Recusas</option>
          </select>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos os status</option>
            <option value="concluido">Concluído</option>
            <option value="pendente">Pendente</option>
            <option value="recusado">Recusado</option>
          </select>

          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Lista do Histórico */}
        <div className="space-y-4">
          {historicoFiltrado.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Nenhum item encontrado no histórico</p>
            </div>
          ) : (
            historicoFiltrado.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center gap-2 mt-1">
                      {getTipoIcon(item.tipo)}
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.descricao}
                        </h3>
                        {item.valor && (
                          <span className="text-green-600 font-bold">
                            {formatarValor(item.valor)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Usuário:</strong> {item.usuario}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Data:</strong> {formatarData(item.data)}
                      </p>
                      {item.observacoes && (
                        <p className="text-sm text-gray-600">
                          <strong>Observações:</strong> {item.observacoes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'concluido'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.tipo === 'pagamento'
                          ? 'bg-blue-100 text-blue-800'
                          : item.tipo === 'solicitacao'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumo */}
        {historicoFiltrado.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total de Itens</p>
                <p className="text-2xl font-bold text-blue-900">{historicoFiltrado.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-900">
                  {historicoFiltrado.filter(item => item.status === 'concluido').length}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {historicoFiltrado.filter(item => item.status === 'pendente').length}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Recusados</p>
                <p className="text-2xl font-bold text-red-900">
                  {historicoFiltrado.filter(item => item.status === 'recusado').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
