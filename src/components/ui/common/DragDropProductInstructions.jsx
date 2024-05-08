import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

export default function DragDropProductInstructions({
  instructions,
  setInstructions,
}) {
  const onDragEndInstructions = (result) => {
    if (!result.destination) return;

    const items = Array.from(instructions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setInstructions(items);
  };

  const handleDeleteInstruction = (id) => {
    const updatedInstructions = instructions.filter(
      (instruction) => instruction.id !== id
    );
    setInstructions(updatedInstructions);
  };

  return (
    <DragDropContext onDragEnd={onDragEndInstructions}>
      <Droppable droppableId="instructions">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {instructions.map((instruction, index) => (
              <Draggable
                key={instruction.id}
                draggableId={instruction.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <div className="instruction-container-recipe__box">
                      <div>{instruction.instruction}</div>
                      <div>
                        <IconButton
                          aria-label="delete"
                          onClick={() =>
                            handleDeleteInstruction(instruction.id)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
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
