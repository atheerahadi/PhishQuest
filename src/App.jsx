import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import { useState, useEffect } from "react";

import LoadingScreen from "./components/LoadingScreen";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import Simulation from "./pages/Simulation";
import WebsiteSimulation from "./pages/WebsiteSimulation";
import Quiz from "./pages/Quiz";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Teacher from "./pages/Teacher";
import Lesson from "./pages/Lesson";
import PPD from "./pages/PPD";
import Manual from "./pages/Manual";

import ProtectedRoute from "./components/ProtectedRoute";

import { MusicProvider } from "./pages/MusicContext";
import { AIAssistantProvider } from "./context/AIAssistantContext";

import FloatingAIAssistant
  from "./components/FloatingAIAssistant/FloatingAIAssistant";


function AppContent() {

  const location = useLocation();


  /* =========================
     HIDE AI ON PUBLIC PAGES
  ========================= */

  const hideAI =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/about" ||
    location.pathname === "/contact";


  return (

    <>

      <Routes>


        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* =========================
            STUDENT ROUTES
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/learn"
          element={
            <ProtectedRoute allowedRole="student">
              <Learn />
            </ProtectedRoute>
          }
        />


        <Route
          path="/lesson"
          element={
            <ProtectedRoute allowedRole="student">
              <Lesson />
            </ProtectedRoute>
          }
        />


        <Route
          path="/simulation"
          element={
            <ProtectedRoute allowedRole="student">
              <Simulation />
            </ProtectedRoute>
          }
        />


        <Route
          path="/website"
          element={
            <ProtectedRoute allowedRole="student">
              <WebsiteSimulation />
            </ProtectedRoute>
          }
        />


        <Route
          path="/quiz"
          element={
            <ProtectedRoute allowedRole="student">
              <Quiz />
            </ProtectedRoute>
          }
        />


        <Route
          path="/rewards"
          element={
            <ProtectedRoute allowedRole="student">
              <Rewards />
            </ProtectedRoute>
          }
        />


        <Route
          path="/ppd"
          element={
            <ProtectedRoute allowedRole="student">
              <PPD />
            </ProtectedRoute>
          }
        />


        {/* =========================
            TEACHER ROUTE
        ========================= */}

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="teacher">
              <Teacher />
            </ProtectedRoute>
          }
        />


        {/* =========================
            SHARED PROFILE
        ========================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* =========================
            MANUAL
        ========================= */}

        <Route
          path="/manual"
          element={<Manual />}
        />


      </Routes>


      {/* =========================
          AI ASSISTANT
      ========================= */}

      {!hideAI && (
        <FloatingAIAssistant />
      )}


    </>

  );

}


function App() {

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    }, 2000);


    return () => clearTimeout(timer);

  }, []);


  if (loading) {

    return <LoadingScreen />;

  }


  return (

    <BrowserRouter>

      <MusicProvider>

        <AIAssistantProvider>

          <AppContent />

        </AIAssistantProvider>

      </MusicProvider>

    </BrowserRouter>

  );

}


export default App;