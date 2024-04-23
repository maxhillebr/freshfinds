import Button from "@mui/material/Button";

import EditNoteIcon from "@mui/icons-material/EditNote";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function MealPlanBoxMain() {
  return (
    <>
      <div className="title-container__view-all-btn">
        <Button variant="contained" endIcon={<VisibilityIcon />}>
          View All
        </Button>
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
      </div>
    </>
  );
}
