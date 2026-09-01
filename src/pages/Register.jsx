import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

import logo from "../assets/mascot/mascot.png";

import "../styles/register.css";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleRegister(e) {

    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);


    try {

      if (
        !name.trim() ||
        !email.trim() ||
        !password
      ) {

        setErrorMessage(
          "❌ Sila lengkapkan semua maklumat."
        );

        setLoading(false);

        return;
      }


      if (password.length < 6) {

        setErrorMessage(
          "❌ Kata laluan mestilah sekurang-kurangnya 6 aksara."
        );

        setLoading(false);

        return;
      }


      if (
        role !== "student" &&
        role !== "teacher"
      ) {

        setErrorMessage(
          "❌ Sila pilih jenis akaun."
        );

        setLoading(false);

        return;
      }


      /* =========================
         CREATE AUTH ACCOUNT
      ========================= */

      const {
        data: authData,
        error: authError
      } = await supabase.auth.signUp({

        email: email.trim().toLowerCase(),

        password: password

      });


      if (authError) {

        console.error(
          "Register Auth Error:",
          authError
        );

        setErrorMessage(
          "❌ " + authError.message
        );

        setLoading(false);

        return;
      }


      if (!authData.user) {

        setErrorMessage(
          "❌ Akaun tidak berjaya dicipta."
        );

        setLoading(false);

        return;
      }


      /* =========================
         CREATE PROFILE
      ========================= */

      const {
        error: profileError
      } = await supabase
        .from("profiles")
        .insert({

          id: authData.user.id,

          name: name.trim(),

          email: email.trim().toLowerCase(),

          role: role,

          total_xp: 0

        });


      if (profileError) {

        console.error(
          "Profile Error:",
          profileError
        );

        setErrorMessage(
          "❌ Akaun berjaya dicipta tetapi profile gagal disimpan."
        );

        setLoading(false);

        return;
      }


      /* =========================
         SUCCESS
      ========================= */

      setSuccessMessage(
        role === "teacher"
          ? "✅ Akaun guru berjaya dicipta!"
          : "✅ Akaun pelajar berjaya dicipta!"
      );


      await supabase.auth.signOut();


      setTimeout(() => {

        navigate("/");

      }, 1500);


    } catch (error) {

      console.error(
        "Register Error:",
        error
      );

      setErrorMessage(
        "❌ Berlaku masalah semasa mencipta akaun."
      );

    } finally {

      setLoading(false);

    }

  }


  return (

    <div className="register-container">

      <div className="register-card">


        {/* =========================
            LOGO
        ========================= */}

        <img
          src={logo}
          alt="Maskot PhishQuest"
          className="mascot"
        />


        {/* =========================
            TITLE
        ========================= */}

        <h1>
          Cipta Akaun
        </h1>


        <p className="register-subtitle">
          Sertai PhishQuest hari ini!
        </p>


        <form onSubmit={handleRegister}>


          {/* =========================
              NAME
          ========================= */}

          <input
            type="text"
            placeholder="Nama Pengguna"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            autoComplete="username"
          />


          {/* =========================
              EMAIL
          ========================= */}

          <input
            type="email"
            placeholder="Alamat E-mel"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            autoComplete="email"
          />


          {/* =========================
              PASSWORD
          ========================= */}

          <input
            type="password"
            placeholder="Kata Laluan"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="new-password"
          />


          {/* =========================
              ROLE
          ========================= */}

          <div className="role-section">

            <p className="role-title">
              Daftar sebagai:
            </p>


            <div className="role-options">


              <label
                className={
                  role === "student"
                    ? "role-option selected"
                    : "role-option"
                }
              >

                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={() =>
                    setRole("student")
                  }
                />

                <span>
                  🎓 Pelajar
                </span>

              </label>


              <label
                className={
                  role === "teacher"
                    ? "role-option selected"
                    : "role-option"
                }
              >

                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={() =>
                    setRole("teacher")
                  }
                />

                <span>
                  👩‍🏫 Guru
                </span>

              </label>


            </div>

          </div>


          {/* =========================
              ERROR
          ========================= */}

          {errorMessage && (

            <p className="register-error">
              {errorMessage}
            </p>

          )}


          {/* =========================
              SUCCESS
          ========================= */}

          {successMessage && (

            <p className="register-success">
              {successMessage}
            </p>

          )}


          {/* =========================
              BUTTON
          ========================= */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "⏳ Mencipta Akaun..."
              : "Cipta Akaun"
            }

          </button>


        </form>


        {/* =========================
            LOGIN
        ========================= */}

        <p className="login-text">

          Sudah mempunyai akaun?{" "}

          <Link to="/">
            Log Masuk
          </Link>

        </p>


      </div>

    </div>

  );

}

export default Register;