import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/sidebar.css";
import "../styles/simulation.css";
import { supabase } from "../services/supabase";
import {
  playCorrectSound,
  playWrongSound
} from "../utils/soundEffect";

const QUESTION_TIME = 30;

const emails = [
  {
    sender: "Maybank Security",
    subject: "Akaun Anda Telah Digantung",
    date: "Hari Ini, 10:30 PG",
    content: `Pelanggan yang dihormati,

Akaun anda telah digantung kerana terdapat aktiviti yang mencurigakan.

Sila sahkan akaun anda melalui pautan di bawah.

https://maybank-secure-login.xyz

Kegagalan untuk mengesahkan akaun dalam tempoh 24 jam boleh menyebabkan akaun anda digantung secara kekal.

Terima kasih.`,
    isPhishing: true,
    explanation:
      "E-mel ini adalah phishing kerana menggunakan domain yang mencurigakan dan memberi tekanan kepada pengguna untuk bertindak segera.",
    redFlags: [
      "Domain pautan bukan domain rasmi Maybank.",
      "Menggunakan ancaman akaun akan digantung.",
      "Meminta pengguna klik pautan untuk pengesahan."
    ]
  },

  {
    sender: "Google",
    subject: "Amaran Keselamatan Google",
    date: "Hari Ini, 11:15 PG",
    content: `Hai,

Kami mengesan percubaan log masuk baharu ke akaun anda.

Jika ini adalah anda, anda tidak perlu melakukan apa-apa.

Jika anda tidak mengenali aktiviti ini, sila buka Google Account secara manual melalui aplikasi atau laman rasmi Google.

Terima kasih,
Google Security`,
    isPhishing: false,
    explanation:
      "E-mel ini selamat kerana tidak meminta pengguna memasukkan kata laluan atau klik pautan mencurigakan.",
    redFlags: [
      "Tiada pautan mencurigakan.",
      "Tidak meminta kata laluan.",
      "Mengarahkan pengguna membuka laman rasmi secara manual."
    ]
  },

  {
    sender: "Shopee Malaysia",
    subject: "Tahniah! Anda Memenangi Baucar RM500",
    date: "Hari Ini, 12:20 PTG",
    content: `Tahniah!

Anda telah dipilih sebagai pemenang baucar RM500.

Untuk menuntut hadiah anda, sila lengkapkan maklumat melalui pautan berikut:

https://shopee-reward-claim.xyz

Tuntutan mesti dibuat dalam masa 2 jam.

Terima kasih.`,
    isPhishing: true,
    explanation:
      "E-mel ini adalah phishing kerana menawarkan hadiah yang tidak dijangka dan menggunakan pautan domain yang mencurigakan.",
    redFlags: [
      "Hadiah yang tidak dijangka.",
      "Domain bukan domain rasmi.",
      "Memberi tekanan masa untuk bertindak."
    ]
  },

  {
    sender: "Netflix",
    subject: "Resit Pembayaran Bulanan Anda",
    date: "Semalam, 8:45 PG",
    content: `Hai,

Pembayaran langganan Netflix anda telah berjaya diproses.

Jumlah: RM55.90

Anda boleh menyemak butiran langganan melalui aplikasi Netflix.

Terima kasih,
Netflix`,
    isPhishing: false,
    explanation:
      "E-mel ini dianggap selamat kerana hanya memberikan maklumat transaksi dan tidak meminta maklumat sensitif.",
    redFlags: [
      "Tiada permintaan kata laluan.",
      "Tiada pautan pembayaran mencurigakan.",
      "Maklumat hanya bersifat pemberitahuan."
    ]
  },

  {
    sender: "J&T Express",
    subject: "Penghantaran Parcel Gagal",
    date: "Hari Ini, 2:10 PTG",
    content: `Pelanggan yang dihormati,

Penghantaran parcel anda tidak dapat dilakukan kerana alamat tidak lengkap.

Sila kemas kini alamat dan bayar caj penghantaran RM3.00 melalui pautan berikut:

https://jtexpress-payment.xyz

Sila lakukan pembayaran dalam masa 6 jam.

Terima kasih.`,
    isPhishing: true,
    explanation:
      "E-mel ini adalah phishing kerana meminta bayaran melalui pautan yang bukan domain rasmi.",
    redFlags: [
      "Meminta bayaran melalui pautan.",
      "Domain mencurigakan.",
      "Menggunakan had masa untuk mendesak pengguna."
    ]
  },

  {
    sender: "PUO Student Portal",
    subject: "Notifikasi Jadual Akademik",
    date: "Hari Ini, 9:00 PG",
    content: `Assalamualaikum,

Jadual akademik bagi semester semasa telah dikemaskini.

Sila semak jadual anda melalui portal pelajar rasmi PUO.

Terima kasih.`,
    isPhishing: false,
    explanation:
      "E-mel ini selamat kerana hanya memberikan notifikasi dan tidak meminta maklumat peribadi atau pembayaran.",
    redFlags: [
      "Tiada permintaan maklumat sensitif.",
      "Tiada pautan mencurigakan.",
      "Maklumat boleh disemak melalui portal rasmi."
    ]
  },

  {
    sender: "Touch 'n Go eWallet",
    subject: "Akaun Anda Memerlukan Pengesahan",
    date: "Hari Ini, 3:30 PTG",
    content: `Pelanggan yang dihormati,

Akaun anda telah dikesan mempunyai masalah keselamatan.

Sila sahkan akaun anda sekarang untuk mengelakkan akaun disekat.

https://tng-secure-verification.xyz

Kegagalan berbuat demikian dalam masa 12 jam akan menyebabkan akaun anda ditamatkan.`,
    isPhishing: true,
    explanation:
      "E-mel ini adalah phishing kerana menggunakan domain palsu dan menggunakan ancaman untuk memaksa pengguna bertindak.",
    redFlags: [
      "Domain mencurigakan.",
      "Menggunakan ancaman akaun ditamatkan.",
      "Meminta pengguna melakukan pengesahan melalui pautan."
    ]
  },

  {
    sender: "Microsoft 365",
    subject: "Mesyuarat Microsoft Teams",
    date: "Hari Ini, 4:00 PTG",
    content: `Hai,

Anda telah dijemput ke mesyuarat Microsoft Teams.

Tarikh: Jumaat
Masa: 10:00 PG

Sila semak jemputan melalui kalendar Microsoft Teams anda.

Terima kasih.`,
    isPhishing: false,
    explanation:
      "E-mel ini selamat kerana hanya memberikan maklumat mesyuarat dan tidak meminta maklumat akaun.",
    redFlags: [
      "Tiada permintaan kata laluan.",
      "Tiada permintaan pembayaran.",
      "Maklumat boleh disemak melalui aplikasi rasmi."
    ]
  },

  {
    sender: "WhatsApp Support",
    subject: "Akaun WhatsApp Anda Akan Disekat",
    date: "Hari Ini, 5:15 PTG",
    content: `Amaran!

Akaun WhatsApp anda akan disekat kerana melanggar polisi keselamatan.

Untuk mengelakkan akaun disekat, sila sahkan nombor telefon anda melalui pautan berikut:

https://whatsapp-security-check.xyz

Tindakan diperlukan dalam masa 30 minit.`,
    isPhishing: true,
    explanation:
      "E-mel ini adalah phishing kerana menggunakan tekanan masa dan pautan domain yang mencurigakan.",
    redFlags: [
      "Had masa yang sangat singkat.",
      "Domain bukan domain rasmi.",
      "Meminta pengesahan melalui pautan."
    ]
  },

  {
    sender: "Spotify",
    subject: "Langganan Spotify Berjaya Diperbaharui",
    date: "Semalam, 7:30 PG",
    content: `Hai,

Langganan Spotify Premium anda telah berjaya diperbaharui.

Jumlah pembayaran telah direkodkan dalam akaun anda.

Untuk melihat sejarah pembayaran, buka aplikasi Spotify.

Terima kasih,
Spotify`,
    isPhishing: false,
    explanation:
      "E-mel ini selamat kerana tidak meminta pengguna memberikan maklumat akaun atau melakukan pembayaran melalui pautan luar.",
    redFlags: [
      "Tiada permintaan kata laluan.",
      "Tiada pautan pembayaran luar.",
      "Pengguna diarahkan menggunakan aplikasi rasmi."
    ]
  },

  {
    sender: "Bank Negara Malaysia",
    subject: "Tuntutan Bantuan Kewangan Segera",
    date: "Hari Ini, 6:00 PTG",
    content: `Tahniah!

Anda layak menerima bantuan kewangan sebanyak RM1,500.

Untuk menerima bayaran tersebut, sila masukkan maklumat akaun bank dan nombor TAC melalui pautan berikut:

https://bantuan-bnm-claim.xyz

Tuntutan perlu dibuat sebelum tengah malam.`,
    isPhishing: true,
    explanation:
      "E-mel ini adalah phishing kerana meminta maklumat perbankan dan TAC melalui pautan yang mencurigakan.",
    redFlags: [
      "Meminta nombor TAC.",
      "Meminta maklumat akaun bank.",
      "Domain mencurigakan.",
      "Menawarkan wang secara tiba-tiba."
    ]
  }
];

