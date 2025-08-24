// Configurações da aplicação
export const APP_CONFIG = {
	ADMIN_PASSWORD_HASH: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // hash de 'password'
	LOADING_DELAY: 1000,
	COLLECTION_NAME: 'submissions',
	MAX_RATING: 10,
	TOP_RESULTS_COUNT: 3
};

// Mensagens de log
export const LOG_MESSAGES = {
	REFRESH_START: '🔄 Iniciando refreshData...',
	REFRESH_SUCCESS: '🎉 Dashboard atualizado com sucesso!',
	REFRESH_ERROR: '❌ Erro ao atualizar dashboard:',
	PARTICIPANTS_UPDATE: '🔄 Buscando dados dos participantes...',
	PARTICIPANTS_SUCCESS: '✅ Status dos participantes atualizado',
	PARTICIPANTS_ERROR: '❌ Erro ao buscar participantes:',
	RESULTS_UPDATE: '🔄 Atualizando resumo dos resultados...',
	RESULTS_SUCCESS: '✅ Resumo dos resultados atualizado',
	RESULTS_ERROR: '❌ Erro ao gerar resumo:',
	DETAILED_UPDATE: '🔄 Atualizando resultados detalhados...',
	DETAILED_SUCCESS: '✅ Resultados detalhados atualizados',
	DETAILED_ERROR: '❌ Erro ao gerar resultados detalhados:',
	ADMIN_LOGIN_ATTEMPT: '🔐 Tentativa de login admin...',
	ADMIN_LOGIN_SUCCESS: '✅ Senha correta! Exibindo dashboard...',
	ADMIN_LOGIN_ERROR: '❌ Senha incorreta!',
	ADMIN_DASHBOARD_SUCCESS: '🎯 Dashboard admin exibido com sucesso!',
	ADMIN_DASHBOARD_ERROR: '❌ Elemento admin-dashboard não encontrado!'
};

// Classes CSS comuns
export const CSS_CLASSES = {
	HIDDEN: 'hidden',
	LOADING: 'loading',
	WELCOME_SCREEN: 'welcome-screen',
	ADMIN_LOGIN: 'admin-login',
	ADMIN_DASHBOARD: 'admin-dashboard',
	PARTICIPANT_INTERFACE: 'participant-interface',
	PARTICIPANTS_STATUS: 'participants-status',
	TOP_VIABLE: 'top-viable',
	TOP_DISRUPTIVE: 'top-disruptive',
	OVERALL_CHAMPION: 'overall-champion'
};

// Elementos DOM
export const DOM_ELEMENTS = {
	LOADING: 'loading',
	WELCOME_SCREEN: 'welcome-screen',
	ADMIN_LOGIN: 'admin-login',
	ADMIN_DASHBOARD: 'admin-dashboard',
	PARTICIPANT_INTERFACE: 'participant-interface',
	PARTICIPANTS_STATUS: 'participants-status',
	TOP_VIABLE: 'top-viable',
	TOP_DISRUPTIVE: 'top-disruptive',
	OVERALL_CHAMPION: 'overall-champion',
	ADMIN_PASSWORD: 'admin-password',
	LOGIN_ERROR: 'login-error',
	BRAINSTORM_NOTES: 'brainstorm-notes',
	MEETING_DATE: 'meeting-date',
	PARTICIPANT_NAME: 'participant-name',
	PARTICIPANT_NAME_INPUT: 'participant-name-input',
	WORKSHOP_DATE: 'workshop-date',
	VIABLE_IDEAS: 'viable-ideas',
	DISRUPTIVE_IDEAS: 'disruptive-ideas',
	VOTING_ACTIVE: 'voting-active',
	SUBMISSION_SUCCESS: 'submission-success'
};
