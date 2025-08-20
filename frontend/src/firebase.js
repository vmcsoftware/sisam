// Configuração do Firebase para o frontend
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBxLZ_JOlUbAiIUbq-zK015aP2D6av2mLw",
  authDomain: "saem-d58b3.firebaseapp.com",
  projectId: "saem-d58b3",
  storageBucket: "saem-d58b3.firebasestorage.app",
  messagingSenderId: "1070231724858",
  appId: "1:1070231724858:web:de8c28e3bd2a565e11e603"
};

const app = initializeApp(firebaseConfig);

export default app;
