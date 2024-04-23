import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { db, storage } from "/src/components/auth/firebase";
import useFirebaseAuth from "/src/components/auth/AuthFirebase";

import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import { generateUUID } from "../../common/UUIDGenerator";
import { copyToClipboard } from "../common/CopyToClipboard";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RecipeBoxMain() {
  // unique id
  const newId = generateUUID();

  // load user info
  const { user, username } = useFirebaseAuth();

  // db, copy to clipboard path
  const recipeListPath = "recipes";

  // Define groceryLists state to store fetched data
  const [recipeData, setRecipeData] = useState([]);

  // Fetch data from Firestore inside useEffect
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        if (!user || !username) {
          console.error(
            "User is not authenticated or display name is undefined."
          );
          return; // Exit the function early
        }

        fetchColGetDoc();
      } catch (error) {
        console.error("Error fetching grocery lists:", error);
      }
    };

    fetchRecipeData();
  }, []); // Empty dependency array to fetch data only once on component mount

  const fetchColGetDoc = async () => {
    const colRef = collection(db, "users", username, recipeListPath);
    const querySnapshot = await getDocs(colRef);
    const lists = [];

    querySnapshot.forEach((doc) => {
      lists.push({ ...doc.data(), id: doc.id });
    });

    setRecipeData(lists);
    console.log(lists);
  };

  const handleDeleteDoc = async (id, imageId) => {
    try {
      // Delete the image from Firebase Storage
      const storageRef = ref(
        storage,
        `users/${username}/images/${recipeListPath}/${imageId}`
      );
      await deleteObject(storageRef);
      console.log("Image deleted successfully");

      // Delete the document from Firestore
      const docRef = doc(db, "users", username, recipeListPath, id);
      await deleteDoc(docRef);
      console.log("Document deleted successfully");

      // Optionally, you can navigate to another page or show a success message
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        console.log("No image found in storage. Deleting document only.");
        // If image is not found in storage, you may choose to only delete the document
        const docRef = doc(db, "users", username, "recipes", id);
        await deleteDoc(docRef);
        console.log("Document deleted successfully");
      } else {
        console.error("Error deleting image or document:", error);
      }
    }
    alert("Grocery Recipe deleted");
    fetchColGetDoc();
  };

  return (
    <>
      {recipeData.map(function (data) {
        return (
          <div className="recipes-container__box" key={data.id}>
            <a href={`/users/${username}/${recipeListPath}/${data.id}`}>
              <div
                className="recipes-container__img"
                style={{
                  backgroundImage: `url(${data.imageUrl})`,
                }}
              ></div>

              <div className="recipes-container__tag-title">
                <div>
                  <p className="recipes-container__tag--main">{data.tag}</p>
                  <h3 className="recipes-container__title">{data.title}</h3>
                </div>
              </div>
            </a>
            <div className="recipes-container__action-btn">
              <Link to={`/users/${username}/${recipeListPath}/${data.id}/edit`}>
                <div className="grocer-list-container__action-btn--edit">
                  <EditNoteIcon />
                </div>
              </Link>
              <div
                className="grocer-list-container__action-btn--share"
                onClick={() =>
                  copyToClipboard(username, recipeListPath, data.id)
                }
              >
                <ShareIcon />
              </div>
              <div
                className="grocer-list-container__action-btn--del"
                onClick={() => handleDeleteDoc(data.id, data.imageId)}
              >
                <DeleteIcon />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
