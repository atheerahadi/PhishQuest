import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../services/supabase";
import * as XLSX from "xlsx";

import "../styles/sidebar.css";
import "../styles/teacher.css";


function Teacher() {

  const TOTAL_MODULES = 6;


 const [students, setStudents] = useState([]);

// Kelas yang diajar oleh teacher yang sedang login
const [teacherClasses, setTeacherClasses] = useState([]);

  const [totalStudents, setTotalStudents] =
    useState(0);

  const [totalQuizzes, setTotalQuizzes] =
    useState(0);

  const [totalCompletedModules, setTotalCompletedModules] =
    useState(0);

  const [totalXP, setTotalXP] =
    useState(0);

  const [averageXp, setAverageXp] =
    useState(0);

  const [averageMark, setAverageMark] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [selectedStudent, setSelectedStudent] =
    useState(null);


  /*
  ============================================
  LOAD TEACHER DATA
  ============================================
  */

  useEffect(() => {

    loadTeacherData();

  }, []);


 async function loadTeacherData() {
  setLoading(true);

  try {
    // ==========================================
    // 1. GET CURRENT LOGGED-IN TEACHER
    // ==========================================

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Gagal mendapatkan user:", userError);

      setStudents([]);
      setTeacherClasses([]);
      setTotalStudents(0);
      setTotalQuizzes(0);
      setTotalCompletedModules(0);
      setTotalXP(0);
      setAverageXp(0);
      setAverageMark(0);

      return;
    }

    // ==========================================
    // 2. GET CLASSES ASSIGNED TO THIS TEACHER
    // ==========================================

    const {
      data: teacherClassRows,
      error: teacherClassError,
    } = await supabase
      .from("teacher_classes")
      .select("class_id")
      .eq("teacher_id", user.id);

    if (teacherClassError) {
      console.error(
        "Gagal ambil kelas guru:",
        teacherClassError
      );

      setTeacherClasses([]);
      setStudents([]);
      setTotalStudents(0);
      setTotalQuizzes(0);
      setTotalCompletedModules(0);
      setTotalXP(0);
      setAverageXp(0);
      setAverageMark(0);

      return;
    }

    // ==========================================
    // 3. GET CLASS IDS
    // ==========================================

    const classIds = (teacherClassRows || []).map(
      (item) => Number(item.class_id)
    );

    console.log("Teacher ID:", user.id);
    console.log("Teacher Class IDs:", classIds);

    // ==========================================
    // 4. GET CLASS INFORMATION
    // ==========================================

    let assignedClasses = [];

    if (classIds.length > 0) {
      const {
        data: classData,
        error: classError,
      } = await supabase
        .from("classes")
        .select("id, class_name, year_level")
        .in("id", classIds);

      if (classError) {
        console.error(
          "Gagal ambil class information:",
          classError
        );
      } else {
        assignedClasses = classData || [];
      }
    }

    setTeacherClasses(assignedClasses);

    console.log(
      "Teacher Classes:",
      assignedClasses
    );

    // ==========================================
    // 5. IF TEACHER HAS NO CLASS
    // ==========================================

    if (classIds.length === 0) {
      setStudents([]);
      setTotalStudents(0);
      setTotalQuizzes(0);
      setTotalCompletedModules(0);
      setTotalXP(0);
      setAverageXp(0);
      setAverageMark(0);

      return;
    }

    // ==========================================
    // 6. GET STUDENTS FROM TEACHER'S CLASSES ONLY
    // ==========================================

    const {
      data: profiles,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(`
        id,
        name,
        email,
        role,
        total_xp,
        class_id
      `)
      .eq("role", "student")
      .in("class_id", classIds);

    if (profileError) {
      console.error(
        "Gagal ambil student profiles:",
        profileError
      );

      setStudents([]);
      return;
    }

    const studentProfiles = profiles || [];

    console.log(
      "Students for teacher:",
      studentProfiles
    );

    // ==========================================
    // 7. GET STUDENT IDS
    // ==========================================

    const studentIds = studentProfiles.map(
      (student) => student.id
    );

    // ==========================================
    // 8. GET QUIZ RESULTS
    // ==========================================

    let quizResults = [];

    if (studentIds.length > 0) {
      const {
        data: quizData,
        error: quizError,
      } = await supabase
        .from("quiz_results")
        .select(`
          profile_id,
          score,
          total_questions,
          percentage,
          xp_earned,
          benchmark,
          created_at
        `)
        .in("profile_id", studentIds)
        .order("created_at", {
          ascending: false,
        });

      if (quizError) {
        console.error(
          "Gagal ambil quiz results:",
          quizError
        );
      } else {
        quizResults = quizData || [];
      }
    }

    // ==========================================
    // 9. GET MODULE PROGRESS
    // ==========================================

    let moduleProgress = [];

    if (studentIds.length > 0) {
      const {
        data: moduleData,
        error: moduleError,
      } = await supabase
        .from("module_progress")
        .select(`
          profile_id,
          module_id,
          module_name,
          completed,
          completed_at
        `)
        .eq("completed", true)
        .in("profile_id", studentIds);

      if (moduleError) {
        console.error(
          "Gagal ambil module progress:",
          moduleError
        );
      } else {
        moduleProgress = moduleData || [];
      }
    }

    // ==========================================
    // 10. GROUP QUIZ RESULTS
    // ==========================================

    const quizzesByStudent = {};

    quizResults.forEach((quiz) => {
      if (!quizzesByStudent[quiz.profile_id]) {
        quizzesByStudent[quiz.profile_id] = [];
      }

      quizzesByStudent[quiz.profile_id].push(quiz);
    });

    // ==========================================
    // 11. GROUP MODULE PROGRESS
    // ==========================================

    const modulesByStudent = {};

    moduleProgress.forEach((module) => {
      if (!modulesByStudent[module.profile_id]) {
        modulesByStudent[module.profile_id] = [];
      }

      modulesByStudent[module.profile_id].push(module);
    });

    // ==========================================
    // 12. CREATE STUDENT DATA
    // ==========================================

    const studentData = studentProfiles.map(
      (profile) => {
        const quizzes =
          quizzesByStudent[profile.id] || [];

        const completedModules =
          modulesByStudent[profile.id] || [];

        const moduleCount =
          completedModules.length;

        const modulePercentage =
          TOTAL_MODULES > 0
            ? Math.round(
                (moduleCount / TOTAL_MODULES) * 100
              )
            : 0;

        const xp = profile.total_xp || 0;

        const latestQuiz =
          quizzes.length > 0
            ? quizzes[0]
            : null;

        const bestQuiz =
          quizzes.length > 0
            ? [...quizzes].sort(
                (a, b) =>
                  (b.percentage || 0) -
                  (a.percentage || 0)
              )[0]
            : null;

        // Find student's class
        const studentClass =
          assignedClasses.find(
            (item) =>
              Number(item.id) ===
              Number(profile.class_id)
          );

        return {
          id: profile.id,

          name:
            profile.name ||
            "Tidak diketahui",

          email:
            profile.email ||
            "-",

          classId:
            profile.class_id,

          className:
            studentClass?.class_name ||
            "Tidak diketahui",

          xp,

          completedModules,

          moduleCount,

          modulePercentage,

          quizzes,

          quizCount:
            quizzes.length,

          latestQuiz,

          bestQuiz,

          score:
            latestQuiz
              ? `${latestQuiz.score} / ${latestQuiz.total_questions}`
              : "Belum menjawab",

          percentage:
            latestQuiz
              ? latestQuiz.percentage || 0
              : 0,

          benchmark:
            latestQuiz
              ? latestQuiz.benchmark ||
                "Belum ada"
              : "Belum ada",
        };
      }
    );

    // ==========================================
    // 13. SET STUDENTS
    // ==========================================

    setStudents(studentData);

    // ==========================================
    // 14. TOTAL STUDENTS
    // ==========================================

    setTotalStudents(
      studentData.length
    );

    // ==========================================
    // 15. TOTAL QUIZZES
    // ==========================================

    setTotalQuizzes(
      quizResults.length
    );

    // ==========================================
    // 16. TOTAL COMPLETED MODULES
    // ==========================================

    const completedModuleTotal =
      studentData.reduce(
        (total, student) =>
          total + student.moduleCount,
        0
      );

    setTotalCompletedModules(
      completedModuleTotal
    );

    // ==========================================
    // 17. TOTAL XP
    // ==========================================

    const xpTotal =
      studentData.reduce(
        (total, student) =>
          total + student.xp,
        0
      );

    setTotalXP(xpTotal);

    // ==========================================
    // 18. AVERAGE XP
    // ==========================================

    setAverageXp(
      studentData.length > 0
        ? Math.round(
            xpTotal /
            studentData.length
          )
        : 0
    );

    // ==========================================
    // 19. AVERAGE MARK
    // ==========================================

    const percentages =
      quizResults.map(
        (quiz) =>
          quiz.percentage || 0
      );

    const percentageTotal =
      percentages.reduce(
        (total, percentage) =>
          total + percentage,
        0
      );

    setAverageMark(
      percentages.length > 0
        ? Math.round(
            percentageTotal /
            percentages.length
          )
        : 0
    );

  } catch (error) {
    console.error(
      "Teacher dashboard error:",
      error
    );
  } finally {
    setLoading(false);
  }
}


  /*
  ============================================
  LEVEL
  ============================================
  */

  function getLevel(xp) {

    if (xp >= 500) {

      return "👑 Master Siber";

    }


    if (xp >= 200) {

      return "🏆 Wira Siber";

    }


    if (xp >= 100) {

      return "🛡️ Penyiasat Siber";

    }


    return "🌱 Pemula Siber";

  }


  /*
  ============================================
  ACHIEVEMENT
  ============================================
  */

  function getAchievement(xp) {

    if (xp >= 500) {

      return "👑 Master Siber";

    }


    if (xp >= 200) {

      return "🏆 Wira Siber";

    }


    if (xp >= 100) {

      return "🛡️ Penyiasat Siber";

    }


    return "🌱 Pemula Siber";

  }


  /*
  ============================================
  RANKING
  ============================================
  */

  const ranking =
    [...students]
      .sort(
        (a, b) => {

          if (
            b.xp !== a.xp
          ) {

            return (
              b.xp -
              a.xp
            );

          }


          return (
            b.percentage -
            a.percentage
          );

        }
      )
      .slice(
        0,
        5
      );


  /*
  ============================================
  FORMAT DATE
  ============================================
  */

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
        month: "2-digit",
        year: "numeric"
      }
    );

  }


  /*
  ============================================
  EXCEL REPORT
  ============================================
  */

  function generateReport() {

    const reportData =
      students.map(
        (
          student,
          index
        ) => ({

          Bil:
            index + 1,

          "Nama Pelajar":
            student.name,

          "E-mel":
            student.email,

          Tahap:
            getLevel(
              student.xp
            ),

          XP:
            student.xp,

          "Modul Selesai":
            `${student.moduleCount}/${TOTAL_MODULES}`,

          "Progress Modul":
            `${student.modulePercentage}%`,

          "Percubaan Kuiz":
            student.quizCount,

          "Markah Kuiz":
            student.score,

          "Peratus":
            `${student.percentage}%`,

          Benchmark:
            student.benchmark,

          Achievement:
            getAchievement(
              student.xp
            )

        })
      );


    const summaryData = [

      {
        Maklumat:
          "PhishQuest - Laporan Prestasi Pelajar",
        Nilai:
          ""
      },

      {
        Maklumat:
          "Tarikh Laporan",
        Nilai:
          new Date()
            .toLocaleDateString(
              "ms-MY"
            )
      },

      {
        Maklumat:
          "Jumlah Pelajar",
        Nilai:
          totalStudents
      },

      {
        Maklumat:
          "Jumlah Modul Selesai",
        Nilai:
          totalCompletedModules
      },

      {
        Maklumat:
          "Jumlah XP",
        Nilai:
          totalXP
      },

      {
        Maklumat:
          "Purata XP",
        Nilai:
          averageXp
      },

      {
        Maklumat:
          "Jumlah Kuiz Disiapkan",
        Nilai:
          totalQuizzes
      },

      {
        Maklumat:
          "Purata Markah",
        Nilai:
          `${averageMark}%`
      }

    ];


    const workbook =
      XLSX.utils.book_new();


    const summarySheet =
      XLSX.utils.json_to_sheet(
        summaryData
      );


    XLSX.utils.book_append_sheet(
      workbook,
      summarySheet,
      "Ringkasan"
    );


    const performanceSheet =
      XLSX.utils.json_to_sheet(
        reportData
      );


    XLSX.utils.book_append_sheet(
      workbook,
      performanceSheet,
      "Prestasi Pelajar"
    );


    XLSX.writeFile(
      workbook,
      "PhishQuest_Laporan_Prestasi.xlsx"
    );

  }


  /*
  ============================================
  LOADING
  ============================================
  */

  if (loading) {

    return (

      <>

        <Sidebar />

        <div className="teacher-page">

          <h1>
            👨‍🏫 Dashboard Guru
          </h1>

          <p>
            ⏳ Memuatkan data pelajar...
          </p>

        </div>

      </>

    );

  }


  /*
  ============================================
  PAGE
  ============================================
  */

  return (

    <>

      <Sidebar />


      <div className="teacher-page">


        {/* HEADER */}

        <div className="teacher-header">

          <div>

            <span className="teacher-label">
              PORTAL GURU
            </span>

            <h1>
              👨‍🏫 Dashboard Guru
            </h1>

            <p className="subtitle">

              Pantau pembelajaran,
              progress modul dan
              prestasi pelajar melalui
              PhishQuest.

            </p>

          </div>


          <div className="teacher-actions">

            <button
              className="refresh-btn"
              onClick={
                loadTeacherData
              }
            >

              🔄 Refresh Data

            </button>


            <button
              className="report-btn"
              onClick={
                generateReport
              }
            >

              📊 Jana Laporan

            </button>

          </div>

        </div>



        {/* STATISTICS */}

        <div className="teacher-stats">


          <div className="teacher-card">

            <h3>
              👨‍🎓 Jumlah Pelajar
            </h3>

            <h1>
              {totalStudents}
            </h1>

          </div>


          <div className="teacher-card">

            <h3>
              📚 Modul Selesai
            </h3>

            <h1>
              {totalCompletedModules}
            </h1>

          </div>


          <div className="teacher-card">

            <h3>
              ⭐ Jumlah XP
            </h3>

            <h1>
              {totalXP}
            </h1>

          </div>


          <div className="teacher-card">

            <h3>
              📝 Kuiz Disiapkan
            </h3>

            <h1>
              {totalQuizzes}
            </h1>

          </div>


          <div className="teacher-card">

            <h3>
              📈 Purata Markah
            </h3>

            <h1>
              {averageMark}%
            </h1>

          </div>


        </div>



        {/* MODULE PROGRESS */}

        <div className="teacher-table">

          <h2>
            📚 Progress Modul Pelajar
          </h2>


          <p className="table-description">

            Pantau perkembangan modul
            pembelajaran setiap pelajar.

          </p>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Nama
                  </th>

                  <th>
                    XP
                  </th>

                  <th>
                    Tahap
                  </th>

                  <th>
                    Modul
                  </th>

                  <th>
                    Progress
                  </th>

                  <th>
                    Achievement
                  </th>

                  <th>
                    Detail
                  </th>

                </tr>

              </thead>


              <tbody>

                {students.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                    >

                      Tiada data pelajar.

                    </td>

                  </tr>

                ) : (

                  students.map(
                    (student) => (

                      <tr
                        key={
                          student.id
                        }
                      >

                        <td>

                          <strong>

                            {student.name}

                          </strong>

                        </td>


                        <td>

                          ⭐ {student.xp}

                        </td>


                        <td>

                          {getLevel(
                            student.xp
                          )}

                        </td>


                        <td>

                          {student.moduleCount}
                          /
                          {TOTAL_MODULES}

                        </td>


                        <td>

                          <div
                            style={{
                              minWidth:
                                "140px"
                            }}
                          >

                            <div
                              style={{
                                display:
                                  "flex",
                                justifyContent:
                                  "space-between",
                                marginBottom:
                                  "5px"
                              }}
                            >

                              <span>

                                {
                                  student.modulePercentage
                                }%

                              </span>

                            </div>


                            <div
                              style={{
                                height:
                                  "8px",
                                background:
                                  "#e5e7eb",
                                borderRadius:
                                  "20px",
                                overflow:
                                  "hidden"
                              }}
                            >

                              <div
                                style={{
                                  width:
                                    `${student.modulePercentage}%`,
                                  height:
                                    "100%",
                                  background:
                                    "#2196f3",
                                  borderRadius:
                                    "20px",
                                  transition:
                                    "width 0.4s ease"
                                }}
                              />

                            </div>

                          </div>

                        </td>


                        <td>

                          {
                            getAchievement(
                              student.xp
                            )
                          }

                        </td>


                        <td>

                          <button
                            className="report-btn"
                            onClick={() =>
                              setSelectedStudent(
                                student
                              )
                            }
                          >

                            👁️ Lihat Detail

                          </button>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>



        {/* COMPLETED MODULE DETAILS */}

        <div className="teacher-table">

          <h2>
            ✅ Modul Yang Telah Diselesaikan
          </h2>


          <p className="table-description">

            Senarai modul yang telah
            diselesaikan oleh setiap pelajar.

          </p>


          {students.length === 0 ? (

            <p>
              Tiada data pelajar.
            </p>

          ) : (

            students.map(
              (student) => (

                <div
                  key={
                    student.id
                  }
                  style={{
                    padding:
                      "20px",
                    marginBottom:
                      "15px",
                    border:
                      "1px solid #dbeafe",
                    borderRadius:
                      "15px",
                    background:
                      "#f8fbff"
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      marginBottom:
                        "12px"
                    }}
                  >

                    <div>

                      <h3
                        style={{
                          margin:
                            "0 0 5px"
                        }}
                      >

                        👨‍🎓 {student.name}

                      </h3>


                      <p
                        style={{
                          margin:
                            "0"
                        }}
                      >

                        {student.email}

                      </p>

                    </div>


                    <strong>

                      {student.moduleCount}
                      /
                      {TOTAL_MODULES}
                      {" "}modul

                    </strong>

                  </div>


                  {student.completedModules.length ===
                  0 ? (

                    <p>

                      📖 Belum menyelesaikan
                      sebarang modul.

                    </p>

                  ) : (

                    <div
                      style={{
                        display:
                          "flex",
                        flexWrap:
                          "wrap",
                        gap:
                          "10px"
                      }}
                    >

                      {student.completedModules.map(
                        (module) => (

                          <span
                            key={
                              module.module_id
                            }
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              gap:
                                "5px",
                              padding:
                                "8px 14px",
                              borderRadius:
                                "20px",
                              background:
                                "#dcfce7",
                              color:
                                "#166534",
                              fontWeight:
                                "600",
                              fontSize:
                                "14px"
                            }}
                          >

                            ✅{" "}

                            {
                              module.module_name ||
                              `Modul ${module.module_id}`
                            }

                          </span>

                        )
                      )}

                    </div>

                  )}

                </div>

              )

            )

          )}

        </div>



        {/* QUIZ PERFORMANCE */}

        <div className="teacher-table">

          <h2>
            📋 Prestasi Pelajar
          </h2>


          <p className="table-description">

            Keputusan kuiz terkini
            setiap pelajar.

          </p>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Nama
                  </th>

                  <th>
                    E-mel
                  </th>

                  <th>
                    Tahap
                  </th>

                  <th>
                    XP
                  </th>

                  <th>
                    Markah Kuiz
                  </th>

                  <th>
                    Peratus
                  </th>

                  <th>
                    Benchmark
                  </th>

                </tr>

              </thead>


              <tbody>

                {students.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                    >

                      Tiada data pelajar.

                    </td>

                  </tr>

                ) : (

                  students.map(
                    (student) => (

                      <tr
                        key={
                          student.id
                        }
                      >

                        <td>
                          {student.name}
                        </td>


                        <td>
                          {student.email}
                        </td>


                        <td>

                          {getLevel(
                            student.xp
                          )}

                        </td>


                        <td>

                          {student.xp} XP

                        </td>


                        <td>

                          {student.score}

                        </td>


                        <td>

                          {student.percentage}%

                        </td>


                        <td>

                          {student.benchmark}

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>



        {/* RANKING */}

        <div className="teacher-table ranking-section">

  <h2>
    🏆 Ranking Pelajar
  </h2>

  <div className="ranking-table-wrapper">

          <table>

            <thead>

              <tr>

                <th>
                  Ranking
                </th>

                <th>
                  Nama
                </th>

                <th>
                  XP
                </th>

                <th>
                  Tahap
                </th>

                <th>
                  Markah
                </th>

              </tr>

            </thead>


            <tbody>

              {ranking.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                  >

                    Tiada data pelajar.

                  </td>

                </tr>

              ) : (

                ranking.map(
                  (
                    student,
                    index
                  ) => (

                    <tr
                      key={
                        student.id
                      }
                    >

                      <td>

                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : index + 1}

                      </td>


                      <td>

                        {student.name}

                      </td>


                      <td>

                        ⭐ {student.xp} XP

                      </td>


                      <td>

                        {getLevel(
                          student.xp
                        )}

                      </td>


                      <td>

                        {student.percentage}%

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


      </div>

   </div>



      {/* =====================================
          STUDENT DETAIL POPUP
      ===================================== */}

      {selectedStudent && (

        <div
          className="student-modal-overlay"
          onClick={() =>
            setSelectedStudent(null)
          }
        >

          <div
            className="student-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="student-modal-header">

              <div>

                <h2>

                  👨‍🎓{" "}
                  {selectedStudent.name}

                </h2>


                <p>

                  {selectedStudent.email}

                </p>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  setSelectedStudent(null)
                }
              >

                ✕

              </button>

            </div>



            {/* ACCOUNT SUMMARY */}

            <div className="student-summary-grid">


              <div className="student-summary-card">

                <span>
                  ⭐ XP
                </span>

                <strong>
                  {selectedStudent.xp}
                </strong>

              </div>


              <div className="student-summary-card">

                <span>
                  🏅 Tahap
                </span>

                <strong>
                  {getLevel(
                    selectedStudent.xp
                  )}
                </strong>

              </div>


              <div className="student-summary-card">

                <span>
                  🏆 Achievement
                </span>

                <strong>
                  {getAchievement(
                    selectedStudent.xp
                  )}
                </strong>

              </div>

            </div>



            {/* MODULE PROGRESS */}

            <div className="student-detail-section">

              <h3>
                📚 Progress Modul
              </h3>


              <div className="detail-progress-header">

                <span>
                  Modul diselesaikan
                </span>

                <strong>

                  {selectedStudent.moduleCount}
                  /
                  {TOTAL_MODULES}

                </strong>

              </div>


              <div className="detail-progress-bar">

                <div
                  style={{
                    width:
                      `${selectedStudent.modulePercentage}%`
                  }}
                />

              </div>


              <p className="detail-progress-text">

                {
                  selectedStudent.modulePercentage
                }% selesai

              </p>


              <div className="completed-module-list">

                {selectedStudent.completedModules.length ===
                0 ? (

                  <p>

                    📖 Belum menyelesaikan
                    sebarang modul.

                  </p>

                ) : (

                  selectedStudent.completedModules.map(
                    (module) => (

                      <div
                        className="completed-module-item"
                        key={
                          module.module_id
                        }
                      >

                        <div>

                          <strong>

                            ✅{" "}

                            {
                              module.module_name ||
                              `Modul ${module.module_id}`
                            }

                          </strong>

                        </div>


                        <span>

                          {
                            formatDate(
                              module.completed_at
                            )
                          }

                        </span>

                      </div>

                    )
                  )

                )}

              </div>

            </div>



            {/* QUIZ SUMMARY */}

            <div className="student-detail-section">

              <h3>
                📝 Prestasi Kuiz
              </h3>


              <div className="student-quiz-grid">


                <div>

                  <span>
                    Percubaan
                  </span>

                  <strong>

                    {
                      selectedStudent.quizCount
                    }

                  </strong>

                </div>


                <div>

                  <span>
                    Terkini
                  </span>

                  <strong>

                    {
                      selectedStudent.latestQuiz
                        ? `${selectedStudent.latestQuiz.score}/${selectedStudent.latestQuiz.total_questions}`
                        : "-"
                    }

                  </strong>

                </div>


                <div>

                  <span>
                    Terbaik
                  </span>

                  <strong>

                    {
                      selectedStudent.bestQuiz
                        ? `${selectedStudent.bestQuiz.percentage}%`
                        : "-"
                    }

                  </strong>

                </div>

              </div>

            </div>



            {/* QUIZ HISTORY */}

            <div className="student-detail-section">

              <h3>
                📋 Sejarah Percubaan Kuiz
              </h3>


              {selectedStudent.quizzes.length ===
              0 ? (

                <p>
                  Belum ada percubaan kuiz.
                </p>

              ) : (

                <div className="quiz-history">

                  {selectedStudent.quizzes.map(
                    (
                      quiz,
                      index
                    ) => (

                      <div
                        className="quiz-history-item"
                        key={
                          `${quiz.created_at}-${index}`
                        }
                      >

                        <div>

                          <strong>

                            Percubaan #
                            {
                              selectedStudent.quizzes.length -
                              index
                            }

                          </strong>


                          <span>

                            {
                              formatDate(
                                quiz.created_at
                              )
                            }

                          </span>

                        </div>


                        <div className="quiz-history-score">

                          <strong>

                            {
                              quiz.score
                            }
                            /
                            {
                              quiz.total_questions
                            }

                          </strong>


                          <span>

                            {
                              quiz.percentage
                            }%

                            {" • "}

                            {
                              quiz.benchmark ||
                              "Tiada benchmark"
                            }

                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>



            {/* CLOSE BUTTON */}

            <div className="modal-footer">

              <button
                className="report-btn"
                onClick={() =>
                  setSelectedStudent(null)
                }
              >

                Tutup

              </button>

            </div>


          </div>

        </div>

      )}

    </>

  );

}


export default Teacher;