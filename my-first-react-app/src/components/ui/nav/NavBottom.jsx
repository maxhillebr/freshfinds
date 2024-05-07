import React, { useState } from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Import an icon that indicates a dropdown
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import "/src/css/navbottom.css";

const NavBottom = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="bottom-nav">
      <ul>
        <li>
          <Link to="/home">
            <HomeIcon />
          </Link>
        </li>
        <li>
          <IconButton
            aria-controls="create-new-menu"
            aria-haspopup="true"
            onClick={handleClick}
            style={{ color: "#1976D2", position: "relative" }}
          >
            <AddCircleOutlineIcon fontSize="large" />
            <ExpandMoreIcon
              style={{
                position: "absolute",
                top: "6px",
                right: "-4px",
                fontSize: "medium",
              }}
            />
          </IconButton>
          <Menu
            id="create-new-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} component={Link} to="/newmealplan">
              Essensplan
            </MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/new">
              Einkaufsliste
            </MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/newrecipe">
              Rezepte
            </MenuItem>
          </Menu>
        </li>
        <li>
          <Link to="/account">
            <SettingsIcon />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBottom;
