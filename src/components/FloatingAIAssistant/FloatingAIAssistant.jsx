import { useMemo, useState } from "react";

import {
  Container,
  Header,
  MessageList,
  Composer,
  StylesheetProvider,
  useWebchat
} from "@botpress/webchat";

import { useAIAssistant } from "../../context/AIAssistantContext";
import "./floatingAI.css";
import phishbot from "./phishbot.png";


function FloatingAIAssistant() {

  const { showHelp, helpLevel, closeHelp } = useAIAssistant();

  const [isChatOpen, setIsChatOpen] = useState(false);

  // ==========================================
  // BOTPRESS CLIENT ID
  // ==========================================

  const clientId =
    "c52e170e-ca3b-4b64-89a7-0fdc6d33a58c";


  // ==========================================
  // BOTPRESS WEBCHAT
  // ==========================================

  const {
    client,
    messages,
    isTyping,
    user,
    clientState,
    newConversation
  } = useWebchat({
    clientId
  });


  // ==========================================
  // BOT CONFIGURATION
  // ==========================================

  const botConfig = {
    botName: "PhishBot",

    botDescription:
      "AI Assistant untuk membantu anda memahami keselamatan siber."
  };


  // ==========================================
  // FORMAT MESSAGES
  // ==========================================

  const enrichedMessages = useMemo(() => {

    return messages.map((message) => {

      const { authorId } = message;

      const direction =
        authorId === user?.id
          ? "outgoing"
          : "incoming";

      return {
        ...message,

        direction,

        sender:
          direction === "outgoing"
            ? {
                name: user?.name ?? "You",
                avatar: user?.pictureUrl
              }
            : {
                name: botConfig.botName
              }
      };

    });

  }, [
    messages,
    user?.id,
    user?.name,
    user?.pictureUrl
  ]);


  // ==========================================
  // OPEN ASSISTANT
  // ==========================================

  function openAssistant() {

    closeHelp();

    setIsChatOpen(true);

  }


  // ==========================================
  // TOGGLE CHAT
  // ==========================================

  function toggleChat() {

    setIsChatOpen(
      (previous) => !previous
    );

  }


  // ==========================================
  // CLOSE CHAT
  // ==========================================

  function closeAssistant() {

    setIsChatOpen(false);

  }


  // ==========================================
  // UI
  // ==========================================

  return (
    <>

      {/* ==================================================
          BOTPRESS STYLES
      ================================================== */}

      <StylesheetProvider
        color="#6c63ff"
        fontFamily="inter"
        radius={1}
        variant="soft"
        themeMode="light"
        headerVariant="solid"
      />


      {/* ==================================================
          HELP POPUP
      ================================================== */}

      {showHelp && !isChatOpen && (

        <div className="phishbot-help">

          <button
            type="button"
            className="help-close"
            onClick={closeHelp}
            aria-label="Tutup bantuan"
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
                sedikit bantuan. Saya boleh bantu awak
                faham konsep phishing.
              </p>

            )}


            <button
              type="button"
              className="help-button"
              onClick={openAssistant}
            >
              💬 Bantu Saya
            </button>

          </div>

        </div>

      )}


      {/* ==================================================
          BOTPRESS CHAT WINDOW
      ================================================== */}

      <Container
        connected={
          clientState !== "disconnected"
        }

        className="phishbot-chat"

        style={{
          width: "380px",
          height: "520px",

          display: isChatOpen
            ? "flex"
            : "none",

          position: "fixed",

          bottom: "100px",
          right: "25px",

          zIndex: 9998,

          borderRadius: "20px",

          overflow: "hidden"
        }}
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <Header
          defaultOpen={true}

          closeWindow={closeAssistant}

          restartConversation={newConversation}

          disabled={false}

          configuration={{
            botName:
              botConfig.botName,

            botDescription:
              botConfig.botDescription
          }}
        />


        {/* ==================================================
            MESSAGE LIST
        ================================================== */}

        <MessageList
          botName={
            botConfig.botName
          }

          botDescription={
            botConfig.botDescription
          }

          isTyping={isTyping}

          showMarquee={false}

          messages={
            enrichedMessages
          }

          sendMessage={
            client?.sendMessage
          }
        />


        {/* ==================================================
            COMPOSER
        ================================================== */}

        <Composer
          disableComposer={false}

          isReadOnly={false}

          allowFileUpload={true}

          connected={
            clientState !== "disconnected"
          }

          sendMessage={
            client?.sendMessage
          }

          uploadFile={
            client?.uploadFile
          }

          composerPlaceholder="Tanya PhishBot..."
        />

      </Container>


      {/* ==================================================
          FLOATING PHISHBOT BUTTON
      ================================================== */}

      <button
        type="button"

        className={`phishbot-button ${
          showHelp
            ? "phishbot-attention"
            : ""
        }`}

        onClick={toggleChat}

        title="Tanya PhishBot"

        aria-label="Buka PhishBot"
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