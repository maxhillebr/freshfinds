import Button from "@mui/material/Button";
import "/src/css/main.css";
import "/src/css/start.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const FrontpageLoginSignUp = () => {
  return (
    <>
      <div className="content">
        <div className="content-main">
          <div className="logo-container">
            <img src="/freshfinds-logo.png" alt="freshfinds logo" />
          </div>
          <div className="entry-text">
            <p>Deine App für Einkäufe & Rezepte.</p>
          </div>
          <div className="button-container">
            <Button href="/signup" variant="contained">
              Account erstellen
            </Button>
            <p className="button-container__text">oder</p>

            <a href="/login">Einloggen</a>
          </div>
          <div className="credentials-container">
            <div>
              <GitHubIcon />
            </div>
            <div>
              <LinkedInIcon />
            </div>
          </div>
        </div>
        <div className="bottom-illustration">
          <img
            src="/illustrations/undraw_eating_together_re_ux62.svg"
            alt="cooking together"
          />
        </div>
      </div>
    </>
  );
};
export default FrontpageLoginSignUp;
