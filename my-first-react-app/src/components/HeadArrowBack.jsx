import "/src/css/headarrowback.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const HeadArrowBack = () => {
  return (
    <div className="back-home-container">
      <a href="/hometest">
        <ArrowBackIosIcon />
      </a>
    </div>
  );
};

export default HeadArrowBack;
