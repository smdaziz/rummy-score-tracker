/*import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// console.log('api key : ', process.env.RUMMY_SCORE_TRACKER_FIREBASE_API_KEY)

// const app = initializeApp({
//     apiKey: process.env.RUMMY_SCORE_TRACKER_FIREBASE_API_KEY,
//     authDomain: process.env.RUMMY_SCORE_TRACKER_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.RUMMY_SCORE_TRACKER_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.RUMMY_SCORE_TRACKER_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.RUMMY_SCORE_TRACKER_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.RUMMY_SCORE_TRACKER_FIREBASE_APP_ID
// })

const app = initializeApp({
  apiKey: "AIzaSyDaSmceFuVUP36mJDmdqccjlxSxacjaVg0",
  authDomain: "rummy-score-tracker.firebaseapp.com",
  projectId: "rummy-score-tracker",
  storageBucket: "rummy-score-tracker.appspot.com",
  messagingSenderId: "420450892849",
  appId: "1:420450892849:web:acdc3c6f8d9c875d116910"
})

export const auth = getAuth(app)
export default app*/


import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyDaSmceFuVUP36mJDmdqccjlxSxacjaVg0",
  authDomain: "rummy-score-tracker.firebaseapp.com",
  projectId: "rummy-score-tracker",
  storageBucket: "rummy-score-tracker.appspot.com",
  messagingSenderId: "420450892849",
  appId: "1:420450892849:web:acdc3c6f8d9c875d116910"
});

const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
