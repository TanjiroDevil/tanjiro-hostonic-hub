import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDFFx_Q4kjsyaQAh98xUMC5WX99rJZlPek",
  authDomain: "hostonic-a0654.firebaseapp.com",
  projectId: "hostonic-a0654",
  storageBucket: "hostonic-a0654.firebasestorage.app",
  messagingSenderId: "656372788492",
  appId: "1:656372788492:web:5ae8797ff30cb6da7e2d29",
  measurementId: "G-FH8PD5JBBL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
