import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import mascot from "../assets/mascot/mascot.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

import {
  FaBookOpen,
  FaLaptopCode,
  FaQuestionCircle,
  FaGift,
  FaStar,
  FaTrophy,
  FaChartLine,
} from "react-icons/fa";

import "../styles/dashboard.css";


function Dashboard() {

  const navigate = useNavigate();


  // =========================
  // STATE
  // =========================

  const [profile, setProfile] = useState(null);

  const [quizResults, setQuizResults] = useState([]);

  const [simulationResults, setSimulationResults] = useState([]);

  const [moduleProgress, setModuleProgress] = useState([]);

  const [certificate, setCertificate] = useState(null);

  const [loading, setLoading] = useState(true);


  // =========================
  // LOAD DASHBOARD
  // =========================

  useEffect(() => {

    loadDashboard();

  }, []);


  async function loadDashboard() {

    try {

      // =========================
      // GET CURRENT USER
      // =========================

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


      // =========================
      // GET PROFILE
      // =========================

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


      // =========================
      // GET QUIZ RESULTS
      // =========================

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
          "Gagal mendapatkan quiz result:",
          resultsError
        );

      } else {

        setQuizResults(
          resultsData || []
        );

      }


      // =========================
      // GET SIMULATION RESULTS
      // =========================

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


      // =========================
      // GET MODULE PROGRESS
      // =========================

      const {
        data: moduleData,
        error: moduleError
      } = await supabase
        .from("module_progress")
        .select("*")
        .eq("profile_id", user.id);


      if (moduleError) {

        console.error(
          "Gagal mendapatkan module progress:",
          moduleError
        );

      } else {

        setModuleProgress(
          moduleData || []
        );

      }


      // =========================
      // GET CERTIFICATE
      // =========================

      const {
        data: certificateData,
        error: certificateError
      } = await supabase
        .from("certificates")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", {
          ascending: false
        })
        .limit(1)
        .maybeSingle();


      if (certificateError) {

        console.error(
          "Gagal mendapatkan certificate:",
          certificateError
        );

      } else {

        setCertificate(
          certificateData || null
        );

      }


    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  // =========================
  // TOTAL XP
  // =========================

  const totalXP =
    profile?.total_xp || 0;


  // =========================
  // LATEST QUIZ
  // =========================

  const latestQuiz =
    quizResults.length > 0
      ? quizResults[0]
      : null;


  // =========================
  // LATEST SIMULATION
  // =========================

  const latestSimulation =
    simulationResults.length > 0
      ? simulationResults[0]
      : null;


  // =========================
  // LATEST QUIZ PERCENTAGE
  // =========================

  const latestPercentage =
    latestQuiz
      ? latestQuiz.percentage
      : 0;


  // =========================
  // COMPLETED ACTIVITIES
  // =========================

  const quizCompleted =
    quizResults.length;


  const simulationCompleted =
    simulationResults.length;


  const totalActivities =
    quizCompleted +
    simulationCompleted;


  // =========================
  // MODULE COMPLETION
  // =========================

  /*
    Only count completed modules
    belonging to the current student.

    Set() is used so that duplicate
    records for the same module
    are not counted twice.
  */

  const completedModuleIds = [
    ...new Set(
      moduleProgress
        .filter(
          (module) =>
            module.completed === true
        )
        .map(
          (module) =>
            module.module_id
        )
    )
  ];


  const completedModules =
    completedModuleIds.length;


  const totalModules = 6;


  const moduleCompletionPercentage =
    Math.min(
      Math.round(
        (completedModules /
          totalModules) *
          100
      ),
      100
    );


  const certificateUnlocked =
    completedModules === totalModules;


  // =========================
  // DEBUG
  // =========================

  console.log(
    "Module Progress:",
    moduleProgress
  );

  console.log(
    "Completed Modules:",
    completedModules
  );

  console.log(
    "Certificate Unlocked:",
    certificateUnlocked
  );


  // =========================
  // LEVEL
  // =========================

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


  // =========================
  // PROGRESS
  // =========================

  const progress =
    Math.min(
      latestPercentage,
      100
    );


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <>

        <Sidebar />

        <div className="dashboard">

          <h2>
            ⏳ Memuatkan dashboard...
          </h2>

        </div>

      </>

    );

  }


  // =========================
  // DASHBOARD
  // =========================

  return (

    <>

      <Sidebar />


      <div className="dashboard">


        {/* =========================
            HERO
        ========================= */}

        <div className="welcome">


          <div>

            <h1>
              Hai, {profile?.name || "Pelajar"}! 👋
            </h1>


            <p>

              Selamat datang kembali ke{" "}

              <strong>
                PhishQuest
              </strong>

              !

              <br />

              Jom tingkatkan pengetahuan
              keselamatan siber dengan
              menyelesaikan aktiviti
              pembelajaran hari ini.

            </p>


            <button

              className="startBtn"

              onClick={() =>
                navigate("/learn")
              }

            >

              🚀 Mula Belajar

            </button>


          </div>


          <img

            src={mascot}

            alt="Maskot PhishQuest"

            className="heroMascot"

          />


        </div>


        {/* =========================
            STATISTICS
        ========================= */}

        <div className="stats">


          {/* TOTAL XP */}

          <div className="statCard">

            <FaStar
              className="featureIcon"
            />

            <h4>
              Jumlah Mata XP
            </h4>

            <h2>
              {totalXP} XP
            </h2>

          </div>


          {/* LEVEL */}

          <div className="statCard">

            <FaTrophy
              className="featureIcon"
            />

            <h4>
              Tahap Semasa
            </h4>

            <h2>
              {level}
            </h2>

          </div>


          {/* QUIZ */}

          <div className="statCard">

            <FaQuestionCircle
              className="featureIcon"
            />

            <h4>
              Kuiz Selesai
            </h4>

            <h2>
              {quizCompleted}
            </h2>

          </div>


          {/* SIMULATION */}

          <div className="statCard">

            <FaChartLine
              className="featureIcon"
            />

            <h4>
              Simulasi Selesai
            </h4>

            <h2>
              {simulationCompleted}
            </h2>

          </div>


          {/* TOTAL ACTIVITIES */}

          <div className="statCard">

            <FaBookOpen
              className="featureIcon"
            />

            <h4>
              Jumlah Aktiviti
            </h4>

            <h2>
              {totalActivities}
            </h2>

          </div>


        </div>


        {/* =========================
            LEARNING PROGRESS
        ========================= */}

        <div className="progressCard">


          <h2>
            📈 Kemajuan Pembelajaran
          </h2>


          <div className="progressBar">

            <div

              className="progressFill"

              style={{
                width: `${progress}%`
              }}

            ></div>

          </div>


          <p
            style={{
              marginTop: "15px"
            }}
          >

            {latestQuiz

              ? `Markah kuiz terkini anda ialah ${latestPercentage}%.`

              : "Anda belum menyelesaikan sebarang kuiz lagi."

            }

          </p>


        </div>


        {/* =========================
            CERTIFICATE
        ========================= */}

        <div className="certificateCard">


          <h2>
            🎓 Sijil PhishQuest
          </h2>


          {certificateUnlocked ? (

            <>

              <p>

                🎉 Tahniah!

                <br />

                Anda telah berjaya melengkapkan
                semua 6 modul pembelajaran
                PhishQuest.

              </p>


              <div className="certificateProgress">

                <strong>
                  {completedModules} / {totalModules} Modul Selesai
                </strong>

              </div>


              <p>

                Kemajuan:
                {" "}
                {moduleCompletionPercentage}%

              </p>


              {certificate ? (

                <button

                  className="certificateBtn"

                  onClick={() =>
                    navigate("/certificate")
                  }

                >

                  🎓 Lihat Sijil

                </button>

              ) : (

                <button

                  className="certificateBtn"

                  onClick={() =>
                    navigate("/certificate")
                  }

                >

                  🎓 Jana Sijil

                </button>

              )}


            </>

          ) : (

            <>

              <p>

                Lengkapkan semua 6 modul
                pembelajaran untuk membuka
                Sijil PhishQuest anda.

              </p>


              <div className="certificateProgress">

                <strong>
                  {completedModules} / {totalModules} Modul Selesai
                </strong>

              </div>


              <p>

                Kemajuan:
                {" "}
                {moduleCompletionPercentage}%

              </p>


              <div className="certificateMiniBar">

                <div

                  className="certificateMiniFill"

                  style={{
                    width:
                      `${moduleCompletionPercentage}%`
                  }}

                ></div>

              </div>


              <button

                className="certificateBtn"

                disabled

              >

                🔒 Sijil Dikunci

              </button>

            </>

          )}


        </div>


        {/* =========================
            FEATURES
        ========================= */}

        <div className="features">


          {/* LEARN */}

          <div

            className="featureCard"

            onClick={() =>
              navigate("/learn")
            }

          >

            <FaBookOpen
              className="featureIcon"
            />

            <h2>
              📚 Modul Pembelajaran
            </h2>

            <p>

              Pelajari asas keselamatan
              siber dan cara mengenal pasti
              serangan phishing melalui
              nota interaktif.

            </p>

          </div>


          {/* SIMULATION */}

          <div

            className="featureCard"

            onClick={() =>
              navigate("/simulation")
            }

          >

            <FaLaptopCode
              className="featureIcon"
            />

            <h2>
              💻 Simulasi
            </h2>

            <p>

              Cuba kenal pasti e-mel
              dan laman web palsu seperti
              situasi sebenar.

            </p>

          </div>


          {/* QUIZ */}

          <div

            className="featureCard"

            onClick={() =>
              navigate("/quiz")
            }

          >

            <FaQuestionCircle
              className="featureIcon"
            />

            <h2>
              📝 Kuiz
            </h2>

            <p>

              Uji kefahaman anda dan
              kumpulkan lebih banyak
              Mata XP.

            </p>

          </div>


          {/* REWARDS */}

          <div

            className="featureCard"

            onClick={() =>
              navigate("/rewards")
            }

          >

            <FaGift
              className="featureIcon"
            />

            <h2>
              🏆 Pencapaian
            </h2>

            <p>

              Dapatkan lencana dan
              pencapaian apabila berjaya
              menyelesaikan setiap aktiviti.

            </p>

          </div>


        </div>


        {/* =========================
            LATEST RESULTS
        ========================= */}

        <div className="recentResults">


          {/* =========================
              LATEST QUIZ
          ========================= */}

          {latestQuiz && (

            <div className="tipCard">


              <h3>
                📊 Keputusan Kuiz Terkini
              </h3>


              <p>

                <strong>
                  Markah:
                </strong>{" "}

                {latestQuiz.score}/
                {latestQuiz.total_questions}

                <br />


                <strong>
                  Peratus:
                </strong>{" "}

                {latestQuiz.percentage}%


                <br />


                <strong>
                  XP:
                </strong>{" "}

                +{latestQuiz.xp_earned} XP


                <br />


                <strong>
                  Benchmark:
                </strong>{" "}

                {latestQuiz.benchmark}

              </p>


            </div>

          )}


          {/* =========================
              LATEST SIMULATION
          ========================= */}

          {latestSimulation && (

            <div className="tipCard">


              <h3>
                📧 Simulasi Terkini
              </h3>


              <p>

                <strong>
                  Markah:
                </strong>{" "}

                {Math.round(
                  latestSimulation.score / 10
                )}

                /

                {latestSimulation.total_questions}


                <br />


                <strong>
                  Peratus:
                </strong>{" "}

                {latestSimulation.percentage}%


                <br />


                <strong>
                  XP:
                </strong>{" "}

                +{latestSimulation.xp_earned} XP

              </p>


            </div>

          )}


        </div>


        {/* =========================
            CYBER TIP
        ========================= */}

        <div className="tipCard">


          <h3>
            💡 Tip Keselamatan Siber
          </h3>


          <p>

            Jangan sesekali klik pautan
            yang mencurigakan atau
            memuat turun lampiran daripada
            e-mel yang tidak dikenali.

            <br />
            <br />

            Sentiasa semak alamat e-mel
            penghantar sebelum membuat
            sebarang tindakan.

          </p>


        </div>


      </div>

    </>

  );

}


export default Dashboard;