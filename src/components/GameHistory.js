/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGameHistoryData } from "../firebase";

const GameHistory = () => {
  const navigate = useNavigate();

  const [gameHistory, setGameHistory] = useState([]);

  useEffect(async () => {
    const gameHistory = await getGameHistoryData();
    setGameHistory(gameHistory);
  }, []);

  return (
    <div>
      <br></br>
      <div>
        <button class="btn btn-success" onClick={() => navigate("/dashboard")}>Dashboard</button>
      </div>
      <br></br>
      <div>
        <button class="btn btn-success" onClick={() => navigate("/gamestats")}>Game Stats</button>
      </div>
      <h1 className="mt-3" style={{color: 'green'}}>Game History</h1>
      {
        gameHistory?.length > 0 &&
        <div>
          <table class="table history-table">
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
                    <td><a href={`/rummy-score-tracker/gamehistory/${game?.utcDateMS}`}>{game?.date}</a></td>
                    <td>{game?.rounds}</td>
                    <td>{game?.winner} <br></br> ({game?.winnerScore})</td>
                    <td>{game?.runner} <br></br> ({game?.runnerScore})</td>
                  </tr>
                )}
              </tbody>
          </table>
        </div>
      }
    </div>
  );
};

export default GameHistory;