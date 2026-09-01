import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/sidebar.css";
import "../styles/rewards.css";
import { supabase } from "../services/supabase";

function Rewards() {

  const [profile, setProfile] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [simulationResults, setSimulationResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, []);

  async function loadRewards() {

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

        return;
      }


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
          "Gagal mendapatkan profile:",
          profileError
        );

      } else {

        setProfile(profileData);

      }


      const {
        data: quizData,
        error: quizError
      } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", {
          ascending: false
        });

      if (quizError) {

        console.error(
          "Gagal mendapatkan quiz result:",
          quizError
        );

      } else {

        setQuizResults(
          quizData || []
        );

      }


      const {
        data: simulationData,
        error: simulationError
      } = await supabase
        .from("simulation_results")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", {
          ascending: false
        });

      if (simulationError) {

        console.error(
          "Gagal mendapatkan simulation result:",
          simulationError
        );

      } else {

        setSimulationResults(
          simulationData || []
        );

      }

    } catch (error) {

      console.error(
        "Rewards error:",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  if (loading) {

    return (
      <>
        <Sidebar />

        <div className="rewards-page">

          <h2>
            ⏳ Memuatkan pencapaian...
          </h2>

        </div>
      </>
    );

  }


  const totalXP =
    profile?.total_xp || 0;


  const quizCompleted =
    quizResults.length;


  const simulationCompleted =
    simulationResults.length;


  const totalActivities =
    quizCompleted +
    simulationCompleted;


  const bestQuizPercentage =
    quizResults.length > 0
      ? Math.max(
          ...quizResults.map(
            (result) =>
              result.percentage || 0
          )
        )
      : 0;


  /* =========================
     LEVEL
  ========================= */

  let level =
    "🌱 Pemula Siber";


  if (totalXP >= 100) {

    level =
      "🛡️ Penyiasat Siber";

  }


  if (totalXP >= 200) {

    level =
      "🏆 Wira Siber";

  }


  if (totalXP >= 500) {

    level =
      "👑 Master Siber";

  }


  /* =========================
     BADGE UNLOCK
  ========================= */

  const pemulaUnlocked =
    totalActivities > 0;


  const penyiasatUnlocked =
    bestQuizPercentage >= 80;


  const wiraUnlocked =
    totalXP >= 200;


  const masterUnlocked =
    totalXP >= 500;


  /* =========================
     OVERALL PROGRESS
  ========================= */

  const completedActivities =
    Math.min(
      totalActivities,
      2
    );


  const totalAvailableActivities =
    2;


  const progress =
    Math.round(
      (
        completedActivities /
        totalAvailableActivities
      ) * 100
    );


  /* =========================
     BADGES
  ========================= */

  const badges = [

    {
      icon: "🥉",

      title: "Pemula Siber",

      description:
        "Menamatkan aktiviti pembelajaran pertama.",

      unlocked:
        pemulaUnlocked,
    },


    {
      icon: "🥈",

      title: "Penyiasat Siber",

      description:
        "Memperoleh sekurang-kurangnya 80% dalam kuiz.",

      unlocked:
        penyiasatUnlocked,
    },


    {
      icon: "🥇",

      title: "Wira Siber",

      description:
        "Mencapai sekurang-kurangnya 200 XP.",

      unlocked:
        wiraUnlocked,
    },


    {
      icon: "👑",

      title: "Master Siber",

      description:
        "Mencapai sekurang-kurangnya 500 XP.",

      unlocked:
        masterUnlocked,
    },

  ];


  return (

    <>

      <Sidebar />


      <div className="rewards-page">


        {/* =========================
            PAGE TITLE
        ========================= */}

        <h1>
          🏆 Pencapaian
        </h1>


        <p className="subtitle">

          Teruskan belajar untuk membuka
          lebih banyak lencana.

        </p>


        {/* =========================
            SUMMARY
        ========================= */}

        <div className="summary">


          <div className="summaryCard">

            <h3>
              ⭐ Mata XP
            </h3>

            <h2>
              {totalXP} XP
            </h2>

          </div>


          <div className="summaryCard">

            <h3>
              🏅 Tahap
            </h3>

            <h2>
              {level}
            </h2>

          </div>


        </div>


        {/* =========================
            BADGES
        ========================= */}

        <h2 className="sectionTitle">

          🎖 Lencana Anda

        </h2>


        <div className="badgeGrid">

          {badges.map(
            (badge, index) => (

              <div
                className={`badgeCard ${
                  badge.unlocked
                    ? "active"
                    : "locked"
                }`}
                key={index}
              >

                <div className="badgeIcon">

                  {badge.icon}

                </div>


                <h3>

                  {badge.title}

                </h3>


                <p>

                  {badge.description}

                </p>


                <span>

                  {badge.unlocked
                    ? "🟢 Dibuka"
                    : "🔒 Dikunci"
                  }

                </span>

              </div>

            )
          )}

        </div>


        {/* =========================
            OVERALL PROGRESS
        ========================= */}

        <h2 className="sectionTitle">

          📈 Kemajuan Keseluruhan

        </h2>


        <div className="progressCard">


          <div className="progressBar">

            <div
              className="progressFill"
              style={{
                width: `${progress}%`
              }}
            ></div>

          </div>


          <p>

            {progress}% Aktiviti
            Telah Diselesaikan

          </p>


          <p>

            📝 Kuiz:{" "}
            {quizCompleted}

            <br />

            📧 Simulasi:{" "}
            {simulationCompleted}

          </p>


        </div>


        {/* =========================
            QUIZ PERFORMANCE
        ========================= */}

        {quizResults.length > 0 && (

          <div className="progressCard">

            <h3>
              📊 Prestasi Kuiz
            </h3>


            <p>

              Markah terbaik anda:
              {" "}

              <strong>
                {bestQuizPercentage}%
              </strong>

            </p>

          </div>

        )}


      </div>

    </>

  );

}

export default Rewards;