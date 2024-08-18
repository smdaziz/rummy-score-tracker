import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
// import "./Dashboard.css";
import { auth, db, getGameData, logout } from "./../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [isPlayer, setIsPlayer] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      if (data.name === 'player') {
        setIsPlayer(true);
      }
      if (data.name === 'admin') {
        setIsAdmin(true);
      }
      } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const [gameInProgress, setGameInProgress] = useState(false);
  useEffect(async() => {
    if (loading) return;
    if (!user) return navigate("/");
    await fetchUserName();

    const gameData = await getGameData();
    setGameInProgress(gameData?.length > 0);
  }, [user, loading]);
  return (
    <div className="dashboard">
       <div className="dashboard__container">
        Logged in as
         <div>{name}</div>
         <div>{user?.email}</div>
         {
          isPlayer &&
          <div>
            <button class="btn btn-success my-1" onClick={() => navigate("/registerplayer")}>Register Player</button>
          </div>
         }
         {
          isPlayer &&
          <div>
            <button class="btn btn-success my-1" onClick={() => navigate("/newgame")}>
              { gameInProgress ? 'Continue Game' : 'New Game' }
            </button>
          </div>
         }
         {
          (isPlayer || isAdmin) &&
          <div>
            <button class="btn btn-success my-1" onClick={() => navigate("/gamehistory")}>Game History</button>
          </div>
         }
         {
          isPlayer &&
          <div>
            <button class="btn btn-success my-1" onClick={() => navigate("/gamestats")}>Game Stats</button>
          </div>
        }
         <div>
          <button class="btn btn-success my-1" onClick={logout}>Logout</button>
         </div>
       </div>
     </div>
  );
}
export default Dashboard;
