# 🎯 Sistema de Avaliação e Votação

Sistema profissional de votação e avaliação de ideias para workshops corporativos, eventos de inovação e reuniões de brainstorming. Interface moderna, dashboard em tempo real e sistema robusto de persistência de dados.

## ✨ Funcionalidades

### 🗳️ Sistema de Votação
- **Interface de Participante**: Avaliação de ideias com sistema de estrelas (1-10)
- **Categorias**: Ideias Viáveis (7) e Ideias Disruptivas (7)
- **Brainstorm**: Área para anotações e insights durante o workshop
- **Identificação**: Sistema de identificação por nome e data do workshop
- **Códigos Únicos**: Geração automática de códigos para controle de acesso

### 📊 Dashboard Administrativo
- **Status dos Participantes**: Visualização de quem já enviou votação (usuários dinâmicos)
- **Rankings em Tempo Real**: Top 3 de cada categoria atualizado automaticamente
- **Resultados Detalhados**: Pontuações, médias e contagem de votos
- **Exportação**: PDF, cópia de resultados e download de dados
- **Gestão de Usuários**: Reset de dados e controle de participantes

### 🔄 Dashboard em Tempo Real
- **Atualização Automática**: Rankings atualizados via Firebase RTDB/Firestore
- **Fallback Local**: Funciona offline com localStorage
- **Interface Moderna**: Design responsivo com Tailwind CSS

### 📱 QR Codes
- **Geração Automática**: QR codes individuais para cada participante
- **URLs Dinâmicas**: Apontam para o domínio atual (localhost/Vercel)
- **Impressão**: Suporte a impressão individual e em lote

## 🚀 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+ (ES6 Modules)
- **UI Framework**: Tailwind CSS com design responsivo
- **Ícones**: Font Awesome 6.4.0
- **Backend**: Firebase (Realtime Database + Firestore)
- **Fallback**: localStorage para funcionamento offline
- **QR Codes**: Biblioteca qrcode.js com múltiplos fallbacks
- **Arquitetura**: Módulos ES6 com separação de responsabilidades

## 📁 Estrutura do Projeto

```
sistema-votacao/
├── assets/
│   ├── js/
│   │   ├── services/
│   │   │   └── persistence.js    # Sistema de persistência Firebase + localStorage
│   │   ├── app.js                # Lógica principal da aplicação
│   │   └── ui.js                 # Funções de interface e navegação
├── deploy.html                   # Interface principal (participante + admin) - RECOMENDADO
├── index.html                    # Versão alternativa
├── index_legacy.html             # Versão legada para compatibilidade
├── qrcodes_participantes.html    # Geração e impressão de QR codes
├── realtime.html                 # Dashboard em tempo real
├── package.json
└── README.md
```

## 🎯 Páginas Principais

### 1. Interface de Participante
- **URL**: `deploy.html` (tela de boas-vindas)
- **Funcionalidade**: Identificação, votação de ideias, brainstorm, envio de dados
- **Fluxo**: Nome → Data → Votação → Envio

### 2. Painel Administrativo
- **URL**: `deploy.html` → "Acesso Administrativo"
- **Senha**: `password` (hash SHA-256)
- **Funcionalidade**: Visualização de resultados, exportação, gestão de usuários

### 3. Dashboard em Tempo Real
- **URL**: `realtime.html`
- **Funcionalidade**: Rankings atualizados automaticamente

### 4. QR Codes dos Participantes
- **URL**: `qrcodes_participantes.html`
- **Funcionalidade**: Geração e impressão de QR codes individuais

## 🚀 Como Executar

### Desenvolvimento Local
```bash
# 1. Clone o repositório
git clone https://github.com/brunoadsba/sistema-votacao.git
cd sistema-votacao

# 2. Inicie servidor local (sem dependências necessárias)
python3 -m http.server 5500
# ou
npx http-server -p 5500 -c-1

# 3. Acesse no navegador
# http://localhost:5500/deploy.html
```

### Deploy na Vercel
1. Conecte o repositório GitHub na Vercel
2. Configure como projeto estático
3. Deploy automático a cada push para `main`

## 🔧 Configuração Firebase

O projeto usa Firebase para persistência em tempo real. Configure as variáveis em `assets/js/services/firebase-config.js`:

```javascript
export const FIREBASE_CONFIG = {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com/",
    projectId: "seu-projeto",
    // ... outras configurações
};
```

## 👥 Sistema de Participantes

### 🔄 Usuários Dinâmicos
O sistema agora suporta **usuários dinâmicos** que se identificam através de:
- **Nome completo** do participante
- **Data do workshop** ou evento
- **Código único** gerado automaticamente

### 📋 Participantes Pré-definidos (Legado)
Para compatibilidade, o sistema mantém suporte aos 18 participantes originais:

