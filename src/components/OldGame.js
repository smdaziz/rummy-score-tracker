import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGameHistoryData } from "../firebase";
import ReadOnlyRow from "./ReadOnlyRow";
import WinnerCup from './../assets/winner-cup.png';

const OldGame = (props) => {
  const navigate = useNavigate();

  const [game, setGame] = useState({});
  const [players, setPlayers] = useState([]);

  const [playerStats, setPlayerStats] = useState({});

  const gameId = useParams().gameId;

  useEffect(async () => {
    const gameHistory = await getGameHistoryData();

    const game = gameHistory.find(game => game.utcDateMS == gameId);

    // const players = game?.playerRanking?.map(player => player.name);
    const players = game?.players;
    setGame(game);
    setPlayers(players);

    const playerStats = {};
    players?.forEach(player => {
      playerStats[player] = {
        rummys: 0,
        drops: 0,
        outs: 0,
        seventyFives: 0
      }
    });

    game?.roundsData?.forEach(round => {
      players?.forEach(player => {
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
    console.log(playerStats);
    setPlayerStats(playerStats);
  }, []);

  return (
    <div>
      <br></br>
      <button class="btn btn-success my-1" onClick={() => navigate("/dashboard")}>Dashboard</button>
      <br></br>
      <button class="btn btn-success my-1" onClick={() => navigate("/gamehistory")}>Game History</button>
      <br></br>
      <button class="btn btn-success my-1" onClick={() => navigate("/gamestats")}>Game Stats</button>
      <h2 className="my-3" style={{color: 'green'}}>Game Played on {game?.date}</h2>
      <h4>Playing Order</h4>
      <ul>
        {
          players?.map(player => <li>{player} ({game?.playerRanking?.find(playerRank => playerRank.name === player).total})</li>)
        }
      </ul>
      <h4>Player Ranking</h4>
      <ul>
        {
          game?.playerRanking?.map(player => <li>{player.name} ({player.total})</li>)
        }
      </ul>
      <h4>Rounds Played: {game?.rounds}</h4>
      <h4>Winner: {game?.winner} <img src={WinnerCup} style={{width: '20px', height: '20px'}}></img></h4>
      <h4>Runner: {game?.runner}</h4>
      <h4 style={{color: 'green'}}>Game Details</h4>
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
              // game?.playerRanking?.map(player => <td>{player?.total}</td>)
              players?.map(player => <td>{game?.playerRanking?.find(playerRank => playerRank.name === player).total}</td>)
            }
          </tr>
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
            players?.map(player => (
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
    </div>
  );
};

export default OldGame;
