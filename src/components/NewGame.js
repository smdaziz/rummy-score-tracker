import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { nanoid } from "nanoid";
import "./NewGame.css";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";
import { deleteRoundData, getGameData, getPlayers, getRegisteredPlayers, resetGame, savePlayers, saveRoundData, updateRoundData } from "../firebase";
import WinnerCup from './../assets/winner-cup.png';

const NewGame = () => {
  const navigate = useNavigate();

  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');

  const [rounds, setRounds] = useState([]);
  const [addRoundData, setAddRoundData] = useState({
  });

  const [allPlayersAdded, setAllPlayersAdded] = useState(false);

  const [playerScores, setPlayerScores] = useState({});

  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');

  useEffect(async () => {
    const regsiteredPlayers = await getRegisteredPlayers();
    setRegisteredPlayers(regsiteredPlayers);

    const gameData = await getGameData();
    setRounds(gameData);
    // const currentPlayers = [];
    // gameData?.length > 0 && Object.keys(gameData?.[0]).forEach((key) => {
    //   if(key !== 'id') {
    //     currentPlayers.push(key);
    //   }
    // });
    // setPlayers(currentPlayers);
    
    const savedPlayers = await getPlayers();
    const tempSavedPlayers = [];
    if(savedPlayers.length > 0) {
      setAllPlayersAdded(true);
      if(players?.length != savedPlayers?.length) {
        Object.keys(savedPlayers[0]).map((key) => {
          tempSavedPlayers[key] = savedPlayers[0][key];
        });
        setPlayers(tempSavedPlayers);
      }
    }

    const playerScoresTemp = {};
    tempSavedPlayers?.forEach(player => playerScoresTemp[player] = 0);
    gameData?.forEach(round => {
      tempSavedPlayers?.forEach(player => {
        playerScoresTemp[player] += Number(round[player]);
      });
    });
    setPlayerScores(playerScoresTemp);

    let lowScore = 350;
    tempSavedPlayers?.forEach(player => {
    // players?.forEach(player => {
      if(playerScoresTemp[player] > 350) {
        setGameOver(true);
      }
      if(playerScoresTemp[player] < lowScore) {
        lowScore = playerScoresTemp[player];
        setWinner(player);
      }
    });

  }, []);

  const handleAddPlayerChange = (event) => {
    event.preventDefault();

    const fieldValue = event.target.value;

    setPlayerName(fieldValue);
  };

  const handleAddPlayerSubmit = (event) => {
    event.preventDefault();

    !players?.includes(playerName) && playerName && players.push(playerName);
    setPlayerName('');

    setPlayers(players);
  };

  const savePlayersHandler = async (event) => {
    event.preventDefault();
    
    await savePlayers(players);

    const savedPlayers = await getPlayers();
    const tempSavedPlayers = [];
    if(savedPlayers.length > 0) {
      setAllPlayersAdded(true);
      if(players?.length != savedPlayers?.length) {
        Object.keys(savedPlayers[0]).map((key) => {
          tempSavedPlayers[key] = savedPlayers[0][key];
        });
        setPlayers(tempSavedPlayers);
      }
    }
  }

  const [editRoundData, setEditRoundData] = useState({
  });

  const [editRoundId, setEditRoundId] = useState(null);

  const handleAddRoundChange = (event, index) => {
    event.preventDefault();

    const fieldValue = event.target.value;

    const newRoundData = { ...addRoundData };
    // newRoundData[index] = fieldValue;
    newRoundData[players[index]] = fieldValue;

    setAddRoundData(newRoundData);
  };

  const handleEditRoundChange = (event, index) => {
    event.preventDefault();

    const fieldValue = event.target.value;

    const newRoundData = { ...editRoundData };
    // newRoundData[index] = fieldValue;
    newRoundData[players[index]] = fieldValue;

    setEditRoundData(newRoundData);
  };

  const handleAddRoundSubmit = async (event) => {
    event.preventDefault();

    const newRound = {
      id: nanoid()
    };
    players?.map((player, idx) => {
      // newRound[idx] = addRoundData[idx];
      newRound[players[idx]] = addRoundData[players[idx]];
    });

    const newRounds = [...rounds, newRound];
    Object.keys(addRoundData)?.map((data, idx) => {
      // addRoundData[idx] = '';
      addRoundData[players[idx]] = '';
    });
    setRounds(newRounds);
    await saveRoundData(newRound);

    const playerScoresTemp = {};
    players?.forEach(player => playerScoresTemp[player] = 0);
    newRounds?.forEach(round => {
      players?.forEach(player => {
        playerScoresTemp[player] += Number(round[player]);
      });
    });
    setPlayerScores(playerScoresTemp);

    let lowScore = 350;
    players?.forEach(player => {
      if(playerScoresTemp[player] > 350) {
        setGameOver(true);
      }
      if(playerScoresTemp[player] < lowScore) {
        lowScore = playerScoresTemp[player];
        setWinner(player);
      }
    });

    window.location.reload();
  };

  const handleEditRoundSubmit = (event) => {
    event.preventDefault();

    const editedRound = {
      id: editRoundId
    };
    players?.map((player, idx) => {
      // editedRound[idx] = editRoundData[idx];
      editedRound[players[idx]] = editRoundData[players[idx]];
    });

    const newRounds = [...rounds];

    const index = rounds.findIndex((round) => round.id === editRoundId);

    // newRounds[index] = editedRound;
    newRounds[players[index]] = editedRound;

    setRounds(newRounds);
    setEditRoundId(null);
    updateRoundData(editedRound);
  };

  const handleEditClick = (event, round) => {
    event.preventDefault();
    setEditRoundId(round.id);

    const roundValues = {
    };
    players?.map((player, idx) => {
      // roundValues[idx] = round[idx];
      roundValues[players[idx]] = round[players[idx]];
    });

    setEditRoundData(roundValues);
  };

  const handleCancelClick = () => {
    setEditRoundId(null);
  };

  const handleDeleteClick = (roundId) => {
    const newRounds = [...rounds];

    const index = rounds.findIndex((round) => round.id === roundId);

    newRounds.splice(index, 1);

    setRounds(newRounds);
    deleteRoundData(roundId);
  };

  const resetGameHandler = () => {
    resetGame();
  };

  const getPlayerTurn = () => {
    if(rounds?.length == 0 || rounds?.length % players?.length == 0) {
      return players[players?.length - 1];
    }
    return players[(rounds?.length % players?.length) - 1];
  };

  return (
    <div>
      {
        !allPlayersAdded && 
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <h2>Select Player</h2>
          <form style={{flexDirection: 'column'}} onSubmit={handleAddPlayerSubmit}>
            {/* <input
              type="text"
              name="player"
              value={playerName}
              required="required"
              placeholder="Enter Player Name..."
              onChange={handleAddPlayerChange}
            /> */}
            <div style={{display: 'flex', flexDirection: 'column'}} onChange={handleAddPlayerChange}>
              {registeredPlayers?.map(player => 
                <div style={{ marginRight: '10px' }}>
                  <input
                    type="radio"
                    name="playerName"
                    value={player}
                  />
                  {player}
                </div>
              )}
            </div>
            <button type="submit" style={{width: '150px'}}>Add Player</button>
            <button style={{width: '150px'}} onClick={savePlayersHandler}>Start Game</button>
          </form>
        </div>
      }
      {
        !gameOver && 
        <div className="app-container">
          <form onSubmit={handleEditRoundSubmit}>
            <table>
              <thead>
                <tr>
                  {players?.length > 0 && <th>Round</th>}
                  {players?.map(player => <th>{player}</th>)}
                </tr>
              </thead>
              <tbody>
                {rounds?.map((round, idx) => (
                  <Fragment>
                    {editRoundId === round.id ? (
                      <EditableRow
                        editRoundData={editRoundData}
                        handleEditRoundChange={handleEditRoundChange}
                        handleCancelClick={handleCancelClick}
                      />
                    ) : (
                      <ReadOnlyRow
                        round={round}
                        roundIndex={idx}
                        players={players}
                        handleEditClick={handleEditClick}
                        handleDeleteClick={handleDeleteClick}
                        rounds={rounds}
                      />
                    )}
                  </Fragment>
                ))}
                <tr>
                  <td><b>Total</b></td>
                  {
                    players?.map(player => <td>{playerScores[player]}</td>)
                  }
                </tr>
              </tbody>
            </table>
          </form>

          {/* <h2>Enter Round Scores</h2> */}
          <form onSubmit={handleAddRoundSubmit}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <button type="submit" style={{width: '150px'}} disabled={!allPlayersAdded}>Add</button>
                  </td>
                  {players?.map((player, idx) => 
                    <td>
                      <input
                        type="text"
                        style={{width: '150px'}}
                        name="fullName"
                        // value={addRoundData[idx]}
                        value={addRoundData[players[idx]]}
                        required="required"
                        placeholder="Enter points..."
                        onChange={
                          (e) => {
                            handleAddRoundChange(e, idx);
                          }}
                      />
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      }
      {
        gameOver && 
        <div>
          <div>{winner} won the game!!<img src={WinnerCup} style={{width: '25px', height: '25px'}}></img></div>
          <button className="dashboard_btn" onClick={resetGameHandler}>Reset</button>
        </div>
      }
      <div>{ players?.length > 0 && getPlayerTurn() + '\'s Turn' }</div>
      <button className="dashboard_btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
      {/* <button className="dashboard_btn" onClick={() => navigate("/newgame")}>Refresh</button> */}
    </div>
  );
};

export default NewGame;