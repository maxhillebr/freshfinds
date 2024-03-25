export default function NewList() {
  return (
    <div>
      <h2>Add New Item</h2>
      {/* Your form for adding new items goes here */}
      {/* For example:*/}
      <form>
        <label>Title:</label>
        <input type="text" name="title" />
        <label>Description:</label>
        <textarea name="description"></textarea>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}
