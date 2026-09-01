import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import "../styles/sidebar.css";
import "../styles/lesson.css";
import "../styles/achievementPopup.css";

import { useMusic } from "./MusicContext";
import { supabase } from "../services/supabase";

import toast from "react-hot-toast";

import { completeModule } from "../utils/moduleProgress";
import { getNewAchievement } from "../utils/achievement";

import AchievementPopup from "../components/AchievementPopup";


function Lesson() {

  const navigate = useNavigate();
  const location = useLocation();

  const {
    enterLesson,
    exitLesson
  } = useMusic();


  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [achievement, setAchievement] = useState(null);


  /*
  ============================================
  TOPIC YANG DIPILIH DARIPADA LEARN PAGE
  ============================================
  */

  const topic = location.state?.topic || {

    id: 1,

    moduleId: "module-1",

    title: "Apakah Itu Phishing?",

    level: "Permulaan",

    duration: "5 minit",

    description:
      "Fahami serangan phishing dan bagaimana penjenayah siber memperdaya mangsa.",

    video: "/videos/modul1.mp4",

    xp: 50

  };


  /*
  ============================================
  MODULE ID
  ============================================
  */

  const moduleId =
    topic.moduleId ||
    `module-${topic.id || 1}`;


  const moduleName =
    topic.title ||
    "Apakah Itu Phishing?";


  const moduleXP =
    topic.xp ||
    50;



  /*
  ============================================
  CONTENT SETIAP MODUL
  ============================================
  */

  const moduleContents = {


    /* ======================================
       MODULE 1
    ====================================== */

    "module-1": {

      cards: [

        {
          icon: "🛡️",

          title: "Kenali Phishing",

          text:
            "Phishing ialah cubaan penipuan yang dilakukan oleh penjenayah siber untuk memperdaya mangsa supaya memberikan maklumat sensitif seperti kata laluan, nombor akaun, OTP atau maklumat peribadi."
        },


        {
          icon: "⚠️",

          title: "Tanda-tanda Phishing",

          items: [

            "Pautan atau laman web yang mencurigakan",

            "Permintaan maklumat peribadi",

            "Mesej yang terlalu mendesak",

            "Tawaran atau hadiah yang terlalu menarik"

          ]

        },


        {
          icon: "🔐",

          title: "Cara Melindungi Diri",

          items: [

            "Jangan klik pautan yang mencurigakan",

            "Semak alamat penghantar dan URL",

            "Jangan kongsi kata laluan atau OTP",

            "Laporkan mesej yang mencurigakan"

          ]

        }

      ]

    },



    /* ======================================
       MODULE 2
    ====================================== */

    "module-2": {

      cards: [

        {
          icon: "📧",

          title: "Kenali Phishing E-mel",

          text:
            "Phishing e-mel ialah e-mel palsu yang direka menyerupai organisasi atau individu yang dipercayai untuk memperdaya mangsa memberikan maklumat atau melakukan tindakan tertentu."
        },


        {
          icon: "⚠️",

          title: "Tanda-tanda E-mel Phishing",

          items: [

            "Alamat e-mel penghantar kelihatan pelik",

            "Terdapat kesalahan ejaan atau bahasa yang mencurigakan",

            "Meminta kata laluan atau maklumat peribadi",

            "Mempunyai pautan atau lampiran yang mencurigakan"

          ]

        },


        {
          icon: "🔐",

          title: "Cara Melindungi Diri",

          items: [

            "Semak alamat e-mel penghantar",

            "Jangan buka lampiran yang mencurigakan",

            "Jangan klik pautan dalam e-mel meragukan",

            "Laporkan e-mel sebagai spam atau phishing"

          ]

        }

      ]

    },



    /* ======================================
       MODULE 3
       KEBERSIHAN SIBER
    ====================================== */

    "module-3": {

      cards: [

        {
          icon: "🛡️",

          title: "Apakah Kebersihan Siber?",

          text:
            "Kebersihan siber ialah amalan menjaga keselamatan data, akaun dan peranti melalui tabiat digital yang baik dan selamat dalam kehidupan seharian."
        },


        {
          icon: "🧹",

          title: "Amalan Kebersihan Siber",

          items: [

            "Gunakan kata laluan yang kuat dan unik",

            "Kemas kini sistem dan aplikasi secara berkala",

            "Elakkan klik pautan yang mencurigakan",

            "Aktifkan pengesahan dua faktor (2FA)"

          ]

        },


        {
          icon: "🔐",

          title: "Cara Melindungi Diri",

          items: [

            "Semak sebelum berkongsi maklumat peribadi",

            "Gunakan perisian keselamatan yang dipercayai",

            "Elakkan menggunakan Wi-Fi awam untuk urusan sensitif",

            "Buat salinan sandaran data penting"

          ]

        }

      ]

    },



    /* ======================================
       MODULE 4
    ====================================== */

    "module-4": {

      cards: [

        {
          icon: "🔑",

          title: "Kenali Keselamatan Kata Laluan",

          text:
            "Kata laluan digunakan untuk melindungi akaun dan maklumat peribadi. Kata laluan yang lemah atau digunakan berulang kali boleh memudahkan penjenayah siber mendapatkan akses kepada akaun."
        },


        {
          icon: "⚠️",

          title: "Tanda-tanda Kata Laluan Tidak Selamat",

          items: [

            "Menggunakan kata laluan seperti 123456",

            "Menggunakan nama atau tarikh lahir",

            "Menggunakan kata laluan yang sama untuk semua akaun",

            "Berkongsi kata laluan dengan orang lain"

          ]

        },


        {
          icon: "🔐",

          title: "Cara Melindungi Akaun",

          items: [

            "Gunakan kata laluan yang panjang dan unik",

            "Gabungkan huruf, nombor dan simbol",

            "Gunakan kata laluan berbeza untuk akaun penting",

            "Aktifkan pengesahan dua faktor (2FA)"

          ]

        }

      ]

    },



    /* ======================================
       MODULE 5
    ====================================== */

    "module-5": {

      cards: [

        {
          icon: "🕵️",

          title: "Kenali Kejuruteraan Sosial",

          text:
            "Kejuruteraan sosial ialah teknik manipulasi yang digunakan oleh penjenayah siber untuk mempengaruhi mangsa supaya memberikan maklumat, melakukan sesuatu atau memberikan akses kepada sistem."
        },


        {
          icon: "⚠️",

          title: "Tanda-tanda Kejuruteraan Sosial",

          items: [

            "Individu mengaku sebagai pihak berkuasa atau organisasi",

            "Meminta maklumat sulit secara tiba-tiba",

            "Menggunakan tekanan atau ketakutan",

            "Menawarkan hadiah atau ganjaran"

          ]

        },


        {
          icon: "🔐",

          title: "Cara Melindungi Diri",

          items: [

            "Jangan mudah percaya kepada permintaan luar biasa",

            "Sahkan identiti pihak yang menghubungi",

            "Jangan berkongsi maklumat sensitif",

            "Hubungi pihak rasmi untuk pengesahan"

          ]

        }

      ]

    },



    /* ======================================
       MODULE 6
       JIKA KENA PHISHING
    ====================================== */

    "module-6": {

      cards: [

        {
          icon: "🚨",

          title: "Jika Anda Terkena Phishing",

          text:
            "Jika anda terpedaya dengan phishing, jangan panik. Tindakan segera boleh membantu mengurangkan risiko kehilangan akaun dan maklumat peribadi."
        },


        {
          icon: "⚠️",

          title: "Langkah Segera",

          items: [

            "Tukar kata laluan akaun dengan segera",

            "Log keluar daripada semua peranti yang tidak dikenali",

            "Aktifkan pengesahan dua faktor (2FA)",

            "Hubungi pihak rasmi jika maklumat kewangan terlibat"

          ]

        },


        {
          icon: "🔐",

          title: "Cara Mencegah Kejadian Berulang",

          items: [

            "Jangan klik semula pautan phishing tersebut",

            "Laporkan mesej atau e-mel sebagai phishing",

            "Semak aktiviti akaun secara berkala",

            "Berhati-hati dengan mesej mencurigakan pada masa akan datang"

          ]

        }

      ]

    }

  };



  /*
  ============================================
  CONTENT MODULE SEMASA
  ============================================
  */

  const currentContent =
    moduleContents[moduleId] ||
    moduleContents["module-1"];



  /*
  ============================================
  ENTER / EXIT LESSON
  ============================================
  */

  useEffect(() => {

    enterLesson();

    checkLessonProgress();


    return () => {

      exitLesson();

    };

  }, [moduleId]);



  /*
  ============================================
  CHECK MODULE PROGRESS
  ============================================
  */

  async function checkLessonProgress() {

    try {

      const {
        data: {
          user
        },
        error: userError
      } = await supabase.auth.getUser();


      if (userError || !user) {

        return;

      }


      const {
        data,
        error
      } = await supabase

        .from("module_progress")

        .select("completed")

        .eq("profile_id", user.id)

        .eq("module_id", moduleId)

        .maybeSingle();


      if (error) {

        console.error(
          "Gagal semak progress modul:",
          error
        );

        return;

      }


      if (data?.completed) {

        setCompleted(true);

      }

    } catch (error) {

      console.error(
        "Check module progress error:",
        error
      );

    }

  }



  /*
  ============================================
  COMPLETE MODULE
  ============================================
  */

  async function completeLesson() {

    if (
      completed ||
      saving
    ) {

      return;

    }


    setSaving(true);


    const result =
      await completeModule(
        moduleId,
        moduleName,
        moduleXP
      );


    /*
    ============================================
    CHECK SAVE RESULT
    ============================================
    */

    if (!result.success) {

      console.error(
        "Complete module error:",
        result.error
      );


      toast.error(
        "❌ Progress gagal disimpan."
      );


      setSaving(false);

      return;

    }



    /*
    ============================================
    MODULE SUDAH SELESAI
    ============================================
    */

    if (result.alreadyCompleted) {

      setCompleted(true);


      toast(
        "✅ Modul ini sudah pernah diselesaikan."
      );


      setSaving(false);

      return;

    }



    /*
    ============================================
    MODULE BERJAYA SELESAI
    ============================================
    */

    setCompleted(true);


    toast.success(

      `🎉 Modul selesai! +${moduleXP} XP`,

      {

        style: {

          background: "#E8F5E9",

          color: "#2E7D32",

          borderRadius: "15px"

        }

      }

    );



    /*
    ============================================
    CHECK ACHIEVEMENT
    ============================================
    */

    const newAchievement =
      getNewAchievement(
        result.oldXP || 0,
        result.newXP || 0
      );



    /*
    ============================================
    SHOW ACHIEVEMENT POPUP
    ============================================
    */

    if (newAchievement) {

      setTimeout(() => {

        setAchievement(
          newAchievement
        );

      }, 500);

    }


    setSaving(false);

  }



  /*
  ============================================
  VIDEO ERROR
  ============================================
  */

  function handleVideoError() {

    toast.error(
      "❌ Video untuk modul ini belum tersedia."
    );

  }



  /*
  ============================================
  CLOSE ACHIEVEMENT
  ============================================
  */

  function closeAchievement() {

    setAchievement(null);

  }



  /*
  ============================================
  PAGE
  ============================================
  */

  return (

    <>

      <Sidebar />


      <div className="lesson-page">


        {/* =========================
            LESSON HEADER
        ========================= */}

        <div className="lesson-header">


          <button

            className="backBtn"

            onClick={() =>
              navigate("/learn")
            }

          >

            ← Kembali

          </button>


          <span className="lesson-level">

            {topic.level}

          </span>


          <h1>

            {topic.title}

          </h1>


          <p>

            {topic.description}

          </p>


          <span className="lesson-duration">

            ⏱️ {topic.duration}

          </span>


        </div>



        {/* =========================
            VIDEO SECTION
        ========================= */}

        <div className="video-card">


          <h2 className="video-title">

            🎬 Video Pembelajaran

          </h2>


          <p className="video-subtitle">

            Tonton video pembelajaran untuk
            modul ini sebelum meneruskan aktiviti.

          </p>



          <div className="video-container">


            <video

              key={topic.video}

              className="lesson-video"

              controls

              preload="metadata"

              playsInline

              onError={handleVideoError}

            >

              <source

                src={topic.video}

                type="video/mp4"

              />


              Browser anda tidak menyokong
              video ini.


            </video>


          </div>



          <div className="video-info">


            <h2>

              🎥 Video Modul {topic.id}

            </h2>


            <p>

              Tonton video sehingga selesai
              sebelum menekan butang
              "Selesai Modul".

            </p>


          </div>


        </div>



        {/* =========================
            LESSON CONTENT
        ========================= */}

        <div className="lesson-content">


          <h2>

            📖 Apa yang perlu anda tahu?

          </h2>



          {currentContent.cards.map(
            (card, index) => (

              <div

                className="info-card"

                key={index}

              >


                <h3>

                  {card.icon}{" "}

                  {card.title}

                </h3>



                {card.text && (

                  <p>

                    {card.text}

                  </p>

                )}



                {card.items && (

                  <ul>

                    {card.items.map(
                      (item, itemIndex) => (

                        <li

                          key={itemIndex}

                        >

                          {item}

                        </li>

                      )
                    )}

                  </ul>

                )}


              </div>

            )
          )}


        </div>



        {/* =========================
            ACTION BUTTONS
        ========================= */}

        <div className="lesson-action">


          <button

            className={

              completed

                ? "completeBtn completed"

                : "completeBtn"

            }

            onClick={completeLesson}

            disabled={

              completed ||
              saving

            }

          >

            {completed

              ? "✅ Modul Telah Selesai"

              : saving

                ? "⏳ Menyimpan..."

                : `✅ Selesai Modul +${moduleXP} XP`

            }

          </button>



          <button

            className="quizBtn"

            onClick={() =>
              navigate(
                "/quiz",
                {
                  state: {
                    moduleId
                  }
                }
              )
            }

          >

            📝 Cuba Kuiz

          </button>


        </div>


      </div>



      {/* =========================
          ACHIEVEMENT POPUP
      ========================= */}

      <AchievementPopup

        achievement={achievement}

        onClose={closeAchievement}

      />


    </>

  );

}


export default Lesson;