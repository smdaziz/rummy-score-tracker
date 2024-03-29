import React from "react";

const ReadOnlyRow = ({ round, roundIndex, players, rounds, handleEditClick, handleDeleteClick, oldGame }) => {
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
          {
            !oldGame ? 
            <td>
              <button
                type="button"
                class="btn btn-success mx-1"
                onClick={(event) => handleEditClick(event, round)}
              >
                Edit
              </button>
              <button type="button" class="btn btn-warning" onClick={() => handleDeleteClick(round.id)}>
                Delete
              </button>
            </td>
            : <td>{roundIndex + 1}</td>
          }
          {
            players?.map(player => {
              const points = Number(round[player]);
              const style = {};
              if (points <= 25) {
                style['color'] = 'green';
              } else if (points > 25 && points <= 50) {
                style['color'] = 'orange';
              } else if (points > 50) {
                style['color'] = 'red';
              }
              return <td style={style}>{round[player]}</td>;
            })
          }
        </tr>
      </>
    );
  }
  return (
    <tr>
      {
        !oldGame ?
        <td>
          <button
            type="button"
            class="btn btn-success mx-1"
            onClick={(event) => handleEditClick(event, round)}
          >
            Edit
          </button>
          <button type="button" class="btn btn-warning" onClick={() => handleDeleteClick(round.id)}>
            Delete
          </button>
        </td>
        : <td>{roundIndex + 1}</td>
      }
      {
        // Object.keys(round)?.map(key => {
        //   if(key !== 'id') {
        //     return (<td>{round[key]}</td>);
        //   }
        // })
        players?.map(player => {
          const points = Number(round[player]);
          const style = {};
          if (points <= 25) {
            style['color'] = 'green';
          } else if (points > 25 && points <= 50) {
            style['color'] = 'orange';
          } else if (points > 50) {
            style['color'] = 'red';
          }
          return <td style={style}>{round[player]}</td>;
        })
      }
    </tr>
  );
};

export default ReadOnlyRow;