import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "/src/components/auth/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import useFirebaseAuth from "/src/components/auth/AuthFirebase";

import EditNoteIcon from "@mui/icons-material/EditNote";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";

import { copyToClipboard } from "../common/CopyToClipboard";
import { generateUUID } from "../../common/UUIDGenerator";

export default function MealPlanBoxMain() {
  // unique id
  const newId = generateUUID();

  // load user info
  const { user, username } = useFirebaseAuth();

  // db, copy to clipboard path
  const mealplanListPath = "mealplan";

  // Define groceryLists state to store fetched data
  const [mealplan, setMealplan] = useState([]);

  // Fetch data from Firestore inside useEffect
  useEffect(() => {
    const fetchMealplan = async () => {
      try {
        if (!user || !username) {
          console.error(
            "User is not authenticated or display name is undefined."
          );
          return; // Exit the function early
        }

        fetchColGetDoc();
      } catch (error) {
        console.error("Error fetching mealplan:", error);
      }
    };

    fetchMealplan();
  }, []); // Empty dependency array to fetch data only once on component mount

  const fetchColGetDoc = async () => {
    const colRef = collection(db, "users", username, mealplanListPath);
    const querySnapshot = await getDocs(colRef);
    const plan = [];

    querySnapshot.forEach((doc) => {
      plan.push({ ...doc.data(), docId: doc.id });
    });

    setMealplan(plan);
    console.log("mealplan:", plan);
  };

  const handleDeleteDoc = async (id) => {
    const colRef = doc(db, "users", username, mealplanListPath, id);
    await deleteDoc(colRef);

    console.log("Document deleted", id);
    alert("Essensplan gelöscht");
    fetchColGetDoc();
  };
  return (
    <>
      {mealplan.map(function (data) {
        return (
          <div className="mealplan-container" key={data.docId}>
            <div className="mealplan-container__box">
              <a href={`/users/${username}/${mealplanListPath}/${data.docId}`}>
                <div className="mealplan-container__tag-title">
                  <p className="mealplan-container__tag--main">Essensplan</p>
                  <h3>{data.title}</h3>
                </div>
              </a>
              <div className="mealplan-container__recipes">
                {data.recipes.map((recipe) => (
                  <p key={recipe.id}>{recipe.title}</p>
                ))}
              </div>
              <div className="mealplan-container__action-btn">
                <Link
                  to={`/users/${username}/${mealplanListPath}/${data.docId}/edit`}
                >
                  <div className="mealplan-container__action-btn--edit">
                    <EditNoteIcon />
                  </div>
                </Link>
                <div
                  className="mealplan-container__action-btn--share"
                  onClick={() =>
                    copyToClipboard(username, mealplanListPath, data.docId)
                  }
                >
                  <ShareIcon />
                </div>
                <div
                  className="grocery-list-container__action-btn--del"
                  onClick={() => handleDeleteDoc(data.docId)}
                >
                  <DeleteIcon />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
