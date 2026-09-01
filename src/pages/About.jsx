import Sidebar from "../components/Sidebar";
import mascot from "../assets/mascot/mascot.png";
import "../styles/sidebar.css";
import "../styles/about.css";

function About() {

  return (

    <>
      <Sidebar />

      <div className="about-page">

        <h1>ℹ️ Tentang PhishQuest</h1>

        <div className="about-card">

          <img
            src={mascot}
            alt="PhishQuest"
            className="about-logo"
          />

          <h2>PhishQuest</h2>

          <p className="tagline">

            Bijak Bertindak. Kekal Selamat.

          </p>

          <p className="description">

            PhishQuest ialah platform pembelajaran interaktif yang dibangunkan
            untuk meningkatkan kesedaran murid sekolah rendah terhadap ancaman
            phishing melalui pembelajaran, simulasi dan kuiz yang menyeronokkan.

          </p>

        </div>

        <div className="info-grid">

          <div className="info-card">

            <h3>🎯 Objektif</h3>

            <ul>

              <li>Meningkatkan kesedaran tentang phishing.</li>

              <li>Membantu murid mengenal pasti e-mel dan laman web palsu.</li>

              <li>Menggalakkan amalan keselamatan siber.</li>

            </ul>

          </div>

          <div className="info-card">

            <h3>💻 Teknologi</h3>

            <ul>

              <li>React.js</li>

              <li>JavaScript</li>

              <li>CSS3</li>

              <li>Supabase</li>

            </ul>

          </div>

          <div className="info-card">

            <h3>👨‍💻 Ahli Kumpulan</h3>

            <ul>

              <li>Nur Athirah Abdul Hadi</li>
               
               <li>Nurul Nawwarah binti Jaffar</li>


              <li>Nur Aina Ariesha binti Abdullah</li>


            </ul>

          </div>

          <div className="info-card">

            <h3>📌 Versi Sistem</h3>

            <p>

              Versi 1.0

            </p>

            <p>

              Tahun 2026

            </p>

          </div>

        </div>

      </div>

    </>

  );

}

export default About;