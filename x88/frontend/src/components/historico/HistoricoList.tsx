import { useState, useEffect } from 'react';
import { 
  SearchIcon, 
  CheckIcon, 
  XIcon
} from '../ui/Icons';
import { historicoService } from '../../services/historicoService';

interface HistoricoItem {
  id: string;
  tipo: 'pagamento' | 'negacao' | 'recusa';
  descricao: string;
  valor?: number;
  data: string;
  hora: string;
  status: 'pago' | 'negado' | 'recusado';
  funcionario: string;
  funcionarioIniciais: string;
  observacoes?: string;
}

export default function HistoricoList() {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [filtroData, setFiltroData] = useState<string>('');
  const [filtroDataFinal, setFiltroDataFinal] = useState<string>('');
  const [pesquisa, setPesquisa] = useState<string>('');
  const [showPagamentosModal, setShowPagamentosModal] = useState(false);
  const [showModalType, setShowModalType] = useState<string>('');
  const [modalData, setModalData] = useState<any>({});

  useEffect(() => {
    // Carregar dados do historicoService
    const carregarHistorico = () => {
      const dadosHistorico = historicoService.obterHistorico();
      setHistorico(dadosHistorico);
    };

    carregarHistorico();

    // Configurar listener para atualizações em tempo real
    const unsubscribe = historicoService.addListener(() => {
      carregarHistorico();
    });

    return unsubscribe;
  }, []);

  const historicoFiltrado = historico.filter(item => {
    // Filtro por data inicial
    const matchDataInicial = !filtroData || item.data >= filtroData;
    
    // Filtro por data final
    const matchDataFinal = !filtroDataFinal || item.data <= filtroDataFinal;
    
    // Filtro por pesquisa
    const matchPesquisa = !pesquisa || 
      item.descricao.toLowerCase().includes(pesquisa.toLowerCase()) ||
      item.funcionario.toLowerCase().includes(pesquisa.toLowerCase());

    return matchDataInicial && matchDataFinal && matchPesquisa;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago':
        return <CheckIcon className="text-green-500" size="md" />;
      case 'negado':
        return <XIcon className="text-red-500" size="md" />;
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
      case 'negacao':
        return <XIcon className="text-red-600" size="md" />;
      case 'recusa':
        return <XIcon className="text-red-600" size="md" />;
      default:
        return <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
  };

  const formatarValor = (valor?: number) => {
    if (!valor) return '';
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarDataHora = (data: string, hora: string) => {
    return `${formatarData(data)} às ${hora}`;
  };

  const handleCardClick = (type: string, data: any) => {
    setShowModalType(type);
    setModalData(data);
  };

  const closeModal = () => {
    setShowModalType('');
    setModalData({});
    setShowPagamentosModal(false);
  };

  const exportarHistorico = () => {
    const csvContent = [
      ['Tipo', 'Descrição', 'Valor', 'Data', 'Status', 'Funcionário', 'Observações'],
      ...historicoFiltrado.map(item => [
        item.tipo === 'pagamento' ? 'Pagamento' : 'Negação',
        item.descricao,
        item.valor ? formatarValor(item.valor) : '',
        formatarDataHora(item.data, item.hora),
        item.status === 'pago' ? 'Pago' : 'Negado',
        item.funcionario,
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
          <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
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

          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            placeholder="Data inicial"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <input
            type="date"
            value={filtroDataFinal || ''}
            onChange={(e) => setFiltroDataFinal(e.target.value)}
            placeholder="Data final"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>



        {/* Resumo Financeiro */}
        {(
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Pagamentos Realizados */}
              <div 
                className="bg-white border border-gray-200 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => setShowPagamentosModal(true)}
                title="Clique para ver detalhes dos pagamentos realizados"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black group-hover:text-green-600 transition-colors">Pagamentos Realizados</p>
                    <p className="text-2xl font-bold text-green-600">
                      {historicoFiltrado.filter(item => item.status === 'pago').length}
                    </p>
                    <p className="text-xs text-green-600 font-medium mt-1">✨ Clique para ver detalhes</p>
                  </div>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckIcon className="text-white" size="md" />
                  </div>
                </div>
              </div>

              {/* Pagamentos Negados */}
              <div 
                className="bg-white border border-gray-200 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => handleCardClick('pagamentos-negados', {
                  title: 'Pagamentos Negados',
                  count: historicoFiltrado.filter(item => item.status === 'negado').length,
                  items: historicoFiltrado.filter(item => item.status === 'negado')
                })}
                title="Clique para ver detalhes dos pagamentos negados"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black group-hover:text-red-600 transition-colors">Pagamentos Negados</p>
                    <p className="text-2xl font-bold text-red-600">
                      {historicoFiltrado.filter(item => item.status === 'negado').length}
                    </p>
                    <p className="text-xs text-red-600 font-medium mt-1">✨ Clique para detalhes</p>
                  </div>
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <XIcon className="text-white" size="md" />
                  </div>
                </div>
              </div>

              {/* Total Gasto em Pagamentos */}
              <div 
                className="bg-white border border-gray-200 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => handleCardClick('total-gasto-pagamentos', {
                  title: 'Total Gasto em Pagamentos',
                  valor: historicoFiltrado
                    .filter(item => item.status === 'pago' && item.tipo === 'pagamento')
                    .reduce((total, item) => total + ((item.valor || 0) * 0.9), 0),
                  items: historicoFiltrado.filter(item => item.status === 'pago' && item.tipo === 'pagamento')
                })}
                title="Clique para ver detalhes do total gasto"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black group-hover:text-blue-600 transition-colors">Total Gasto em Pagamentos</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatarValor(historicoFiltrado
                        .filter(item => item.status === 'pago' && item.tipo === 'pagamento')
                        .reduce((total, item) => total + ((item.valor || 0) * 0.9), 0))}
                    </p>
                    <p className="text-xs text-blue-600 font-medium mt-1">✨ Clique para detalhes</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Valor Bruto Total Recebido */}
              <div 
                className="bg-white border border-gray-200 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => handleCardClick('valor-bruto-total', {
                  title: 'Valor Bruto Total',
                  valor: historicoFiltrado
                    .filter(item => item.status === 'pago' && item.tipo === 'pagamento')
                    .reduce((total, item) => total + (item.valor || 0), 0),
                  items: historicoFiltrado.filter(item => item.status === 'pago' && item.tipo === 'pagamento')
                })}
                title="Clique para ver detalhes do valor bruto total"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black group-hover:text-purple-600 transition-colors">Valor Bruto Total</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatarValor(historicoFiltrado
                        .filter(item => item.status === 'pago' && item.tipo === 'pagamento')
                        .reduce((total, item) => total + (item.valor || 0), 0))}
                    </p>
                    <p className="text-xs text-purple-600 font-medium mt-1">✨ Clique para detalhes</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 10% Retido (Taxa de Serviço) */}
              <div 
                className="bg-white border border-gray-200 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => handleCardClick('taxa-servico', {
                  title: 'Taxa de Serviço (10%)',
                  valor: historicoFiltrado
                    .filter(item => item.status === 'pago' && item.tipo === 'pagamento')
                    .reduce((total, item) => total + ((item.valor || 0) * 0.1), 0),
                  items: historicoFiltrado.filter(item => item.status === 'pago' && item.tipo === 'pagamento')
                })}
                title="Clique para ver detalhes da taxa de serviço"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black group-hover:text-yellow-600 transition-colors">Taxa de Serviço (10%)</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {formatarValor(historicoFiltrado
                        .filter(item => item.status === 'pago' && item.tipo === 'pagamento')
                        .reduce((total, item) => total + ((item.valor || 0) * 0.1), 0))}
                    </p>
                    <p className="text-xs text-yellow-600 font-medium mt-1">✨ Clique para detalhes</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Resumo Total */}
              <div 
                className="bg-white border border-gray-200 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => handleCardClick('total-transacoes', {
                  title: 'Total de Transações',
                  count: historicoFiltrado.length,
                  items: historicoFiltrado
                })}
                title="Clique para ver detalhes de todas as transações"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black group-hover:text-gray-600 transition-colors">Total de Transações</p>
                    <p className="text-2xl font-bold text-gray-600">{historicoFiltrado.length}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {historicoFiltrado.filter(item => item.status === 'pago').length} Pagas
                      </span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        {historicoFiltrado.filter(item => item.status === 'negado').length} Negadas
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium mt-1">✨ Clique para detalhes</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Modal Universal para Detalhes dos Cards */}
      {(showModalType || showPagamentosModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  {showPagamentosModal ? 'Pagamentos Realizados' : modalData.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {showPagamentosModal 
                    ? `${historicoFiltrado.filter(item => item.status === 'pago' && item.tipo === 'pagamento').length} pagamentos no período`
                    : `${modalData.items?.length || 0} itens encontrados ${modalData.valor ? `- Total: ${formatarValor(modalData.valor)}` : ''}`
                  }
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XIcon size="lg" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {(showPagamentosModal 
                  ? historicoFiltrado.filter(item => item.status === 'pago' && item.tipo === 'pagamento')
                  : modalData.items || []
                ).map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.status === 'pago' ? 'bg-green-500' :
                          item.status === 'negado' ? 'bg-red-500' : 'bg-gray-500'
                        }`}>
                          {item.status === 'pago' && (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          )}
                          {item.status === 'negado' && <XIcon className="text-white" size="md" />}
                        </div>
                        {item.status === 'pago' && <CheckIcon className="text-green-500" size="md" />}
                        {item.status === 'negado' && <XIcon className="text-red-500" size="md" />}
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          item.status === 'pago' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.status === 'pago' ? 'Pagamento realizado' : 'Pagamento negado'} {item.valor ? formatarValor(item.valor) : ''}
                        </h3>
                        <p className="text-black dark:text-white font-medium">
                          Funcionário: {item.funcionario}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Data: {formatarDataHora(item.data, item.hora)}
                        </p>
                        {item.descricao && (
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            {item.descricao}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === 'pago' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {item.status === 'pago' ? 'Pago' : 'Negado'}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                          {item.tipo === 'pagamento' ? 'Pagamento' : 'Negação'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(showPagamentosModal 
                ? historicoFiltrado.filter(item => item.status === 'pago' && item.tipo === 'pagamento').length === 0
                : !modalData.items || modalData.items.length === 0
              ) && (
                <div className="text-center py-12">
                  <CheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" size="xl" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum item encontrado para os filtros selecionados.
                  </p>
                </div>
              )}
            </div>

            {/* Footer do Modal */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {showPagamentosModal 
                  ? `Total: ${formatarValor(historicoFiltrado.filter(item => item.status === 'pago' && item.tipo === 'pagamento').reduce((sum, item) => sum + (item.valor || 0), 0))}`
                  : modalData.valor 
                    ? `Total: ${formatarValor(modalData.valor)}`
                    : `${modalData.count || modalData.items?.length || 0} itens`
                }
              </div>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
