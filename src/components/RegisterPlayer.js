import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRegisteredPlayers, registerPlayer } from "../firebase";

import "./NewGame.css";

const RegisterPlayer = () => {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');

  useEffect(async () => {
    const savedPlayers = await getRegisteredPlayers();
    setPlayers(savedPlayers);
  }, []);

  const handleRegisterPlayerChange = (event) => {
    event.preventDefault();

    const fieldValue = event.target.value;

    setPlayerName(fieldValue);
  };

  const handleRegisterPlayerSubmit = async (event) => {
    event.preventDefault();
    
    await registerPlayer({
      name: playerName,
      id: Date.now()
    });

    setPlayerName('');
    const savedPlayers = await getRegisteredPlayers();
    setPlayers(savedPlayers);
  };

  return (
    <div>
      <div>
        <h2>Players</h2>
        <form onSubmit={handleRegisterPlayerSubmit}>
          <input
            type="text"
            name="player"
            value={playerName}
            required="required"
            placeholder="Enter Player Name..."
            onChange={handleRegisterPlayerChange}
          />
          <button type="submit">Register</button>
        </form>
      </div>
      {
        players?.length > 0 &&
        <div>
          <table class="table">
            <thead>
              <tr>
                <th>Player Number</th>
                <th>Player Name</th>
              </tr>
            </thead>
            <tbody>
                {players?.map((player, idx) => 
                  <tr>
                    <td>{idx+1}</td>
                    <td>{player}</td>
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

export default RegisterPlayer;