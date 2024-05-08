import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import "/src/css/headarrowback.css";

const HeadArrowBack = () => {
  const navigate = useNavigate(); // Access the navigate function

  const goBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div
      className="back-home-container"
      onClick={goBack}
      style={{ cursor: "pointer" }}
    >
      <ArrowBackIosIcon />
    </div>
  );
};

export default HeadArrowBack;
