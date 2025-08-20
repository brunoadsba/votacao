# 🏥 Sistema de Votação - 1º Hackathon+ SESI Saúde

Sistema moderno de votação e avaliação de ideias para workshops de inovação em saúde ocupacional, com dashboard em tempo real e interface responsiva.

## ✨ Funcionalidades

### 🗳️ Sistema de Votação
- **Interface de Participante**: Avaliação de ideias com sistema de estrelas (1-10)
- **Categorias**: Ideias Viáveis (7) e Ideias Disruptivas (7)
- **Brainstorm**: Área para anotações e insights durante o workshop
- **Validação**: Códigos únicos de participante para controle de acesso

### 📊 Dashboard Administrativo
- **Status dos Participantes**: Visualização de quem já enviou votação
- **Rankings em Tempo Real**: Top 3 de cada categoria atualizado automaticamente
- **Resultados Detalhados**: Pontuações, médias e contagem de votos
- **Exportação**: PDF, cópia de resultados e download de dados

### 🔄 Dashboard em Tempo Real
- **Atualização Automática**: Rankings atualizados via Firebase RTDB/Firestore
- **Fallback Local**: Funciona offline com localStorage
- **Interface Moderna**: Design responsivo com Tailwind CSS

### 📱 QR Codes
- **Geração Automática**: QR codes individuais para cada participante
- **URLs Dinâmicas**: Apontam para o domínio atual (localhost/Vercel)
- **Impressão**: Suporte a impressão individual e em lote

## 🚀 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **UI Framework**: Tailwind CSS
- **Ícones**: Font Awesome
- **Backend**: Firebase (Realtime Database + Firestore)
- **Fallback**: localStorage para funcionamento offline
- **QR Codes**: Biblioteca qrcode.js com fallbacks

## 📁 Estrutura do Projeto

```
hackathon/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── data/
│   │   │   ├── ideas.js          # Ideias viáveis e disruptivas
│   │   │   └── participants.js   # Lista de participantes
│   │   ├── services/
│   │   │   ├── firebase.js       # Configuração Firebase
│   │   │   └── persistence.js    # Persistência de dados
│   │   ├── app.js                # Lógica principal
│   │   ├── ui.js                 # Funções de interface
│   │   ├── realtime-dashboard.js # Dashboard em tempo real
│   │   └── vendor/
│   │       └── qrcode.min.js     # Biblioteca QR Code local
├── deploy.html                   # Interface principal (participante + admin)
├── index.html                    # Versão backup
├── qrcodes_participantes.html    # Geração de QR codes
├── realtime.html                 # Dashboard em tempo real
├── package.json
└── README.md
```

## 🎯 Páginas Principais

### 1. Interface de Participante
- **URL**: `deploy.html?codigo=H7K9M2`
- **Funcionalidade**: Votação de ideias, brainstorm, envio de dados

### 2. Painel Administrativo
- **URL**: `deploy.html?admin=true`
- **Senha**: `Br88080187`
- **Funcionalidade**: Visualização de resultados, exportação, reset de participantes

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
git clone https://github.com/brunoadsba/votacao.git
cd votacao

# 2. Instale dependências (opcional)
npm install

# 3. Inicie servidor local
python3 -m http.server 5500
# ou
npx http-server -p 5500 -c-1

# 4. Acesse no navegador
# http://localhost:5500/deploy.html?codigo=H7K9M2
```

### Deploy na Vercel
1. Conecte o repositório GitHub na Vercel
2. Configure como projeto estático
3. Deploy automático a cada push para `main`

## 🔧 Configuração Firebase

O projeto usa Firebase para persistência em tempo real. Configure as variáveis em `assets/js/services/firebase.js`:

```javascript
window.FIREBASE_CONFIG = {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com/",
    projectId: "seu-projeto",
    // ... outras configurações
};
```

## 👥 Participantes

O sistema inclui 18 participantes com códigos únicos:

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
- **SESI Blue**: `#1E40AF`
- **SESI Orange**: `#FF6B35`
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

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação acima
2. Consulte as issues do repositório
3. Entre em contato com o desenvolvedor

---

**Desenvolvido com ❤️ para o 1º Hackathon+ SESI Saúde**
