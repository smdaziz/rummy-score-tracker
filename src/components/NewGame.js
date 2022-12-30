import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { nanoid } from "nanoid";
import "./NewGame.css";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";
import { deleteRoundData, getGameData, getPlayers, savePlayers, saveRoundData, updateRoundData } from "../firebase";

const NewGame = () => {
  const navigate = useNavigate();

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
  }, []);

  const handleAddPlayerChange = (event) => {
    event.preventDefault();

    const fieldValue = event.target.value;

    setPlayerName(fieldValue);
  };

  const handleAddPlayerSubmit = (event) => {
    event.preventDefault();

    players.push(playerName);
    setPlayerName('');

    setPlayers(players);
  };

  const savePlayersHandler = (event) => {
    event.preventDefault();

    savePlayers(players);
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

  return (
    <div>
      {
        !allPlayersAdded && 
        <div>
          <h2>Add a Player</h2>
          <form onSubmit={handleAddPlayerSubmit}>
            <input
              type="text"
              name="player"
              value={playerName}
              required="required"
              placeholder="Enter Player Name..."
              onChange={handleAddPlayerChange}
            />
            <button type="submit">Add Player</button>
            <button onClick={savePlayersHandler}>Done</button>
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
                        players={players}
                        handleEditClick={handleEditClick}
                        handleDeleteClick={handleDeleteClick}
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
                    <button type="submit" style={{width: '150px'}}>Add</button>
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
        gameOver && winner + ' won the game!!'
      }
      <button className="dashboard_btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
      {/* <button className="dashboard_btn" onClick={() => navigate("/newgame")}>Refresh</button> */}
    </div>
  );
};

export default NewGame;