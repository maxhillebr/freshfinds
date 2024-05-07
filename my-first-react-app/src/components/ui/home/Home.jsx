import "/src/css/home.css";
import "/src/css/main.css";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NavBottom from "../nav/NavBottom";
import GroceryBoxMainTest from "./GroceryBoxMain";
import RecipeBoxMain from "./RecipeBoxMain";
import useFirebaseAuth from "/src/components/auth/AuthFirebase";
import MealPlanBoxMain from "./MealPlanBoxMain";

function Home() {
  // load user info
  const { username } = useFirebaseAuth();

  return (
    <>
      <div className="content">
        <div className="title-welcome">
          <h1>Hallo, {username}</h1>
        </div>
        <div className="title-container">
          <div className="title-container__title">
            <h2>Deine Essenspläne</h2>
          </div>
        </div>
        <MealPlanBoxMain />

        <a href="/newmealplan">
          <div className="create-container">
            <div className="create-container__title">
              <h3>Neuer Essensplan</h3>
              <AddCircleOutlineIcon
                fontSize="large"
                style={{ color: "#1976D2" }}
              />
            </div>
          </div>
        </a>

        <div className="title-container">
          <div className="title-container__title">
            <h2>Deine Einkaufslisten</h2>
          </div>
        </div>

        <div className="grocery-list-container">
          <GroceryBoxMainTest />
        </div>

        <a href="/new">
          <div className="create-container">
            <div className="create-container__title">
              <h3>Neue Einkaufsliste</h3>
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
            <h2>Deine Rezepte</h2>
          </div>
        </div>

        <div className="recipes-container">
          <RecipeBoxMain />
        </div>

        <a href="/newrecipe">
          <div className="create-container">
            <div className="create-container__title">
              <h3>Neues Rezept</h3>
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
