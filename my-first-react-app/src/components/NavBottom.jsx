import "/src/css/navbottom.css";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const NavBottom = () => {
  return (
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
  );
};

export default NavBottom;