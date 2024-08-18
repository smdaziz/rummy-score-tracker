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
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
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

const registerPlayer = async (player) => {
  try {
    // let playersObj = {};
    // Object.assign(playersObj, players);
    await addDoc(collection(db, "registered_players"), player);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const getRegisteredPlayers = async () => {
  const players = [];
  try {
    const q = query(collection(db, "registered_players"));
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      players.push(doc?.data()?.name);
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    players?.sort((p1, p2) => p1?.id - p2?.id);
    return players;
  }
};

const savePlayers = async (players) => {
  try {
    let playersObj = {};
    Object.assign(playersObj, players);
    await addDoc(collection(db, "players"), playersObj);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const getPlayers = async () => {
  const players = [];
  try {
    const q = query(collection(db, "players"));
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      players.push(doc.data());
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    return players;
  }
};

const saveRoundData = async (roundData) => {
  try {
    roundData['roundNumber'] = Date.now();
    await addDoc(collection(db, "game"), roundData);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const updateRoundData = async (roundData) => {
  try {
    const q = query(collection(db, "game"), where("id", "==", roundData.id));
    const docs = await getDocs(q);
    docs.forEach(async (d) => {
      const docRef = doc(db, "game", d.id);
      await updateDoc(docRef, roundData);
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const deleteRoundData = async (roundId) => {
  try {
    const q = query(collection(db, "game"), where("id", "==", roundId));
    const docs = await getDocs(q);
    docs.forEach(async (d) => {
      const docRef = doc(db, "game", d.id);
      await deleteDoc(docRef);
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const deleteGame = async (docId) => {
  try {
    const gameQuery = query(collection(db, "game_history"), where("id", "==", docId));
    const gameDoc = await getDocs(gameQuery);
    console.log(gameDoc);
    const docRef = doc(db, "game_history", docId);
    console.log(docRef);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const getGameData = async () => {
  const gameData = [];
  try {
    const q = query(collection(db, "game"));
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      gameData.push(doc.data());
    });
    gameData?.sort((round1, round2) => round1?.roundNumber - round2?.roundNumber);
  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    return gameData;
  }
};

const saveGame = async() => {
  try {
    await saveGameHistory();
    const gameQuery = query(collection(db, "game"));
    const gameDocs = await getDocs(gameQuery);
    gameDocs.forEach(async (d) => {
      const docRef = doc(db, "game", d.id);
      await deleteDoc(docRef);
    });
    const playersQuery = query(collection(db, "players"));
    const playerDocs = await getDocs(playersQuery);
    playerDocs.forEach(async (d) => {
      const docRef = doc(db, "players", d.id);
      await deleteDoc(docRef);
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const saveGameHistory = async() => {
  try {
    //get players
    const players = [];

    const playersQuery = query(collection(db, "players"));
    const playerDocs = await getDocs(playersQuery);
    playerDocs.forEach(async (d) => {
      const playersObj = d?.data();
      Object.keys(playersObj)?.forEach(player => {
        players.push(playersObj[player]);
      });
    });

    //player scores
    const playerTotals = {};
    players?.forEach(player => playerTotals[player] = 0);

    //get rounds
    const rounds = [];
    const gameQuery = query(collection(db, "game"));
    const gameDocs = await getDocs(gameQuery);
    gameDocs.forEach(async (d) => {
      const round = d?.data();
      rounds.push(round);
      players?.forEach(player => {
        playerTotals[player] += Number(round[player]);
      });
    });
    rounds?.sort((round1, round2) => round1?.roundNumber - round2?.roundNumber);

    const playerRanking = [];
    players?.forEach(player => {
      playerRanking.push({
        name: player,
        total: playerTotals[player]
      });
    });
    playerRanking?.sort((p1, p2) => p1?.total - p2?.total);

    const gameHistory = {
      utcDateMS: Date.now(),
      rounds,
      players,
      playerRanking,
      winner: playerRanking[0]?.name
    };
    // console.log(JSON.stringify(gameHistory));
    await addDoc(collection(db, "game_history"), gameHistory);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const discardGame = async() => {
  try {
    const gameQuery = query(collection(db, "game"));
    const gameDocs = await getDocs(gameQuery);
    gameDocs.forEach(async (d) => {
      const docRef = doc(db, "game", d.id);
      await deleteDoc(docRef);
    });
    const playersQuery = query(collection(db, "players"));
    const playerDocs = await getDocs(playersQuery);
    playerDocs.forEach(async (d) => {
      const docRef = doc(db, "players", d.id);
      await deleteDoc(docRef);
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const getGameHistoryData = async () => {
  const gameHistoryData = [];
  try {
    const q = query(collection(db, "game_history"));
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      const game = doc.data();
      const gameDate = new Date(game?.utcDateMS);
      gameHistoryData.push({
        docId: doc.id,
        utcDateMS: game?.utcDateMS,
        playerRanking: game?.playerRanking,
        players: game?.players,
        date: (gameDate.getMonth()+1) + "/" + gameDate.getDate() + "/" + gameDate.getFullYear(),
        rounds: game?.rounds?.length,
        roundsData: game?.rounds,
        winner: game?.winner,
        winnerScore: game?.playerRanking?.[0]?.total,
        runner: game?.playerRanking?.[1]?.name,
        runnerScore: game?.playerRanking?.[1]?.total
      });
    });
    gameHistoryData?.sort((game1, game2) => game2?.utcDateMS - game1?.utcDateMS);
  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    return gameHistoryData;
  }
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  registerPlayer,
  getRegisteredPlayers,
  savePlayers,
  getPlayers,
  saveRoundData,
  updateRoundData,
  deleteRoundData,
  getGameData,
  saveGame,
  discardGame,
  deleteGame,
  getGameHistoryData
};
