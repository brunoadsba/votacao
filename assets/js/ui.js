export function showWelcomeScreen() {
	const welcomeScreen = document.getElementById('welcome-screen');
	if (welcomeScreen) {
		welcomeScreen.classList.remove('hidden');
	} else {
		console.error('Elemento welcome-screen não encontrado!');
	}
}

export function showAccessDenied() {
	document.getElementById('access-denied').classList.remove('hidden');
}

export function showAdminLogin() {
	// Hide ALL other screens
	const welcomeScreen = document.getElementById('welcome-screen');
	const participantInterface = document.getElementById('participant-interface');
	const adminDashboard = document.getElementById('admin-dashboard');
	
	if (welcomeScreen) welcomeScreen.classList.add('hidden');
	if (participantInterface) participantInterface.classList.add('hidden');
	if (adminDashboard) adminDashboard.classList.add('hidden');
	
	// Show only admin login screen
	const adminLogin = document.getElementById('admin-login');
	if (adminLogin) {
		adminLogin.classList.remove('hidden');
	} else {
		console.error('Elemento admin-login não encontrado!');
	}
}

export function setParticipantHeader(name) {
	document.getElementById('participant-interface').classList.remove('hidden');
	document.getElementById('participant-name').value = name;
	const today = new Date();
	document.getElementById('meeting-date').value = today.toISOString().split('T')[0];
}

export function renderIdeas(cardsHtml) {
	document.getElementById('viable-ideas').innerHTML = cardsHtml.viable;
	document.getElementById('disruptive-ideas').innerHTML = cardsHtml.disruptive;
}

export function updateStarDisplay(ideaId, rating) {
	console.log(`🔄 Atualizando estrelas para ideia ${ideaId} com rating ${rating}`);
	
	// Buscar todas as estrelas da ideia específica
	const starContainer = document.querySelector(`[data-idea="${ideaId}"]`);
	if (!starContainer) {
		console.error(`❌ Container de estrelas não encontrado para ideia ${ideaId}`);
		return;
	}
	
	const stars = starContainer.querySelectorAll('.star');
	console.log(`✅ Encontradas ${stars.length} estrelas para ideia ${ideaId}`);
	
	// Atualizar cada estrela
	stars.forEach((star, index) => {
		const shouldBeActive = index < rating;
		star.classList.toggle('active', shouldBeActive);
		console.log(`⭐ Estrela ${index + 1}: ${shouldBeActive ? 'ativa' : 'inativa'}`);
	});
	
	// Atualizar o texto do rating usando seletor mais específico
	const ratingSpan = starContainer.closest('.idea-card').querySelector('.rating-display');
	if (ratingSpan) {
		ratingSpan.textContent = `${rating}/10`;
		console.log(`📝 Rating atualizado para ${rating}/10`);
	} else {
		console.error(`❌ Span de rating não encontrado para ideia ${ideaId}`);
	}
	
	console.log(`✅ Estrelas atualizadas com sucesso para ideia ${ideaId}`);
}

export function showSubmissionSuccess(backendLabel) {
	document.getElementById('voting-active').classList.add('hidden');
	document.getElementById('submission-success').classList.remove('hidden');
	try {
		if (backendLabel) {
			const container = document.querySelector('#submission-success .bg-green-50');
			if (container) {
				const info = document.createElement('p');
				info.className = 'text-xs text-gray-500 mt-2';
				info.textContent = `Armazenado em: ${backendLabel}`;
				container.appendChild(info);
			}
		}
	} catch (_) {
		// não bloquear UI por erro de UI opcional
	}
}

export function renderParticipantsStatus(html) {
	console.log('🎯 renderParticipantsStatus chamada com HTML:', html);
	const element = document.getElementById('participants-status');
	if (element) {
		console.log('✅ Elemento participants-status encontrado, atualizando...');
		element.innerHTML = html;
		console.log('✅ HTML atualizado com sucesso');
	} else {
		console.error('❌ Elemento participants-status não encontrado!');
	}
}

export function renderSummary({ topViableHtml, topDisruptiveHtml, championHtml }) {
	console.log('🎯 renderSummary chamada com:', { topViableHtml, topDisruptiveHtml, championHtml });
	
	const topViableElement = document.getElementById('top-viable');
	const topDisruptiveElement = document.getElementById('top-disruptive');
	const championElement = document.getElementById('overall-champion');
	
	if (topViableElement) {
		console.log('✅ Elemento top-viable encontrado, atualizando...');
		topViableElement.innerHTML = topViableHtml;
	} else {
		console.error('❌ Elemento top-viable não encontrado!');
	}
	
	if (topDisruptiveElement) {
		console.log('✅ Elemento top-disruptive encontrado, atualizando...');
		topDisruptiveElement.innerHTML = topDisruptiveHtml;
	} else {
		console.error('❌ Elemento top-disruptive não encontrado!');
	}
	
	if (championElement && championHtml) {
		console.log('✅ Elemento overall-champion encontrado, atualizando...');
		championElement.innerHTML = championHtml;
	} else if (championHtml) {
		console.error('❌ Elemento overall-champion não encontrado!');
	}
	
	console.log('✅ Resumo renderizado com sucesso');
}

export function renderDetailedResults(html) {
	console.log('🎯 renderDetailedResults chamada com HTML:', html);
	const element = document.getElementById('detailed-results');
	if (element) {
		console.log('✅ Elemento detailed-results encontrado, atualizando...');
		element.innerHTML = html;
		console.log('✅ Resultados detalhados atualizados com sucesso');
	} else {
		console.error('❌ Elemento detailed-results não encontrado!');
	}
}


