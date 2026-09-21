import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../styles/certificate.css";

function Certificate() {
  const navigate = useNavigate();

  // =========================================================
  // CERTIFICATE PDF REFERENCE
  // =========================================================

  const certificateRef = useRef(null);

  // =========================================================
  // STATES
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD CERTIFICATE
  // =========================================================

  useEffect(() => {
    loadCertificate();
  }, []);

  async function loadCertificate() {
    try {
      setLoading(true);
      setError("");

      // =====================================================
      // GET CURRENT USER
      // =====================================================

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(
          "Sesi pengguna tidak dijumpai. Sila log masuk semula."
        );
        return;
      }

      // =====================================================
      // GET PROFILE
      // =====================================================

      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);

        setError(
          "Maklumat pelajar tidak dapat diperoleh."
        );

        return;
      }

      // =====================================================
      // GET MODULE PROGRESS
      // =====================================================

      const {
        data: moduleData,
        error: moduleError,
      } = await supabase
        .from("module_progress")
        .select("module_id, completed")
        .eq("profile_id", user.id);

      if (moduleError) {
        console.error(
          "Module progress error:",
          moduleError
        );

        setError(
          "Kemajuan modul tidak dapat diperoleh."
        );

        return;
      }

      // =====================================================
      // COUNT UNIQUE COMPLETED MODULES
      // =====================================================

      const completedModuleIds = [
        ...new Set(
          (moduleData || [])
            .filter(
              (module) =>
                module.completed === true
            )
            .map(
              (module) =>
                module.module_id
            )
        ),
      ];

      const completedModules =
        completedModuleIds.length;

      const totalModules = 6;

      // =====================================================
      // CHECK 6/6 MODULES
      // =====================================================

      if (completedModules < totalModules) {
        setError(
          `Sijil masih dikunci. Anda telah melengkapkan ${completedModules}/${totalModules} modul.`
        );

        return;
      }

      // =====================================================
      // GET CLASS NAME
      // =====================================================

      let className = "Tidak dinyatakan";

      if (profileData?.class_id) {
        const {
          data: classData,
          error: classError,
        } = await supabase
          .from("classes")
          .select(
            "id, class_name, year_level"
          )
          .eq(
            "id",
            profileData.class_id
          )
          .maybeSingle();

        if (!classError && classData) {
          className =
            classData.class_name;
        }
      }

      // =====================================================
      // CHECK EXISTING CERTIFICATE
      // =====================================================

      const {
        data: existingCertificate,
        error: certificateError,
      } = await supabase
        .from("certificates")
        .select("*")
        .eq(
          "student_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(1)
        .maybeSingle();

      if (certificateError) {
        console.error(
          "Certificate lookup error:",
          certificateError
        );
      }

      // =====================================================
      // IF CERTIFICATE EXISTS
      // =====================================================

      if (existingCertificate) {
        setCertificate(
          existingCertificate
        );

        return;
      }

      // =====================================================
      // GENERATE NEW CERTIFICATE
      // =====================================================

      setGenerating(true);

      const certificateId =
        generateCertificateId();

      const completionDate =
        new Date().toISOString();

      const {
        data: newCertificate,
        error: insertError,
      } = await supabase
        .from("certificates")
        .insert({
          student_id: user.id,

          certificate_id:
            certificateId,

          student_name:
            profileData.name ||
            "Pelajar PhishQuest",

          class_name:
            className,

          completion_date:
            completionDate,
        })
        .select()
        .single();

      if (insertError) {
        console.error(
          "Certificate generation error:",
          insertError
        );

        setError(
          "Sijil tidak dapat dijana. Sila cuba lagi."
        );

        return;
      }

      setCertificate(
        newCertificate
      );

    } catch (err) {
      console.error(
        "Certificate page error:",
        err
      );

      setError(
        "Ralat berlaku semasa menjana sijil."
      );

    } finally {
      setGenerating(false);
      setLoading(false);
    }
  }

  // =========================================================
  // GENERATE CERTIFICATE ID
  // =========================================================

  function generateCertificateId() {
    const year =
      new Date().getFullYear();

    const randomPart =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `PQ-${year}-${randomPart}`;
  }

  // =========================================================
  // FORMAT DATE
  // =========================================================

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "ms-MY",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  }

  // =========================================================
  // DOWNLOAD CERTIFICATE AS A4 LANDSCAPE PDF
  // =========================================================

  async function downloadCertificate() {
    try {
      const element =
        certificateRef.current;

      if (!element) {
        console.error(
          "Certificate element not found."
        );

        return;
      }

      // =====================================================
      // WAIT FOR ALL IMAGES
      // =====================================================

      const images =
        element.querySelectorAll("img");

      await Promise.all(
        Array.from(images).map(
          (img) => {
            if (img.complete) {
              return Promise.resolve();
            }

            return new Promise(
              (resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              }
            );
          }
        )
      );

      // =====================================================
      // CAPTURE CERTIFICATE
      // =====================================================

      const canvas =
        await html2canvas(
          element,
          {
            scale: 2,

            useCORS: true,

            allowTaint: false,

            backgroundColor:
              "#ffffff",

            logging: false,

            // Pastikan keseluruhan certificate diambil
            scrollX: 0,
            scrollY: 0,
          }
        );

      const imgData =
        canvas.toDataURL(
          "image/png"
        );

      // =====================================================
      // CREATE A4 LANDSCAPE PDF
      // =====================================================

      const pdf =
        new jsPDF({
          orientation:
            "landscape",

          unit: "mm",

          format: "a4",
        });

      // A4 Landscape dimensions
      const pageWidth = 297;
      const pageHeight = 210;

      // =====================================================
      // CALCULATE IMAGE SIZE
      // =====================================================

      const imageRatio =
        canvas.width /
        canvas.height;

      const pageRatio =
        pageWidth /
        pageHeight;

      let imgWidth;
      let imgHeight;
      let xPosition;
      let yPosition;

      // =====================================================
      // FIT IMAGE INTO A4 LANDSCAPE
      // =====================================================

      if (
        imageRatio >
        pageRatio
      ) {
        // Certificate lebih lebar
        imgWidth =
          pageWidth;

        imgHeight =
          imgWidth /
          imageRatio;

        xPosition = 0;

        yPosition =
          (pageHeight -
            imgHeight) /
          2;

      } else {
        // Certificate lebih tinggi
        imgHeight =
          pageHeight;

        imgWidth =
          imgHeight *
          imageRatio;

        xPosition =
          (pageWidth -
            imgWidth) /
          2;

        yPosition = 0;
      }

      // =====================================================
      // ADD CERTIFICATE TO PDF
      // =====================================================

      pdf.addImage(
        imgData,
        "PNG",
        xPosition,
        yPosition,
        imgWidth,
        imgHeight
      );

      // =====================================================
      // SAFE FILE NAME
      // =====================================================

      const studentName =
        certificate?.student_name ||
        "Pelajar";

      const safeName =
        studentName
          .replace(
            /[^a-zA-Z0-9\s-_]/g,
            ""
          )
          .trim()
          .replace(
            /\s+/g,
            "-"
          );

      // =====================================================
      // DOWNLOAD PDF
      // =====================================================

      pdf.save(
        `Sijil-PhishQuest-${safeName}.pdf`
      );

    } catch (error) {
      console.error(
        "Error downloading certificate:",
        error
      );

      alert(
        "Sijil tidak dapat dimuat turun. Sila cuba lagi."
      );
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (
    loading ||
    generating
  ) {
    return (
      <div className="certificatePage">

        <div className="certificateLoading">

          <div className="certificateLoadingIcon">
            🎓
          </div>

          <h2>
            {generating
              ? "Menjana sijil..."
              : "Memuatkan sijil..."}
          </h2>

          <p>
            Sila tunggu sebentar.
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR / LOCKED
  // =========================================================

  if (error) {
    return (
      <div className="certificatePage">

        <div className="certificateError">

          <div className="certificateErrorIcon">
            🔒
          </div>

          <h2>
            Sijil Belum Tersedia
          </h2>

          <p>
            {error}
          </p>

          <button
            className="certificateBackBtn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Kembali ke Dashboard
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // CERTIFICATE DISPLAY
  // =========================================================

  return (
    <div className="certificatePage">

      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      <div className="certificateActions">

        <button
          className="certificateAction secondary"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>

        <button
          className="certificateAction"
          onClick={
            downloadCertificate
          }
        >
          📥 Muat Turun Sijil
        </button>

      </div>


      {/* =====================================================
          CERTIFICATE OUTER FRAME
          ONLY THIS AREA WILL BE CAPTURED
      ===================================================== */}

      <div
        className="certificateOuter"
        ref={certificateRef}
      >

        <div className="certificateInner">

          {/* =================================================
              DECORATIVE STARS
          ================================================= */}

          <span className="decorStar starOne">
            ✦
          </span>

          <span className="decorStar starTwo">
            ✧
          </span>

          <span className="decorStar starThree">
            ✦
          </span>

          <span className="decorStar starFour">
            ✧
          </span>


          {/* =================================================
              DECORATIVE CORNERS
          ================================================= */}

          <div className="goldCorner topRight"></div>

          <div className="goldCorner bottomLeft"></div>


          {/* =================================================
              HEADER
              ALL THREE LOGOS CENTERED
          ================================================= */}

          <div className="certificateHeader">

            {/* =================================================
                SK RAJA CHULAN
            ================================================= */}

            <div className="certificateInstitution">

              <img
                src="/rajachulan.png"
                alt="SK Raja Chulan"
              />

            </div>


            {/* =================================================
                PHISHQUEST
            ================================================= */}

            <div className="certificatePhishQuest">

              <img
                src="/mascot.png"
                alt="PhishQuest Logo"
              />

              <div className="certificatePhishQuestText">

                <div className="certificateBrandName">
                  PHISHQUEST
                </div>

                <div className="certificateBrandSub">
                  Interactive Phishing Awareness Platform
                </div>

              </div>

            </div>


            {/* =================================================
                POLITEKNIK UNGKU OMAR
            ================================================= */}

            <div className="certificateInstitution">

              <img
                src="/puo.png"
                alt="Politeknik Ungku Omar"
              />

            </div>

          </div>


          {/* =================================================
              TITLE
          ================================================= */}

          <div className="certificateTitleSection">

            <p className="certificateSmallTitle">
              SIJIL INI DENGAN SUKACITANYA DIBERIKAN KEPADA
            </p>


            <div className="certificateMainTitle">

              <h1>
                SIJIL
              </h1>

              <span>
                PENYELESAIAN
              </span>

            </div>


            <div className="titleDecoration">

              <span></span>

              <b>
                ✦
              </b>

              <span></span>

            </div>

          </div>


          {/* =================================================
              STUDENT NAME
          ================================================= */}

          <div className="certificateStudent">

            <div className="certificateStudentName">
              {certificate?.student_name}
            </div>

            <div className="certificateUnderline"></div>

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="certificateDescription">

            <p>
              Sijil ini diberikan sebagai pengiktirafan atas
              kejayaan melengkapkan semua modul pembelajaran
              yang diperlukan dalam
            </p>

            <strong>
              PhishQuest: Interactive Phishing Awareness Platform
            </strong>

            <p>
              serta menunjukkan penyertaan dalam aktiviti
              pembelajaran kesedaran keselamatan siber dan
              phishing.
            </p>

          </div>


          {/* =================================================
              CERTIFICATE DETAILS
          ================================================= */}

          <div className="certificateDetails">

            {/* CLASS */}

            <div className="certificateDetail">

              <div className="detailIcon">
                🎓
              </div>

              <span>
                KELAS
              </span>

              <strong>
                {certificate?.class_name || "-"}
              </strong>

            </div>


            {/* COMPLETION DATE */}

            <div className="certificateDetail">

              <div className="detailIcon">
                📅
              </div>

              <span>
                TARIKH PENYELESAIAN
              </span>

              <strong>
                {formatDate(
                  certificate?.completion_date
                )}
              </strong>

            </div>


            {/* CERTIFICATE ID */}

            <div className="certificateDetail">

              <div className="detailIcon">
                🏅
              </div>

              <span>
                ID SIJIL
              </span>

              <strong>
                {certificate?.certificate_id}
              </strong>

            </div>

          </div>


          {/* =================================================
              PROJECT TEAM
          ================================================= */}

          <div className="certificateFooter">

            <div className="certificateSignature">

              <div className="signatureLine"></div>

              <strong>
                Pasukan Projek PhishQuest
              </strong>

            </div>

          </div>


          {/* =================================================
              FOOTER DECORATION
          ================================================= */}

          <div className="footerDecoration">

            <span></span>

            <b>
              ✦
            </b>

            <span></span>

          </div>


          {/* =================================================
              BOTTOM TEXT
          ================================================= */}

          <div className="certificateBottom">
            PhishQuest • Program Kesedaran Keselamatan Siber
          </div>

        </div>

      </div>

    </div>
  );
}

export default Certificate;