- `H7K9M2` → André Luiz Carvalho
- `F3L8N1` → Bruna Ferreira Machado
- `R5T2P9` → Caio Roberto Nogueira
- `K8W4D6` → Daniela Marques Teixeira
- `M1B7X5` → Eduardo Pereira da Silva
- `Q9C3Z8` → Fernanda Souza Correia
- `T6Y2V4` → Guilherme Almeida Castro
- `J4S1G9` → Helena Araújo Monteiro
- `A8E5L3` → Isabela Moura Santana
- `P2N6U7` → João Pedro Barbosa
- `W9I4O1` → Karina Oliveira Ramos
- `D5H8K2` → Leandro Martins Farias
- `B3F7R6` → Mariana Costa Ribeiro
- `X1Q4T8` → Nicolas Henrique Duarte
- `C7V2J5` → Patrícia Andrade Lopes
- `N4L9S3` → Renato Figueiredo Campos
- `G6Z8A1` → Sabrina Rocha Pacheco
- `Y2M5E7` → Tiago Moreira Bastos

## 💡 Ideias para Votação

### Ideias Viáveis (7)
1. **Chatbot de Suporte à Saúde Mental**
2. **Detector de EPI com Visão Computacional**
3. **Dashboard Preditivo de Afastamentos**
4. **Reconhecimento de Voz para Relato de Incidentes**
5. **Análise de Sentimentos em Feedbacks**
6. **Assistente Virtual com IA para SST**
7. **Plataforma de Treinamento Gamificado**

### Ideias Disruptivas (7)
1. **Digital Twin de Segurança e Saúde Ocupacional**
2. **IA para Prevenção de Burnout em Tempo Real**
3. **Monitoramento Comportamental com IA e Gamificação**
4. **Anjo Virtual de Primeiros Socorros com IA Multimodal**
5. **IA Ética para Acompanhamento de Inclusão e Diversidade**
6. **Sistema Inteligente de Auditoria de SST via IA**
7. **IA Previsora de Doenças Ocupacionais por Perfil Funcional**

## 🎨 Personalização

### Cores e Estilo
- **Cor Principal**: `#1E40AF`
- **Cor Secundária**: `#FF6B35`
- **Framework**: Tailwind CSS com classes customizadas

### Layout Responsivo
- **Mobile First**: Design otimizado para dispositivos móveis
- **Grid System**: Layout adaptativo com CSS Grid
- **Breakpoints**: sm, md, lg, xl para diferentes tamanhos de tela

## 🔒 Segurança

- **Validação de Códigos**: Acesso restrito por códigos únicos
- **Senha Admin**: Proteção do painel administrativo
- **Fallback Local**: Funcionamento offline sem exposição de dados

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos**: Desktop, tablet, mobile
- **Conectividade**: Online (Firebase) + Offline (localStorage)

## 🆕 Melhorias Recentes

### ✨ Interface e UX
- **Tela de Boas-vindas**: Interface moderna e profissional para identificação
- **Navegação Limpa**: Transições suaves entre telas sem sobreposição
- **Design Responsivo**: Layout otimizado para todos os dispositivos
- **Sistema de Cores**: Paleta profissional com gradientes e hover effects

### 🔧 Funcionalidades
- **Usuários Dinâmicos**: Sistema flexível para qualquer número de participantes
- **Persistência Robusta**: Firebase + localStorage com fallback automático
- **QR Codes Atualizados**: Geração automática para qualquer domínio
- **Admin Dashboard**: Gestão completa de usuários e resultados

### 💻 Código e Arquitetura
- **Módulos ES6**: Estrutura modular e organizada
- **Separação de Responsabilidades**: UI, lógica e persistência separados
- **Logs Profissionais**: Sistema de debug limpo e apropriado
- **Tratamento de Erros**: Gestão robusta de falhas e edge cases

## 🚀 Roadmap

- [ ] Autenticação OAuth (Google, Microsoft)
- [ ] Relatórios avançados com gráficos
- [ ] Notificações push para atualizações
- [ ] API REST para integração externa
- [ ] Sistema de backup automático
- [ ] Múltiplos workshops simultâneos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

**Bruno Almeida** - [GitHub](https://github.com/brunoadsba)

---

## 🆘 Suporte e Contato

### 📚 Documentação
- **README**: Este arquivo contém todas as informações necessárias
- **Issues**: Consulte as issues do repositório para problemas conhecidos
- **Código**: Código limpo e comentado para fácil manutenção

### 💬 Contato
- **Desenvolvedor**: Bruno Almeida
- **GitHub**: [@brunoadsba](https://github.com/brunoadsba)
- **Email**: Disponível através do perfil GitHub

---

**Sistema profissional desenvolvido para avaliação e votação de ideias em workshops corporativos, eventos de inovação e reuniões de brainstorming. Pronto para produção e uso empresarial.**
