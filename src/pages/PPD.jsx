import { useState } from "react";
import * as XLSX from "xlsx";
import Sidebar from "../components/Sidebar";
import "../styles/ppd.css";
function PPD() {

  const [selectedSchool, setSelectedSchool] = useState("Semua Sekolah");

  const schools = [
    {
      name: "SK Taman Maju",
      students: 180,
      classes: 6,
      average: 84,
      completion: 91,
    },
    {
      name: "SK Seri Indah",
      students: 150,
      classes: 5,
      average: 78,
      completion: 86,
    },
    {
      name: "SK Bandar Baru",
      students: 210,
      classes: 7,
      average: 89,
      completion: 94,
    },
    {
      name: "SK Desa Harmoni",
      students: 165,
      classes: 5,
      average: 71,
      completion: 76,
    },
  ];

  const totalStudents = schools.reduce(
    (total, school) => total + school.students,
    0
  );

  const totalClasses = schools.reduce(
    (total, school) => total + school.classes,
    0
  );

  const averageScore = Math.round(
    schools.reduce(
      (total, school) => total + school.average,
      0
    ) / schools.length
  );

  const averageCompletion = Math.round(
    schools.reduce(
      (total, school) => total + school.completion,
      0
    ) / schools.length
  );

  const filteredSchools =
    selectedSchool === "Semua Sekolah"
      ? schools
      : schools.filter(
          (school) => school.name === selectedSchool
        );

  function getPerformanceClass(score) {

    if (score >= 90) {
      return "excellent";
    }

    if (score >= 80) {
      return "good";
    }

    if (score >= 60) {
      return "satisfactory";
    }

    return "needs-help";
  }

  function generateReport() {

  const schoolData = schools.map((school) => ({
    "Nama Sekolah": school.name,
    "Jumlah Pelajar": school.students,
    "Jumlah Kelas": school.classes,
    "Purata Markah (%)": school.average,
    "Completion (%)": school.completion,
  }));

  const summaryData = [
    {
      "Jumlah Sekolah": schools.length,
      "Jumlah Pelajar": totalStudents,
      "Jumlah Kelas": totalClasses,
      "Purata Markah Daerah (%)": averageScore,
      "Purata Completion (%)": averageCompletion,
    }
  ];

  const workbook = XLSX.utils.book_new();

  const summarySheet =
    XLSX.utils.json_to_sheet(summaryData);

  const schoolSheet =
    XLSX.utils.json_to_sheet(schoolData);

  XLSX.utils.book_append_sheet(
    workbook,
    summarySheet,
    "Ringkasan Daerah"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    schoolSheet,
    "Prestasi Sekolah"
  );

  XLSX.writeFile(
    workbook,
    "PhishQuest_Laporan_PPD.xlsx"
  );
}

  return (
    <>
      <Sidebar />

      <div className="ppd-page">

        {/* HEADER */}

<div className="ppd-header">

  <div>

    <h1>
      🏢 Dashboard PPD
    </h1>

    <p>
      Pemantauan prestasi keselamatan siber
      mengikut sekolah dan kelas.
    </p>

  </div>

  <button
    className="report-btn"
    onClick={generateReport}
  >
    📊 Jana Laporan
  </button>

</div>


        {/* STATISTICS */}

        <div className="ppd-stats">

          <div className="ppd-card">

            <h3>
              🏫 Jumlah Sekolah
            </h3>

            <h1>
              {schools.length}
            </h1>

          </div>


          <div className="ppd-card">

            <h3>
              👨‍🎓 Jumlah Pelajar
            </h3>

            <h1>
              {totalStudents}
            </h1>

          </div>


          <div className="ppd-card">

            <h3>
              📚 Jumlah Kelas
            </h3>

            <h1>
              {totalClasses}
            </h1>

          </div>


          <div className="ppd-card">

            <h3>
              📈 Purata Daerah
            </h3>

            <h1>
              {averageScore}%
            </h1>

          </div>

        </div>


        {/* OVERALL PROGRESS */}

        <div className="district-card">

          <h2>
            📊 Prestasi Keseluruhan Daerah
          </h2>

          <div className="district-progress">

            <div
              className="district-progress-fill"
              style={{
                width: `${averageScore}%`
              }}
            ></div>

          </div>

          <div className="district-info">

            <span>
              Purata Markah: <strong>{averageScore}%</strong>
            </span>

            <span>
              Completion: <strong>{averageCompletion}%</strong>
            </span>

          </div>

        </div>


        {/* SCHOOL PERFORMANCE */}

        <div className="school-section">

          <div className="school-header">

            <div>

              <h2>
                🏫 Prestasi Sekolah
              </h2>

              <p>
                Pantau pencapaian setiap sekolah dalam daerah.
              </p>

            </div>


            <select
              value={selectedSchool}
              onChange={(e) =>
                setSelectedSchool(e.target.value)
              }
            >

              <option>
                Semua Sekolah
              </option>

              {schools.map((school) => (

                <option
                  key={school.name}
                  value={school.name}
                >
                  {school.name}
                </option>

              ))}

            </select>

          </div>


          <div className="school-grid">

            {filteredSchools.map((school) => (

              <div
                className="school-card"
                key={school.name}
              >

                <div className="school-card-top">

                  <h3>
                    {school.name}
                  </h3>

                  <span>
                    {school.classes} kelas
                  </span>

                </div>


                <div className="school-score">

                  <strong>
                    {school.average}%
                  </strong>

                  <span>
                    Purata Markah
                  </span>

                </div>


                <div className="school-progress">

                  <div
                    className={`school-progress-fill ${getPerformanceClass(
                      school.average
                    )}`}
                    style={{
                      width: `${school.average}%`
                    }}
                  ></div>

                </div>


                <div className="school-details">

                  <span>
                    👨‍🎓 {school.students} pelajar
                  </span>

                  <span>
                    ✅ {school.completion}% completion
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* MONITORING */}

        <div className="ppd-monitoring">

          <h2>
            🔎 Pemantauan Daerah
          </h2>

          <p>
            Dashboard ini membantu pihak PPD mengenal pasti
            sekolah yang memerlukan perhatian dan sokongan
            tambahan berdasarkan prestasi pelajar.
          </p>

          <div className="monitoring-grid">

            <div>

              <span>
                🟢 Prestasi Tinggi
              </span>

              <strong>
                {
                  schools.filter(
                    (school) => school.average >= 80
                  ).length
                }
              </strong>

              <small>
                sekolah
              </small>

            </div>


            <div>

              <span>
                🟡 Perlu Pemantauan
              </span>

              <strong>
                {
                  schools.filter(
                    (school) =>
                      school.average >= 60 &&
                      school.average < 80
                  ).length
                }
              </strong>

              <small>
                sekolah
              </small>

            </div>


            <div>

              <span>
                🔴 Perlu Intervensi
              </span>

              <strong>
                {
                  schools.filter(
                    (school) => school.average < 60
                  ).length
                }
              </strong>

              <small>
                sekolah
              </small>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default PPD;