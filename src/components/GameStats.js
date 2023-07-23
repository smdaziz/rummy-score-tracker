/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGameHistoryData } from "../firebase";

import WinnerCup from './../assets/winner-cup.png';
import PieChart from "./PieChart";

const GameStats = () => {
  const navigate = useNavigate();

  const [playerWinnerRunner, setPlayerWinnerRunner] = useState([]);

  const [playerGameCombo, setPlayerGameCombo] = useState({});

  const [winnerChartData, setWinnerChartData] = useState([]);
  const [runnerChartData, setRunnerChartData] = useState([]);
  const [outChartData, setOutChartData] = useState([]);

  useEffect(async () => {
    const gameHistory = await getGameHistoryData();

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
    //player stats by game combo - start
    Object?.keys(playerGameCombo)?.forEach(playerGameComboKey => {
      const playerGameComboObj = playerGameCombo[playerGameComboKey];
      const playerStats = {};
      playerGameComboKey.split(',')?.forEach(player => {
        playerStats[player] = {
          rummys: 0,
          drops: 0,
          outs: 0,
          seventyFives: 0
        }
      });
      playerGameComboObj?.games?.forEach(game => {
        playersParticipated?.forEach(player => {
          game?.roundsData?.forEach(round => {
            const points = Number(round[player]);
            if (points === 0) {
              playerStats[player].rummys += 1;
            } else if (points === 25) {
              playerStats[player].drops += 1;
            } else if (points > 25 && points < 75) {
              playerStats[player].outs += 1;
            }
            if (points == 75) {
              playerStats[player].seventyFives += 1;
            }
          });
        });
      });
      playerGameCombo[playerGameComboKey].playerStats = playerStats;
    });
    //player stats by game combo - end
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

    // accordion code
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    }
  }, []);

  return (
    <div>
      <br></br>
      <div>
        <button class="btn btn-success" onClick={() => navigate("/dashboard")}>Dashboard</button>
      </div>
      <br></br>
      <div>
        <button class="btn btn-success" onClick={() => navigate("/gamehistory")}>Game History</button>
      </div>
      {
        playerWinnerRunner?.length > 0 && 
        // <div style={{width: '360px'}}>
        <div>
          <h1 className="mt-3" style={{color: 'green'}}>Game Stats</h1>
          <div className="mt-3">{playerWinnerRunner[0]?.playerName} is All Time Winner <img src={WinnerCup} style={{width: '20px', height: '20px'}}></img></div>
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
          <h4 style={{marginTop: '50px', color: 'green'}}>Winner Chart</h4>
          <PieChart
            name='winner'
            data={winnerChartData}
            outerRadius={200}
            innerRadius={100}
          />
          <h4 style={{marginTop: '50px', color: 'green'}}>Runner Chart</h4>
          <PieChart
            name='runner'
            data={runnerChartData}
            outerRadius={200}
            innerRadius={100}
          />
          <h4 style={{marginTop: '50px', color: 'green'}}>Out Chart</h4>
          <PieChart
            name='out'
            data={outChartData}
            outerRadius={200}
            innerRadius={100}
          />
        </div>
      }
      {
        <div style={{marginBottom: '50px'}}>
          <h3 style={{marginBottom: '25px', marginTop: '25px', color: 'green'}}>Win Combinations</h3>
          {
            Object?.keys(playerGameCombo)?.map((playerGameComboKey, idx) => {
              const playersParticipated = playerGameComboKey?.split(',');
              const playerStats = playerGameCombo[playerGameComboKey]?.playerStats;
              return (
                <>
                  <button class="accordion mb-2"><div style={{color: 'white'}}><b>{playersParticipated.join(', ')}</b></div></button>
                  <div class="panel">
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
                      <h4 style={{color: 'green'}}>Player Overall Stats</h4>
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
                      <h4 style={{color: 'green'}}>Player Round Stats</h4>
                      <table class="table rummy-table">
                        <thead>
                          <tr>
                            <th>Player Name</th>
                            <th>Rummys</th>
                            <th>Drops</th>
                            <th>Outs</th>
                            <th>75s</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            playersParticipated?.map(player => (
                              <tr>
                                <td>{player}</td>
                                <td>{playerStats[player]?.rummys}</td>
                                <td>{playerStats[player]?.drops}</td>
                                <td>{playerStats[player]?.outs}</td>
                                <td>{playerStats[player]?.seventyFives}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                      <h4 style={{marginTop: '50px', color: 'green'}}>Winner Chart</h4>
                      <PieChart
                        name={`winner-${idx}`}
                        data={playerGameCombo?.[playerGameComboKey]?.winnerChartData}
                        outerRadius={200}
                        innerRadius={100}
                      />
                      <h4 style={{marginTop: '50px', color: 'green'}}>Runner Chart</h4>
                      <PieChart
                        name={`runner-${idx}`}
                        data={playerGameCombo?.[playerGameComboKey]?.runnerChartData}
                        outerRadius={200}
                        innerRadius={100}
                      />
                      <h4 style={{marginTop: '50px', color: 'green'}}>Out Chart</h4>
                      <PieChart
                        name={`out-${idx}`}
                        data={playerGameCombo?.[playerGameComboKey]?.outChartData}
                        outerRadius={200}
                        innerRadius={100}
                      />
                    </div>
                  </div>
                </>
              )
            })
          }
        </div>
      }
      {/* <h2>Accordion</h2>

      <button class="accordion">Section 1</button>
      <div class="panel">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>

      <button class="accordion">Section 2</button>
      <div class="panel">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>

      <button class="accordion">Section 3</button>
      <div class="panel">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div> */}
    </div>
  );
};

export default GameStats;