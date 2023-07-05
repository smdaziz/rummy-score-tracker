/* eslint-disable react-hooks/exhaustive-deps */
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

  const [gameWins, setGameWins] = useState([]);
  const [playersParticipated, setPlayersParticipated] = useState([]);
  const [playerGameCombo, setPlayerGameCombo] = useState({});

  const [winnerChartData, setWinnerChartData] = useState([]);
  const [runnerChartData, setRunnerChartData] = useState([]);
  const [outChartData, setOutChartData] = useState([]);

  useEffect(async () => {
    const gameHistory = await getGameHistoryData();
    setGameHistory(gameHistory);

    const playerWinnerCount = {};
    const playerRunnerCount = {};
    const playerOutCount = {};
    const playerGameCount = {};
    const gameWinsCount = {};
    const playerGameCombo = {};
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
      //out
      const out = game?.playerRanking?.[game?.playerRanking?.length - 1]?.name;
      let outCount = playerOutCount[out];
      if(!outCount) {
        playerOutCount[out] = 1;
      } else {
        playerOutCount[out] = outCount+1;
      }
      //player game count
      game?.playerRanking?.forEach(player => {
        let gameCount = playerGameCount[player?.name];
        if(!gameCount) {
          playerGameCount[player?.name] = 1;
        } else {
          playerGameCount[player?.name] = gameCount+1;
        }
      });
      //ranking
      const gameWin = [];
      game?.playerRanking?.map((player, idx) => gameWin.push(player?.name));
      let gameWinCount = gameWinsCount[gameWin];
      if(!gameWinCount) {
        gameWinsCount[gameWin] = 1;
      } else {
        gameWinsCount[gameWin] = gameWinCount+1;
      }
      //player game combo
      const playerGameComboKey = game?.playerRanking?.map(player => player?.name)?.sort()?.join(',');
      let playerGameComboCount = playerGameCombo[playerGameComboKey];
      if(!playerGameComboCount) {
        playerGameCombo[playerGameComboKey] = {games: [game]};
      } else {
        playerGameCombo[playerGameComboKey]?.games?.push(game);
      }
      Object.keys(gameWinsCount).forEach(gameWin => {
        const gameWinPlayers = gameWin?.split(',');
        const gameWinPlayersSorted = gameWinPlayers?.sort();
        const gameWinPlayersSortedKey = gameWinPlayersSorted?.join(',');
        let gameWinsCountTemp = playerGameCombo[gameWinPlayersSortedKey]?.gameWinsCount?.gameWin;
        if(!gameWinsCountTemp) {
          if(!playerGameCombo[gameWinPlayersSortedKey]?.gameWinsCount) {
            playerGameCombo[gameWinPlayersSortedKey]['gameWinsCount'] = {};
          }
        }
        playerGameCombo[gameWinPlayersSortedKey].gameWinsCount[gameWin] = gameWinsCount[gameWin];
        // Convert object to array of key-value pairs
        const gameWinsCountEntries = Object.entries(playerGameCombo[gameWinPlayersSortedKey].gameWinsCount);
        // Sort the array based on values
        gameWinsCountEntries?.sort((g1, g2) => g2?.[1] - g1?.[1]);
        // Convert sorted array back to object
        const sortedGameWinsCount = gameWinsCountEntries?.reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        // Assign the sorted object back to the original structure
        playerGameCombo[gameWinPlayersSortedKey].gameWinsCount = sortedGameWinsCount;
      });
    });
    //player winner runner out counts by game combo - start
    Object.keys(playerGameCombo)?.forEach(playerGameComboKey => {
      const playerGameComboObj = playerGameCombo[playerGameComboKey];
      const playerWinnerCount = {};
      const playerRunnerCount = {};
      const playerOutCount = {};
      const playerGameCount = {};
      const playerWinnerRunner = [];
      playerGameComboObj?.games?.forEach(game => {
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
        //out
        const out = game?.playerRanking?.[game?.playerRanking?.length - 1]?.name;
        let outCount = playerOutCount[out];
        if(!outCount) {
          playerOutCount[out] = 1;
        } else {
          playerOutCount[out] = outCount+1;
        }
        //player game count
        game?.playerRanking?.forEach(player => {
          let gameCount = playerGameCount[player?.name];
          if(!gameCount) {
            playerGameCount[player?.name] = 1;
          } else {
            playerGameCount[player?.name] = gameCount+1;
          }
        });
      });
      playerGameCombo[playerGameComboKey].playerWinnerCount = playerWinnerCount;
      playerGameCombo[playerGameComboKey].playerRunnerCount = playerRunnerCount;
      playerGameCombo[playerGameComboKey].playerOutCount = playerOutCount;
      playerGameCombo[playerGameComboKey].playerGameCount = playerGameCount;
      playerGameCombo[playerGameComboKey].playerWinnerRunner = [];
      playerGameCombo[playerGameComboKey].winnerChartData = [];
      playerGameCombo[playerGameComboKey].runnerChartData = [];
      playerGameCombo[playerGameComboKey].outChartData = [];
      playerGameComboKey?.split(',')?.forEach(player => {
        playerGameCombo[playerGameComboKey].playerWinnerRunner.push({
          playerName: player,
          winner: playerWinnerCount[player],
          runner: playerRunnerCount[player],
          out: playerOutCount[player],
          gamesPlayed: playerGameCount[player],
          winPercentage: playerWinnerCount[player] ? Math.round((playerWinnerCount[player] / playerGameCount[player]) * 100) : 0,
          runnerPercentage: playerRunnerCount[player] ? Math.round((playerRunnerCount[player] / playerGameCount[player]) * 100) : 0,
          outPercentage: playerOutCount[player] ? Math.round((playerOutCount[player] / playerGameCount[player]) * 100) : 0
        });
        playerGameCombo[playerGameComboKey].winnerChartData.push({
          label: player,
          value: playerGameCombo[playerGameComboKey].playerWinnerCount[player]
        });
        playerGameCombo[playerGameComboKey].runnerChartData.push({
          label: player,
          value: playerGameCombo[playerGameComboKey].playerRunnerCount[player]
        });
        playerGameCombo[playerGameComboKey].outChartData.push({
          label: player,
          value: playerGameCombo[playerGameComboKey].playerOutCount[player]
        });
      });
      playerGameCombo[playerGameComboKey].playerWinnerRunner?.sort((p1, p2) => p2?.winPercentage - p1?.winPercentage);
    });
    //player winner runner out counts by game combo - end
    const gameWins = [];
    const playersParticipated = [];
    Object?.keys(gameWinsCount)?.map(g => {
      const obj = {
        players: g?.split(','),
        wins: gameWinsCount[g]
      };
      obj?.players?.forEach(player => !playersParticipated.includes(player) && playersParticipated.push(player));
      gameWins.push(obj);
    });
    gameWins?.sort((game1, game2) => game2.wins - game1.wins);
    setGameWins(gameWins);
    setPlayersParticipated(playersParticipated);
    setPlayerGameCombo(playerGameCombo);

    const playerWinnerRunner = [];
    Object?.keys(playerWinnerCount)?.forEach(player => {
    // playersParticipated?.forEach(player => {
      playerWinnerRunner.push({
        playerName: player,
        winner: playerWinnerCount[player],
        runner: playerRunnerCount[player],
        out: playerOutCount[player],
        gamesPlayed: playerGameCount[player],
        winPercentage: playerWinnerCount[player] ? Math.round((playerWinnerCount[player] / playerGameCount[player]) * 100) : 0,
        runnerPercentage: playerRunnerCount[player] ? Math.round((playerRunnerCount[player] / playerGameCount[player]) * 100) : 0,
        outPercentage: playerOutCount[player] ? Math.round((playerOutCount[player] / playerGameCount[player]) * 100) : 0
      });
      winnerChartData.push({
        label: player,
        value: playerWinnerCount[player]
      });
      runnerChartData.push({
        label: player,
        value: playerRunnerCount[player]
      });
      outChartData.push({
        label: player,
        value: playerOutCount[player]
      });
    });

    setWinnerChartData(winnerChartData);
    setRunnerChartData(runnerChartData);
    setOutChartData(outChartData);

    playerWinnerRunner?.sort((p1, p2) => p2?.winPercentage - p1?.winPercentage);

    setPlayerWinnerRunner(playerWinnerRunner);
  }, []);

  return (
    <div>
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
      {
        playerWinnerRunner?.length > 0 && 
        // <div style={{width: '360px'}}>
        <div>
          <div>{playerWinnerRunner[0]?.playerName} is All Time Winner <img src={WinnerCup} style={{width: '20px', height: '20px'}}></img></div>
          <table class="table player-stats-table">
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Winner</th>
                <th>Runner</th>
                <th>Out</th>
                <th>Games Played</th>
                <th>Win %</th>
                <th>Runner %</th>
                <th>Out %</th>
              </tr>
            </thead>
            <tbody>
                {playerWinnerRunner?.map(player => 
                  <tr>
                    <td>{player?.playerName}</td>
                    <td>{player?.winner ? player?.winner : 0}</td>
                    <td>{player?.runner ? player?.runner : 0}</td>
                    <td>{player?.out ? player?.out : 0}</td>
                    <td>{player?.gamesPlayed}</td>
                    <td>{player?.winPercentage}</td>
                    <td>{player?.runnerPercentage}</td>
                    <td>{player?.outPercentage}</td>
                  </tr>
                )}
              </tbody>
          </table>
          {/* <div style={{marginTop: '50px'}}><b>Winner Chart</b></div>
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
          <div style={{marginTop: '50px'}}><b>Out Chart</b></div>
          <PieChart
            name='out'
            data={outChartData}
            outerRadius={200}
            innerRadius={100}
          /> */}
        </div>
      }
      {
        <div style={{marginBottom: '50px'}}>
          <div style={{marginBottom: '25px', marginTop: '25px'}}><b>Win Combinations</b></div>
          {
            Object?.keys(playerGameCombo)?.map((playerGameComboKey, idx) => {
              const playersParticipated = playerGameComboKey?.split(',');
              return (
                <div style={{marginBottom: '25px'}}>
                  <div><b>Players</b>{playerGameComboKey?.split(',')?.map(player => <li>{player}</li>)}</div>
                  <table class="table history-table">
                    <thead>
                      <tr>
                        {
                          playersParticipated?.map((player, idx) => 
                            <th>
                              { idx == 0 ? 'Winner' : (idx == 1 ? 'Runner' : `Place - ${idx+1}`) }
                            </th>
                          )
                        }
                        <th>Wins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        Object?.keys(playerGameCombo[playerGameComboKey]?.gameWinsCount)?.map(gameWin => {
                          return (
                            <tr>
                              {gameWin?.split(',')?.map((player, idx) => <td>{player}</td> )}
                              <td>{playerGameCombo[playerGameComboKey]?.gameWinsCount[gameWin]}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                  <table class="table player-stats-table">
                    <thead>
                      <tr>
                        <th>Player Name</th>
                        <th>Winner</th>
                        <th>Runner</th>
                        <th>Out</th>
                        <th>Games Played</th>
                        <th>Win %</th>
                        <th>Runner %</th>
                        <th>Out %</th>
                      </tr>
                    </thead>
                    <tbody>
                        {playerGameCombo[playerGameComboKey]?.playerWinnerRunner?.map(player => 
                          <tr>
                            <td>{player?.playerName}</td>
                            <td>{player?.winner ? player?.winner : 0}</td>
                            <td>{player?.runner ? player?.runner : 0}</td>
                            <td>{player?.out ? player?.out : 0}</td>
                            <td>{player?.gamesPlayed}</td>
                            <td>{player?.winPercentage}</td>
                            <td>{player?.runnerPercentage}</td>
                            <td>{player?.outPercentage}</td>
                          </tr>
                        )}
                      </tbody>
                  </table>
                  <div style={{marginTop: '50px'}}><b>Winner Chart</b></div>
                  <PieChart
                    name={`winner-${idx}`}
                    data={playerGameCombo?.[playerGameComboKey]?.winnerChartData}
                    outerRadius={200}
                    innerRadius={100}
                  />
                  <div style={{marginTop: '50px'}}><b>Runner Chart</b></div>
                  <PieChart
                    name={`runner-${idx}`}
                    data={playerGameCombo?.[playerGameComboKey]?.runnerChartData}
                    outerRadius={200}
                    innerRadius={100}
                  />
                  <div style={{marginTop: '50px'}}><b>Out Chart</b></div>
                  <PieChart
                    name={`out-${idx}`}
                    data={playerGameCombo?.[playerGameComboKey]?.outChartData}
                    outerRadius={200}
                    innerRadius={100}
                  />
                </div>
              )
            })
          }
          {/* <table class="table history-table">
            <thead>
              <tr>
                {
                  playersParticipated?.map((player, idx) => 
                    <th>
                      { idx == 0 ? 'Winner' : (idx == 1 ? 'Runner' : `Place - ${idx+1}`) }
                    </th>
                  )
                }
                <th>Wins</th>
              </tr>
            </thead>
            <tbody>
              {gameWins?.map(gameWin => 
                <tr>
                  {gameWin?.players?.map((player, idx) => <td>{player}</td> )}
                  <td>{gameWin?.wins}</td>
                </tr>
              )}
            </tbody>
          </table> */}
        </div>
      }
      <button class="btn btn-success" onClick={() => navigate("/dashboard")}>Dashboard</button>
    </div>
  );
};

export default GameHistory;