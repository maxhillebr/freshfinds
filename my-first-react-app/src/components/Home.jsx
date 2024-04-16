import "/src/css/home.css";
import "/src/css/main.css";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NavBottom from "./NavBottom";
import GroceryBoxMainTest from "./GroceryBoxMain";
import RecipeBoxMain from "./RecipeBoxMain";
import { getAuth } from "firebase/auth";

function Home() {
  const auth = getAuth();
  const user = auth.currentUser;
  const username = user.displayName;

  return (
    <>
      <div className="content">
        <div className="title-welcome">
          <h1>Welcome back, {username}</h1>
        </div>
        {/* <div className="title-container">
          <div className="title-container__title">
            <h2>Your Weekly Mealplan</h2>
          </div>
          <div className="title-container__view-all-btn">
            <Button variant="contained" endIcon={<VisibilityIcon />}>
              View All
            </Button>
          </div>
        </div>

        <div className="mealplan-container">
          <div className="mealplan-container__box">
            <div className="mealplan-container__tag-title">
              <p className="mealplan-container__tag--main">Mealplan</p>
              <h3>Groceries List 1</h3>
              <p>Description</p>
            </div>
            <div className="mealplan-container__recipes">
              <h3>Recipes</h3>
              <p>Chicken Teriyaki</p>
              <p>Sushi Bowl</p>
              <p>vegan Schnitzel</p>
            </div>
            <div className="mealplan-container__action-btn">
              <EditNoteIcon />
              <ShareIcon />
              <DeleteIcon />
            </div>
          </div>

          <div className="create-container">
            <div className="create-container__title">
              <h3>Create List </h3>
              <AddCircleOutlineIcon
                fontSize="large"
                style={{ color: "#1976D2" }}
              />
            </div>
          </div>
        </div> */}

        <div className="title-container">
          <div className="title-container__title">
            <h2>Your Lists</h2>
          </div>
          {/* <div className="title-container__view-all-btn">
            <Button variant="contained" endIcon={<VisibilityIcon />}>
              View All
            </Button>
          </div> */}
        </div>

        <div className="grocery-list-container">
          <GroceryBoxMainTest />
        </div>

        <a href="/new">
          <div className="create-container">
            <div className="create-container__title">
              <h3>Create List </h3>
              <AddCircleOutlineIcon
                fontSize="large"
                style={{ color: "#1976D2" }}
              />
            </div>
          </div>
        </a>

        {/* recipes */}

        <div className="title-container">
          <div className="title-container__title">
            <h2>Your Recipes</h2>
          </div>
        </div>

        <div className="recipes-container">
          <RecipeBoxMain />
        </div>

        <a href="/newrecipe">
          <div className="create-container">
            <div className="create-container__title">
              <h3>Create Recipe </h3>
              <AddCircleOutlineIcon
                fontSize="large"
                style={{ color: "#1976D2" }}
              />
            </div>
          </div>
        </a>
      </div>

      <NavBottom />
    </>
  );
}

export default Home;
