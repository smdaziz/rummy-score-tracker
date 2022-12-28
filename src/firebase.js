import { initializeApp } from 'firebase/app'
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
export default app
