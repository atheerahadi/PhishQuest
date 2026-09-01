import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import mascot from "../assets/mascot/mascot.png";
import { supabase } from "../services/supabase";

import "../styles/sidebar.css";
import "../styles/profile.css";

function Profile() {

  const [profile, setProfile] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {

    try {

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {

        console.error(
          "User tidak dijumpai:",
          userError
        );

        setLoading(false);

        return;
      }


      /* =========================
         GET PROFILE
      ========================= */

      const {
        data: profileData,
        error: profileError
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();


      if (profileError) {

        console.error(
          "Profile error:",
          profileError
        );

      } else {

        setProfile(profileData);

      }


      /* =========================
         GET QUIZ RESULTS
      ========================= */

      const {
        data: resultsData,
        error: resultsError
      } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", {
          ascending: false
        });


      if (resultsError) {

        console.error(
          "Quiz result error:",
          resultsError
        );

      } else {

        setQuizResults(
          resultsData || []
        );

      }

    } catch (error) {

      console.error(
        "Profile error:",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  /* =========================
     STUDENT DATA
  ========================= */

  const totalXP =
    profile?.total_xp || 0;


  const quizCompleted =
    quizResults.length;


  const latestQuiz =
    quizResults.length > 0
      ? quizResults[0]
      : null;


  let level = "🌱 Pemula Siber";


  if (totalXP >= 100) {
    level = "🛡️ Penyiasat Siber";
  }


  if (totalXP >= 200) {
    level = "🏆 Wira Siber";
  }


  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (
      <>
        <Sidebar />

        <div className="profile-page">

          <h2>
            ⏳ Memuatkan profil...
          </h2>

        </div>
      </>
    );

  }


  /* ==================================================
     TEACHER PROFILE
  ================================================== */

  if (profile?.role === "teacher") {

    return (

      <>
        <Sidebar />

        <div className="profile-page teacher-profile">

          {/* PAGE TITLE */}

          <h1 className="teacher-profile-title">
            👤 Profil Saya
          </h1>


          {/* PROFILE CARD */}

          <div className="profile-card teacher-profile-card">

            <img
              src={mascot}
              alt="Avatar Guru"
              className="profileAvatar"
            />

            <h2>
              {profile?.name || "Guru"}
            </h2>

            <p>
              {profile?.email || ""}
            </p>

            <p className="teacher-role">
              👩‍🏫 Guru PhishQuest
            </p>

          </div>


          {/* TEACHER ACCOUNT */}

          <div className="teacher-info">

            <h2>
              👩‍🏫 Maklumat Akaun Guru
            </h2>

            <div className="teacher-info-content">

              <p>
                <strong>Nama:</strong>{" "}
                {profile?.name || "-"}
              </p>

              <p>
                <strong>E-mel:</strong>{" "}
                {profile?.email || "-"}
              </p>

              <p>
                <strong>Jenis Akaun:</strong>{" "}
                👩‍🏫 Guru
              </p>

              <p>
                <strong>Status Akaun:</strong>{" "}
                <span className="teacher-status">
                  🟢 Aktif
                </span>
              </p>

            </div>

          </div>


          {/* WELCOME */}

          <div className="teacher-welcome">

            <h2>
              🎓 Selamat Datang, Guru PhishQuest!
            </h2>

            <p>
              Pantau perkembangan pembelajaran pelajar
              dan bantu mereka membina kesedaran
              keselamatan siber.
            </p>

          </div>

        </div>
      </>

    );

  }


  /* ==================================================
     STUDENT PROFILE
  ================================================== */

  return (

    <>
      <Sidebar />

      <div className="profile-page">

        <h1>
          👤 Profil Saya
        </h1>


        {/* PROFILE CARD */}

        <div className="profile-card">

          <img
            src={mascot}
            alt="Avatar"
            className="profileAvatar"
          />

          <h2>
            {profile?.name || "Pelajar"}
          </h2>

          <p>
            {profile?.email || ""}
          </p>

          <p>
            🎓 Pelajar PhishQuest
          </p>

        </div>


        {/* STATISTICS */}

        <div className="statsGrid">

          <div className="statCard">

            <h3>
              ⭐ Mata XP
            </h3>

            <h2>
              {totalXP} XP
            </h2>

          </div>


          <div className="statCard">

            <h3>
              🏅 Tahap
            </h3>

            <h2>
              {level}
            </h2>

          </div>


          <div className="statCard">

            <h3>
              📝 Kuiz
            </h3>

            <h2>
              {quizCompleted} Diselesaikan
            </h2>

          </div>


          <div className="statCard">

            <h3>
              📊 Kuiz Terkini
            </h3>

            <h2>

              {latestQuiz
                ? `${latestQuiz.percentage}%`
                : "Belum ada"
              }

            </h2>

          </div>

        </div>


        {/* QUIZ PERFORMANCE */}

        <div className="missionCard">

          <h2>
            📊 Prestasi Kuiz
          </h2>


          {latestQuiz ? (

            <>

              <p>
                <strong>
                  Markah:
                </strong>{" "}

                {latestQuiz.score}
                /
                {latestQuiz.total_questions}

              </p>


              <p>
                <strong>
                  Peratus:
                </strong>{" "}

                {latestQuiz.percentage}%

              </p>


              <p>
                <strong>
                  XP Diperoleh:
                </strong>{" "}

                +{latestQuiz.xp_earned} XP

              </p>


              <p>
                <strong>
                  Benchmark:
                </strong>{" "}

                {latestQuiz.benchmark}

              </p>

            </>

          ) : (

            <p>
              Anda belum menyelesaikan sebarang kuiz.
            </p>

          )}

        </div>


        {/* BADGES */}

        <div className="badgeSection">

          <h2>
            🏆 Lencana Saya
          </h2>


          <div className="badges">

            <div className="badge">

              🥉

              <p>
                Pemula Siber
              </p>

            </div>


            <div
              className={
                totalXP >= 100
                  ? "badge"
                  : "badge locked"
              }
            >

              🥈

              <p>
                Penyiasat Siber
              </p>

            </div>


            <div
              className={
                totalXP >= 200
                  ? "badge"
                  : "badge locked"
              }
            >

              🥇

              <p>
                Wira Siber
              </p>

            </div>


            <div
              className={
                totalXP >= 500
                  ? "badge"
                  : "badge locked"
              }
            >

              👑

              <p>
                Master Siber
              </p>

            </div>

          </div>

        </div>

      </div>
    </>

  );

}

export default Profile;