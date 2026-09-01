import { useState } from "react";
import { Webchat } from "@botpress/webchat";
import { useAIAssistant } from "../../context/AIAssistantContext";
import "./floatingAI.css";
import phishbot from "./phishbot.png";

function FloatingAIAssistant() {

  const {
    showHelp,
    helpLevel,
    closeHelp
  } = useAIAssistant();

  const [isChatOpen, setIsChatOpen] = useState(false);

  const clientId =
    "c52e170e-ca3b-4b64-89a7-0fdc6d33a58c";

  function openAssistant() {

    closeHelp();

    setIsChatOpen(true);

  }

  function toggleChat() {

    setIsChatOpen((previous) => !previous);

  }

  return (
    <>

      {showHelp && !isChatOpen && (

        <div className="phishbot-help">

          <button
            className="help-close"
            onClick={closeHelp}
          >
            ×
          </button>

          <div className="help-content">

            <strong>
              🤖 PhishBot nak bantu!
            </strong>

            {helpLevel === 1 ? (

              <p>
                Nampak macam soalan ini agak mencabar.
                Nak saya terangkan topik ini dengan lebih mudah?
              </p>

            ) : (

              <p>
                Jangan risau! Awak nampak macam perlukan
                sedikit bantuan. Saya boleh bantu awak faham
                konsep phishing.
              </p>

            )}

            <button
              className="help-button"
              onClick={openAssistant}
            >
              💬 Bantu Saya
            </button>

          </div>

        </div>

      )}

      {isChatOpen && (

        <div className="phishbot-chat">

          <Webchat
            clientId={clientId}
            configuration={{
              botName: "PhishBot",
              botDescription:
                "AI Assistant untuk membantu anda memahami keselamatan siber.",
              composerPlaceholder:
                "Tanya PhishBot..."
            }}
          />

        </div>

      )}

      <button
        className={`phishbot-button ${
          showHelp ? "phishbot-attention" : ""
        }`}
        onClick={toggleChat}
        title="Tanya PhishBot"
      >

        <img
          src={phishbot}
          alt="PhishBot"
        />

      </button>

    </>
  );

}

export default FloatingAIAssistant;