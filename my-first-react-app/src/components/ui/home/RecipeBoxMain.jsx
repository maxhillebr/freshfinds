import { useState, useEffect, useId } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { db, storage } from "/src/components/auth/firebase";

import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { getAuth } from "firebase/auth";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RecipeBoxMain() {
  const generateUUID = () => {
    let uuid = "";
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

    for (let i = 0; i < 25; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += "-";
      }
      uuid += chars[randomNumber];
    }
    return uuid;
  };

  // unique id
  const newId = generateUUID();

  const auth = getAuth();
  const user = auth.currentUser;
  const username = user.displayName;

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
    const colRef = collection(db, "users", username, "recipes");
    const querySnapshot = await getDocs(colRef);
    const lists = [];

    querySnapshot.forEach((doc) => {
      lists.push({ ...doc.data(), id: doc.id });
    });

    setRecipeData(lists);
    console.log(lists);
  };

  // const handleDeleteDoc = async (id, imageId) => {
  //   const colRef = doc(db, "users", username, "recipes", id);
  //   const storageRef = ref(storage, "users", username, "recipes", imageId);

  //   if (storageRef === undefined) {
  //     await deleteObject(storageRef);
  //     console.log("Deleted image with id", imageId);
  //   } else {
  //     console.log("This recipe has no image.");
  //   }

  //   await deleteDoc(colRef);

  //   console.log("Document deleted", id);
  //   alert("Grocery List deleted");
  //   fetchColGetDoc();
  // };

  const handleDeleteDoc = async (id, imageId) => {
    try {
      // Delete the image from Firebase Storage
      const storageRef = ref(
        storage,
        `users/${username}/images/recipes/${imageId}`
      );
      await deleteObject(storageRef);
      console.log("Image deleted successfully");

      // Delete the document from Firestore
      const docRef = doc(db, "users", username, "recipes", id);
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

  // copy to clipboard for share
  const copyToClipboard = async (username, id) => {
    try {
      const url = `${window.location.host}/users/${username}/recipes/${id}`;

      await navigator.clipboard.writeText(url);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy to clipboard");
    }
  };

  return (
    <>
      {recipeData.map(function (data) {
        return (
          <div className="recipes-container__box" key={data.id}>
            <a href={`/users/${username}/recipes/${data.id}`}>
              <div
                className="recipes-container__img"
                style={{
                  backgroundImage: `url(${data.imageUrl})`,
                }}
              ></div>

              <div className="recipes-container__tag-title">
                <div>
                  <p className="recipes-container__tag--main">Tag</p>
                  <h3 className="recipes-container__title">{data.title}</h3>
                </div>
              </div>
            </a>
            <div className="recipes-container__action-btn">
              <Link to={`/users/${username}/recipes/${data.id}/edit`}>
                <div className="grocer-list-container__action-btn--edit">
                  <EditNoteIcon />
                </div>
              </Link>
              <div
                className="grocer-list-container__action-btn--share"
                onClick={() => copyToClipboard(username, data.id)}
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
