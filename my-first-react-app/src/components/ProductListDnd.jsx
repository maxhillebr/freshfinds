import React from "react";
import Button from "@mui/material/Button";
import { Draggable } from "react-beautiful-dnd";

export default function ProductListDnd({ row, index, handleDelete }) {
  return (
    <Draggable key={row.id} draggableId={row.id.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="product-list-container__box">
            <div>{row.amount}</div>
            <div>{row.name}</div>
            <div>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => handleDelete(row.id)}
              >
                X
              </Button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
