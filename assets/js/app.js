import { participants } from './data/participants.js?v=5';
import { viableIdeas, disruptiveIdeas } from './data/ideas.js?v=5';
import { saveSubmission, getAllSubmissions, loadUserVotes, saveUserVotes, deleteSubmission } from './services/persistence.js?v=5';
import { showWelcomeScreen, showAdminLogin, setParticipantHeader, renderIdeas as renderIdeasUI, updateStarDisplay, showSubmissionSuccess, renderParticipantsStatus, renderSummary, renderDetailedResults } from './ui.js?v=6';
import { createIdeaCard } from './components/IdeaCard.js';
import { aggregateVotesFromSubmissions, calculateResults, generateResultsText } from './utils/calculations.js';
import { appState } from './state/appState.js';
import { attachDelegatedHandlers } from './events/eventHandlers.js';
import { APP_CONFIG, LOG_MESSAGES, CSS_CLASSES, DOM_ELEMENTS } from './config/constants.js';

function renderIdeas() {
	const userVotes = appState.getUserVotes();
	const viableHtml = viableIdeas.map(idea => createIdeaCard(idea, userVotes[idea.id] || 0)).join('');
	const disruptiveHtml = disruptiveIdeas.map(idea => createIdeaCard(idea, userVotes[idea.id] || 0)).join('');
	renderIdeasUI({ viable: viableHtml, disruptive: disruptiveHtml });
}

function init() {
	setTimeout(() => {
		document.getElementById(DOM_ELEMENTS.LOADING).classList.add(CSS_CLASSES.HIDDEN);
		const urlParams = new URLSearchParams(window.location.search);
		const admin = urlParams.get('admin');
		const codigo = urlParams.get('codigo');
		const guest = urlParams.get('guest');
		
		// Fluxo admin direto
		if (admin === 'true') {
			showAdminLogin();
			attachDelegatedHandlers();
			return;
		}

		// Fluxo com código pré-definido
		if (codigo && participants[codigo]) {
			appState.setCurrentUser(codigo);
			const votes = loadUserVotes(codigo);
			appState.setUserVotes(votes);
			setParticipantHeader(participants[codigo]);
			renderIdeas();
			attachDelegatedHandlers();
			return;
		}

		// Fluxo convidado
		const isGuest = guest === '1' || guest === 'true';
		appState.setGuestStatus(isGuest);
		
		// Tela de boas-vindas por padrão
		const welcomeScreen = document.getElementById(DOM_ELEMENTS.WELCOME_SCREEN);
		const loadingScreen = document.getElementById(DOM_ELEMENTS.LOADING);
		if (welcomeScreen && loadingScreen) {
			loadingScreen.classList.add(CSS_CLASSES.HIDDEN);
			welcomeScreen.classList.remove(CSS_CLASSES.HIDDEN);
		} else {
			console.error('Elemento welcome-screen não encontrado!');
		}
		attachDelegatedHandlers();
	}, APP_CONFIG.LOADING_DELAY);
}

async function submitVoting() {
	const brainstormNotes = document.getElementById(DOM_ELEMENTS.BRAINSTORM_NOTES).value;
	const meetingDate = document.getElementById(DOM_ELEMENTS.MEETING_DATE).value;
	const participantName = document.getElementById(DOM_ELEMENTS.PARTICIPANT_NAME).value;
	
	const submissionData = {
		participant: participantName,
		code: appState.getCurrentUser(),
		votes: appState.getUserVotes(),
		brainstorm: brainstormNotes,
		date: meetingDate,
		submittedAt: new Date().toISOString(),
		guest: appState.getGuestStatus() || !participants[appState.getCurrentUser()]
	};
	
	const result = await saveSubmission(appState.getCurrentUser(), submissionData);
	showSubmissionSuccess(result && result.backend ? result.backend : 'localStorage');
}

async function refreshData() {
	console.log(LOG_MESSAGES.REFRESH_START);
	try {
		await updateParticipantsStatus();
		console.log(LOG_MESSAGES.PARTICIPANTS_SUCCESS);
		
		await updateResultsSummary();
		console.log(LOG_MESSAGES.RESULTS_SUCCESS);
		
		await updateDetailedResultsView();
		console.log(LOG_MESSAGES.DETAILED_SUCCESS);
		
		console.log(LOG_MESSAGES.REFRESH_SUCCESS);
	} catch (error) {
		console.error(LOG_MESSAGES.REFRESH_ERROR, error);
	}
}

