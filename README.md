# Sistema de Avaliação e Votação

Sistema profissional para votação e avaliação de ideias em workshops corporativos, eventos de inovação e reuniões de brainstorming.

## Funcionalidades

- **Sistema de Votação**: Avaliação de ideias com sistema de estrelas (1-10)
- **Dashboard Administrativo**: Visualização de resultados e gestão de participantes
- **Dashboard em Tempo Real**: Rankings atualizados automaticamente
- **QR Codes**: Geração automática para cada participante
- **Usuários Dinâmicos**: Sistema flexível para qualquer número de participantes
- **Persistência Robusta**: Firebase + localStorage com fallback offline

## Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+ (Módulos)
- **UI**: Tailwind CSS responsivo
- **Backend**: Firebase (Realtime Database + Firestore)
- **Arquitetura**: Módulos ES6 com separação de responsabilidades

## Estrutura do Projeto

```
assets/
├── css/styles.css              # Estilos customizados
├── js/
│   ├── components/IdeaCard.js  # Componente de ideias
│   ├── config/constants.js     # Configurações
│   ├── events/eventHandlers.js # Gerenciamento de eventos
│   ├── state/appState.js       # Gerenciamento de estado
│   ├── utils/calculations.js   # Funções utilitárias
│   ├── services/               # Serviços de persistência
│   ├── app.js                  # Lógica principal
│   └── ui.js                   # Interface do usuário
├── deploy.html                 # Interface principal
├── realtime.html               # Dashboard tempo real
└── qrcodes_participantes.html  # Geração de QR codes
```

## Como Executar

### Desenvolvimento Local
```bash
# Clone o repositório
git clone https://github.com/brunoadsba/sistema-votacao.git
cd sistema-votacao

# Inicie servidor local
python3 -m http.server 5500
# ou
npx http-server -p 5500

# Acesse no navegador
http://localhost:5500/deploy.html
```

### Deploy na Vercel
1. Conecte o repositório GitHub na Vercel
2. Configure como projeto estático
3. Deploy automático a cada push

## Configuração Firebase

Configure as variáveis em `assets/js/services/firebase-config.js`:

```javascript
export const FIREBASE_CONFIG = {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com/",
    projectId: "seu-projeto"
};
```

## Uso

### Participante
1. Acesse `deploy.html`
2. Digite nome e data do workshop
3. Avalie ideias clicando nas estrelas (1-10)
4. Adicione notas no brainstorm
5. Envie sua votação

### Administrador
1. Acesse "Acesso Administrativo"
2. Senha: `password`
3. Visualize resultados e gerencie participantes

## Características Técnicas

- **Arquitetura Modular**: Código organizado em módulos especializados
- **Gerenciamento de Estado**: Estado centralizado com AppState
- **Event Handlers**: Delegação de eventos otimizada
- **Responsivo**: Design mobile-first com Tailwind CSS
- **Offline**: Funciona sem conexão usando localStorage

## Licença

MIT License - veja arquivo `LICENSE` para detalhes.

## Desenvolvedor

**Bruno Almeida** - [GitHub](https://github.com/brunoadsba)

---

*Sistema profissional desenvolvido para avaliação e votação de ideias em workshops corporativos. Pronto para produção e uso empresarial.*
