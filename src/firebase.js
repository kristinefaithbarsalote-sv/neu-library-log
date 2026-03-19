import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTxqPy9i9Q5EaSfZj4eZUlvVORCg8tsD8",
  authDomain: "im-project-7b2a1.firebaseapp.com",
  databaseURL: "https://im-project-7b2a1-default-rtdb.firebaseio.com",
  projectId: "im-project-7b2a1",
  storageBucket: "im-project-7b2a1.firebasestorage.app",
  messagingSenderId: "702684482522",
  appId: "1:702684482522:web:a17f6519d6a9884d748ee3",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };