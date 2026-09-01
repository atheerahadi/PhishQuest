import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Toaster } from "react-hot-toast";
import './styles/screen-fit.css';

ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>

    <>

      <App />

      <Toaster

        position="top-right"

        reverseOrder={false}

        toastOptions={{

          duration:2000,

          style:{

            borderRadius:"15px",

            background:"#fff",

            color:"#333",

            fontSize:"16px",

          }

        }}

      />

    </>

  </React.StrictMode>

);