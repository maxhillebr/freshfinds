export default function AddProduct() {
  return (
    <>
      <div className="add-product-container">
        <TextField
          required
          id="grocery-list-amount"
          className="add-product-container__amount"
          label="Amount"
          value={amount}
          onChange={handleAmountChange}
        />
        <TextField
          required
          id="grocery-list-product"
          className="add-product-container__title"
          label="Product"
          value={product}
          onChange={handleProductChange}
        />
      </div>
      <div className="add-product-btn">
        <Button id="add-button" variant="contained" onClick={handleAddProducts}>
          Add
        </Button>
      </div>
      <div className="title-product-list">
        <h2>List</h2>
      </div>
      <div className="product-list-container">
        <div className="product-list-container__header">
          <div>Amount</div>
          <div>Product</div>
          <div>Delete</div>
        </div>
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
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
}
