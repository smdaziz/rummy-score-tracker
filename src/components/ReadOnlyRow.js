import React from "react";

const ReadOnlyRow = ({ round, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      {Object.keys(round)?.map(key => {
        if(key !== 'id') {
          return (<td>{round[key]}</td>);
        }
      })}
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
    </tr>
  );
};

export default ReadOnlyRow;