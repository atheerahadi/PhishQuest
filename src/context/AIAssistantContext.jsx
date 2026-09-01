import { createContext, useContext, useState } from "react";

const AIAssistantContext = createContext();

export function AIAssistantProvider({ children }) {

  const [wrongStreak, setWrongStreak] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [helpLevel, setHelpLevel] = useState(1);

  function handleAnswer(isCorrect) {

    if (isCorrect) {

      setWrongStreak(0);
      setShowHelp(false);

      return;
    }

    setWrongStreak((previous) => {

      const newStreak = previous + 1;

      if (newStreak >= 3) {

        setHelpLevel(2);
        setShowHelp(true);

      } else if (newStreak >= 2) {

        setHelpLevel(1);
        setShowHelp(true);

      }

      return newStreak;

    });

  }

  function closeHelp() {

    setShowHelp(false);

  }

  function resetAssistant() {

    setWrongStreak(0);
    setShowHelp(false);
    setHelpLevel(1);

  }

  return (

    <AIAssistantContext.Provider
      value={{
        wrongStreak,
        showHelp,
        helpLevel,
        handleAnswer,
        closeHelp,
        resetAssistant
      }}
    >

      {children}

    </AIAssistantContext.Provider>

  );

}

export function useAIAssistant() {

  return useContext(AIAssistantContext);

}