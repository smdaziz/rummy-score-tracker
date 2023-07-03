import React from "react";

const ReadOnlyRow = ({ round, roundIndex, players, rounds, handleEditClick, handleDeleteClick }) => {
  //calculate subround total - start
  const subRoundTotal = [];
  let playerSubScores = {};
  players?.forEach(player => playerSubScores[player] = 0);
  for(let i = 0; i <= rounds?.length; i++) {
    if (i > 0 && i % players?.length == 0) {
      let playerSubScoresTemp = Object.assign({}, playerSubScores);
      subRoundTotal[(i / players?.length) - 1] = playerSubScoresTemp;
    }
    if (i < rounds?.length) {
      players?.forEach(player => {
        playerSubScores[player] += Number(rounds[i][player]);
      });
    }
  }
  console.log('subRoundTotal', subRoundTotal);
  //calculate subround total - end
  if (roundIndex > 0 && roundIndex % players.length === 0) {
    return (
      <>
        <tr class="round-total">
          <td><b>Round {roundIndex/players.length}</b></td>
          {
            players?.map(player => <td>{subRoundTotal?.[(roundIndex / players.length) - 1]?.[player]}</td>)
          }
        </tr>
        <tr>
          <td>
            <button
              type="button"
              onClick={(event) => handleEditClick(event, round)}
            >
              Edit
            </button>
            <button type="button" onClick={() => handleDeleteClick(round.id)}>
              Delete
            </button>
          </td>
          {
            players?.map(player => <td>{round[player]}</td>)
          }
        </tr>
      </>
    );
  }
  return (
    <tr>
      <td>
        <button
          type="button"
          onClick={(event) => handleEditClick(event, round)}
        >
          Edit
        </button>
        <button type="button" onClick={() => handleDeleteClick(round.id)}>
          Delete
        </button>
      </td>
      {
        // Object.keys(round)?.map(key => {
        //   if(key !== 'id') {
        //     return (<td>{round[key]}</td>);
        //   }
        // })
        players?.map(player => <td>{round[player]}</td>)
      }
    </tr>
  );
};

export default ReadOnlyRow;