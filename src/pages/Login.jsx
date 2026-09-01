import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

import "../styles/login.css";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("student");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleLogin(e) {

    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {

      if (!username.trim() || !password) {

        setErrorMessage(
          "❌ Sila masukkan username dan kata laluan."
        );

        setLoading(false);

        return;
      }


      // =========================
      // GET EMAIL USING USERNAME
      // =========================

      const {
        data: email,
        error: usernameError
      } = await supabase.rpc(
        "get_login_email",
        {
          p_username: username.trim()
        }
      );


      console.log(
        "LOGIN USERNAME:",
        username
      );

      console.log(
        "LOGIN EMAIL:",
        email
      );


      if (usernameError || !email) {

        console.error(
          "Username tidak dijumpai:",
          usernameError
        );

        setErrorMessage(
          "❌ Username atau kata laluan tidak betul."
        );

        setLoading(false);

        return;
      }


      // =========================
      // LOGIN SUPABASE AUTH
      // =========================

      const {
        data: authData,
        error: authError
      } = await supabase.auth.signInWithPassword({

        email: email,

        password: password

      });


      if (authError) {

        console.error(
          "Login error:",
          authError
        );

        setErrorMessage(
          "❌ Username atau kata laluan tidak betul."
        );

        setLoading(false);

        return;
      }


      console.log(
        "AUTH USER:",
        authData.user
      );


      // =========================
      // GET PROFILE
      // =========================

      const {
        data: profile,
        error: profileError
      } = await supabase
        .from("profiles")
        .select(
          "id, name, email, role"
        )
        .eq(
          "id",
          authData.user.id
        )
        .single();


      if (profileError || !profile) {

        console.error(
          "Profile tidak dijumpai:",
          profileError
        );

        await supabase.auth.signOut();

        setErrorMessage(
          "❌ Profile pengguna tidak dijumpai."
        );

        setLoading(false);

        return;
      }


      console.log(
        "PROFILE LOGIN:",
        profile
      );


      // =========================
      // GET ACTUAL ROLE
      // =========================

      const actualRole =
        profile.role
          ?.toString()
          .trim()
          .toLowerCase();


      console.log(
        "SELECTED ROLE:",
        selectedRole
      );

      console.log(
        "ACTUAL ROLE:",
        actualRole
      );


      // =========================
      // CHECK SELECTED ROLE
      // =========================

      if (
        selectedRole !== actualRole
      ) {

        await supabase.auth.signOut();

        if (
          selectedRole === "teacher"
        ) {

          setErrorMessage(
            "❌ Akaun ini bukan akaun cikgu."
          );

        } else {

          setErrorMessage(
            "❌ Akaun ini bukan akaun pelajar."
          );

        }

        setLoading(false);

        return;
      }


      // =========================
      // TEACHER
      // =========================

      if (
        actualRole === "teacher"
      ) {

        console.log(
          "Redirecting to Teacher Dashboard..."
        );

        navigate(
          "/teacher",
          {
            replace: true
          }
        );

        return;
      }


      // =========================
      // STUDENT
      // =========================

      if (
        actualRole === "student"
      ) {

        console.log(
          "Redirecting to Student Dashboard..."
        );

        navigate(
          "/dashboard",
          {
            replace: true
          }
        );

        return;
      }


      // =========================
      // UNKNOWN ROLE
      // =========================

      await supabase.auth.signOut();

      setErrorMessage(
        "❌ Role akaun tidak sah."
      );


    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setErrorMessage(
        "❌ Berlaku masalah semasa log masuk."
      );

    } finally {

      setLoading(false);

    }

  }


  return (

    <div className="login-container">

      <div className="login-card">


        {/* LOGO */}

        <img
          src="/src/assets/mascot/mascot.png"
          alt="Maskot PhishQuest"
          className="mascot"
        />


        {/* TITLE */}

        <h1>
          Selamat Datang ke PhishQuest
        </h1>


        <p>
          Bijak Bertindak. Kekal Selamat.
        </p>


        {/* LOGIN FORM */}

        <form
          onSubmit={handleLogin}
        >


          {/* USERNAME */}

          <input
            type="text"
            placeholder="Nama Pengguna"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            autoComplete="username"
          />


          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Kata Laluan"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            autoComplete="current-password"
          />


          {/* ACCOUNT TYPE */}

          <div className="role-select">

            <label htmlFor="role">
              Jenis Akaun
            </label>

            <select
              id="role"
              value={selectedRole}
              onChange={(e) =>
                setSelectedRole(
                  e.target.value
                )
              }
            >

              <option value="student">
                🎓 Pelajar
              </option>

              <option value="teacher">
                👩‍🏫 Guru
              </option>

            </select>

          </div>


          {/* ERROR */}

          {errorMessage && (

            <p className="login-error">
              {errorMessage}
            </p>

          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "⏳ Log Masuk..."
              : "Log Masuk"
            }

          </button>


        </form>


        {/* REGISTER */}

        <p>

          Belum mempunyai akaun?{" "}

          <Link to="/register">
            Daftar
          </Link>

        </p>


      </div>

    </div>

  );

}

export default Login;