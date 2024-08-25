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

  // const getLexicographicallySmallestRotation = (str) => {
  //   const doubled = str + str;
  //   const n = str.length;
  //   let smallestRotation = str;
  
  //   for (let i = 1; i < n; i++) {
  //     const rotation = doubled.slice(i, i + n);
  //     if (rotation < smallestRotation) {
  //       smallestRotation = rotation;
  //     }
  //   }
  
  //   return smallestRotation;
  // };

  // const getLexicographicallySmallestRotation = (str) => {
  //   const doubled = str + str;
  //   const n = str.length / 2;
  //   let smallestRotation = str;
    
  //   for (let i = 1; i < n; i++) {
  //       const rotation = doubled.slice(i * (str.indexOf(' -> ') + 4), i * (str.indexOf(' -> ') + 4) + str.length);
  //       if (rotation < smallestRotation) {
  //           smallestRotation = rotation;
  //       }
  //   }
    
  //   return smallestRotation;
  // };

  const getLexicographicallySmallestRotation = (players) => {
    const n = players.length;
    let smallestRotation = players.join(' -> ');
    
    // Generate all rotations
    for (let i = 1; i < n; i++) {
        // Rotate the array
        const rotation = players.slice(i).concat(players.slice(0, i)).join(' -> ');
        
        // Compare to find the smallest rotation
        if (rotation < smallestRotation) {
            smallestRotation = rotation;
        }
    }
    
    return smallestRotation;
  };

  const calculateStats = (arr) => {
    arr = arr?.filter(val => typeof val === 'number' && !isNaN(val));
    if (!arr || arr.length === 0) return {};
  
    // Lowest and Highest
    const lowest = Math.min(...arr);
    const highest = Math.max(...arr);
  
    // Average
    const sum = arr.reduce((acc, val) => acc + val, 0);
    const average = Math.round(sum / arr.length);
  
    // Median
    const sortedArr = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    const median = Math.round(sortedArr.length % 2 !== 0 ? sortedArr[mid] : (sortedArr[mid - 1] + sortedArr[mid]) / 2);
  
    // Mode
    const frequency = {};
    let maxFreq = 0;
    let mode = [];
    for (const num of arr) {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
        mode = [num];
      } else if (frequency[num] === maxFreq) {
        mode.push(num);
      }
    }
    if (mode.length > 1) {
      mode = mode?.sort((a, b) => a - b);
      // Mode statistics
      const modeMin = Math.min(...mode);
      const modeMax = Math.max(...mode);
      const modeSum = mode.reduce((acc, val) => acc + val, 0);
      const modeAvg = Math.round(modeSum / mode.length);
      mode = `[${modeMin}, ${modeAvg}, ${modeMax}]`;
    } else {
      mode = mode[0];
    }
  
    // Standard Deviation
    const variance = arr.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / arr.length;
    const stdDeviation = Math.round(Math.sqrt(variance));
  
    return { lowest, highest, average, median, mode, stdDeviation };
  };

  /*const computePointsStats = (playerGameCombo) => {
    Object.keys(playerGameCombo)?.forEach(playerGameComboKey => {
      const playerSeatingGames = {};
      const playerNormalizedSeatingGames = {};
      const playerGameComboObj = playerGameCombo[playerGameComboKey];
      const playerRankings = playerGameComboObj?.games?.map(game => game?.playerRanking);
      const winnerData = playerRankings?.map(playerRanking => playerRanking[0]);
      const runnerData = playerRankings?.map(playerRanking => playerRanking[1]);
      const outData = playerRankings?.map(playerRanking => playerRanking[playerRanking.length - 1]);
      const winnerDataSorted = winnerData?.sort((p1, p2) => p2?.total - p1?.total);
      const runnerDataSorted = runnerData?.sort((p1, p2) => p2?.total - p1?.total);
      const outDataSorted = outData?.sort((p1, p2) => p2?.total - p1?.total);
      const winnerRunnerMarginData = playerRankings?.map(playerRanking => playerRanking[1]?.total - playerRanking[0]?.total);
      const winnerOutMarginData = playerRankings?.map(playerRanking => playerRanking[playerRanking.length - 1]?.total - playerRanking[0]?.total);
      const runnerOutMarginData = playerRankings?.map(playerRanking => playerRanking[playerRanking.length - 1]?.total - playerRanking[1]?.total);
      const winnerRunnerMarginStats = calculateStats(winnerRunnerMarginData);
      const winnerOutMarginStats = calculateStats(winnerOutMarginData);
      const runnerOutMarginStats = calculateStats(runnerOutMarginData);
      playerGameComboObj['pointsStats'] = {
        playerRecords: {
          lowestWinner: winnerDataSorted?.[winnerDataSorted?.length - 1],
          highestWinner: winnerDataSorted?.[0],
          lowestRunner: runnerDataSorted?.[runnerDataSorted?.length - 1],
          highestRunner: runnerDataSorted?.[0],
          lowestOut: outDataSorted?.[outDataSorted?.length - 1],
          highestOut: outDataSorted?.[0]
        },
        marginStats: {
          winnerRunnerMarginStats,
          winnerOutMarginStats,
          runnerOutMarginStats
        },
        playerSeatingGames: {},
        playerNormalizedSeatingGames: {}
      };
      //player point stats by seating - start
      playerGameComboObj?.games?.forEach(game => {
        const seatingKey = game?.players?.join(' -> ');
        if(!playerSeatingGames[seatingKey]) {
          playerSeatingGames[seatingKey] = {games: [game]};
        } else {
          playerSeatingGames[seatingKey]?.games?.push(game);
        }
        const normalizedSeatingKey = getLexicographicallySmallestRotation(game?.players);
        if(!playerNormalizedSeatingGames[normalizedSeatingKey]) {
          playerNormalizedSeatingGames[normalizedSeatingKey] = {games: [game]};
        } else {
          playerNormalizedSeatingGames[normalizedSeatingKey]?.games?.push(game);
        }
      });
      Object.keys(playerSeatingGames)?.forEach(seatingKey => {
        const playerSeatingGamesObj = playerSeatingGames[seatingKey];
        const playerRankings = playerSeatingGamesObj?.games?.map(game => game?.playerRanking);
        const winnerData = playerRankings?.map(playerRanking => playerRanking[0]);
        const runnerData = playerRankings?.map(playerRanking => playerRanking[1]);
        const outData = playerRankings?.map(playerRanking => playerRanking[playerRanking.length - 1]);
        const winnerDataSorted = winnerData?.sort((p1, p2) => p2?.total - p1?.total);
        const runnerDataSorted = runnerData?.sort((p1, p2) => p2?.total - p1?.total);
        const outDataSorted = outData?.sort((p1, p2) => p2?.total - p1?.total);
        const winnerRunnerMarginData = playerRankings?.map(playerRanking => playerRanking[1]?.total - playerRanking[0]?.total);
        const winnerOutMarginData = playerRankings?.map(playerRanking => playerRanking[playerRanking.length - 1]?.total - playerRanking[0]?.total);
        const runnerOutMarginData = playerRankings?.map(playerRanking => playerRanking[playerRanking.length - 1]?.total - playerRanking[1]?.total);
        const winnerRunnerMarginStats = calculateStats(winnerRunnerMarginData);
        const winnerOutMarginStats = calculateStats(winnerOutMarginData);
        const runnerOutMarginStats = calculateStats(runnerOutMarginData);
        playerGameComboObj['pointsStats']['playerSeatingGames'][seatingKey] = {
          playerRecords: {
            lowestWinner: winnerDataSorted?.[winnerDataSorted?.length - 1],
            highestWinner: winnerDataSorted?.[0],
            lowestRunner: runnerDataSorted?.[runnerDataSorted?.length - 1],
            highestRunner: runnerDataSorted?.[0],
            lowestOut: outDataSorted?.[outDataSorted?.length - 1],
            highestOut: outDataSorted?.[0]
          },
          marginStats: {
            winnerRunnerMarginStats,
            winnerOutMarginStats,
            runnerOutMarginStats
          }
        };
      });
      Object.keys(playerNormalizedSeatingGames)?.forEach(seatingKey => {
        const playerNormalizedSeatingGamesObj = playerNormalizedSeatingGames[seatingKey];
        const playerRankings = playerNormalizedSeatingGamesObj?.games?.map(game => game?.playerRanking);
        const winnerData = playerRankings?.map(playerRanking => playerRanking[0]);
        const runnerData = playerRankings?.map(playerRanking => playerRanking[1]);
        const outData = playerRankings?.map(playerRanking => playerRanking[playerRanking.length - 1]);
        const winnerDataSorted = winnerData?.sort((p1, p2) => p2?.total - p1?.total);
        const runnerDataSorted = runnerData?.sort((p1, p2) => p2?.total - p1?.total);
        const outDataSorted = outData?.sort((p1, p2) => p2?.total - p1?.total);
        const winnerRunnerMarginData = playerRankings?.map(playerRanking => playerRanking[1]?.total - playerRanking[0]?.total);
        const winnerOutMarginData = playerRankings?.map(playerRanking => playerRanking[playerRanking.length - 1]?.total - playerRanking[0]?.total);
        const runnerOutMarginData = playerRankings?.map(playerRanking => playerRanking[playerRanking.length - 1]?.total - playerRanking[1]?.total);
        const winnerRunnerMarginStats = calculateStats(winnerRunnerMarginData);
        const winnerOutMarginStats = calculateStats(winnerOutMarginData);
        const runnerOutMarginStats = calculateStats(runnerOutMarginData);
        playerGameComboObj['pointsStats']['playerNormalizedSeatingGames'][seatingKey] = {
          playerRecords: {
            lowestWinner: winnerDataSorted?.[winnerDataSorted?.length - 1],
            highestWinner: winnerDataSorted?.[0],
            lowestRunner: runnerDataSorted?.[runnerDataSorted?.length - 1],
            highestRunner: runnerDataSorted?.[0],
            lowestOut: outDataSorted?.[outDataSorted?.length - 1],
            highestOut: outDataSorted?.[0]
          },
          marginStats: {
            winnerRunnerMarginStats,
            winnerOutMarginStats,
            runnerOutMarginStats
          }
        };
      });
      //player point stats by seating - end
      console.log('playerGameComboObj', playerGameComboObj);
    });
  };*/

  const computePointsStats = (playerGameCombo) => {
    const processPlayerRankings = (playerRankings) => {
      const winnerData = playerRankings.map(playerRanking => playerRanking[0]);
      const runnerData = playerRankings.map(playerRanking => playerRanking[1]);
      const outData = playerRankings.map(playerRanking => playerRanking[playerRanking.length - 1]);
  
      const winnerDataSorted = [...winnerData].sort((p1, p2) => p2.total - p1.total);
      const runnerDataSorted = [...runnerData].sort((p1, p2) => p2.total - p1.total);
      const outDataSorted = [...outData].sort((p1, p2) => p2.total - p1.total);
  
      const winnerRunnerMarginData = playerRankings.map(playerRanking => playerRanking[1].total - playerRanking[0].total);
      const winnerOutMarginData = playerRankings.map(playerRanking => playerRanking[playerRanking.length - 1].total - playerRanking[0].total);
      const runnerOutMarginData = playerRankings.map(playerRanking => playerRanking[playerRanking.length - 1].total - playerRanking[1].total);
  
      return {
        playerRecords: {
          lowestWinner: winnerDataSorted[winnerDataSorted.length - 1],
          highestWinner: winnerDataSorted[0],
          lowestRunner: runnerDataSorted[runnerDataSorted.length - 1],
          highestRunner: runnerDataSorted[0],
          lowestOut: outDataSorted[outDataSorted.length - 1],
          highestOut: outDataSorted[0]
        },
        marginStats: {
          winnerRunnerMarginStats: calculateStats(winnerRunnerMarginData),
          winnerOutMarginStats: calculateStats(winnerOutMarginData),
          runnerOutMarginStats: calculateStats(runnerOutMarginData)
        }
      };
    };
  
    const processGames = (games) => {
      const playerRankings = games.map(game => game.playerRanking);
      return processPlayerRankings(playerRankings);
    };
  
    Object.keys(playerGameCombo).forEach(playerGameComboKey => {
      const playerSeatingGames = {};
      const playerNormalizedSeatingGames = {};

      const playerGameComboObj = playerGameCombo[playerGameComboKey];
      const playerRankings = playerGameComboObj.games.map(game => game.playerRanking);
  
      playerGameComboObj.pointsStats = {
        ...processPlayerRankings(playerRankings),
        playerSeatingGames: {},
        playerNormalizedSeatingGames: {}
      };
  
      playerGameComboObj.games.forEach(game => {
        const seatingKey = game.players.join(' -> ');
        if (!playerSeatingGames[seatingKey]) {
          playerSeatingGames[seatingKey] = { games: [game] };
        } else {
          playerSeatingGames[seatingKey].games.push(game);
        }
  
        const normalizedSeatingKey = getLexicographicallySmallestRotation(game.players);
        if (!playerNormalizedSeatingGames[normalizedSeatingKey]) {
          playerNormalizedSeatingGames[normalizedSeatingKey] = { games: [game] };
        } else {
          playerNormalizedSeatingGames[normalizedSeatingKey].games.push(game);
        }
      });
  
      Object.keys(playerSeatingGames).forEach(seatingKey => {
        playerGameComboObj.pointsStats.playerSeatingGames[seatingKey] = processGames(playerSeatingGames[seatingKey].games);
      });
  
      Object.keys(playerNormalizedSeatingGames).forEach(seatingKey => {
        playerGameComboObj.pointsStats.playerNormalizedSeatingGames[seatingKey] = processGames(playerNormalizedSeatingGames[seatingKey].games);
      });
  
      console.log('playerGameComboObj', playerGameComboObj);
    });
  };

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
      const playerDealerCount = {};
      const playerSeatingCount = {};
      const playerSeatingGames = {};
      const playerNormalizedSeatingCount = {};
      const playerNormalizedSeatingGames = {};
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
        //dealer count
        const dealer = game?.players[game?.players?.length - 1];
        let dealerCount = playerDealerCount[dealer];
        if(!dealerCount) {
          playerDealerCount[dealer] = 1;
        } else {
          playerDealerCount[dealer] = dealerCount+1;
        }
        //seating count
        const seatingKey = game?.players?.join(' -> ');
        let seatingCount = playerSeatingCount[seatingKey];
        if(!seatingCount) {
          playerSeatingCount[seatingKey] = 1;
        } else {
          playerSeatingCount[seatingKey] = seatingCount+1;
        }
        //seating count stats
        let seatingCountGames = playerSeatingGames[seatingKey];
        if(!seatingCountGames) {
          playerSeatingGames[seatingKey] = {games: [game]};
        } else {
          playerSeatingGames[seatingKey]?.games?.push(game);
        }
        //lexicographically smallest rotation
        // const normalizedSeatingKey = getLexicographicallySmallestRotation(game?.players?.join(' -> '));
        const normalizedSeatingKey = getLexicographicallySmallestRotation(game?.players);
        let normalizedSeatingCount = playerNormalizedSeatingCount[normalizedSeatingKey];
        if(!normalizedSeatingCount) {
          playerNormalizedSeatingCount[normalizedSeatingKey] = 1;
        } else {
          playerNormalizedSeatingCount[normalizedSeatingKey] = normalizedSeatingCount+1;
        }
        //normalized seating count stats
        let normalizedSeatingCountGames = playerNormalizedSeatingGames[normalizedSeatingKey];
        if(!normalizedSeatingCountGames) {
          playerNormalizedSeatingGames[normalizedSeatingKey] = {games: [game]};
        } else {
          playerNormalizedSeatingGames[normalizedSeatingKey]?.games?.push(game);
        }
      });
      playerGameCombo[playerGameComboKey].playerWinnerCount = playerWinnerCount;
      playerGameCombo[playerGameComboKey].playerRunnerCount = playerRunnerCount;
      playerGameCombo[playerGameComboKey].playerOutCount = playerOutCount;
      playerGameCombo[playerGameComboKey].playerGameCount = playerGameCount;
      playerGameCombo[playerGameComboKey].playerDealerCount = playerDealerCount;
      playerGameCombo[playerGameComboKey].playerSeatingCount = playerSeatingCount;
      playerGameCombo[playerGameComboKey].playerSeatingCountStats = {};
      playerGameCombo[playerGameComboKey].playerNormalizedSeatingCount = playerNormalizedSeatingCount;
      playerGameCombo[playerGameComboKey].playerNormalizedSeatingCountStats = {};
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
      //player game stats by seating
      Object.keys(playerSeatingGames)?.forEach(seatingKey => {
        console.log('seatingKey', seatingKey);
        const playerSeatingGamesObj = playerSeatingGames[seatingKey];
        const playerWinnerCount = {};
        const playerRunnerCount = {};
        const playerOutCount = {};
        const playerGameCount = {};
        playerSeatingGamesObj?.games?.forEach(game => {
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
        const sortedPlayerWinnerCount = Object.entries(playerWinnerCount)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        const sortedPlayerRunnerCount = Object.entries(playerRunnerCount)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        const sortedPlayerOutCount = Object.entries(playerOutCount)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        playerGameCombo[playerGameComboKey].playerSeatingCountStats[seatingKey] = {
          playerWinnerCount: sortedPlayerWinnerCount,
          playerRunnerCount: sortedPlayerRunnerCount,
          playerOutCount: sortedPlayerOutCount,
          playerGameCount
        };
      });
      //player game stats by normalized seating
      Object.keys(playerNormalizedSeatingGames)?.forEach(seatingKey => {
        console.log('seatingKey', seatingKey);
        const playerNormalizedSeatingGamesObj = playerNormalizedSeatingGames[seatingKey];
        const playerWinnerCount = {};
        const playerRunnerCount = {};
        const playerOutCount = {};
        const playerGameCount = {};
        playerNormalizedSeatingGamesObj?.games?.forEach(game => {
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
        const sortedPlayerWinnerCount = Object.entries(playerWinnerCount)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        const sortedPlayerRunnerCount = Object.entries(playerRunnerCount)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        const sortedPlayerOutCount = Object.entries(playerOutCount)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        playerGameCombo[playerGameComboKey].playerNormalizedSeatingCountStats[seatingKey] = {
          playerWinnerCount: sortedPlayerWinnerCount,
          playerRunnerCount: sortedPlayerRunnerCount,
          playerOutCount: sortedPlayerOutCount,
          playerGameCount
        };
      });
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
    // code modularization start
    computePointsStats(playerGameCombo);
    // TODO: Remove console.log
    console.log('playerGameCombo', playerGameCombo);
    // code modularization end
    setPlayerGameCombo(playerGameCombo);
    //player stats by game combo - end

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
                      <br></br>
                      <h4 style={{color: 'green'}}>Win Combination Count</h4>
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
                            <th>Count</th>
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
                      <h4 style={{color: 'green'}}>Player Overall Stats by Seating (Dealer at the end)</h4>
                      <table class="table player-stats-table">
                        <thead>
                          <tr>
                            <th>Player Seating</th>
                            <th>Player Name</th>
                            <th>Winner</th>
                            <th>Runner</th>
                            <th>Out</th>
                            <th>Games Played</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(playerGameCombo[playerGameComboKey]?.playerSeatingCountStats)?.map((playerSeating, seatingIndex) => 
                            Object.keys(playerGameCombo[playerGameComboKey]?.playerSeatingCountStats[playerSeating]?.playerWinnerCount)?.map((player, idx) =>
                              <tr key={`${playerSeating}-${player}`} className={seatingIndex % 2 === 0 ? 'even-group' : 'odd-group'}>
                                {/* <td>{playerSeating}</td> */}
                                {idx === 0 && (
                                  <td rowspan={Object.keys(playerGameCombo[playerGameComboKey]?.playerSeatingCountStats[playerSeating]?.playerWinnerCount).length}>{playerSeating}</td>
                                )}
                                <td>{player}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.playerSeatingCountStats[playerSeating]?.playerWinnerCount[player]}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.playerSeatingCountStats[playerSeating]?.playerRunnerCount[player]}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.playerSeatingCountStats[playerSeating]?.playerOutCount[player]}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.playerSeatingCountStats[playerSeating]?.playerGameCount[player]}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                      <h4 style={{color: 'green'}}>Player Overall Stats by Normalized Seating</h4>
                      <table class="table player-stats-table">
                        <thead>
                          <tr>
                            <th>Player Seating</th>
                            <th>Player Name</th>
                            <th>Winner</th>
                            <th>Runner</th>
                            <th>Out</th>
                            <th>Games Played</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(playerGameCombo[playerGameComboKey]?.playerNormalizedSeatingCountStats)?.map((playerSeating, seatingIndex) => 
                            Object.keys(playerGameCombo[playerGameComboKey]?.playerNormalizedSeatingCountStats[playerSeating]?.playerWinnerCount)?.map((player, idx) =>
                              <tr key={`${playerSeating}-${player}`} className={seatingIndex % 2 === 0 ? 'even-group' : 'odd-group'}>
                                {/* <td>{playerSeating}</td> */}
                                {idx === 0 && (
                                  <td rowspan={Object.keys(playerGameCombo[playerGameComboKey]?.playerNormalizedSeatingCountStats[playerSeating]?.playerWinnerCount).length}>{playerSeating}</td>
                                )}
                                <td>{player}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.playerNormalizedSeatingCountStats[playerSeating]?.playerWinnerCount[player]}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.playerNormalizedSeatingCountStats[playerSeating]?.playerRunnerCount[player]}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.playerNormalizedSeatingCountStats[playerSeating]?.playerOutCount[player]}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.playerNormalizedSeatingCountStats[playerSeating]?.playerGameCount[player]}</td>
                              </tr>
                            )
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
                      <h4 style={{color: 'green'}}>Player Dealer Stats</h4>
                      <table class="table rummy-table">
                        <thead>
                          <tr>
                            <th>Player Name</th>
                            <th>Game Starter (Dealer)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            Object.keys(playerGameCombo[playerGameComboKey].playerDealerCount)
                            ?.sort((p1, p2) => playerGameCombo[playerGameComboKey].playerDealerCount[p2] - playerGameCombo[playerGameComboKey].playerDealerCount[p1])
                            ?.map(player => (
                              <tr>
                                <td>{player}</td>
                                <td>{playerGameCombo[playerGameComboKey].playerDealerCount[player]}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                      <h4 style={{color: 'green'}}>Player Seating Stats (Dealer at the end)</h4>
                      <table class="table rummy-table">
                        <thead>
                          <tr>
                            <th>Player Seating</th>
                            <th>Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            Object.keys(playerGameCombo[playerGameComboKey].playerSeatingCount)
                            ?.sort((p1, p2) => playerGameCombo[playerGameComboKey].playerSeatingCount[p2] - playerGameCombo[playerGameComboKey].playerSeatingCount[p1])
                            ?.map(player => (
                              <tr>
                                <td>{player}</td>
                                <td>{playerGameCombo[playerGameComboKey].playerSeatingCount[player]}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                      <h4 style={{color: 'green'}}>Player Normalized Seating Stats</h4>
                      <table class="table rummy-table">
                        <thead>
                          <tr>
                            <th>Player Seating</th>
                            <th>Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            Object.keys(playerGameCombo[playerGameComboKey].playerNormalizedSeatingCount)
                            ?.sort((p1, p2) => playerGameCombo[playerGameComboKey].playerNormalizedSeatingCount[p2] - playerGameCombo[playerGameComboKey].playerNormalizedSeatingCount[p1])
                            ?.map(player => (
                              <tr>
                                <td>{player}</td>
                                <td>{playerGameCombo[playerGameComboKey].playerNormalizedSeatingCount[player]}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                      <h4 style={{color: 'green'}}>Player Records</h4>
                      <table class="table rummy-table">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Winner (total)</th>
                            <th>Runner (total)</th>
                            <th>Out (total)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ backgroundColor: '#5B9279', color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Lowest</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerRecords?.lowestWinner?.name}  ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerRecords?.lowestWinner?.total})</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerRecords?.lowestRunner?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerRecords?.lowestRunner?.total})</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerRecords?.lowestOut?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerRecords?.lowestOut?.total})</td>
                          </tr>
                          <tr>
                            <td style={{ backgroundColor: '#5B9279', color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Highest</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerRecords?.highestWinner?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerRecords?.highestWinner?.total})</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerRecords?.highestRunner?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerRecords?.highestRunner?.total})</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerRecords?.highestOut?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerRecords?.highestOut?.total})</td>
                          </tr>
                        </tbody>
                      </table>
                      <h4 style={{color: 'green'}}>Player Records by Seating (Dealer at the end)</h4>
                      <table class="table player-stats-table">
                        <thead>
                          <tr>
                            <th>Player Seating</th>
                            <th>Measure</th>
                            <th>Winner (total)</th>
                            <th>Runner (total)</th>
                            <th>Out (total)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames)?.map((playerSeating, seatingIndex) => 
                            <>
                              <tr key={`${playerSeating}-${seatingIndex}`} className={seatingIndex % 2 === 0 ? 'even-group' : 'odd-group'}>
                                <td rowspan='2'>{playerSeating}</td>
                                <td>Lowest</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.playerRecords?.lowestWinner?.name}  ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.playerRecords?.lowestWinner?.total})</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.playerRecords?.lowestRunner?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.playerRecords?.lowestRunner?.total})</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.playerRecords?.lowestOut?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.playerRecords?.lowestOut?.total})</td>
                              </tr>
                              <tr key={`${playerSeating}-${seatingIndex}`} className={seatingIndex % 2 === 0 ? 'even-group' : 'odd-group'}>
                                <td>Highest</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.playerRecords?.highestWinner?.name}  ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.playerRecords?.highestWinner?.total})</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.playerRecords?.highestRunner?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.playerRecords?.highestRunner?.total})</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.playerRecords?.highestOut?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.playerRecords?.highestOut?.total})</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                      <h4 style={{color: 'green'}}>Player Records by Normalized Seating</h4>
                      <table class="table player-stats-table">
                        <thead>
                          <tr>
                            <th>Player Seating</th>
                            <th>Measure</th>
                            <th>Winner (total)</th>
                            <th>Runner (total)</th>
                            <th>Out (total)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames)?.map((playerSeating, seatingIndex) => 
                            <>
                              <tr key={`${playerSeating}-${seatingIndex}`} className={seatingIndex % 2 === 0 ? 'even-group' : 'odd-group'}>
                                <td rowspan='2'>{playerSeating}</td>
                                <td>Lowest</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.playerRecords?.lowestWinner?.name}  ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.playerRecords?.lowestWinner?.total})</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.playerRecords?.lowestRunner?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.playerRecords?.lowestRunner?.total})</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.playerRecords?.lowestOut?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.playerRecords?.lowestOut?.total})</td>
                              </tr>
                              <tr key={`${playerSeating}-${seatingIndex}`} className={seatingIndex % 2 === 0 ? 'even-group' : 'odd-group'}>
                                <td>Highest</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.playerRecords?.highestWinner?.name}  ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.playerRecords?.highestWinner?.total})</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.playerRecords?.highestRunner?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.playerRecords?.highestRunner?.total})</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.playerRecords?.highestOut?.name} ({playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.playerRecords?.highestOut?.total})</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                      <h4 style={{color: 'green'}}>Player Points Margin Stats</h4>
                      <table class="table rummy-table">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Lowest</th>
                            <th>Highest</th>
                            <th>Average</th>
                            <th>Median</th>
                            <th>Popular Margin</th>
                            <th>Deviation</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ backgroundColor: '#5B9279', color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Winner vs Runner</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.winnerRunnerMarginStats?.lowest}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.winnerRunnerMarginStats?.highest}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.winnerRunnerMarginStats?.average}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.winnerRunnerMarginStats?.median}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.winnerRunnerMarginStats?.mode}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.winnerRunnerMarginStats?.stdDeviation}</td>
                          </tr>
                          <tr>
                            <td style={{ backgroundColor: '#5B9279', color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Winner vs Out</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.winnerOutMarginStats?.lowest}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.winnerOutMarginStats?.highest}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.winnerOutMarginStats?.average}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.winnerOutMarginStats?.median}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.winnerOutMarginStats?.mode}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.winnerOutMarginStats?.stdDeviation}</td>
                          </tr>
                          <tr>
                            <td style={{ backgroundColor: '#5B9279', color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }}>Runner vs Out</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.runnerOutMarginStats?.lowest}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.runnerOutMarginStats?.highest}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.runnerOutMarginStats?.average}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.runnerOutMarginStats?.median}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.runnerOutMarginStats?.mode}</td>
                            <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.marginStats?.runnerOutMarginStats?.stdDeviation}</td>
                          </tr>
                        </tbody>
                      </table>
                      <h4 style={{color: 'green'}}>Player Points Margin Stats by Seating (Dealer at the end)</h4>
                      <table class="table player-stats-table">
                        <thead>
                          <tr>
                            <th>Player Seating</th>
                            <th>Measure</th>
                            <th>Lowest</th>
                            <th>Highest</th>
                            <th>Average</th>
                            <th>Median</th>
                            <th>Popular Margin</th>
                            <th>Deviation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames)?.map((playerSeating, seatingIndex) => 
                            <>
                              <tr key={`${playerSeating}-${seatingIndex}`} className={seatingIndex % 2 === 0 ? 'even-group' : 'odd-group'}>
                                <td rowspan='3'>{playerSeating}</td>
                                <td>Winner vs Runner</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.winnerRunnerMarginStats?.lowest}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.winnerRunnerMarginStats?.highest}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.winnerRunnerMarginStats?.average}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.winnerRunnerMarginStats?.median}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.winnerRunnerMarginStats?.mode}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.winnerRunnerMarginStats?.stdDeviation}</td>
                              </tr>
                              <tr key={`${playerSeating}-${seatingIndex}`} className={seatingIndex % 2 === 0 ? 'even-group' : 'odd-group'}>
                                <td>Winner vs Out</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.winnerOutMarginStats?.lowest}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.winnerOutMarginStats?.highest}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.winnerOutMarginStats?.average}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.winnerOutMarginStats?.median}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.winnerOutMarginStats?.mode}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.winnerOutMarginStats?.stdDeviation}</td>
                              </tr>
                              <tr key={`${playerSeating}-${seatingIndex}`} className={seatingIndex % 2 === 0 ? 'even-group' : 'odd-group'}>
                                <td>Runner vs Out</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.runnerOutMarginStats?.lowest}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.runnerOutMarginStats?.highest}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.runnerOutMarginStats?.average}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.runnerOutMarginStats?.median}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.runnerOutMarginStats?.mode}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerSeatingGames?.[playerSeating]?.marginStats?.runnerOutMarginStats?.stdDeviation}</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                      <h4 style={{color: 'green'}}>Player Points Margin Stats by Normalized Seating</h4>
                      <table class="table player-stats-table">
                        <thead>
                          <tr>
                            <th>Player Seating</th>
                            <th>Measure</th>
                            <th>Lowest</th>
                            <th>Highest</th>
                            <th>Average</th>
                            <th>Median</th>
                            <th>Popular Margin</th>
                            <th>Deviation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames)?.map((playerSeating, seatingIndex) => 
                            <>
                              <tr key={`${playerSeating}-${seatingIndex}`} className={seatingIndex % 2 === 0 ? 'even-group' : 'odd-group'}>
                                <td rowspan='3'>{playerSeating}</td>
                                <td>Winner vs Runner</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.winnerRunnerMarginStats?.lowest}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.winnerRunnerMarginStats?.highest}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.winnerRunnerMarginStats?.average}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.winnerRunnerMarginStats?.median}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.winnerRunnerMarginStats?.mode}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.winnerRunnerMarginStats?.stdDeviation}</td>
                              </tr>
                              <tr key={`${playerSeating}-${seatingIndex}`} className={seatingIndex % 2 === 0 ? 'even-group' : 'odd-group'}>
                                <td>Winner vs Out</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.winnerOutMarginStats?.lowest}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.winnerOutMarginStats?.highest}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.winnerOutMarginStats?.average}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.winnerOutMarginStats?.median}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.winnerOutMarginStats?.mode}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.winnerOutMarginStats?.stdDeviation}</td>
                              </tr>
                              <tr key={`${playerSeating}-${seatingIndex}`} className={seatingIndex % 2 === 0 ? 'even-group' : 'odd-group'}>
                                <td>Runner vs Out</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.runnerOutMarginStats?.lowest}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.runnerOutMarginStats?.highest}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.runnerOutMarginStats?.average}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.runnerOutMarginStats?.median}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.runnerOutMarginStats?.mode}</td>
                                <td>{playerGameCombo[playerGameComboKey]?.pointsStats?.playerNormalizedSeatingGames?.[playerSeating]?.marginStats?.runnerOutMarginStats?.stdDeviation}</td>
                              </tr>
                            </>
                          )}
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