import { participants } from './data/participants.js?v=4';
import { viableIdeas, disruptiveIdeas } from './data/ideas.js?v=4';
import { saveSubmission, getAllSubmissions, deleteSubmission, loadUserVotes, saveUserVotes } from './services/persistence.js?v=4';
import { showWelcomeScreen, showAdminLogin, setParticipantHeader, renderIdeas as renderIdeasUI, updateStarDisplay, showSubmissionSuccess, renderParticipantsStatus, renderSummary, renderDetailedResults } from './ui.js?v=5';

let currentUser = null;
let isGuest = false;
let userVotes = {};

function createIdeaCard(idea) {
	const currentRating = userVotes[idea.id] || 0;
	return `
		<div class="idea-card bg-white p-6 rounded-lg shadow-sm">
			<div class="flex justify-between items-start mb-4">
				<h3 class="text-lg font-semibold text-gray-800 flex-1">${idea.title}</h3>
				<div class="ml-4">
					<button data-action="reset" data-ideaid="${idea.id}" class="text-gray-400 hover:text-red-500 text-sm">
						<i class="fas fa-undo"></i> Zerar
					</button>
				</div>
			</div>
			<p class="text-gray-600 mb-4">${idea.description}</p>
			<div class="flex items-center justify-between">
				<div class="star-rating" data-idea="${idea.id}">
					${Array.from({ length: 10 }, (_, i) =>
						`<i class="fas fa-star star ${i < currentRating ? 'active' : ''}" data-rating="${i + 1}" data-ideaid="${idea.id}" data-action="rate"></i>`
					).join('')}
				</div>
				<span class="text-sm font-medium text-gray-700">${currentRating}/10</span>
			</div>
		</div>
	`;
}

function renderIdeas() {
	const viableHtml = viableIdeas.map(createIdeaCard).join('');
	const disruptiveHtml = disruptiveIdeas.map(createIdeaCard).join('');
	renderIdeasUI({ viable: viableHtml, disruptive: disruptiveHtml });
}

function attachDelegatedHandlers() {
	// Delegação de eventos para estrelas e reset
	document.body.addEventListener('click', async (e) => {
		const target = e.target.closest('[data-action]');
		if (!target) return;
		const action = target.getAttribute('data-action');
		const ideaId = target.getAttribute('data-ideaid');
		if (!ideaId) return;
		if (action === 'rate') {
			const rating = Number(target.getAttribute('data-rating'));
			userVotes[ideaId] = rating;
			saveUserVotes(currentUser, userVotes);
			updateStarDisplay(ideaId, rating);
		}
		if (action === 'reset') {
			userVotes[ideaId] = 0;
			saveUserVotes(currentUser, userVotes);
			updateStarDisplay(ideaId, 0);
		}
	});

	// Botões específicos
	const submitBtn = document.querySelector('button[onclick="submitVoting()"]');
	if (submitBtn) submitBtn.onclick = submitVoting;
	const exportBtn = document.querySelector('button[onclick="exportToPDF()"]');
	if (exportBtn) exportBtn.onclick = () => window.print();
	const copyBtn = document.querySelector('button[onclick="copyResults()"]');
	if (copyBtn) copyBtn.onclick = copyResults;
	const refreshBtn = document.querySelector('button[onclick="refreshData()"]');
	if (refreshBtn) refreshBtn.onclick = refreshData;
	const loginBtn = document.querySelector('#admin-login button');
	if (loginBtn) loginBtn.onclick = checkAdminPassword;

	// Reset por participante no admin (delegado)
	document.body.addEventListener('click', async (e) => {
		const btn = e.target.closest('button[data-reset-participant]');
		if (!btn) return;
		const code = btn.getAttribute('data-reset-participant');
		await resetParticipant(code);
	});
}

