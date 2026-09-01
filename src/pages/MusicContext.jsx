import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import musicFile from "../assets/music/happymusic.m4a";


const MusicContext = createContext();


export function MusicProvider({ children }) {

  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [musicDisabled, setMusicDisabled] = useState(false);

  const previousMusicState = useRef(false);

  const videoActive = useRef(false);


  /* =========================
     CREATE AUDIO
  ========================= */

  useEffect(() => {

    const audio = new Audio(musicFile);

    audio.loop = true;

    audio.volume = 0.12;

    audioRef.current = audio;


    return () => {

      audio.pause();

      audio.currentTime = 0;

      audioRef.current = null;

    };

  }, []);


  /* =========================
     AUTO PLAY
  ========================= */

  useEffect(() => {

    async function tryAutoPlay() {

      if (!audioRef.current) return;

      if (musicDisabled) return;

      if (videoActive.current) return;

      try {

        await audioRef.current.play();

        setIsPlaying(true);

      } catch (error) {

        /*
          Browser mungkin block autoplay.
          Muzik akan cuba dimainkan semula
          selepas user membuat interaction.
        */

        console.log(
          "Autoplay disekat browser. Menunggu interaction user."
        );

      }

    }


    tryAutoPlay();


    /* =========================
       FIRST USER INTERACTION
    ========================= */

    async function handleFirstInteraction() {

      if (!audioRef.current) return;

      if (musicDisabled) return;

      if (videoActive.current) return;

      if (isPlaying) return;

      try {

        await audioRef.current.play();

        setIsPlaying(true);

      } catch (error) {

        console.error(
          "Muzik tidak dapat dimainkan:",
          error
        );

      }

      window.removeEventListener(
        "pointerdown",
        handleFirstInteraction
      );

      window.removeEventListener(
        "keydown",
        handleFirstInteraction
      );

    }


    window.addEventListener(
      "pointerdown",
      handleFirstInteraction
    );

    window.addEventListener(
      "keydown",
      handleFirstInteraction
    );


    return () => {

      window.removeEventListener(
        "pointerdown",
        handleFirstInteraction
      );

      window.removeEventListener(
        "keydown",
        handleFirstInteraction
      );

    };

  }, [musicDisabled, isPlaying]);


  /* =========================
     TOGGLE MUSIC
  ========================= */

  async function toggleMusic() {

    if (!audioRef.current) return;


    if (isPlaying) {

      audioRef.current.pause();

      setIsPlaying(false);

      setMusicDisabled(true);

      return;

    }


    try {

      setMusicDisabled(false);

      await audioRef.current.play();

      setIsPlaying(true);

    } catch (error) {

      console.error(
        "Muzik tidak dapat dimainkan:",
        error
      );

    }

  }


  /* =========================
     STOP MUSIC
  ========================= */

  function stopMusic() {

    if (!audioRef.current) return;

    audioRef.current.pause();

    setIsPlaying(false);

  }


  /* =========================
     PLAY MUSIC
  ========================= */

  async function playMusic() {

    if (!audioRef.current) return;

    if (musicDisabled) return;

    if (videoActive.current) return;


    try {

      await audioRef.current.play();

      setIsPlaying(true);

    } catch (error) {

      console.error(
        "Muzik tidak dapat dimainkan:",
        error
      );

    }

  }


  /* =========================
     ENTER VIDEO / LESSON
  ========================= */

  function enterLesson() {

    if (!audioRef.current) return;


    /*
      Simpan keadaan muzik sebelum
      video dibuka.
    */

    previousMusicState.current =
      isPlaying;


    videoActive.current = true;


    /*
      Pause muzik.
    */

    audioRef.current.pause();

    setIsPlaying(false);

  }


  /* =========================
     EXIT VIDEO / LESSON
  ========================= */

  async function exitLesson() {

    videoActive.current = false;


    /*
      Hanya sambung muzik jika muzik
      memang sedang dimainkan sebelum
      video dibuka.
    */

    if (
      previousMusicState.current &&
      !musicDisabled
    ) {

      try {

        await audioRef.current.play();

        setIsPlaying(true);

      } catch (error) {

        console.error(
          "Muzik tidak dapat disambung:",
          error
        );

      }

    }

  }


  return (

    <MusicContext.Provider
      value={{

        isPlaying,

        toggleMusic,

        stopMusic,

        playMusic,

        enterLesson,

        exitLesson

      }}
    >

      {children}

    </MusicContext.Provider>

  );

}


export function useMusic() {

  return useContext(MusicContext);

}