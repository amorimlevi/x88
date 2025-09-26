# X88 - Sistema de Gestão de Pagamento de Frota

Sistema completo de gestão de frota com foco em adiantamentos, pagamentos e controle financeiro.

## 📱 Sobre o Projeto

X88 é um PWA (Progressive Web App) moderno e profissional para gestão de pagamentos de frotas. O sistema permite que gestores gerenciem pagamentos de funcionários e que funcionários solicitem adiantamentos de forma eficiente.

## 🎨 Design System

- **Cores**: Preto, Verde (#22c55e) e Branco
- **Estilo**: Moderno, minimalista e profissional  
- **Responsive**: Otimizado para desktop e mobile
- **Dark Mode**: Suporte completo a tema escuro

## 🚀 Funcionalidades

### 📊 Dashboard
- Visão geral dos dados financeiros
- Cards interativos com estatísticas em tempo real
- Acesso rápido às principais funcionalidades

### 📝 Solicitações
- Gestão de solicitações de adiantamentos
- Sistema de aprovação/negação com modal detalhado
- Status em tempo real das solicitações
- Cálculo automático de valor líquido (10% de taxa)
- Interface responsiva para mobile e desktop

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

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Lucide React** para ícones
- **PWA** com service workers

### Backend
- **Node.js** (em desenvolvimento)
- Sistema de autenticação
- API RESTful

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Instalar dependências do frontend
cd frontend && npm install

# Iniciar desenvolvimento
npm run dev
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Inicia frontend e backend
npm run dev:frontend # Apenas frontend
npm run dev:backend  # Apenas backend  
npm run build        # Build de produção
npm run preview      # Preview da build
```

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
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   └── middleware/
│   └── ...
└── ...
```

## 📱 PWA Features

- ✅ Instalável no dispositivo
- ✅ Funciona offline
- ✅ Notificações push
- ✅ Ícones personalizados
- ✅ Tema adaptativo

## 📱 Funcionalidades em Tempo Real

O sistema possui comunicação em tempo real entre as páginas:
- Ao aprovar uma solicitação → Aparece instantaneamente no histórico como "Pagamento"
- Ao negar uma solicitação → Registra como "Cancelamento" no histórico
- Estatísticas e contadores atualizados automaticamente
- Dados sincronizados entre histórico e relatórios

## 🎯 Status do Projeto

- ✅ Estrutura base PWA
- ✅ Sistema de autenticação
- ✅ Dashboard principal
- ✅ Design system (cores X88)
- ✅ Sistema de solicitações responsivo
- ✅ Modal de detalhes redesenhado
- ✅ Tema dark/light completo
- 🔄 Backend em desenvolvimento
- ⏳ Sistema de pagamentos
- ⏳ Notificações push

## 🚀 Como Executar

```bash
cd frontend
npm install
npm run dev
```

## 📄 Licença

Projeto privado - Todos os direitos reservados.