async function updateParticipantsStatus() {
	console.log(LOG_MESSAGES.PARTICIPANTS_UPDATE);
	try {
		const { items, backend } = await getAllSubmissions([]);
		console.log('📊 Dados recebidos:', { backend, count: Object.keys(items || {}).length });
		console.log('📋 Dados brutos:', items);
		
		const submissions = items || {};
		
		if (Object.keys(submissions).length === 0) {
			console.log('⚠️ Nenhum participante encontrado');
			const html = '<p class="text-gray-500 text-center p-4">Nenhum participante encontrado</p>';
			console.log('📝 HTML para renderizar:', html);
			renderParticipantsStatus(html);
			return;
		}
		
		const html = Object.entries(submissions).map(([code, data]) => {
			const submitted = Boolean(data);
			const status = submitted ? 'Enviado' : 'Pendente';
			const statusColor = submitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
			const icon = submitted ? 'fa-check-circle text-green-500' : 'fa-clock text-yellow-500';
			const participantName = data ? data.participant : 'Participante';
			
			return `
				<div class="p-3 border rounded-lg">
					<div class="flex items-center justify-between mb-2">
						<div class="flex items-center">
							<i class="fas ${icon} mr-2"></i>
							<span class="font-medium text-sm">${participantName}</span>
						</div>
						<button data-reset-participant="${code}" class="text-red-500 hover:text-red-700 text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-50 transition-colors" title="Zerar dados deste participante">
							<i class="fas fa-trash"></i> Reset
						</button>
					</div>
					<div class="mt-1">
						<span class="px-2 py-1 rounded-full text-xs ${statusColor}">${status}</span>
					</div>
				</div>
			`;
		}).join('');
		
		console.log('✅ HTML dos participantes gerado:', html.length, 'caracteres');
		console.log('📝 HTML para renderizar:', html);
		renderParticipantsStatus(html);
	} catch (error) {
		console.error(LOG_MESSAGES.PARTICIPANTS_ERROR, error);
		const errorHtml = '<p class="text-red-500 text-center p-4">Erro ao carregar dados</p>';
		console.log('📝 HTML de erro para renderizar:', errorHtml);
		renderParticipantsStatus(errorHtml);
	}
}

async function updateResultsSummary() {
	console.log(LOG_MESSAGES.RESULTS_UPDATE);
	try {
		const { items, backend } = await getAllSubmissions([]);
		console.log('📊 Dados para resumo:', { backend, count: Object.keys(items || {}).length });
		
		const allVotes = aggregateVotesFromSubmissions(items);
		const viableResults = calculateResults(viableIdeas, allVotes);
		const disruptiveResults = calculateResults(disruptiveIdeas, allVotes);
		
		const topViable = viableResults.slice(0, APP_CONFIG.TOP_RESULTS_COUNT).map((item, index) => `
			<div class="flex items-start p-2 bg-yellow-50 rounded min-h-[50px]">
				<span class="font-bold text-yellow-600 mr-2 flex-shrink-0">${index + 1}º</span>
				<span class="flex-1 text-sm leading-relaxed break-words overflow-hidden" style="text-wrap: balance;">${item.title}</span>
				<span class="font-semibold text-yellow-700 flex-shrink-0 ml-2">${item.totalScore} pts</span>
			</div>
		`).join('');
		
		const topDisruptive = disruptiveResults.slice(0, APP_CONFIG.TOP_RESULTS_COUNT).map((item, index) => `
			<div class="flex items-start p-2 bg-purple-50 rounded min-h-[50px]">
				<span class="font-bold text-purple-600 mr-2 flex-shrink-0">${index + 1}º</span>
				<span class="flex-1 text-sm leading-relaxed break-words overflow-hidden" style="text-wrap: balance;">${item.title}</span>
				<span class="font-semibold text-purple-700 flex-shrink-0 ml-2">${item.totalScore} pts</span>
			</div>
		`).join('');
		
		const allResults = [...viableResults, ...disruptiveResults].sort((a, b) => b.totalScore - a.totalScore);
		const champion = allResults[0];
		
		const championHtml = champion ? `
			<h3 class="text-xl font-bold text-yellow-700 mb-2">🏆 CAMPEÃO GERAL</h3>
			<p class="text-lg font-semibold">${champion.title}</p>
			<p class="text-2xl font-bold text-yellow-600">${champion.totalScore} pontos</p>
		` : '<p class="text-gray-500">Nenhuma votação ainda</p>';
		
		console.log('✅ Resumo gerado com sucesso');
		renderSummary({ topViableHtml: topViable, topDisruptiveHtml: topDisruptive, championHtml });
	} catch (error) {
		console.error(LOG_MESSAGES.RESULTS_ERROR, error);
		renderSummary({ 
			topViableHtml: '<p class="text-red-500">Erro ao carregar</p>', 
			topDisruptiveHtml: '<p class="text-red-500">Erro ao carregar</p>', 
			championHtml: '<p class="text-red-500">Erro ao carregar</p>' 
		});
	}
}

