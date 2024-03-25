import "./App.css";
import FloatingActionButtons from "./Fab.jsx";
import GroceryBoxMain from "./GroceryBoxMain.jsx";

function App() {
  return (
    <>
      <div>
        <p>
          View your grocery list by tapping the whole card. You can edit, share,
          delete or mark a list as uncompleted.
        </p>

        <FloatingActionButtons />
        <GroceryBoxMain />
        <GroceryBoxMain />
        <GroceryBoxMain />
      </div>
    </>
  );
}

export default App;
