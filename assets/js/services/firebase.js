// Inicialização opcional do Firebase. Mantém o app funcionando sem backend.
// Para ativar, crie um objeto global window.FIREBASE_CONFIG ou edite abaixo.

let firebaseApp = null;
let firestoreDb = null;
let realtimeDb = null;

export function initializeFirebaseIfConfigured() {
	try {
		const config = window.FIREBASE_CONFIG || null;
		if (!config) return null;
		// Lazy import dinâmico para não quebrar em ambientes sem Firebase
		return import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js')
			.then(({ initializeApp }) => {
				firebaseApp = initializeApp(config);
				return Promise.all([
					import('https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js').catch(() => null),
					import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js').catch(() => null)
				]);
			})
			.then((modules) => {
				const dbModule = modules[0];
				const fsModule = modules[1];
				if (dbModule && dbModule.getDatabase) {
					realtimeDb = dbModule.getDatabase(firebaseApp);
				}
				if (fsModule && fsModule.getFirestore) {
					firestoreDb = fsModule.getFirestore(firebaseApp);
				}
				return { realtimeDb, firestoreDb };
			})
			.catch(() => null);
	} catch (err) {
		return null;
	}
}

export function getFirestoreDb() {
	return firestoreDb;
}

export function getRealtimeDb() {
	return realtimeDb;
}