async function updateDetailedResultsView() {
	console.log(LOG_MESSAGES.DETAILED_UPDATE);
	try {
		const { items, backend } = await getAllSubmissions([]);
		console.log('📊 Dados para detalhes:', { backend, count: Object.keys(items || {}).length });
		
		const allVotes = aggregateVotesFromSubmissions(items);
		const viableResults = calculateResults(viableIdeas, allVotes);
		const disruptiveResults = calculateResults(disruptiveIdeas, allVotes);
		
		if (Object.keys(allVotes).length === 0) {
			console.log('⚠️ Nenhuma votação encontrada');
			renderDetailedResults('<p class="text-gray-500 text-center p-8">Nenhuma votação registrada ainda</p>');
			return;
		}
		
		const allResults = [...viableResults, ...disruptiveResults].sort((a, b) => b.totalScore - a.totalScore);
		
		const html = allResults.map((item, index) => `
			<div class="border-b border-gray-200 py-4 ${index === 0 ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''}">
				<div class="flex items-center justify-between">
					<div class="flex-1">
						<div class="flex items-center mb-2">
							${index === 0 ? '<span class="text-yellow-600 text-lg mr-2">🏆</span>' : ''}
							<h3 class="text-lg font-semibold ${index === 0 ? 'text-yellow-800' : 'text-gray-800'}">${item.title}</h3>
						</div>
						<p class="text-gray-600 text-sm mb-2">${item.description}</p>
						<div class="flex items-center space-x-4 text-sm">
							<span class="text-blue-600"><i class="fas fa-star mr-1"></i>${item.average.toFixed(1)} média</span>
							<span class="text-green-600"><i class="fas fa-users mr-1"></i>${item.votes} votos</span>
							<span class="text-purple-600"><i class="fas fa-trophy mr-1"></i>${item.totalScore} pontos</span>
						</div>
					</div>
				</div>
			</div>
		`).join('');
		
		console.log('✅ Resultados detalhados gerados com sucesso');
		renderDetailedResults(html);
	} catch (error) {
		console.error(LOG_MESSAGES.DETAILED_ERROR, error);
		renderDetailedResults('<p class="text-red-500 text-center p-8">Erro ao carregar resultados</p>');
	}
}

async function copyResults() {
	const { items } = await getAllSubmissions();
	const allVotes = aggregateVotesFromSubmissions(items);
	const viableResults = calculateResults(viableIdeas, allVotes);
	const disruptiveResults = calculateResults(disruptiveIdeas, allVotes);
	const allResults = [...viableResults, ...disruptiveResults].sort((a, b) => b.totalScore - a.totalScore);
	
	const resultsText = generateResultsText(viableResults, disruptiveResults, allResults, items);
	navigator.clipboard.writeText(resultsText).then(() => alert('Resultados copiados para a área de transferência!'));
}

