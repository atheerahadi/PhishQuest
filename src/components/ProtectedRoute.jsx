import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";

function ProtectedRoute({
  children,
  allowedRole
}) {

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);


  useEffect(() => {

    checkUser();

  }, []);


  async function checkUser() {

    try {

      // =========================
      // GET CURRENT USER
      // =========================

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();


      console.log("PROTECTED USER:", user);


      if (userError || !user) {

        console.error(
          "User tidak dijumpai:",
          userError
        );

        setLoading(false);

        return;

      }


      // =========================
      // GET USER ROLE
      // =========================

      const {
        data: profile,
        error: profileError
      } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();


      console.log(
        "PROTECTED PROFILE:",
        profile
      );


      if (profileError) {

        console.error(
          "Gagal mendapatkan profile:",
          profileError
        );

        setLoading(false);

        return;

      }


      // =========================
      // NORMALIZE ROLE
      // =========================

      const userRole =
        profile?.role
          ?.toString()
          .trim()
          .toLowerCase();


      console.log(
        "USER ROLE:",
        userRole
      );

      console.log(
        "ALLOWED ROLE:",
        allowedRole
      );


      setRole(userRole);

      setLoading(false);


    } catch (error) {

      console.error(
        "ProtectedRoute error:",
        error
      );

      setLoading(false);

    }

  }


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >

        <h2>
          ⏳ Memuatkan...
        </h2>

      </div>

    );

  }


  // =========================
  // NOT LOGGED IN
  // =========================

  if (!role) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  // =========================
  // ROLE CHECK
  // =========================

  if (
    allowedRole &&
    role !== allowedRole.toLowerCase()
  ) {

    console.log(
      "ROLE TIDAK SEPADAN:",
      role,
      "→",
      allowedRole
    );


    // Teacher → Teacher Dashboard

    if (role === "teacher") {

      return (
        <Navigate
          to="/teacher"
          replace
        />
      );

    }


    // Student → Student Dashboard

    if (role === "student") {

      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );

    }


    // Unknown role

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  // =========================
  // ALLOWED
  // =========================

  return children;

}

export default ProtectedRoute;