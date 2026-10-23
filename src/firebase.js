
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/web-extension";

const firebaseConfig = {
  apiKey: "AIzaSyAcwNhDFq8JKy_Gsb0L87MqhjpXFBRlm0w",
  authDomain: "seege-82ab8.firebaseapp.com",
  projectId: "seege-82ab8",
  storageBucket: "seege-82ab8.firebasestorage.app",
  messagingSenderId: "529964064972",
  appId: "1:529964064972:web:59d1028d844538923b2269"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