function init() {
	setTimeout(() => {
		document.getElementById('loading').classList.add('hidden');
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
			currentUser = codigo;
			userVotes = loadUserVotes(currentUser);
			setParticipantHeader(participants[codigo]);
			renderIdeas();
			attachDelegatedHandlers();
			return;
		}

		// Fluxo convidado
		isGuest = guest === '1' || guest === 'true';
		
		// Tela de boas-vindas por padrão
		const welcomeScreen = document.getElementById('welcome-screen');
		const loadingScreen = document.getElementById('loading');
		if (welcomeScreen && loadingScreen) {
			loadingScreen.classList.add('hidden');
			welcomeScreen.classList.remove('hidden');
		} else {
			console.error('Elemento welcome-screen não encontrado!');
		}
		attachDelegatedHandlers();
	}, 1000);
}

async function submitVoting() {
	const brainstormNotes = document.getElementById('brainstorm-notes').value;
	const meetingDate = document.getElementById('meeting-date').value;
	const participantName = document.getElementById('participant-name').value;
	
	const submissionData = {
		participant: participantName,
		code: currentUser,
		votes: userVotes,
		brainstorm: brainstormNotes,
		date: meetingDate,
		submittedAt: new Date().toISOString(),
		guest: isGuest || !participants[currentUser]
	};
	
	const result = await saveSubmission(currentUser, submissionData);
	showSubmissionSuccess(result && result.backend ? result.backend : 'localStorage');
}

async function refreshData() {
	updateParticipantsStatus();
	updateResultsSummary();
	updateDetailedResultsView();
}

async function updateParticipantsStatus() {
	const { items } = await getAllSubmissions();
	const submissions = items || {};
	
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
	renderParticipantsStatus(html);
}

function aggregateVotesFromSubmissions(submissions) {
	const allVotes = {};
	Object.entries(submissions).forEach(([code, data]) => {
		if (data && data.votes) allVotes[code] = data.votes;
	});
	return allVotes;
}

function calculateResults(ideas, allVotes) {
	return ideas.map(idea => {
		let totalScore = 0;
		let voteCount = 0;
		Object.values(allVotes).forEach(votes => {
			if (votes[idea.id]) {
				totalScore += votes[idea.id];
				voteCount++;
			}
		});
		return {
			...idea,
			totalScore,
			votes: voteCount,
			average: voteCount > 0 ? totalScore / voteCount : 0
		};
	}).sort((a, b) => b.totalScore - a.totalScore);
}

