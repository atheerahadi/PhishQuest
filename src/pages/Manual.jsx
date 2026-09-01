import { useState } from "react";
import Sidebar from "../components/Sidebar";

import "../styles/sidebar.css";
import "../styles/manual.css";

function Manual() {

    const [selectedManual, setSelectedManual] = useState(null);


    const manuals = [

        {
            id: 1,
            icon: "📝",
            title: "Mendaftar Akaun",
            description: (
                <ol>
                    <li>
                        Pilih menu <strong>Daftar</strong> pada halaman utama.
                    </li>

                    <li>
                        Masukkan nama, alamat e-mel dan kata laluan.
                    </li>

                    <li>
                        Pilih jenis pengguna yang sesuai.
                    </li>

                    <li>
                        Tekan butang <strong>Daftar</strong> untuk mencipta akaun.
                    </li>
                </ol>
            )
        },


        {
            id: 2,
            icon: "🔐",
            title: "Log Masuk",
            description: (
                <ol>
                    <li>
                        Masukkan alamat e-mel yang telah didaftarkan.
                    </li>

                    <li>
                        Masukkan kata laluan.
                    </li>

                    <li>
                        Tekan butang <strong>Log Masuk</strong>.
                    </li>

                    <li>
                        Anda akan dibawa ke halaman utama mengikut jenis akaun anda.
                    </li>
                </ol>
            )
        },


        {
            id: 3,
            icon: "📚",
            title: "Modul Pembelajaran",
            description: (
                <>
                    <p>
                        Menu <strong>Pembelajaran</strong> menyediakan modul
                        berkaitan keselamatan siber dan phishing.
                    </p>

                    <ol>
                        <li>
                            Pilih modul yang ingin dipelajari.
                        </li>

                        <li>
                            Baca penerangan yang disediakan.
                        </li>

                        <li>
                            Tonton video pembelajaran jika tersedia.
                        </li>

                        <li>
                            Setelah selesai, tekan <strong>Selesai Modul</strong>.
                        </li>

                        <li>
                            Modul yang telah selesai akan direkodkan sebagai
                            progress pembelajaran anda.
                        </li>
                    </ol>
                </>
            )
        },


        {
            id: 4,
            icon: "❓",
            title: "Kuiz Kesedaran Siber",
            description: (
                <>
                    <p>
                        Kuiz digunakan untuk menguji pengetahuan anda selepas
                        mempelajari topik keselamatan siber.
                    </p>

                    <ol>
                        <li>
                            Pilih menu <strong>Kuiz</strong>.
                        </li>

                        <li>
                            Tekan <strong>Mula Kuiz</strong>.
                        </li>

                        <li>
                            Setiap soalan mempunyai had masa yang ditetapkan.
                        </li>

                        <li>
                            Pilih jawapan yang paling tepat.
                        </li>

                        <li>
                            Selepas menjawab, sistem akan memaparkan sama ada
                            jawapan anda betul atau salah.
                        </li>

                        <li>
                            Baca penerangan yang diberikan sebelum meneruskan
                            ke soalan seterusnya.
                        </li>

                        <li>
                            Keputusan kuiz dan XP akan direkodkan selepas
                            kuiz selesai.
                        </li>
                    </ol>
                </>
            )
        },


        {
            id: 5,
            icon: "💻",
            title: "Simulasi",
            description: (
                <>
                    <p>
                        Simulasi membolehkan anda mempraktikkan kemahiran
                        mengenal pasti ancaman phishing dalam situasi yang
                        menyerupai keadaan sebenar.
                    </p>

                    <ol>
                        <li>
                            Pilih menu <strong>Simulasi</strong>.
                        </li>

                        <li>
                            Baca situasi atau mesej yang dipaparkan.
                        </li>

                        <li>
                            Kenal pasti tindakan yang paling selamat.
                        </li>

                        <li>
                            Hantar jawapan anda.
                        </li>

                        <li>
                            Sistem akan memaparkan keputusan dan XP yang
                            diperoleh.
                        </li>
                    </ol>
                </>
            )
        },


        {
            id: 6,
            icon: "🏆",
            title: "XP dan Pencapaian",
            description: (
                <>
                    <p>
                        XP atau mata pengalaman diberikan berdasarkan aktiviti
                        yang dilakukan dalam PhishQuest.
                    </p>

                    <ul>
                        <li>
                            ⭐ Melengkapkan modul pembelajaran
                        </li>

                        <li>
                            ⭐ Menjawab kuiz
                        </li>

                        <li>
                            ⭐ Menyelesaikan simulasi
                        </li>
                    </ul>

                    <p>
                        XP yang dikumpulkan akan dipaparkan pada profil dan
                        boleh digunakan untuk melihat perkembangan serta
                        pencapaian pengguna.
                    </p>
                </>
            )
        },


        {
            id: 7,
            icon: "👤",
            title: "Profil",
            description: (
                <>
                    <p>
                        Halaman profil memaparkan maklumat pengguna dan
                        perkembangan pembelajaran.
                    </p>

                    <ul>
                        <li>
                            Nama pengguna
                        </li>

                        <li>
                            XP terkumpul
                        </li>

                        <li>
                            Tahap pengguna
                        </li>

                        <li>
                            Pencapaian
                        </li>
                    </ul>
                </>
            )
        },


        {
            id: 8,
            icon: "🚪",
            title: "Log Keluar",
            description: (
                <p>
                    Setelah selesai menggunakan PhishQuest, tekan butang
                    <strong> Log Keluar</strong> pada menu navigasi untuk
                    keluar daripada akaun anda.
                </p>
            )
        }

    ];


    return (

        <>

            <Sidebar />


            <main className="manual-page">


                {/* =========================
                    HEADER
                ========================= */}

                <section className="manual-header">

                    <div className="manual-header-icon">
                        📖
                    </div>


                    <div>

                        <p className="manual-label">
                            PANDUAN PHISHQUEST
                        </p>


                        <h1>
                            Manual Pengguna
                        </h1>


                        <p>
                            Pilih bahagian yang ingin anda pelajari.
                        </p>

                    </div>

                </section>


                {/* =========================
                    DETAIL
                ========================= */}

                {selectedManual ? (

                    <section className="manual-detail">


                        <button
                            className="manual-back"
                            onClick={() =>
                                setSelectedManual(null)
                            }
                        >
                            ← Kembali ke Manual
                        </button>


                        <div className="manual-detail-icon">
                            {selectedManual.icon}
                        </div>


                        <div className="manual-detail-number">
                            Modul {selectedManual.id}
                        </div>


                        <h2>
                            {selectedManual.title}
                        </h2>


                        <div className="manual-detail-content">
                            {selectedManual.description}
                        </div>


                    </section>

                ) : (


                    /* =========================
                        CARD GRID
                    ========================= */

                    <section className="manual-grid">

                        {manuals.map((manual) => (

                            <button
                                key={manual.id}
                                className="manual-menu-card"
                                onClick={() =>
                                    setSelectedManual(manual)
                                }
                            >

                                <div className="manual-card-number">
                                    {manual.id}
                                </div>


                                <div className="manual-card-icon">
                                    {manual.icon}
                                </div>


                                <h2>
                                    {manual.title}
                                </h2>


                                <span>
                                    Lihat panduan →
                                </span>

                            </button>

                        ))}

                    </section>

                )}


                {/* =========================
                    SAFETY TIP
                ========================= */}

                {!selectedManual && (

                    <section className="manual-tip">

                        <div className="manual-tip-icon">
                            💡
                        </div>


                        <div>

                            <h2>
                                Tip Keselamatan
                            </h2>


                            <p>
                                Jangan sesekali berkongsi kata laluan, OTP
                                atau maklumat peribadi dengan pihak yang
                                tidak dikenali. Sentiasa semak pautan dan
                                alamat penghantar sebelum membuat sebarang
                                tindakan.
                            </p>

                        </div>

                    </section>

                )}

            </main>

        </>

    );

}


export default Manual;