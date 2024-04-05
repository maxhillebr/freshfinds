import "./HomeTest.css";

// BottomNav.js
import React from "react";
import "./HomeTest.css"; // Import the CSS file for styling

function HomeTest() {
  return (
    <div>
      <h1>Your Content Goes Here</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor,
        turpis vel rutrum ullamcorper, massa libero accumsan metus, id mollis
        elit risus non ex.
      </p>

      <nav className="bottom-nav">
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default HomeTest;
