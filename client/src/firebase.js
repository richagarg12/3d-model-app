import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAuOs66MJDU7JTogKAST7H45wL-9SYXBAM",
  authDomain: "d-model-app-f373e.firebaseapp.com",
  projectId: "d-model-app-f373e",
  storageBucket: "d-model-app-f373e.firebasestorage.app",
  messagingSenderId: "996878315219",
  appId: "1:996878315219:web:531c69750b80abf35d2e26"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);