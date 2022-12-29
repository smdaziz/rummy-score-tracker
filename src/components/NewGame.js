import React, { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { nanoid } from "nanoid";
import "./NewGame.css";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";
import { deleteRoundData, getGameData, saveRoundData, updateRoundData } from "../firebase";

const NewGame = () => {
  const navigate = useNavigate();

  const [rounds, setRounds] = useState([]);
  const [addRoundData, setAddRoundData] = useState({
  });

  useEffect(async () => {
    const gameData = await getGameData();
    setRounds(gameData);
  }, []);

  const [editRoundData, setEditRoundData] = useState({
  });

  const [editRoundId, setEditRoundId] = useState(null);

  const handleAddRoundChange = (event, index) => {
    event.preventDefault();

    const fieldValue = event.target.value;

    const newRoundData = { ...addRoundData };
    newRoundData[index] = fieldValue;

    setAddRoundData(newRoundData);
  };

  const handleEditRoundChange = (event, index) => {
    event.preventDefault();

    const fieldValue = event.target.value;

    const newRoundData = { ...editRoundData };
    newRoundData[index] = fieldValue;

    setEditRoundData(newRoundData);
  };

  const handleAddRoundSubmit = (event) => {
    event.preventDefault();

    const newRound = {
      id: nanoid()
    };
    players?.map((player, idx) => {
      newRound[idx] = addRoundData[idx];
    });

    const newRounds = [...rounds, newRound];
    Object.keys(addRoundData)?.map((data, idx) => {
      addRoundData[idx] = '';
    });
    setRounds(newRounds);
    saveRoundData(newRound);
  };

  const handleEditRoundSubmit = (event) => {
    event.preventDefault();

    const editedRound = {
      id: editRoundId
    };
    players?.map((player, idx) => {
      editedRound[idx] = editRoundData[idx];
    });

    const newRounds = [...rounds];

    const index = rounds.findIndex((round) => round.id === editRoundId);

    newRounds[index] = editedRound;

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
      roundValues[idx] = round[idx];
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

  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');

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

  return (
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
      </form>
      <div className="app-container">
        <form onSubmit={handleEditRoundSubmit}>
          <table>
            <thead>
              <tr>
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
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </form>

        <h2>Enter Round Scores</h2>
        <form onSubmit={handleAddRoundSubmit}>
          {players?.map((player, idx) => 
          <input
            type="text"
            name="fullName"
            value={addRoundData[idx]}
            required="required"
            placeholder="Enter points..."
            onChange={
              (e) => {
                handleAddRoundChange(e, idx);
              }}
          />)}
          <button type="submit">Add</button>
        </form>

      </div>
      <button className="dashboard_btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
    </div>
  );
};

export default NewGame;