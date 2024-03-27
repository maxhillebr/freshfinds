import React from "react";
import { Button } from "@mui/material";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5NbqVvvMRbelJnyh95k13NzCazeUUQ6g",
  authDomain: "freshfinds-3456a.firebaseapp.com",
  projectId: "freshfinds-3456a",
  storageBucket: "freshfinds-3456a.appspot.com",
  messagingSenderId: "1016837431826",
  appId: "1:1016837431826:web:3d73c232b3e47885e5eecb",
};

// init firebase
const app = initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const colRef = collection(db, "groceryLists");

// get collection data
getDocs(colRef)
  .then((snapshot) => {
    // console.log(snapshot.docs);

    let groceryLists = [];
    snapshot.docs.forEach((doc) => {
      groceryLists.push({ ...doc.data(), id: doc.id });
    });
    // console.log(groceryLists);
  })
  .catch((err) => {
    console.log(err.message);
  });

export default function DBTest() {
  // Function to add a new entry with a unique ID
  const addNewGroceryList = async (title, description) => {
    try {
      const docRef = await addDoc(colRef, {
        title: title,
        description: description,
        products: products,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Example data
  const title = "New Grocery List";
  const description = "Description of the new grocery list";
  const products = [
    { id: 0, name: "apfel", amount: "2" },
    { id: 1, name: "banane", amount: "5" },
  ];

  return (
    <>
      <Button onClick={() => addNewGroceryList(title, description, products)}>
        Test
      </Button>
      <p>Test</p>
    </>
  );
}
// Fetch all groceryLists
// +++++++++++++++++++++++++++++++++++++++++++++++
// const GroceryListPage = () => {
//     // Define groceryLists state to store fetched data
//     const [groceryLists, setGroceryLists] = useState([]);

//     // Fetch data from Firestore inside useEffect
//     useEffect(() => {
//       const fetchGroceryLists = async () => {
//         try {
//           const colRef = collection(db, "groceryLists");
//           const querySnapshot = await getDocs(colRef);
//           const lists = [];

//           querySnapshot.forEach((doc) => {
//             lists.push({ ...doc.data(), id: doc.id });
//           });

//           setGroceryLists(lists);
//           console.log(lists);
//         } catch (error) {
//           console.error("Error fetching grocery lists:", error);
//         }
//       };

//       fetchGroceryLists();
//     }, []); // Empty dependency array to fetch data only once on component mount

//     return (
//       <>
//         {groceryLists.map(function (data) {
//           return (
//             <>
//               <div
//                 className="grocerybox"
//                 style={{
//                   backgroundColor: "#f1f1f1",
//                   padding: "1em",
//                   margin: "1em",
//                 }}
//               >
//                 <div>
//                   <p style={{ fontWeight: 600 }}>{data.title}</p>
//                   <p style={{ color: "grey" }}>{data.description}</p>
//                 </div>
//                 <div>
//                   <Button variant="contained">Edit</Button>
//                   <Button variant="outlined">Share</Button>
//                   <Button variant="outlined">Delete</Button>
//                 </div>
//               </div>
//             </>
//           );
//         })}
//       </>
//     );
//   };
// +++++++++++++++++++++++++++++++++++++++++++++++