async function updateResultsSummary() {
	const { items } = await getAllSubmissions();
	const allVotes = aggregateVotesFromSubmissions(items);
	const viableResults = calculateResults(viableIdeas, allVotes);
	const disruptiveResults = calculateResults(disruptiveIdeas, allVotes);
	const topViable = viableResults.slice(0, 3).map((item, index) => `
		<div class="flex items-start p-2 bg-yellow-50 rounded min-h-[50px]">
			<span class="font-bold text-yellow-600 mr-2 flex-shrink-0">${index + 1}º</span>
			<span class="flex-1 text-sm leading-relaxed break-words overflow-hidden" style="text-wrap: balance;">${item.title}</span>
			<span class="font-semibold text-yellow-700 flex-shrink-0 ml-2">${item.totalScore} pts</span>
		</div>
	`).join('');
	const topDisruptive = disruptiveResults.slice(0, 3).map((item, index) => `
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
	` : '';
	renderSummary({ topViableHtml: topViable, topDisruptiveHtml: topDisruptive, championHtml });
}

async function updateDetailedResultsView() {
	const { items } = await getAllSubmissions();
	const allVotes = aggregateVotesFromSubmissions(items);
	const viableResults = calculateResults(viableIdeas, allVotes);
	const disruptiveResults = calculateResults(disruptiveIdeas, allVotes);
	const section = (title, results) => `
		<div>
			<h3 class="text-lg font-semibold mb-4 text-${title.includes('Viáveis') ? 'yellow' : 'purple'}-600">${title}</h3>
			${results.map((item, index) => `
				<div class="border rounded-lg p-4 mb-3">
					<div class="flex justify-between items-start mb-2">
						<h4 class="font-medium text-gray-800 text-sm leading-relaxed break-words overflow-hidden flex-1 mr-3" style="text-wrap: balance;">${index + 1}º - ${item.title}</h4>
						<div class="text-right flex-shrink-0">
							<div class="text-xl font-bold text-blue-600">${item.totalScore} pts</div>
							<div class="text-sm text-gray-500">${item.votes} votos</div>
							<div class="text-sm text-gray-500">Média: ${item.average.toFixed(1)}</div>
						</div>
					</div>
					<div class="text-sm text-gray-600 leading-relaxed">${item.description}</div>
				</div>
			`).join('')}
		</div>
	`;
	const html = `
		<div class="space-y-6">
			${section('Ideias Viáveis - Resultados Completos', viableResults)}
			${section('Ideias Disruptivas - Resultados Completos', disruptiveResults)}
		</div>
	`;
	renderDetailedResults(html);
}

async function copyResults() {
	const { items } = await getAllSubmissions();
	const allVotes = aggregateVotesFromSubmissions(items);
	const viableResults = calculateResults(viableIdeas, allVotes);
	const disruptiveResults = calculateResults(disruptiveIdeas, allVotes);
	const allResults = [...viableResults, ...disruptiveResults].sort((a, b) => b.totalScore - a.totalScore);
	let resultsText = '=== RESULTADOS CONSOLIDADOS - SISTEMA DE AVALIAÇÃO E VOTAÇÃO ===\n\n';
	resultsText += '🏆 CAMPEÃO GERAL:\n';
	if (allResults[0]) resultsText += `${allResults[0].title} - ${allResults[0].totalScore} pontos\n\n`;
	resultsText += '🔥 TOP 3 IDEIAS VIÁVEIS:\n';
	viableResults.slice(0, 3).forEach((item, index) => { resultsText += `${index + 1}º - ${item.title} (${item.totalScore} pts)\n`; });
	resultsText += '\n🚀 TOP 3 IDEIAS DISRUPTIVAS:\n';
	disruptiveResults.slice(0, 3).forEach((item, index) => { resultsText += `${index + 1}º - ${item.title} (${item.totalScore} pts)\n`; });
	resultsText += '\n📊 PARTICIPAÇÃO:\n';
	const submittedCount = Object.keys(items).length;
	resultsText += `${submittedCount} participantes enviaram suas votações\n`;
	navigator.clipboard.writeText(resultsText).then(() => alert('Resultados copiados para a área de transferência!'));
}

async function checkAdminPassword() {
	const password = document.getElementById('admin-password').value;
	if (password === 'Br88080187') {
		// Esconder TODAS as outras telas
		const welcomeScreen = document.getElementById('welcome-screen');
		const adminLogin = document.getElementById('admin-login');
		const participantInterface = document.getElementById('participant-interface');
		
		if (welcomeScreen) welcomeScreen.classList.add('hidden');
		if (adminLogin) adminLogin.classList.add('hidden');
		if (participantInterface) participantInterface.classList.add('hidden');
		
		// Mostrar apenas o dashboard admin
		document.getElementById('admin-dashboard').classList.remove('hidden');
		refreshData();
		return;
	}
	document.getElementById('login-error').classList.remove('hidden');
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
	const participantName = document.getElementById('participant-name-input').value.trim();
	const workshopDate = document.getElementById('workshop-date').value;
	
	if (!participantName) {
		alert('Por favor, insira seu nome completo.');
		return;
	}
	
	if (!workshopDate) {
		alert('Por favor, selecione a data do workshop.');
		return;
	}
	
	// Criar um código único para o participante
	currentUser = 'user_' + Date.now();
	
	// Salvar dados do participante
	userVotes = {};
	
	// Configurar interface - esconder TODAS as outras telas
	const welcomeScreen = document.getElementById('welcome-screen');
	const adminLogin = document.getElementById('admin-login');
	const adminDashboard = document.getElementById('admin-dashboard');
	
	if (welcomeScreen) welcomeScreen.classList.add('hidden');
	if (adminLogin) adminLogin.classList.add('hidden');
	if (adminDashboard) adminDashboard.classList.add('hidden');
	
	// Mostrar apenas a interface de participante
	document.getElementById('participant-interface').classList.remove('hidden');
	
	// Preencher dados
	document.getElementById('participant-name').value = participantName;
	document.getElementById('meeting-date').value = workshopDate;
	
	// Renderizar ideias
	renderIdeas();
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

// Função showAdminLogin removida - já está sendo importada do ui.js

document.addEventListener('DOMContentLoaded', init);


