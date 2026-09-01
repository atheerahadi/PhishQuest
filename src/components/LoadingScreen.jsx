import mascot from "../assets/mascot/mascot.png";
import "../styles/loading.css";

function LoadingScreen() {

  return (

    <div className="loadingScreen">

      <img
        src={mascot}
        alt="Maskot"
        className="loadingLogo"
      />

      <h1>PhishQuest</h1>

      <p>

        Bijak Bertindak.
        <br/>
        Kekal Selamat.

      </p>

      <div className="loader">

        <div className="loaderFill"></div>

      </div>

      <span>Loading...</span>

    </div>

  );

}

export default LoadingScreen;