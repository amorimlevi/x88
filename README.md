# X88 - Sistema de Gestão de Frota

Sistema completo de gestão de frota com foco em adiantamentos, pagamentos e controle financeiro.

## 🚀 Funcionalidades

### 📊 Dashboard
- Visão geral dos dados financeiros
- Cards interativos com estatísticas em tempo real
- Acesso rápido às principais funcionalidades

### 📝 Solicitações
- Gestão de solicitações de adiantamentos
- Sistema de aprovação/negação com modal detalhado
- Status em tempo real das solicitações

### 📈 Histórico
- Timeline completa de todas as atividades
- Filtros avançados por data, tipo e status
- Estatísticas detalhadas por período
- Atualização automática em tempo real

### 📊 Relatórios
- Relatórios financeiros detalhados
- Filtros personalizáveis por período
- Exportação de dados
- Gráficos e métricas interativas

### 👥 Colaboradores
- Gestão de funcionários
- Controle de dados pessoais e profissionais

### ⚙️ Configurações
- Personalizações do sistema
- Configurações administrativas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build**: Vite
- **State Management**: React Hooks + Context

## 🏗️ Arquitetura

### Componentes Principais
- `Dashboard` - Página principal com visão geral
- `SolicitacoesList` - Gestão de solicitações
- `HistoricoPage` - Timeline de atividades
- `RelatoriosList` - Sistema de relatórios

### Serviços
- `historicoService` - Gerenciamento do histórico de atividades
- `relatoriosService` - Processamento de dados para relatórios
- Sistema de listeners para atualizações em tempo real

### Características Especiais
- **Tempo Real**: Sistema de notificação automática entre componentes
- **Filtros Avançados**: Filtros por data igual ao sistema de relatórios
- **Responsivo**: Interface adaptável para diferentes tamanhos de tela
- **Dark Mode**: Suporte completo a tema escuro

## 📦 Estrutura do Projeto

```
x88/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── solicitacoes/
│   │   │   ├── historico/
│   │   │   ├── relatorios/
│   │   │   ├── colaboradores/
│   │   │   ├── configuracoes/
│   │   │   └── ui/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── ...
```

## 🚀 Como Executar

```bash
cd x88/frontend
npm install
npm run dev
```

## 📱 Funcionalidades em Tempo Real

O sistema possui comunicação em tempo real entre as páginas:
- Ao aprovar uma solicitação → Aparece instantaneamente no histórico como "Pagamento"
- Ao negar uma solicitação → Registra como "Cancelamento" no histórico
- Estatísticas e contadores atualizados automaticamente
- Dados sincronizados entre histórico e relatórios

## 🎨 Design System

- **Cores**: Sistema baseado em variáveis CSS
- **Componentes**: Biblioteca própria de componentes reutilizáveis
- **Iconografia**: Lucide React para ícones consistentes
- **Typography**: Sistema tipográfico hierárquico

## 👨‍💻 Desenvolvedor

Sistema desenvolvido para gestão eficiente de frotas com foco na experiência do usuário e performance.
