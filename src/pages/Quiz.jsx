import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import "../styles/sidebar.css";
import "../styles/quiz.css";

import toast from "react-hot-toast";

import { supabase } from "../services/supabase";

import { useAIAssistant } from "../context/AIAssistantContext";

import {
  playCorrectSound,
  playWrongSound
} from "../utils/soundEffect";


function Quiz() {

  const navigate = useNavigate();

  const {
    handleAnswer,
    resetAssistant
  } = useAIAssistant();


  /*
  ============================================
  QUIZ QUESTIONS
  ============================================
  */

  const questions = [

    {
      question:
        "Apakah yang dimaksudkan dengan phishing?",

      options: [
        "Permainan dalam talian",
        "Cubaan menipu pengguna untuk mendapatkan maklumat",
        "Cara meningkatkan kelajuan internet",
        "Aplikasi untuk menghantar e-mel"
      ],

      answer: 1,

      explanation:
        "Phishing ialah cubaan menipu atau memperdaya pengguna untuk mendapatkan maklumat sensitif seperti kata laluan, nombor akaun dan maklumat peribadi."
    },


    {
      question:
        "Antara berikut, yang manakah merupakan petunjuk phishing?",

      options: [
        "Domain rasmi syarikat",
        "Permintaan segera untuk mengesahkan akaun",
        "Sijil HTTPS",
        "Logo syarikat"
      ],

      answer: 1,

      explanation:
        "Permintaan yang terlalu mendesak untuk mengesahkan akaun merupakan salah satu tanda phishing. Penyerang biasanya cuba membuat mangsa bertindak tanpa berfikir panjang."
    },


    {
      question:
        "Apakah yang perlu anda lakukan jika menerima e-mel yang mencurigakan?",

      options: [
        "Klik pautan tersebut",
        "Balas e-mel dengan segera",
        "Laporkan dan padamkan e-mel tersebut",
        "Abaikan amaran antivirus"
      ],

      answer: 2,

      explanation:
        "E-mel yang mencurigakan tidak sepatutnya dibuka atau pautannya diklik. Tindakan yang lebih selamat ialah melaporkan dan memadamkan e-mel tersebut."
    },


    {
      question:
        "Kata laluan yang manakah paling kukuh?",

      options: [
        "123456",
        "password",
        "Athirah123",
        "P@55w0rd!9X#"
      ],

      answer: 3,

      explanation:
        "Kata laluan yang kukuh biasanya mempunyai gabungan huruf besar, huruf kecil, nombor dan simbol serta tidak menggunakan maklumat peribadi yang mudah diteka."
    },


    {
      question:
        "Apakah yang dimaksudkan dengan kejuruteraan sosial?",

      options: [
        "Bahasa pengaturcaraan",
        "Memanipulasi individu untuk mendapatkan maklumat",
        "Memasang Windows",
        "Membina laman web"
      ],

      answer: 1,

      explanation:
        "Kejuruteraan sosial ialah teknik memanipulasi atau memperdaya seseorang supaya memberikan maklumat atau melakukan tindakan yang menguntungkan penyerang."
    },


    {
      question:
        "Anda menerima mesej yang mendakwa akaun Maybank anda mempunyai transaksi mencurigakan sebanyak RM2,850 dan meminta anda mengesahkan identiti melalui pautan. Apakah tindakan paling selamat?",

      options: [
        "Klik pautan dan sahkan akaun",
        "Berikan nombor akaun kepada penghantar",
        "Semak akaun melalui aplikasi atau laman rasmi Maybank",
        "Balas mesej untuk mendapatkan maklumat lanjut"
      ],

      answer: 2,

      explanation:
        "Jangan gunakan pautan yang diberikan dalam mesej mencurigakan. Sebaliknya, buka aplikasi atau laman rasmi bank secara terus untuk menyemak transaksi."
    },


    {
      question:
        "Anda menerima mesej daripada Pos Malaysia yang mengatakan bungkusan anda tidak dapat dihantar kerana caj RM8.90 belum dibayar. Mesej tersebut menyediakan pautan pembayaran yang mencurigakan. Apakah petunjuk phishing?",

      options: [
        "Mesej berkaitan penghantaran",
        "Mesej meminta bayaran melalui pautan mencurigakan",
        "Mesej menyebut jumlah RM8.90",
        "Mesej menggunakan Bahasa Melayu"
      ],

      answer: 1,

      explanation:
        "Permintaan bayaran melalui pautan yang mencurigakan merupakan petunjuk phishing. Penyerang sering menggunakan isu penghantaran untuk membuat mangsa panik dan bertindak segera."
    },


    {
      question:
        "Anda menerima mesej Touch 'n Go eWallet yang mengatakan anda memenangi RM500 dan perlu klik pautan untuk menuntut hadiah. Apakah tanda amaran utama?",

      options: [
        "Mesej menyebut nama eWallet",
        "Mesej menawarkan ganjaran dan meminta pengguna klik pautan",
        "Mesej menggunakan Bahasa Melayu",
        "Mesej mempunyai jumlah RM500"
      ],

      answer: 1,

      explanation:
        "Tawaran hadiah yang terlalu menarik bersama arahan untuk klik pautan merupakan tanda amaran phishing. Jangan klik pautan tersebut sebelum mengesahkan kesahihannya."
    },


    {
      question:
        "Anda menerima mesej yang mendakwa anda layak menerima bayaran balik cukai RM1,250 daripada LHDN dan perlu mengemas kini maklumat akaun bank sebelum 11.59 malam. Apakah tanda phishing?",

      options: [
        "Mesej menyebut LHDN",
        "Mesej memberikan jumlah wang",
        "Mesej menggunakan tekanan masa dan meminta maklumat akaun",
        "Mesej menggunakan Bahasa Melayu"
      ],

      answer: 2,

      explanation:
        "Penggunaan tekanan masa seperti 'sebelum 11.59 malam' dan permintaan maklumat akaun merupakan tanda amaran phishing yang biasa digunakan untuk mempengaruhi mangsa."
    },


    {
      question:
        "Anda menerima mesej yang mengatakan anda telah memenangi iPhone 17 Pro Max secara percuma dan perlu klik satu pautan untuk menuntut hadiah. Apakah tindakan yang paling selamat?",

      options: [
        "Klik pautan untuk mendapatkan hadiah",
        "Kongsi mesej dengan rakan",
        "Jangan klik pautan dan laporkan mesej tersebut",
        "Berikan nombor telefon kepada penghantar"
      ],

      answer: 2,

      explanation:
        "Jangan klik pautan atau memberikan maklumat peribadi. Tawaran hadiah percuma yang memerlukan pengguna mengklik pautan boleh menjadi cubaan phishing."
    }

  ];


  /*
  ============================================
  CONSTANT
  ============================================
  */

  const QUESTION_TIME = 30;


  /*
  ============================================
  STATES
  ============================================
  */

  const [started, setStarted] = useState(false);

  const [current, setCurrent] = useState(0);

  const [score, setScore] = useState(0);

  const [finished, setFinished] = useState(false);

  const [answered, setAnswered] = useState(false);

  const [timeLeft, setTimeLeft] =
    useState(QUESTION_TIME);

  const [showFeedback, setShowFeedback] =
    useState(false);

  const [lastAnswerCorrect, setLastAnswerCorrect] =
    useState(false);

  const [timedOut, setTimedOut] =
    useState(false);

  const timerRef = useRef(null);


  /*
  ============================================
  RESET AI
  ============================================
  */

  useEffect(() => {

    resetAssistant();

  }, []);


  /*
  ============================================
  TIMER
  ============================================
  */

  useEffect(() => {

    if (!started || finished || answered) {

      return;

    }


    setTimeLeft(QUESTION_TIME);


    timerRef.current = setInterval(() => {

      setTimeLeft((previous) => {

        if (previous <= 1) {

          clearInterval(timerRef.current);

          handleTimeout();

          return 0;

        }


        return previous - 1;

      });

    }, 1000);


    return () => {

      clearInterval(timerRef.current);

    };

  }, [current, started, finished, answered]);


  /*
  ============================================
  START SOUND
  ============================================
  */

  function playStartSound() {

    try {

      const sound =
        new Audio("/sounds/start.mp3");

      sound.volume = 0.8;

      sound.play().catch(() => {});

    } catch (error) {

      console.error(
        "Start sound error:",
        error
      );

    }

  }


  /*
  ============================================
  START QUIZ
  ============================================
  */

  function startQuiz() {

    playStartSound();

    setStarted(true);

    setCurrent(0);

    setScore(0);

    setAnswered(false);

    setShowFeedback(false);

    setTimedOut(false);

    setTimeLeft(QUESTION_TIME);

  }


  /*
  ============================================
  SAVE QUIZ RESULT
  ============================================
  */

  async function saveQuizResult(finalScore) {

    try {

      const {
        data: {
          user
        },
        error: userError
      } = await supabase.auth.getUser();


      if (userError || !user) {

        console.error(
          "User tidak dijumpai:",
          userError
        );

        toast.error(
          "❌ User tidak dijumpai"
        );

        return false;

      }


      const finalPercentage =
        Math.round(
          (finalScore /
            questions.length) *
          100
        );


      const finalXp =
        finalScore * 10;


      let finalBenchmark = "";


      if (finalPercentage < 40) {

        finalBenchmark =
          "Perlu Bimbingan";

      }

      else if (finalPercentage < 60) {

        finalBenchmark =
          "Asas";

      }

      else if (finalPercentage < 80) {

        finalBenchmark =
          "Memuaskan";

      }

      else if (finalPercentage < 90) {

        finalBenchmark =
          "Baik";

      }

      else {

        finalBenchmark =
          "Cemerlang";

      }


      /*
      ========================================
      SAVE RESULT
      ========================================
      */

      const {
        error: quizError
      } = await supabase

        .from("quiz_results")

        .insert([

          {

            profile_id:
              user.id,

            score:
              finalScore,

            total_questions:
              questions.length,

            percentage:
              finalPercentage,

            xp_earned:
              finalXp,

            benchmark:
              finalBenchmark

          }

        ]);


      if (quizError) {

        console.error(
          "Gagal simpan quiz:",
          quizError
        );

        toast.error(
          "❌ Markah gagal disimpan"
        );

        return false;

      }


      /*
      ========================================
      GET CURRENT XP
      ========================================
      */

      const {
        data: profile,
        error: profileError
      } = await supabase

        .from("profiles")

        .select("total_xp")

        .eq("id", user.id)

        .single();


      if (profileError) {

        console.error(
          "Gagal ambil XP:",
          profileError
        );

        return false;

      }


      /*
      ========================================
      UPDATE XP
      ========================================
      */

      const newTotalXp =
        (profile.total_xp || 0) +
        finalXp;


      const {
        error: updateError
      } = await supabase

        .from("profiles")

        .update({

          total_xp:
            newTotalXp

        })

        .eq("id", user.id);


      if (updateError) {

        console.error(
          "Gagal update XP:",
          updateError
        );

        toast.error(
          "❌ XP gagal dikemaskini"
        );

        return false;

      }


      console.log(
        "✅ Quiz result berjaya disimpan!"
      );


      console.log(
        "✅ XP berjaya dikemaskini:",
        newTotalXp
      );


      return true;

    } catch (error) {

      console.error(
        "Quiz save exception:",
        error
      );

      toast.error(
        "❌ Berlaku masalah semasa menyimpan keputusan."
      );

      return false;

    }

  }


  /*
  ============================================
  HANDLE TIMEOUT
  ============================================
  */

  function handleTimeout() {

    if (answered || finished) {

      return;

    }


    setAnswered(true);

    setTimedOut(true);

    setLastAnswerCorrect(false);

    setShowFeedback(true);


    handleAnswer(false);


    playWrongSound();


    toast.error(
      "⏰ Masa tamat!",
      {

        style: {

          background: "#FFEBEE",

          color: "#C62828",

          borderRadius: "15px"

        }

      }

    );

  }


  /*
  ============================================
  ANSWER
  ============================================
  */

  function answer(index) {

    if (
      answered ||
      finished
    ) {

      return;

    }


    clearInterval(
      timerRef.current
    );


    setAnswered(true);

    setTimedOut(false);


    const isCorrect =
      index ===
      questions[current].answer;


    setLastAnswerCorrect(
      isCorrect
    );


    handleAnswer(
      isCorrect
    );


    if (isCorrect) {

      playCorrectSound();


      setScore(
        (previous) =>
          previous + 1
      );


      toast.success(
        "🎉 Jawapan betul! +10 XP"
      );

    }

    else {

      playWrongSound();


      toast.error(
        "❌ Jawapan salah!"
      );

    }


    setShowFeedback(true);

  }


  /*
  ============================================
  NEXT QUESTION
  ============================================
  */

  async function nextQuestion() {

    setShowFeedback(false);


    if (
      current ===
      questions.length - 1
    ) {

      await saveQuizResult(
        score +
        (
          lastAnswerCorrect
            ? 1
            : 0
        )
      );


      setScore(
        score +
        (
          lastAnswerCorrect
            ? 1
            : 0
        )
      );


      setFinished(true);

      return;

    }


    setCurrent(
      (previous) =>
        previous + 1
    );


    setAnswered(false);

    setTimedOut(false);

    setLastAnswerCorrect(false);

    setTimeLeft(
      QUESTION_TIME
    );

  }


  /*
  ============================================
  PROGRESS
  ============================================
  */

  const progress =
    ((current + 1) /
      questions.length) *
    100;


  const xp =
    score * 10;


  const percentage =
    Math.round(
      (score /
        questions.length) *
      100
    );


  /*
  ============================================
  BENCHMARK
  ============================================
  */

  let benchmark = "";

  let benchmarkClass = "";


  if (percentage < 40) {

    benchmark =
      "🔴 Perlu Bimbingan";

    benchmarkClass =
      "needs-help";

  }

  else if (percentage < 60) {

    benchmark =
      "🟠 Asas";

    benchmarkClass =
      "basic";

  }

  else if (percentage < 80) {

    benchmark =
      "🟡 Memuaskan";

    benchmarkClass =
      "satisfactory";

  }

  else if (percentage < 90) {

    benchmark =
      "🟢 Baik";

    benchmarkClass =
      "good";

  }

  else {

    benchmark =
      "🏆 Cemerlang";

    benchmarkClass =
      "excellent";

  }


  /*
  ============================================
  LEVEL
  ============================================
  */

  let level =
    "🌱 Pemula Siber";


  if (
    score ===
    questions.length
  ) {

    level =
      "🏆 Wira Siber";

  }

  else if (
    score >= 4
  ) {

    level =
      "🛡️ Penyiasat Siber";

  }


  /*
  ============================================
  MESSAGE
  ============================================
  */

  let message =
    "📚 Teruskan belajar untuk meningkatkan kemahiran anda!";


  if (
    score ===
    questions.length
  ) {

    message =
      "🌟 Hebat! Anda berjaya menjawab semua soalan dengan betul!";

  }

  else if (
    score >= 4
  ) {

    message =
      "🎉 Syabas! Anda hampir menguasai topik phishing.";

  }

  else if (
    score >= 3
  ) {

    message =
      "😊 Bagus! Teruskan latihan supaya menjadi lebih mahir.";

  }


  /*
  ============================================
  TIMER CLASS
  ============================================
  */

  let timerClass =
    "quizTimer";


  if (timeLeft <= 10) {

    timerClass =
      "quizTimer danger";

  }

  else if (timeLeft <= 20) {

    timerClass =
      "quizTimer warning";

  }


  /*
  ============================================
  PAGE
  ============================================
  */

  return (

    <>

      <Sidebar />


      <div className="quiz-page">


        {/* ==================================
            START SCREEN
        ================================== */}

        {!started && !finished && (

          <div className="quiz-start-card">


            <div className="quiz-start-icon">

              🛡️

            </div>


            <h1>

              Kuiz Kesedaran Siber

            </h1>


            <p>

              Uji pengetahuan anda tentang
              phishing dan keselamatan siber.

            </p>


            <div className="quiz-start-info">


              <div>

                <span>
                  📋
                </span>

                <strong>
                  {questions.length}
                </strong>

                <small>
                  Soalan
                </small>

              </div>


              <div>

                <span>
                  ⏱️
                </span>

                <strong>
                  {QUESTION_TIME}s
                </strong>

                <small>
                  Setiap Soalan
                </small>

              </div>


              <div>

                <span>
                  ⭐
                </span>

                <strong>
                  +10 XP
                </strong>

                <small>
                  Jawapan Betul
                </small>

              </div>


            </div>


            <div className="quiz-start-note">

              💡 Setiap soalan mempunyai
              had masa {QUESTION_TIME} saat.
              Timer akan ditetapkan semula
              apabila anda pergi ke soalan
              seterusnya.

            </div>


            <button

              className="startQuizBtn"

              onClick={startQuiz}

            >

              🚀 Mula Kuiz

            </button>


          </div>

        )}


        {/* ==================================
            RESULT
        ================================== */}

        {finished && (

          <div className="result-card">


            <h1>

              🎉 Tahniah!

            </h1>


            <h2>

              Kuiz Tamat

            </h2>


            <div className="scoreCircle">

              {score}/
              {questions.length}

            </div>


            <h3>

              ⭐ Mata XP Diperoleh

            </h3>


            <h1>

              {xp} XP

            </h1>


            <h3>

              📊 Peratus Markah

            </h3>


            <h2>

              {percentage}%

            </h2>


            <div

              className={
                `benchmark ${benchmarkClass}`
              }

            >

              {benchmark}

            </div>


            <h2>

              {level}

            </h2>


            <p>

              {message}

            </p>


            <button

              className="homeBtn"

              onClick={() =>
                navigate("/dashboard")
              }

            >

              🏠 Kembali ke Laman Utama

            </button>


          </div>

        )}


        {/* ==================================
            QUIZ
        ================================== */}

        {started && !finished && (

          <div className="quiz-card">


            <h1>

              📝 Kuiz Kesedaran Siber

            </h1>


            <div className="quiz-top-row">


              <h3>

                Soalan{" "}
                {current + 1}{" "}
                daripada{" "}
                {questions.length}

              </h3>


              <div className={timerClass}>

                ⏱️ {timeLeft}s

              </div>


            </div>


            <div className="progressBar">

              <div

                className="progressFill"

                style={{

                  width:
                    `${progress}%`

                }}

              ></div>

            </div>


            <p className="progressText">

              Kemajuan{" "}
              {Math.round(progress)}%

            </p>


            <div className="questionTimerHint">

              ⏱️ Anda mempunyai{" "}
              {QUESTION_TIME} saat
              untuk menjawab soalan ini.

            </div>


            <h2>

              {
                questions[current]
                  .question
              }

            </h2>


            <div className="options">


              {

                questions[current]
                  .options
                  .map(
                    (
                      option,
                      index
                    ) => (

                      <button

                        key={index}

                        className="optionButton"

                        onClick={() =>
                          answer(index)
                        }

                        disabled={
                          answered
                        }

                      >

                        <span

                          className={
                            "optionLetter"
                          }

                        >

                          {
                            String.fromCharCode(
                              65 + index
                            )
                          }

                        </span>


                        <span>

                          {option}

                        </span>


                      </button>

                    )
                  )

              }


            </div>


          </div>

        )}


        {/* ==================================
            FEEDBACK POPUP
        ================================== */}

        {showFeedback && (

          <div className="quiz-feedback-overlay">


            <div

              className={
                lastAnswerCorrect
                  ? "quiz-feedback-popup correct"
                  : "quiz-feedback-popup wrong"
              }

            >


              <div className="feedback-icon">

                {lastAnswerCorrect
                  ? "🎉"
                  : "❌"
                }

              </div>


              <h1>

                {lastAnswerCorrect
                  ? "BETUL!"
                  : timedOut
                    ? "MASA TAMAT!"
                    : "SALAH!"
                }

              </h1>


              {lastAnswerCorrect && (

                <div className="feedback-xp">

                  ⭐ +10 XP

                </div>

              )}


              {!lastAnswerCorrect && (

                <div className="correct-answer-box">

                  <strong>

                    Jawapan yang betul:

                  </strong>


                  <p>

                    {
                      questions[current]
                        .options[
                          questions[current]
                            .answer
                        ]
                    }

                  </p>

                </div>

              )}


              <div className="explanation-box">


                <h3>

                  💡 Penjelasan

                </h3>


                <p>

                  {
                    questions[current]
                      .explanation
                  }

                </p>


              </div>


              <button

                className="nextQuestionBtn"

                onClick={nextQuestion}

              >

                {current ===
                questions.length - 1

                  ? "🏆 Lihat Keputusan"

                  : "Soalan Seterusnya →"

                }

              </button>


            </div>


          </div>

        )}


      </div>

    </>

  );

}


export default Quiz;