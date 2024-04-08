import "./css/HomeTest.css";
import "./css/main.css";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

function HomeTest() {
  return (
    <div>
      <div className="title-welcome">
        <h1>Welcome back, Max</h1>
      </div>
      <div className="title-container">
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
            <p className="mealplan-container__tag--main">List</p>
            <h3>Groceries List 1</h3>
            <p>Description</p>
          </div>
          <div className="mealplan-container__recipes">
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
      </div>

      <div className="title-container">
        <div className="title-container__title">
          <h2>Your Lists</h2>
        </div>
        <div className="title-container__view-all-btn">
          <Button variant="contained" endIcon={<VisibilityIcon />}>
            View All
          </Button>
        </div>
      </div>

      <div className="grocery-list-container">
        <div className="grocery-list-container__box">
          <div className="grocery-list-container__tag-title">
            <p className="grocery-list-container__tag--main">List</p>
            <h3>Groceries List 1</h3>
            <p>Description</p>
          </div>
          <div className="grocery-list-container__action-btn">
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
      </div>

      {/* recipes */}

      <div className="title-container">
        <div className="title-container__title">
          <h2>Your Recipes</h2>
        </div>
        <div className="title-container__view-all-btn">
          <Button variant="contained" endIcon={<VisibilityIcon />}>
            View All
          </Button>
        </div>
      </div>

      <div className="recipes-container">
        <div className="recipes-container__box">
          <div className="recipes-container__img"></div>
          <div className="recipes-container__tag-title">
            <div>
              <p className="recipes-container__tag--main">Fish</p>
              <h3 className="recipes-container__title">Chicken Salad</h3>
              <p>My favorite chicken salad recipe</p>
            </div>
            <div className="recipes-container__action-btn">
              <EditNoteIcon />
              <ShareIcon />
              <DeleteIcon />
            </div>
          </div>
        </div>

        <div className="create-container">
          <div className="create-container__title">
            <h3>Create List</h3>
            <AddCircleOutlineIcon
              fontSize="large"
              style={{ color: "#1976D2" }}
            />
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <ul>
          <li>
            <a href="#">
              <HomeIcon />
            </a>
          </li>
          <li>
            <a href="#">
              <AddCircleOutlineIcon
                fontSize="large"
                style={{ color: "#1976D2" }}
              />
            </a>
          </li>
          <li>
            <a href="#">
              <SettingsIcon />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default HomeTest;
