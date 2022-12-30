import React from "react";

const EditableRow = ({
  editRoundData,
  handleEditRoundChange,
  handleCancelClick,
}) => {
  return (
    <tr>
      <td>
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancelClick}>
          Cancel
        </button>
      </td>
      {Object.keys(editRoundData)?.map((key, idx) => {
        if(key !== 'id') {
          return (
            <td>
              <input
                type="text"
                required="required"
                placeholder="Enter points..."
                name="fullName"
                value={editRoundData[key]}
                onChange={(e) => {
                  handleEditRoundChange(e, idx);
                }}
              ></input>
            </td>
          );
        }
      })}
    </tr>
  );
};

export default EditableRow;