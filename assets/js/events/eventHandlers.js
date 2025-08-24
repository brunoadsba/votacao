import { appState } from '../state/appState.js';
import { saveUserVotes, deleteSubmission } from '../services/persistence.js';
import { updateStarDisplay } from '../ui.js';

export function attachDelegatedHandlers() {
	console.log('🔧 Anexando event handlers delegados...');
	
	// Delegação de eventos para estrelas e reset
	document.body.addEventListener('click', async (e) => {
		const target = e.target.closest('[data-action]');
		if (!target) return;
		
		const action = target.getAttribute('data-action');
		const ideaId = target.getAttribute('data-ideaid');
		
		console.log(`🎯 Evento capturado: action=${action}, ideaId=${ideaId}`);
		
		if (!ideaId) return;
		
		if (action === 'rate') {
			const rating = Number(target.getAttribute('data-rating'));
			console.log(`⭐ Rating selecionado: ${rating} para ideia ${ideaId}`);
			appState.updateUserVote(ideaId, rating);
			await saveUserVotes(appState.getCurrentUser(), appState.getUserVotes());
			// Atualizar a interface visual das estrelas
			updateStarDisplay(ideaId, rating);
		}
		
		if (action === 'reset') {
			console.log(`🔄 Reset solicitado para ideia ${ideaId}`);
			appState.resetUserVote(ideaId);
			await saveUserVotes(appState.getCurrentUser(), appState.getUserVotes());
			// Atualizar a interface visual das estrelas
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
	
	console.log('✅ Event handlers delegados anexados com sucesso!');
}

export async function resetParticipant(participantCode) {
	const { participants } = await import('../data/participants.js');
	const participantName = participants[participantCode];
	
	if (!confirm(`Tem certeza que deseja zerar todos os dados de ${participantName}? Esta ação não pode ser desfeita.`)) {
		return;
	}
	
	await deleteSubmission(participantCode);
	// Usar a função global para evitar dependência circular
	window.refreshData();
	alert(`Dados de ${participantName} foram zerados com sucesso!`);
}

// Funções globais para HTML onclick - serão implementadas no módulo principal
export function submitVoting() {
	// Implementação será movida para o módulo principal
	window.submitVoting();
}

export function exportToPDF() {
	window.print();
}

export function copyResults() {
	window.copyResults();
}

export function refreshData() {
	window.refreshData();
}

export function checkAdminPassword() {
	window.checkAdminPassword();
}
