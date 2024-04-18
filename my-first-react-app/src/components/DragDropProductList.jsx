import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Button from "@mui/material/Button";

export default function DragDropProductList({ rows, setRows }) {
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(rows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRows(items);
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter((product) => product.id !== id);
    setRows(updatedRows);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="rows">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {rows.map((row, index) => (
              <Draggable
                key={row.id}
                draggableId={row.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
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
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
