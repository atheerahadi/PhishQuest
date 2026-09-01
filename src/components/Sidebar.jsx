import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMusic } from "../pages/MusicContext";
import { supabase } from "../services/supabase";

import {
  FaHome,
  FaBook,
  FaLaptop,
  FaQuestionCircle,
  FaGift,
  FaUser,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaMusic,
  FaBookOpen,
  FaBars,
  FaTimes
} from "react-icons/fa";

import "../styles/sidebar.css";
import logo from "../assets/mascot/mascot.png";


function Sidebar() {

  const navigate = useNavigate();

  const {
    isPlaying,
    toggleMusic
  } = useMusic();


  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);


  /*
  ============================================
  GET USER ROLE
  ============================================
  */

  useEffect(() => {

    getUserRole();

  }, []);


  async function getUserRole() {

    try {

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();


      if (userError || !user) {

        console.error(
          "User tidak dijumpai:",
          userError
        );

        setLoadingRole(false);

        return;

      }


      const {
        data: profile,
        error: profileError
      } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();


      if (profileError) {

        console.error(
          "Gagal mendapatkan role:",
          profileError
        );

      } else {

        setRole(profile.role);

      }

    } catch (error) {

      console.error(
        "Sidebar role error:",
        error
      );

    } finally {

      setLoadingRole(false);

    }

  }


  /*
  ============================================
  STUDENT MENU
  ============================================
  */

  const studentMenu = [

    {
      title: "Utama",
      icon: <FaHome />,
      path: "/dashboard"
    },

    {
      title: "Pembelajaran",
      icon: <FaBook />,
      path: "/learn"
    },

    {
      title: "Simulasi",
      icon: <FaLaptop />,
      path: "/simulation"
    },

    {
      title: "Kuiz",
      icon: <FaQuestionCircle />,
      path: "/quiz"
    },

    {
      title: "Pencapaian",
      icon: <FaGift />,
      path: "/rewards"
    },

    {
      title: "Manual Pengguna",
      icon: <FaBookOpen />,
      path: "/manual"
    },

    {
      title: "Profil",
      icon: <FaUser />,
      path: "/profile"
    }

  ];


  /*
  ============================================
  TEACHER MENU
  ============================================
  */

  const teacherMenu = [

    {
      title: "Dashboard Guru",
      icon: <FaChalkboardTeacher />,
      path: "/teacher"
    },

    {
      title: "Profil",
      icon: <FaUser />,
      path: "/profile"
    }

  ];


  /*
  ============================================
  SELECT MENU BASED ON ROLE
  ============================================
  */

  const menu =
    role === "teacher"
      ? teacherMenu
      : studentMenu;


  /*
  ============================================
  CLOSE MOBILE SIDEBAR
  ============================================
  */

  function closeMobileMenu() {

    setMobileOpen(false);

  }


  /*
  ============================================
  LOGOUT
  ============================================
  */

  async function handleLogout() {

    await supabase.auth.signOut();

    setMobileOpen(false);

    navigate("/");

  }


  /*
  ============================================
  LOADING
  ============================================
  */

  if (loadingRole) {

    return (

      <>

        <button
          className="mobile-menu-button"
          onClick={() => setMobileOpen(true)}
        >
          <FaBars />
        </button>


        <aside className="sidebar">

          <div className="logo-section">

            <img
              src={logo}
              alt="Logo PhishQuest"
            />

            <h2>
              PhishQuest
            </h2>

            <p>
              Bijak Bertindak.
              <br />
              Kekal Selamat.
            </p>

          </div>


          <nav>

            <div className="menu-item">

              <span>
                ⏳ Memuatkan...
              </span>

            </div>

          </nav>

        </aside>

      </>

    );

  }


  /*
  ============================================
  SIDEBAR
  ============================================
  */

  return (

    <>

      {/* ==================================
          MOBILE BURGER BUTTON
      ================================== */}

      <button
        className="mobile-menu-button"
        onClick={() => setMobileOpen(true)}
        aria-label="Buka menu"
      >

        <FaBars />

      </button>


      {/* ==================================
          MOBILE OVERLAY
      ================================== */}

      {mobileOpen && (

        <div
          className="sidebar-overlay"
          onClick={closeMobileMenu}
        ></div>

      )}


      {/* ==================================
          SIDEBAR
      ================================== */}

      <aside
        className={`
          ${
            role === "teacher"
              ? "sidebar teacher-sidebar"
              : "sidebar"
          }
          ${
            mobileOpen
              ? "mobile-open"
              : ""
          }
        `}
      >


        {/* ==================================
            MOBILE CLOSE BUTTON
        ================================== */}

        <button
          className="mobile-close-button"
          onClick={closeMobileMenu}
          aria-label="Tutup menu"
        >

          <FaTimes />

        </button>


        {/* ==================================
            LOGO
        ================================== */}

        <div className="logo-section">

          <img
            src={logo}
            alt="Logo PhishQuest"
          />

          <h2>
            PhishQuest
          </h2>

          <p>
            Bijak Bertindak.
            <br />
            Kekal Selamat.
          </p>

        </div>


        {/* ==================================
            MENU
        ================================== */}

        <nav>

          {menu.map((item) => (

            <NavLink
              key={item.title}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                isActive
                  ? "menu-item active"
                  : "menu-item"
              }
            >

              <div className="menuIcon">

                {item.icon}

              </div>


              <span>

                {item.title}

              </span>

            </NavLink>

          ))}

        </nav>


        {/* ==================================
            MUSIC
        ================================== */}

        <button
          className="music-btn"
          onClick={toggleMusic}
        >

          <FaMusic />

          <span>

            {isPlaying
              ? "Muzik ON"
              : "Muzik OFF"
            }

          </span>

        </button>


        {/* ==================================
            LOGOUT
        ================================== */}

        <button
          className="logout"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          <span>
            Log Keluar
          </span>

        </button>


      </aside>

    </>

  );

}


export default Sidebar;