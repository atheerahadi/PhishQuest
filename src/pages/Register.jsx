import { useEffect, useState } from "react";
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

  // =========================
  // CLASS
  // =========================
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [teacherClasses, setTeacherClasses] = useState([]);

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD CLASSES
  // =========================
  useEffect(() => {
    async function loadClasses() {
      try {
        const { data, error } = await supabase
          .from("classes")
          .select("id, class_name, year_level")
          .order("year_level", { ascending: true })
          .order("class_name", { ascending: true });

        if (error) {
          console.error("Load classes error:", error);
          setErrorMessage("❌ Senarai kelas gagal dimuatkan.");
          return;
        }

        setClasses(data || []);
      } catch (error) {
        console.error("Load classes error:", error);
        setErrorMessage("❌ Tidak dapat memuatkan senarai kelas.");
      } finally {
        setLoadingClasses(false);
      }
    }

    loadClasses();
  }, []);

  // =========================
  // CHANGE ROLE
  // =========================
  function handleRoleChange(newRole) {
    setRole(newRole);

    // Reset class selection when changing role
    setClassId("");
    setTeacherClasses([]);
  }

  // =========================
  // TEACHER CLASS SELECTION
  // =========================
  function handleTeacherClassChange(classIdValue) {
    const numericClassId = Number(classIdValue);

    setTeacherClasses((currentClasses) => {
      if (currentClasses.includes(numericClassId)) {
        return currentClasses.filter(
          (id) => id !== numericClassId
        );
      }

      return [...currentClasses, numericClassId];
    });
  }

  // =========================
  // REGISTER
  // =========================
  async function handleRegister(e) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // =========================
      // BASIC VALIDATION
      // =========================
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

      // =========================
      // CLASS VALIDATION
      // =========================

      if (role === "student" && !classId) {
        setErrorMessage(
          "❌ Sila pilih kelas anda."
        );

        setLoading(false);
        return;
      }

      if (
        role === "teacher" &&
        teacherClasses.length === 0
      ) {
        setErrorMessage(
          "❌ Sila pilih sekurang-kurangnya satu kelas yang anda ajar."
        );

        setLoading(false);
        return;
      }

      // =========================
      // CREATE AUTH ACCOUNT
      // =========================

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

      // =========================
      // CREATE PROFILE
      // =========================

      const profileData = {
        id: authData.user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role,
        total_xp: 0
      };

      // Student gets ONE class_id
      if (role === "student") {
        profileData.class_id = Number(classId);
      }

      const {
        error: profileError
      } = await supabase
        .from("profiles")
        .insert(profileData);

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

      // =========================
      // TEACHER CLASS ASSIGNMENT
      // =========================

      if (role === "teacher") {
        const teacherClassRows =
          teacherClasses.map((selectedClassId) => ({
            teacher_id: authData.user.id,
            class_id: selectedClassId
          }));

        const {
          error: teacherClassError
        } = await supabase
          .from("teacher_classes")
          .insert(teacherClassRows);

        if (teacherClassError) {
          console.error(
            "Teacher Classes Error:",
            teacherClassError
          );

          setErrorMessage(
            "❌ Akaun berjaya dicipta tetapi kelas guru gagal disimpan."
          );

          setLoading(false);
          return;
        }
      }

      // =========================
      // SUCCESS
      // =========================

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
                    handleRoleChange("student")
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
                    handleRoleChange("teacher")
                  }
                />

                <span>
                  👩‍🏫 Guru
                </span>
              </label>

            </div>

          </div>

          {/* =========================
              STUDENT CLASS
          ========================= */}

          {role === "student" && (

            <div className="class-section">

              <label className="class-label">
                🎓 Kelas Anda
              </label>

              <select
                value={classId}
                onChange={(e) =>
                  setClassId(e.target.value)
                }
                disabled={loadingClasses}
              >

                <option value="">
                  {loadingClasses
                    ? "⏳ Memuatkan kelas..."
                    : "Pilih kelas anda"
                  }
                </option>

                {classes.map((item) => (

                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.class_name}
                  </option>

                ))}

              </select>

            </div>

          )}

          {/* =========================
              TEACHER CLASS
          ========================= */}

          {role === "teacher" && (

            <div className="class-section">

              <p className="class-label">
                👩‍🏫 Kelas yang diajar
              </p>

              <p className="class-hint">
                Pilih satu atau lebih kelas.
              </p>

              {loadingClasses ? (

                <p>
                  ⏳ Memuatkan senarai kelas...
                </p>

              ) : (

                <div className="class-options">

                  {classes.map((item) => {

                    const selected =
                      teacherClasses.includes(
                        Number(item.id)
                      );

                    return (

                      <label
                        key={item.id}
                        className={
                          selected
                            ? "class-option selected"
                            : "class-option"
                        }
                      >

                        <input
                          type="checkbox"
                          value={item.id}
                          checked={selected}
                          onChange={() =>
                            handleTeacherClassChange(
                              item.id
                            )
                          }
                        />

                        <span>
                          {item.class_name}
                        </span>

                      </label>

                    );

                  })}

                </div>

              )}

            </div>

          )}

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
            disabled={loading || loadingClasses}
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