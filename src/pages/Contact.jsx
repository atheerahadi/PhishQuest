import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/sidebar.css";
import "../styles/contact.css";

function Contact() {

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [message,setMessage]=useState("");

  function sendMessage(){

    if(!name || !email || !message){

      alert("Sila lengkapkan semua maklumat.");

      return;

    }

    alert("✅ Terima kasih! Maklum balas anda telah berjaya dihantar.");

    setName("");
    setEmail("");
    setMessage("");

  }

  return(

<>
<Sidebar/>

<div className="contact-page">

<h1>

📞 Hubungi Kami

</h1>

<p className="subtitle">

Kami sedia menerima sebarang pertanyaan atau cadangan bagi menambah baik PhishQuest.

</p>

<div className="contact-card">

<input

type="text"

placeholder="Nama"

value={name}

onChange={(e)=>setName(e.target.value)}

/>

<input

type="email"

placeholder="Alamat E-mel"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>

<textarea

rows="6"

placeholder="Tulis mesej anda di sini..."

value={message}

onChange={(e)=>setMessage(e.target.value)}

/>

<button

onClick={sendMessage}

>

📨 Hantar Maklum Balas

</button>

</div>

</div>

</>

  );

}

export default Contact;