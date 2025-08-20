export function showWelcomeScreen() {
	console.log('showWelcomeScreen chamada');
	const welcomeScreen = document.getElementById('welcome-screen');
	console.log('Elemento welcome-screen encontrado:', welcomeScreen);
	if (welcomeScreen) {
		welcomeScreen.classList.remove('hidden');
		console.log('Classe hidden removida');
	} else {
		console.error('Elemento welcome-screen não encontrado!');
	}
}

export function showAccessDenied() {
	document.getElementById('access-denied').classList.remove('hidden');
}

export function showAdminLogin() {
	document.getElementById('admin-login').classList.remove('hidden');
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
	const stars = document.querySelectorAll(`[data-idea="${ideaId}"] .star`);
	stars.forEach((star, index) => {
		star.classList.toggle('active', index < rating);
	});
	const ratingSpan = document.querySelector(`[data-idea="${ideaId}"]`).parentElement.querySelector('span');
	ratingSpan.textContent = `${rating}/10`;
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
	document.getElementById('participants-status').innerHTML = html;
}

export function renderSummary({ topViableHtml, topDisruptiveHtml, championHtml }) {
	document.getElementById('top-viable').innerHTML = topViableHtml;
	document.getElementById('top-disruptive').innerHTML = topDisruptiveHtml;
	if (championHtml) document.getElementById('overall-champion').innerHTML = championHtml;
}

export function renderDetailedResults(html) {
	document.getElementById('detailed-results').innerHTML = html;
}


