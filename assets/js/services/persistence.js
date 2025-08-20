import { initializeFirebaseIfConfigured, getFirestoreDb, getRealtimeDb } from './firebase.js';

// Coleção principal no Firestore
const COLLECTION_NAME = 'submissions';

async function ensureBackend() {
	if (!getFirestoreDb()) {
		await initializeFirebaseIfConfigured();
	}
	return { rtdb: getRealtimeDb(), fs: getFirestoreDb() };
}

export async function saveSubmission(code, data) {
	// Sempre persistir localmente para experiência offline
	localStorage.setItem(`submission_${code}`, JSON.stringify(data));

	console.log('[DEBUG] Iniciando saveSubmission para código:', code);
	const { rtdb, fs } = await ensureBackend();
	console.log('[DEBUG] Backend disponível - RTDB:', !!rtdb, 'Firestore:', !!fs);
	
	if (rtdb) {
		console.log('[DEBUG] Tentando salvar no RTDB...');
		const { ref, set, update, get, child } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js');
		try {
			await update(ref(rtdb, `${COLLECTION_NAME}/${code}`), data).catch(async () => {
				console.log('[DEBUG] Update falhou, tentando set...');
				await set(ref(rtdb, `${COLLECTION_NAME}/${code}`), data);
			});
			console.log('[DEBUG] Gravação no RTDB concluída');
		} catch (error) {
			console.error('[DEBUG] Erro ao gravar no RTDB:', error);
			throw error;
		}
		// Verificação de persistência
		try {
			const snap = await get(child(ref(rtdb), `${COLLECTION_NAME}/${code}`));
			if (snap && snap.exists()) {
				console.log('[DEBUG] Verificação: dados gravados com sucesso no RTDB');
				return { backend: 'realtime' };
			} else {
				console.log('[DEBUG] Verificação: dados não encontrados no RTDB após gravação');
			}
		} catch (error) {
			console.error('[DEBUG] Erro na verificação RTDB:', error);
		}
	}
	
	if (fs) {
		console.log('[DEBUG] Tentando salvar no Firestore...');
		const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');
		await setDoc(doc(fs, COLLECTION_NAME, code), data, { merge: true });
		console.log('[DEBUG] Gravação no Firestore concluída');
		return { backend: 'firestore' };
	}
	
	console.log('[DEBUG] Nenhum backend disponível, usando localStorage');
	return { backend: 'localStorage' };
}

export async function deleteSubmission(code) {
	localStorage.removeItem(`submission_${code}`);
	localStorage.removeItem(`votes_${code}`);

	const { rtdb, fs } = await ensureBackend();
	if (rtdb) {
		const { ref, remove } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js');
		await remove(ref(rtdb, `${COLLECTION_NAME}/${code}`));
		return { backend: 'realtime' };
	}
	if (fs) {
		const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');
		await deleteDoc(doc(fs, COLLECTION_NAME, code));
		return { backend: 'firestore' };
	}
	return { backend: 'localStorage' };
}

export async function getAllSubmissions(codes) {
	const { rtdb, fs } = await ensureBackend();
	if (!rtdb && !fs) {
		// Fallback: ler do localStorage
		const items = {};
		codes.forEach(code => {
			const raw = localStorage.getItem(`submission_${code}`);
			if (raw) items[code] = JSON.parse(raw);
		});
		return { backend: 'localStorage', items };
	}

	if (rtdb) {
		const { ref, get, child } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js');
		const snap = await get(child(ref(rtdb), COLLECTION_NAME));
		const data = snap.exists() ? snap.val() : {};
		return { backend: 'realtime', items: data || {} };
	}

	const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');
	const colRef = collection(fs, COLLECTION_NAME);
	const snap = await getDocs(colRef);
	const items = {};
	snap.forEach(docSnap => { items[docSnap.id] = docSnap.data(); });
	return { backend: 'firestore', items };
}

export function loadUserVotes(code) {
	const saved = localStorage.getItem(`votes_${code}`);
	return saved ? JSON.parse(saved) : {};
}

export function saveUserVotes(code, votes) {
	localStorage.setItem(`votes_${code}`, JSON.stringify(votes));
}

// Assinatura em tempo real das submissões.
// Retorna uma função de unsubscribe.
export async function subscribeSubmissions(onUpdate) {
    const { rtdb, fs } = await ensureBackend();
    if (rtdb) {
        const { ref, onValue } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js');
        const submissionsRef = ref(rtdb, COLLECTION_NAME);
        const unsubscribe = onValue(submissionsRef, (snap) => {
            const data = snap && snap.exists() ? snap.val() : {};
            onUpdate(data || {});
        });
        return () => { try { if (typeof unsubscribe === 'function') unsubscribe(); } catch (_) {} };
    }
    if (fs) {
        const { collection, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');
        const colRef = collection(fs, COLLECTION_NAME);
        const unsubscribe = onSnapshot(colRef, (snap) => {
            const items = {};
            snap.forEach((docSnap) => { items[docSnap.id] = docSnap.data(); });
            onUpdate(items);
        });
        return () => { try { unsubscribe(); } catch (_) {} };
    }
    // Fallback: polling do localStorage quando não há backend
    const intervalId = setInterval(() => {
        const items = {};
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('submission_')) {
                const code = key.replace('submission_', '');
                try { items[code] = JSON.parse(localStorage.getItem(key)); } catch (_) {}
            }
        });
        onUpdate(items);
    }, 1000);
    return () => clearInterval(intervalId);
}


