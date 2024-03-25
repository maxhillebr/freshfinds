import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FloatingActionButtons from "./Fab.jsx";
import GroceryBoxMain from "./GroceryBoxMain.jsx";
import NewList from "./NewList.jsx";

function App() {
  return (
    <Router>
      <div>
        <p>
          View your grocery list by tapping the whole card. You can edit, share,
          delete or mark a list as uncompleted.
        </p>

        <FloatingActionButtons />
        <Routes>
          <Route path="/" element={<GroceryBoxMain />} />
          <Route path="/new" element={<NewList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
