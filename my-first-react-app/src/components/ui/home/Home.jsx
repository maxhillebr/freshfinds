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
          <h1>Hi, {username}</h1>
        </div>
        <div className="title-container">
          <div className="title-container__title">
            <h2>Your Weekly Mealplan</h2>
          </div>
        </div>
        <MealPlanBoxMain />

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
