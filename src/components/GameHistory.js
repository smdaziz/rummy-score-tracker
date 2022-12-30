import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGameHistoryData } from "../firebase";

import "./NewGame.css";

import WinnerCup from './../assets/winner-cup.png';

const GameHistory = () => {
  const navigate = useNavigate();

  const [gameHistory, setGameHistory] = useState([]);

  const [playerWins, setPlayerWins] = useState([]);

  useEffect(async () => {
    const gameHistory = await getGameHistoryData();
    setGameHistory(gameHistory);
    const playerWinCount = {};
    gameHistory?.forEach(game => {
      let winCount = playerWinCount[game?.winner];
      if(!winCount) {
        playerWinCount[game?.winner] = 1;
      } else {
        playerWinCount[game?.winner] = winCount+1;
      }
    });
    
    const playerWins = [];
    Object?.keys(playerWinCount)?.forEach(player => {
      playerWins.push({playerName: player, wins: playerWinCount[player]});
    });

    playerWins?.sort((p1, p2) => p2?.wins - p1?.wins);

    setPlayerWins(playerWins);
  }, []);

  return (
    <div>
      {
        gameHistory?.length > 0 &&
        <div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Rounds Played</th>
                <th>Winner</th>
                <th>Runner</th>
              </tr>
            </thead>
            <tbody>
                {gameHistory?.map(game => 
                  <tr>
                    <td>{game?.date}</td>
                    <td>{game?.rounds}</td>
                    <td>{game?.winner}</td>
                    <td>{game?.runner}</td>
                  </tr>
                )}
              </tbody>
          </table>
        </div>
      }
      {
        playerWins?.length > 0 && 
        <div>
          <div>{playerWins[0]?.playerName} is All Time Winner <img src={WinnerCup} style={{width: '20px', height: '20px'}}></img></div>
          <table>
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Wins</th>
              </tr>
            </thead>
            <tbody>
                {playerWins?.map(player => 
                  <tr>
                    <td>{player?.playerName}</td>
                    <td>{player?.wins}</td>
                  </tr>
                )}
              </tbody>
          </table>
        </div>
      }
      <button className="dashboard_btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
    </div>
  );
};

export default GameHistory;