async function checkAdminPassword() {
	const password = document.getElementById(DOM_ELEMENTS.ADMIN_PASSWORD).value;
	console.log(LOG_MESSAGES.ADMIN_LOGIN_ATTEMPT);
	
	// Hash simples da senha para não expor em texto plano
	// Em produção, usar Firebase Auth ou sistema de autenticação adequado
	const hashedPassword = await hashPassword(password);
	
	if (hashedPassword === APP_CONFIG.ADMIN_PASSWORD_HASH) {
		console.log(LOG_MESSAGES.ADMIN_LOGIN_SUCCESS);
		
		// Esconder TODAS as outras telas
		const welcomeScreen = document.getElementById(DOM_ELEMENTS.WELCOME_SCREEN);
		const adminLogin = document.getElementById(DOM_ELEMENTS.ADMIN_LOGIN);
		const participantInterface = document.getElementById(DOM_ELEMENTS.PARTICIPANT_INTERFACE);
		
		if (welcomeScreen) welcomeScreen.classList.add(CSS_CLASSES.HIDDEN);
		if (adminLogin) adminLogin.classList.add(CSS_CLASSES.HIDDEN);
		if (participantInterface) participantInterface.classList.add(CSS_CLASSES.HIDDEN);
		
		// Mostrar apenas o dashboard admin
		const adminDashboard = document.getElementById(DOM_ELEMENTS.ADMIN_DASHBOARD);
		if (adminDashboard) {
			adminDashboard.classList.remove(CSS_CLASSES.HIDDEN);
			console.log(LOG_MESSAGES.ADMIN_DASHBOARD_SUCCESS);
		} else {
			console.error(LOG_MESSAGES.ADMIN_DASHBOARD_ERROR);
		}
		
		await refreshData();
		return;
	}
	
	console.log(LOG_MESSAGES.ADMIN_LOGIN_ERROR);
	document.getElementById(DOM_ELEMENTS.LOGIN_ERROR).classList.remove(CSS_CLASSES.HIDDEN);
}

// Função para hash da senha (SHA-256)
async function hashPassword(password) {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

async function resetParticipant(participantCode) {
	const participantName = participants[participantCode];
	if (!confirm(`Tem certeza que deseja zerar todos os dados de ${participantName}? Esta ação não pode ser desfeita.`)) return;
	await deleteSubmission(participantCode);
	await refreshData();
	alert(`Dados de ${participantName} foram zerados com sucesso!`);
}

// Funções para a nova interface de boas-vindas
function startVoting() {
	const participantName = document.getElementById(DOM_ELEMENTS.PARTICIPANT_NAME_INPUT).value.trim();
	const workshopDate = document.getElementById(DOM_ELEMENTS.WORKSHOP_DATE).value;
	
	if (!participantName) {
		alert('Por favor, insira seu nome completo.');
		return;
	}
	
	if (!workshopDate) {
		alert('Por favor, selecione a data do workshop.');
		return;
	}
	
	// Criar um código único para o participante
	const userCode = 'user_' + Date.now();
	appState.setCurrentUser(userCode);
	appState.setUserVotes({});
	
	// Configurar interface - esconder TODAS as outras telas
	const welcomeScreen = document.getElementById(DOM_ELEMENTS.WELCOME_SCREEN);
	const adminLogin = document.getElementById(DOM_ELEMENTS.ADMIN_LOGIN);
	const adminDashboard = document.getElementById(DOM_ELEMENTS.ADMIN_DASHBOARD);
	
	if (welcomeScreen) welcomeScreen.classList.add(CSS_CLASSES.HIDDEN);
	if (adminLogin) adminLogin.classList.add(CSS_CLASSES.HIDDEN);
	if (adminDashboard) adminDashboard.classList.add(CSS_CLASSES.HIDDEN);
	
	// Mostrar apenas a interface de participante
	document.getElementById(DOM_ELEMENTS.PARTICIPANT_INTERFACE).classList.remove(CSS_CLASSES.HIDDEN);
	
	// Preencher dados
	document.getElementById(DOM_ELEMENTS.PARTICIPANT_NAME).value = participantName;
	document.getElementById(DOM_ELEMENTS.MEETING_DATE).value = workshopDate;
	
	// Renderizar ideias
	renderIdeas();
	
	// Anexar event handlers após renderizar as ideias
	attachDelegatedHandlers();
}

// Função para exportar PDF (simples - usa print do navegador)
function exportToPDF() {
	window.print();
}

// Tornar funções acessíveis globalmente para HTML onclick
window.startVoting = startVoting;
window.showAdminLogin = showAdminLogin;
window.checkAdminPassword = checkAdminPassword;
window.submitVoting = submitVoting;
window.exportToPDF = exportToPDF;
window.copyResults = copyResults;
window.refreshData = refreshData;
window.resetParticipant = resetParticipant;

// Função de debug para testar o sistema de estrelas
window.debugStars = function() {
	console.log('🔍 Debug do sistema de estrelas:');
	console.log('📊 Estado atual:', appState);
	console.log('🎯 Estrelas encontradas:', document.querySelectorAll('.star').length);
	console.log('🎯 Containers de ideias:', document.querySelectorAll('[data-idea]').length);
	console.log('🎯 Event handlers anexados:', true);
};

// Função showAdminLogin removida - já está sendo importada do ui.js

document.addEventListener('DOMContentLoaded', init);


