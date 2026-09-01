import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/sidebar.css";
import "../styles/website.css";

function WebsiteSimulation() {

  const websites = [

    {
      browser: "Maybank2u",
      url: "https://www.maybank2u.com.my",
      title: "Maybank2u Online Banking",
      answer: "safe",
      reason: "Ini ialah domain rasmi Maybank yang menggunakan HTTPS.",
      redFlags: [
        "Menggunakan domain rasmi maybank2u.com.my",
        "Sambungan HTTPS yang selamat",
        "Tiada ejaan yang mencurigakan"
      ]
    },

    {
      browser: "Maybank Security",
      url: "https://maybank-login-security.xyz",
      title: "Maybank Secure Login",
      answer: "phishing",
      reason: "Domain palsu yang cuba menyamar sebagai Maybank.",
      redFlags: [
        "Menggunakan domain .xyz",
        "Bukan laman rasmi Maybank",
        "Menggunakan perkataan 'login-security' untuk mengelirukan pengguna"
      ]
    },

    {
      browser: "Google",
      url: "https://accounts.google.com",
      title: "Google Sign In",
      answer: "safe",
      reason: "Ini ialah halaman log masuk rasmi Google.",
      redFlags: [
        "Domain rasmi Google",
        "Menggunakan HTTPS",
        "Alamat URL adalah betul"
      ]
    },

    {
      browser: "Google Security",
      url: "https://google-account-login.xyz",
      title: "Google Account Verification",
      answer: "phishing",
      reason: "Laman palsu yang cuba mencuri maklumat log masuk.",
      redFlags: [
        "Menggunakan domain .xyz",
        "Bukan domain rasmi Google",
        "Nama domain mengelirukan"
      ]
    },

    {
      browser: "Shopee",
      url: "https://shopee.com.my",
      title: "Shopee Malaysia",
      answer: "safe",
      reason: "Laman web rasmi Shopee Malaysia.",
      redFlags: [
        "Domain rasmi shopee.com.my",
        "Menggunakan HTTPS",
        "Tiada ejaan pelik"
      ]
    },

    {
      browser: "Shopee Voucher",
      url: "https://shopee-voucher-free.xyz",
      title: "Shopee Voucher RM500",
      answer: "phishing",
      reason: "Laman palsu yang menawarkan hadiah untuk memperdaya pengguna.",
      redFlags: [
        "Menggunakan domain .xyz",
        "Menawarkan hadiah yang terlalu menarik",
        "Bukan laman rasmi Shopee"
      ]
    },
      {
      browser: "Pos Malaysia",
      url: "https://www.pos.com.my",
      title: "Pos Malaysia",
      answer: "safe",
      reason: "Ini ialah laman rasmi Pos Malaysia.",
      redFlags: [
        "Domain rasmi Pos Malaysia",
        "Menggunakan HTTPS",
        "Alamat domain kelihatan sah"
      ]
    },

    {
      browser: "Pos Malaysia Delivery",
      url: "https://posmalaysia-delivery.xyz",
      title: "Pos Malaysia Delivery",
      answer: "phishing",
      reason: "Domain ini bukan domain rasmi Pos Malaysia dan cuba menyamar sebagai perkhidmatan penghantaran.",
      redFlags: [
        "Menggunakan domain .xyz",
        "Domain bukan domain rasmi Pos Malaysia",
        "Meminta pengguna membuat bayaran melalui laman yang mencurigakan"
      ]
    }
  ];

const [current, setCurrent] = useState(0);
const [feedback, setFeedback] = useState("");
const [score, setScore] = useState(0);
const [finished, setFinished] = useState(false);

 function check(choice) {

  if (feedback) return;

  if (choice === websites[current].answer) {

    setFeedback("correct");

    setScore((prev) => prev + 10);

  } else {

    setFeedback("wrong");

  }

}

  function nextWebsite() {

  if (current < websites.length - 1) {

    setCurrent((prev) => prev + 1);
    setFeedback("");

  } else {

    setFinished(true);

  }

}

const percentage = Math.round(
  (score / websites.length) * 100
);

let benchmark = "";

if (percentage < 40) {

  benchmark = "🔴 Perlu Bimbingan";

} else if (percentage < 60) {

  benchmark = "🟠 Asas";

} else if (percentage < 80) {

  benchmark = "🟡 Memuaskan";

} else if (percentage < 90) {

  benchmark = "🟢 Baik";

} else {

  benchmark = "🏆 Cemerlang";

}

  return(

<>
<Sidebar/>

<div className="website-page">

<h1>🌐 Simulasi Laman Web</h1>

{finished ? (

  <div className="website-result">

    <h1>🎉 Simulasi Tamat!</h1>

    <h2>
      Markah Anda
    </h2>

    <div className="website-score">

      {score} / {websites.length}

    </div>

    <h3>
      ⭐ XP Diperoleh
    </h3>

    <h2>
      {score * 10} XP
    </h2>

    <h3>
      📊 Benchmark
    </h3>

    <h2>
      {benchmark}
    </h2>

    <p>
      Anda mendapat {percentage}% dalam simulasi laman web.
    </p>

  </div>

) : (

  <>
  
  </>

)}

<div className="progressBox">

  <span>
    Laman Web {current + 1} / {websites.length}
  </span>

  <span>
    ⭐ XP: {score}
  </span>

</div>

<div className="browser">

<div className="browserTop">

<div className="circles">

<span className="red"></span>

<span className="yellow"></span>

<span className="green"></span>

</div>

<div className="addressBar">

🔒 {websites[current].url}

</div>

</div>

<div className="browserContent">

<h2>

{websites[current].title}

</h2>

<div className="loginBox">

<input
type="text"
placeholder="Nama Pengguna"
/>

<input
type="password"
placeholder="Kata Laluan"
/>

<button>

Log Masuk

</button>

</div>

</div>

</div>

<div className="questionCard">

<h2>

Adakah laman web ini selamat?

</h2>

<div className="website-buttons">

<button
  className="safe"
  onClick={() => check("safe")}
  disabled={feedback !== ""}
>

✅ Laman Web Sah

</button>

<button
  className="danger"
  onClick={() => check("phishing")}
  disabled={feedback !== ""}
>

🚨 Laman Web Phishing

</button>

</div>

{

feedback &&

<div className="feedback">

<h3>

{

feedback==="correct"

?

"🎉 Hebat!"

:

"😊 Cuba Lagi!"

}

</h3>

<p>

{

feedback==="correct"

?

"Jawapan anda betul. +10 XP ⭐"

:

"Jawapan kurang tepat."

}

</p>

<h4>

Tanda-tanda yang perlu diperhatikan

</h4>

<ul>

{

websites[current].redFlags.map((item,index)=>(

<li key={index}>

{item}

</li>

))

}

</ul>

</div>

}

<button
className="next-btn"
onClick={nextWebsite}
>

Laman Web Seterusnya →

</button>

</div>

</div>

</>

  );

}

export default WebsiteSimulation;