import React from "react";

const ReadOnlyRow = ({ round, players, handleEditClick, handleDeleteClick }) => {
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