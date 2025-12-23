import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5nD0udLNpcqe-1lrkDpETWsaBflyVEFk",
  authDomain: "eagerly-a4770.firebaseapp.com",
  projectId: "eagerly-a4770",
  storageBucket: "eagerly-a4770.firebasestorage.app",
  messagingSenderId: "398479337005",
  appId: "1:398479337005:web:931d88cf5181c6bca2baa4",
  measurementId: "G-ZHZ5M9Q2N7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
