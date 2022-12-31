import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGameHistoryData } from "../firebase";

// import "./NewGame.css";

import WinnerCup from './../assets/winner-cup.png';
import PieChart from "./PieChart";

const GameHistory = () => {
  const navigate = useNavigate();

  const [gameHistory, setGameHistory] = useState([]);

  const [playerWinnerRunner, setPlayerWinnerRunner] = useState([]);

  const [playerRanks, setPlayerRanks] = useState({});

  const [winnerChartData, setWinnerChartData] = useState([]);
  const [runnerChartData, setRunnerChartData] = useState([]);

  useEffect(async () => {
    const gameHistory = await getGameHistoryData();
    setGameHistory(gameHistory);

    const playerWinnerCount = {};
    const playerRunnerCount = {};
    const playerRanks = [];
    gameHistory?.forEach(game => {
      //winner
      let winCount = playerWinnerCount[game?.winner];
      if(!winCount) {
        playerWinnerCount[game?.winner] = 1;
      } else {
        playerWinnerCount[game?.winner] = winCount+1;
      }
      //runner
      let runnerCount = playerRunnerCount[game?.runner];
      if(!runnerCount) {
        playerRunnerCount[game?.runner] = 1;
      } else {
        playerRunnerCount[game?.runner] = runnerCount+1;
      }
      //ranking
      const playerRanking = {};
      game?.playerRanking?.map((player, idx) => playerRanking[idx] = player?.name);
      playerRanks.push(playerRanking);
    });

    const playerWinnerRunner = [];
    const winnerChartData = [];
    const runnerChartData = [];
    Object?.keys(playerWinnerCount)?.forEach(player => {
      playerWinnerRunner.push({playerName: player, winner: playerWinnerCount[player], runner: playerRunnerCount[player]});
      winnerChartData.push({
        label: player,
        value: playerWinnerCount[player]
      });
      runnerChartData.push({
        label: player,
        value: playerRunnerCount[player]
      });
    });

    setWinnerChartData(winnerChartData);
    setRunnerChartData(runnerChartData);

    playerWinnerRunner?.sort((p1, p2) => p2?.winner - p1?.winner);

    setPlayerWinnerRunner(playerWinnerRunner);
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
        playerWinnerRunner?.length > 0 && 
        <div style={{width: '360px'}}>
          <div>{playerWinnerRunner[0]?.playerName} is All Time Winner <img src={WinnerCup} style={{width: '20px', height: '20px'}}></img></div>
          <table>
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Winner</th>
                <th>Runner</th>
              </tr>
            </thead>
            <tbody>
                {playerWinnerRunner?.map(player => 
                  <tr>
                    <td>{player?.playerName}</td>
                    <td>{player?.winner}</td>
                    <td>{player?.runner}</td>
                  </tr>
                )}
              </tbody>
          </table>
          <div style={{marginTop: '50px'}}><b>Winner Chart</b></div>
          <PieChart
            name='winner'
            data={winnerChartData}
            outerRadius={200}
            innerRadius={100}
          />
          <div style={{marginTop: '50px'}}><b>Runner Chart</b></div>
          <PieChart
            name='runner'
            data={runnerChartData}
            outerRadius={200}
            innerRadius={100}
          />
        </div>
      }
      <button className="dashboard_btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
    </div>
  );
};

export default GameHistory;