function shuffleEmails(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(
      Math.random() * (i + 1)
    );

    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i]
    ];
  }

  return shuffled;
}

function Simulation() {
  const [randomEmails, setRandomEmails] = useState(
    () => shuffleEmails(emails)
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [answered, setAnswered] =
    useState(false);

  const [score, setScore] = useState(0);

  const [xp, setXp] = useState(0);

  const [started, setStarted] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  const [timeLeft, setTimeLeft] =
    useState(QUESTION_TIME);

  const [showFeedback, setShowFeedback] =
    useState(false);

  const [lastAnswerCorrect, setLastAnswerCorrect] =
    useState(false);

  const [timedOut, setTimedOut] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const scoreRef = useRef(0);

  const xpRef = useRef(0);

  const savingRef = useRef(false);

  const finishedRef = useRef(false);

  const currentEmail =
    randomEmails[currentIndex];

  /* ================================
     TIMER
  ================================= */

  useEffect(() => {
    if (
      !started ||
      finished ||
      answered ||
      showFeedback
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    started,
    finished,
    answered,
    showFeedback,
    currentIndex
  ]);

  /* ================================
     TIMER HABIS
  ================================= */

  useEffect(() => {
    if (
      started &&
      !finished &&
      !answered &&
      timeLeft === 0
    ) {
      handleTimeout();
    }
  }, [
    timeLeft,
    started,
    finished,
    answered
  ]);

  /* ================================
     FORMAT TIMER
  ================================= */

  function formatTime(seconds) {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  /* ================================
     START
  ================================= */

  function startSimulation() {
    const newEmails =
      shuffleEmails(emails);

    setRandomEmails(newEmails);

    setCurrentIndex(0);

    setSelectedAnswer(null);

    setAnswered(false);

    setScore(0);

    setXp(0);

    scoreRef.current = 0;

    xpRef.current = 0;

    setTimeLeft(QUESTION_TIME);

    setShowFeedback(false);

    setLastAnswerCorrect(false);

    setTimedOut(false);

    setFinished(false);

    setSaving(false);

    savingRef.current = false;

    finishedRef.current = false;

    setStarted(true);
  }

  /* ================================
     TIMEOUT
  ================================= */

  function handleTimeout() {
    if (
      answered ||
      finished ||
      !started
    ) {
      return;
    }

    playWrongSound();

    setSelectedAnswer(null);

    setAnswered(true);

    setTimedOut(true);

    setLastAnswerCorrect(false);

    setShowFeedback(true);
  }

  /* ================================
     ANSWER
  ================================= */

  function handleAnswer(answer) {
    if (
      answered ||
      finished ||
      !started
    ) {
      return;
    }

    const correct =
      answer === currentEmail.isPhishing;

    setSelectedAnswer(answer);

    setAnswered(true);

    setTimedOut(false);

    setLastAnswerCorrect(correct);

    setShowFeedback(true);

    if (correct) {
      playCorrectSound();

      scoreRef.current += 1;

      xpRef.current += 10;

      setScore(scoreRef.current);

      setXp(xpRef.current);
    } else {
      playWrongSound();
    }
  }

  /* ================================
     NEXT EMAIL
  ================================= */

  function handleNext() {
    if (saving || finished) {
      return;
    }

    setShowFeedback(false);

    if (
      currentIndex <
      randomEmails.length - 1
    ) {
      setCurrentIndex(
        (previous) =>
          previous + 1
      );

      setSelectedAnswer(null);

      setAnswered(false);

      setTimedOut(false);

      setLastAnswerCorrect(false);

      setTimeLeft(
        QUESTION_TIME
      );

      return;
    }

    finishSimulation();
  }

  /* ================================
     FINISH + SAVE
  ================================= */

  async function finishSimulation() {
    if (
      savingRef.current ||
      finishedRef.current
    ) {
      return;
    }

    savingRef.current = true;

    finishedRef.current = true;

    setSaving(true);

    const finalScore =
      scoreRef.current;

    const finalXp =
      xpRef.current;

    const percentage =
      Math.round(
        (finalScore /
          randomEmails.length) *
          100
      );

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        const {
          error
        } = await supabase
          .from("simulation_results")
          .insert([
            {
              profile_id:
                user.id,

              score:
                finalScore,

              total_questions:
                randomEmails.length,

              percentage:
                percentage,

              xp_earned:
                finalXp,

              created_at:
                new Date().toISOString()
            }
          ]);

        if (error) {
          console.error(
            "Simulation result save error:",
            error
          );
        }

        const {
          data: profile
        } = await supabase
          .from("profiles")
          .select("total_xp")
          .eq("id", user.id)
          .single();

        if (profile) {
          const currentXP =
            profile.total_xp || 0;

          await supabase
            .from("profiles")
            .update({
              total_xp:
                currentXP + finalXp
            })
            .eq(
              "id",
              user.id
            );
        }
      }
    } catch (error) {
      console.error(
        "Simulation result error:",
        error
      );
    }

    setScore(finalScore);

    setXp(finalXp);

    setSaving(false);

    setFinished(true);
  }

  /* ================================
     RESTART
  ================================= */

  function restartSimulation() {
    const newEmails =
      shuffleEmails(emails);

    setRandomEmails(newEmails);

    setCurrentIndex(0);

    setSelectedAnswer(null);

    setAnswered(false);

    setScore(0);

    setXp(0);

    scoreRef.current = 0;

    xpRef.current = 0;

    setTimeLeft(
      QUESTION_TIME
    );

    setShowFeedback(false);

    setLastAnswerCorrect(false);

    setTimedOut(false);

    setStarted(false);

    setFinished(false);

    setSaving(false);

    savingRef.current = false;

    finishedRef.current = false;
  }

  /* ================================
     START SCREEN
  ================================= */

  if (!started) {
    return (
      <>
        <Sidebar />

        <div className="simulation-page">

          <div className="simulation-start-screen">

            <div className="simulation-start-modal">

              <div className="simulation-start-icon">
                📧
              </div>

              <h1>
                Simulasi E-mel Phishing
              </h1>

              <p>
                Uji kebolehan anda mengenal pasti
                e-mel phishing dan e-mel yang selamat.
              </p>

              <div className="simulation-info">

                <div className="simulation-info-card">
                  <span>📩</span>

                  <strong>
                    12
                  </strong>

                  <small>
                    E-mel
                  </small>
                </div>

                <div className="simulation-info-card">
                  <span>🟢</span>

                  <strong>
                    6
                  </strong>

                  <small>
                    Selamat
                  </small>
                </div>

                <div className="simulation-info-card">
                  <span>🔴</span>

                  <strong>
                    6
                  </strong>

                  <small>
                    Phishing
                  </small>
                </div>

                <div className="simulation-info-card">
                  <span>⏱️</span>

                  <strong>
                    30s
                  </strong>

                  <small>
                    Setiap E-mel
                  </small>
                </div>

              </div>

              <div className="simulation-start-warning">
                💡 Setiap e-mel mempunyai masa
                30 saat untuk dijawab.
                Timer akan reset kepada 30 saat
                untuk e-mel seterusnya.
              </div>

              <button
                className="simulation-start-btn"
                onClick={startSimulation}
              >
                🚀 Mula Simulasi
              </button>

            </div>

          </div>

        </div>
      </>
    );
  }

  /* ================================
     RESULT SCREEN
  ================================= */

  if (finished) {
    const percentage =
      Math.round(
        (score /
          randomEmails.length) *
          100
      );

    return (
      <>
        <Sidebar />

        <div className="simulation-page">

          <div className="simulation-result-screen">

            <div className="simulation-result-modal">

              <div className="simulation-result-icon">
                🎉
              </div>

              <h1>
                Simulasi Selesai!
              </h1>

              <p>
                Tahniah! Anda telah melengkapkan
                semua 12 simulasi e-mel.
              </p>

              <div className="simulation-final-score">

                <div>
                  <span>
                    Skor
                  </span>

                  <strong>
                    {score} / {randomEmails.length}
                  </strong>
                </div>

                <div>
                  <span>
                    Markah
                  </span>

                  <strong>
                    {percentage}%
                  </strong>
                </div>

                <div>
                  <span>
                    XP
                  </span>

                  <strong>
                    ⭐ +{xp}
                  </strong>
                </div>

              </div>

              <div className="simulation-final-message">

                {percentage >= 80 && (
                  <>
                    <div className="result-message-title">
                      🏆 Cemerlang!
                    </div>

                    <p>
                      Anda sangat baik dalam mengenal
                      pasti e-mel phishing.
                    </p>
                  </>
                )}

                {percentage >= 50 &&
                  percentage < 80 && (
                    <>
                      <div className="result-message-title">
                        👍 Bagus!
                      </div>

                      <p>
                        Anda sudah mempunyai asas yang baik.
                        Teruskan berlatih.
                      </p>
                    </>
                  )}

                {percentage < 50 && (
                  <>
                    <div className="result-message-title">
                      💡 Jangan risau!
                    </div>

                    <p>
                      Cuba semula dan perhatikan
                      red flags dengan lebih teliti.
                    </p>
                  </>
                )}

              </div>

              <button
                className="simulation-restart-btn"
                onClick={restartSimulation}
              >
                🔄 Cuba Semula
              </button>

            </div>

          </div>

        </div>
      </>
    );
  }

  /* ================================
     CURRENT EMAIL
  ================================= */

  const isCorrect =
    selectedAnswer ===
    currentEmail.isPhishing;

  const progress =
    ((currentIndex + 1) /
      randomEmails.length) *
    100;

  return (
    <>
      <Sidebar />

      <div className="simulation-page">

        <div className="simulation-header">

          <div>
            <h1>
              📧 Simulasi E-mel Phishing
            </h1>

            <p>
              Kenal pasti sama ada e-mel ini
              selamat atau phishing.
            </p>
          </div>

          <div
            className={`simulation-timer ${
              timeLeft <= 10
                ? "timer-danger"
                : timeLeft <= 20
                ? "timer-warning"
                : ""
            }`}
          >
            ⏱️ {formatTime(timeLeft)}
          </div>

        </div>

        <div className="simulation-progress-container">

          <div className="simulation-progress-top">

            <span>
              📩 E-mel {currentIndex + 1} /{" "}
              {randomEmails.length}
            </span>

            <span>
              ⭐ XP: {xp}
            </span>

          </div>

          <div className="simulation-progress-bar">

            <div
              className="simulation-progress-fill"
              style={{
                width: `${progress}%`
              }}
            />

          </div>

        </div>

        <div className="simulation-container">

          <div className="email-list">

            <h2>
              📥 Peti Masuk
            </h2>

            {randomEmails.map(
              (email, index) => (
                <div
                  key={`${email.sender}-${index}`}
                  className={`email-item ${
                    index === currentIndex
                      ? "active"
                      : ""
                  } ${
                    index < currentIndex
                      ? "completed"
                      : ""
                  }`}
                >

                  <div className="email-number">
                    {index + 1}
                  </div>

                  <div className="email-item-content">

                    <strong>
                      {email.sender}
                    </strong>

                    <p>
                      {email.subject}
                    </p>

                  </div>

                  {index < currentIndex && (
                    <span className="email-check">
                      ✓
                    </span>
                  )}

                </div>
              )
            )}

          </div>

          <div className="email-view">

            <div className="toolbar">

              <button disabled>
                ↩ Balas
              </button>

              <button disabled>
                → Majukan
              </button>

              <button disabled>
                🗑 Padam
              </button>

            </div>

            <div className="email-header">

              <h2>
                {currentEmail.subject}
              </h2>

              <p>
                <strong>
                  Daripada:
                </strong>{" "}
                {currentEmail.sender}
              </p>

              <p>
                <strong>
                  Tarikh:
                </strong>{" "}
                {currentEmail.date}
              </p>

            </div>

            <div className="emailContent">
              {currentEmail.content}
            </div>

            {!answered && (
              <div className="buttons">

                <button
                  className="safe"
                  onClick={() =>
                    handleAnswer(false)
                  }
                >
                  🟢 Selamat
                </button>

                <button
                  className="danger"
                  onClick={() =>
                    handleAnswer(true)
                  }
                >
                  🔴 Phishing
                </button>

              </div>
            )}

          </div>

        </div>

        {/* ================================
            FEEDBACK POPUP
        ================================= */}

        {showFeedback && (
          <div className="simulation-feedback-overlay">

            <div
              className={`simulation-feedback-popup ${
                lastAnswerCorrect
                  ? "correct"
                  : "wrong"
              }`}
            >

              <div className="feedback-icon">

                {lastAnswerCorrect
                  ? "🎉"
                  : timedOut
                  ? "⏰"
                  : "❌"}

              </div>

              <h1>

                {lastAnswerCorrect
                  ? "BETUL!"
                  : timedOut
                  ? "MASA TAMAT!"
                  : "SALAH!"}

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
                    {currentEmail.isPhishing
                      ? "🔴 Phishing"
                      : "🟢 Selamat"}
                  </p>

                </div>
              )}

              <div className="explanation-box">

                <h3>
                  💡 Penjelasan
                </h3>

                <p>
                  {currentEmail.explanation}
                </p>

              </div>

              <div className="red-flags-box">

                <h3>
                  🔍 Perkara yang perlu diperhatikan
                </h3>

                <ul>

                  {currentEmail.redFlags.map(
                    (flag, index) => (
                      <li key={index}>
                        {flag}
                      </li>
                    )
                  )}

                </ul>

              </div>

              <button
                className="simulation-next-btn"
                onClick={handleNext}
                disabled={saving}
              >

                {saving
                  ? "⏳ Menyimpan..."
                  : currentIndex ===
                    randomEmails.length - 1
                  ? "🏆 Lihat Keputusan"
                  : "E-mel Seterusnya →"}

              </button>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default Simulation;