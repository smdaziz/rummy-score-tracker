import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGameHistoryData } from "../firebase";
import ReadOnlyRow from "./ReadOnlyRow";
import WinnerCup from './../assets/winner-cup.png';

const OldGame = (props) => {
  const navigate = useNavigate();

  const [game, setGame] = useState({});
  const [players, setPlayers] = useState([]);

  const gameId = useParams().gameId;

  useEffect(async () => {
    const gameHistory = await getGameHistoryData();

    const game = gameHistory.find(game => game.utcDateMS == gameId);

    const players = game?.playerRanking?.map(player => player.name);
    setGame(game);
    setPlayers(players);
  }, []);

  return (
    <div>
      <h2>Game Played on {game?.date}</h2>
      <h4>Players</h4>
      <ul>
        {
          players?.map(player => <li>{player}</li>)
        }
      </ul>
      <h4>Rounds Played: {game?.rounds}</h4>
      <h4>Winner: {game?.winner} <img src={WinnerCup} style={{width: '20px', height: '20px'}}></img></h4>
      <h4>Runner: {game?.runner}</h4>
      <h4>Game Details</h4>
      <table class="table rummy-table">
        <thead>
          <tr>
            {players?.length > 0 && <th>Turn #</th>}
            {players?.map(player => <th>{player}</th>)}
          </tr>
        </thead>
        <tbody>
          {game?.roundsData?.map((round, idx) => (
            <Fragment>
              <ReadOnlyRow
                round={round}
                roundIndex={idx}
                players={players}
                rounds={game?.roundsData}
                oldGame={true}
              />
            </Fragment>
          ))}
          <tr class="total">
            <td><b>Total</b></td>
            {
              game?.playerRanking?.map(player => <td>{player?.total}</td>)
            }
          </tr>
        </tbody>
      </table>
      <button class="btn btn-success my-1" onClick={() => navigate("/gamehistory")}>Game History</button>
      <br></br>
      <button class="btn btn-success my-1" onClick={() => navigate("/dashboard")}>Dashboard</button>
    </div>
  );
};

export default OldGame;
