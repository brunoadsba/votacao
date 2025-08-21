// Configuração centralizada do Firebase
// Este arquivo centraliza todas as configurações do Firebase para evitar duplicação
export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCbH6vvO75BNUik6d-2xFmszXvXbC9zLbo",
    authDomain: "hackathon-sesi.firebaseapp.com",
    databaseURL: "https://hackathon-sesi-default-rtdb.firebaseio.com/",
    projectId: "hackathon-sesi",
    storageBucket: "hackathon-sesi.firebasestorage.app",
    messagingSenderId: "124533455216",
    appId: "1:124533455216:web:21397ca5efbfb95235f7b5"
};

// Função para configurar Firebase globalmente (para compatibilidade)
export function setupFirebaseConfig() {
    if (typeof window !== 'undefined') {
        window.FIREBASE_CONFIG = FIREBASE_CONFIG;
        console.log('✅ FIREBASE_CONFIG configurado globalmente');
    }
}
