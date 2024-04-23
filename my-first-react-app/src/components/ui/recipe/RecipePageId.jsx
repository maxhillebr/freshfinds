// grocery list rending for user specific data

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "/src/components/auth/firebase";
import { doc, getDoc } from "firebase/firestore";
import Button from "@mui/material/Button";
import ShareIcon from "@mui/icons-material/Share";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import HomeIcon from "@mui/icons-material/Home";
import HeadArrowBack from "../nav/HeadArrowBack";
import NavBottom from "../nav/NavBottom";
import "/src/css/main.css";
import "/src/css/displaylists.css";

const RecipePageId = () => {
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

  const { username, listId } = useParams(); // Extract the document ID from the URL
  const [recipeData, setRecipeData] = useState(null);
  const [itemColors, setItemColors] = useState({});
  const [selectedServings, setSelectedServings] = useState();

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const docRef = doc(db, "users", username, "recipes", listId);
        console.log("Document Reference:", docRef);

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Initialize item colors
          const initialColors = {};
          data.products.forEach((product) => {
            initialColors[product.id] = "#fff6e3";
          });
          setItemColors(initialColors);

          // Store servings in a local variable
          const servings = data.servings;

          // Set recipe data and selectedServings
          setRecipeData(data);
          setSelectedServings(servings);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRecipeData();
  }, [username, listId]);

  const handleItemClick = (itemId) => {
    // Toggle color for the clicked item
    setItemColors((prevColors) => ({
      ...prevColors,
      [itemId]: prevColors[itemId] === "#fff6e3" ? "#74e3915e" : "#fff6e3",
    }));
  };

  const handleServingsChange = (event) => {
    setSelectedServings(event.target.value);
  };

  const normalizeAmount = (amount) => {
    // Replace commas with periods for consistent input handling
    return amount.replace(",", ".");
  };

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        {/* Render grocery list data */}
        {recipeData && (
          <>
            <div
              className="recipe-cover-img"
              style={{
                backgroundImage: `url(${recipeData.imageUrl})`,
              }}
            ></div>
            <h2>
              {recipeData.title} ({recipeData.tag})
            </h2>

            <div className="display-title-box">
              <div className="display-title-box__title">
                <h3>Items you need</h3>
              </div>
              <div className="display-title-box__calc">
                <Select
                  value={selectedServings}
                  onChange={handleServingsChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((servings) => (
                    <MenuItem key={servings} value={servings}>
                      {servings}
                    </MenuItem>
                  ))}
                </Select>
                Servings
              </div>
            </div>
            <div className="display-list-container">
              {recipeData.products.map((product) => (
                <div
                  key={product.id}
                  className="display-list-container__box"
                  onClick={() => handleItemClick(product.id)}
                  style={{
                    backgroundColor: itemColors[product.id],
                    cursor: "pointer",
                  }}
                >
                  <div className="display-list-container__product">
                    {product.name}
                  </div>
                  <div className="display-list-container__amount">
                    {(
                      parseFloat(normalizeAmount(product.amount)) *
                      selectedServings
                    ).toFixed(2)}
                    {product.unit}
                  </div>
                </div>
              ))}
            </div>
            <h3>Instructions</h3>
            <div className="display-instruction-container">
              {recipeData.instructions.map((instruction, index) => (
                <div
                  key={instruction.id}
                  className="display-instruction-container__box"
                  onClick={() => handleItemClick(instruction.id)}
                  style={{
                    backgroundColor: itemColors[instruction.id],
                    cursor: "pointer",
                  }}
                >
                  <div className="display-instruction-container__instruction">
                    {index + 1}. {instruction.instruction}
                  </div>
                </div>
              ))}
            </div>
            <div className="display-list-action-btn">
              <Button
                href={`/users/${username}/recipes/${listId}/edit`}
                id="edit"
                variant="contained"
              >
                <EditNoteIcon />
              </Button>
              <Button
                onClick={() => copyToClipboard(username, listId)}
                variant="outlined"
              >
                <ShareIcon />
              </Button>
              <Button href="/home" id="home-button" variant="outlined">
                <HomeIcon />
              </Button>
            </div>
          </>
        )}
      </div>

      <NavBottom />
    </>
  );
};

export default RecipePageId;
