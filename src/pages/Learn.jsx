import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

import "../styles/sidebar.css";
import "../styles/learn.css";

import {
  FaShieldAlt,
  FaEnvelope,
  FaGlobe,
  FaLock,
  FaUserSecret,
  FaExclamationTriangle,
} from "react-icons/fa";


function Learn() {

  const navigate = useNavigate();


  const topics = [

    {
      id: 1,

      moduleId: "module-1",

      icon: <FaShieldAlt />,

      title: "Apakah Itu Phishing?",

      level: "Permulaan",

      duration: "5 minit",

      description:
        "Fahami serangan phishing dan bagaimana penjenayah siber memperdaya mangsa.",

      video: "/videos/modul1.mp4",

      xp: 50
    },


    {
      id: 2,

      moduleId: "module-2",

      icon: <FaEnvelope />,

      title: "Phishing E-mel",

      level: "Pertengahan",

      duration: "5 minit",

      description:
        "Pelajari cara mengenal pasti e-mel palsu, pautan berbahaya dan lampiran yang mencurigakan.",

      video: "/videos/modul2.mp4",

      xp: 50
    },


    {
      id: 3,

      moduleId: "module-3",

      icon: <FaGlobe />,

      title: "Kebersihan Siber",

      level: "Pertengahan",

      duration: "5 minit",

      description:
        "Amalkan tabiat digital yang baik untuk melindungi data, akaun dan peranti daripada ancaman siber harian.",

      video: "/videos/modul3.mp4",

      xp: 50
    },


    {
      id: 4,

      moduleId: "module-4",

      icon: <FaLock />,

      title: "Keselamatan Kata Laluan",

      level: "Permulaan",

      duration: "5 minit",

      description:
        "Cipta kata laluan yang kukuh dan lindungi akaun dalam talian daripada akses yang tidak dibenarkan.",

      video: "/videos/modul4.mp4",

      xp: 50
    },


    {
      id: 5,

      moduleId: "module-5",

      icon: <FaUserSecret />,

      title: "Kejuruteraan Sosial",

      level: "Lanjutan",

      duration: "5 minit",

      description:
        "Fahami teknik manipulasi psikologi yang digunakan oleh penjenayah siber untuk memperdaya mangsa.",

      video: "/videos/modul5.mp4",

      xp: 50
    },


    {
      id: 6,

      moduleId: "module-6",

      icon: <FaExclamationTriangle />,

      title: "Apa Yang Perlu Dilakukan Jika Kena Phishing?",

      level: "Pertengahan",

      duration: "5 minit",

      description:
        "Pelajari langkah yang betul untuk diambil sekiranya anda menjadi mangsa phishing bagi melindungi diri dan akaun anda.",

      video: "/videos/modul6.mp4",

      xp: 50
    }

  ];


  function startLesson(topic) {

    const lessonData = {

      id: topic.id,

      moduleId: topic.moduleId,

      title: topic.title,

      level: topic.level,

      duration: topic.duration,

      description: topic.description,

      video: topic.video,

      xp: topic.xp

    };


    navigate("/lesson", {

      state: {

        topic: lessonData

      }

    });

  }


  return (

    <>

      <Sidebar />


      <div className="learn-page">


        {/* =========================
            HEADER
        ========================= */}

        <h1>

          📚 Modul Pembelajaran
          Keselamatan Siber

        </h1>


        <p className="subtitle">

          Selesaikan setiap modul untuk
          meningkatkan pengetahuan dan
          kemahiran keselamatan siber anda.

        </p>



        {/* =========================
            MODULE GRID
        ========================= */}

        <div className="learn-grid">


          {topics.map((topic) => (

            <div
              className="learn-card"
              key={topic.id}
            >


              {/* ICON */}

              <div className="lesson-icon">

                {topic.icon}

              </div>



              {/* TITLE */}

              <h2>

                {topic.title}

              </h2>



              {/* INFO */}

              <div className="lesson-info">


                <span>

                  {topic.level}

                </span>


                <span>

                  ⏱ {topic.duration}

                </span>


              </div>



              {/* DESCRIPTION */}

              <p>

                {topic.description}

              </p>



              {/* VIDEO */}

              <div className="video-status">

                🎬 Video pembelajaran tersedia

              </div>



              {/* XP */}

              <div className="lesson-xp">

                ⭐ +{topic.xp} XP

              </div>



              {/* BUTTON */}

              <button

                type="button"

                onClick={() =>
                  startLesson(topic)
                }

              >

                Mula Modul

              </button>


            </div>

          ))}


        </div>


      </div>


    </>

  );

}


export default Learn;