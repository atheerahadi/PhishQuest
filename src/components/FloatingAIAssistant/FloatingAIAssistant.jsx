import { useEffect, useState } from "react";

import { useAIAssistant } from "../../context/AIAssistantContext";
import { supabase } from "../../services/supabase";

import "./floatingAI.css";
import phishbot from "./phishbot.png";

function FloatingAIAssistant() {
  const {
    showHelp,
    helpLevel,
    closeHelp,
  } = useAIAssistant();

  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const INJECT_SCRIPT_ID =
    "phishbot-botpress-inject";

  const CONFIG_SCRIPT_ID =
    "phishbot-botpress-config";

  /*
   * Stores the last Supabase account that
   * was connected to Botpress in this browser.
   */
  const BOT_ACCOUNT_STORAGE_KEY =
    "phishquest-botpress-account-id";

  useEffect(() => {
    let cancelled = false;

    let initializedUnsubscribe = null;
    let errorUnsubscribe = null;

    /*
     * ==========================================
     * BOTPRESS CONFIGURATION
     * ==========================================
     */

    const botpressConfiguration = {
      botName: "PhishBot",

      botDescription:
        "AI Assistant untuk membantu anda memahami keselamatan siber.",

      composerPlaceholder:
        "Tanya PhishBot...",

      themeMode: "light",

      headerVariant: "solid",

      radius: 1,
    };

    /*
     * ==========================================
     * GET CURRENT SUPABASE USER
     * ==========================================
     */

    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error(
            "[PhishBot] Supabase user error:",
            error
          );

          return null;
        }

        if (!user) {
          console.warn(
            "[PhishBot] No Supabase user logged in."
          );

          return null;
        }

        return user;
      } catch (error) {
        console.error(
          "[PhishBot] Failed to get Supabase user:",
          error
        );

        return null;
      }
    };

    /*
     * ==========================================
     * SYNC SUPABASE USER WITH BOTPRESS
     * ==========================================
     */

    const syncBotpressUser = async () => {
      if (
        cancelled ||
        !window.botpress ||
        !window.botpress.updateUser
      ) {
        return;
      }

      const user =
        await getCurrentUser();

      if (!user) {
        console.warn(
          "[PhishBot] Cannot sync user because no user is logged in."
        );

        return;
      }

      /*
       * Every Supabase account gets its own
       * unique Botpress userKey.
       *
       * Example:
       *
       * phishquest-123456-uuid
       */
      const botpressUserKey =
        `phishquest-${user.id}`;

      /*
       * Get previous PhishQuest account
       * stored in this browser.
       */
      const previousAccountId =
        localStorage.getItem(
          BOT_ACCOUNT_STORAGE_KEY
        );

      const accountChanged =
        previousAccountId !== user.id;

      console.log(
        "[PhishBot] Current Supabase account:",
        user.id
      );

      console.log(
        "[PhishBot] Previous account:",
        previousAccountId
      );

      console.log(
        "[PhishBot] Account changed:",
        accountChanged
      );

      try {
        /*
         * Update Botpress user identity.
         */
        await window.botpress.updateUser({
          userKey:
            botpressUserKey,

          name:
            user.user_metadata?.name ||
            user.email ||
            "Pengguna PhishQuest",

          data: {
            supabaseUserId:
              user.id,

            email:
              user.email || "",

            role:
              user.user_metadata?.role ||
              "student",
          },
        });

        console.log(
          "[PhishBot] Botpress user updated:",
          botpressUserKey
        );

        /*
         * If another PhishQuest account was
         * previously using this browser,
         * start a fresh conversation.
         *
         * IMPORTANT:
         *
         * Same account + refresh:
         * NO restart.
         *
         * Different account:
         * restart conversation.
         */
        if (
          accountChanged &&
          previousAccountId !== null &&
          window.botpress.restartConversation
        ) {
          console.log(
            "[PhishBot] Different account detected."
          );

          console.log(
            "[PhishBot] Starting new conversation..."
          );

          await window.botpress.restartConversation();

          console.log(
            "[PhishBot] New conversation started."
          );
        }

        /*
         * Save current Supabase account.
         */
        localStorage.setItem(
          BOT_ACCOUNT_STORAGE_KEY,
          user.id
        );

        console.log(
          "[PhishBot] Account synced successfully."
        );
      } catch (error) {
        console.error(
          "[PhishBot] Failed to sync Botpress user:",
          error
        );
      }
    };

    /*
     * ==========================================
     * APPLY BOTPRESS CONFIGURATION
     * ==========================================
     */

    const applyBotpressConfiguration =
      async () => {
        if (
          cancelled ||
          !window.botpress
        ) {
          return;
        }

        console.log(
          "[PhishBot] Applying Webchat configuration..."
        );

        /*
         * Apply PhishBot appearance/configuration.
         */
        if (window.botpress.config) {
          window.botpress.config({
            configuration:
              botpressConfiguration,
          });
        }

        /*
         * Sync current Supabase account
         * after Webchat is initialized.
         */
        await syncBotpressUser();

        if (cancelled) {
          return;
        }

        setIsReady(true);
        setHasError(false);

        console.log(
          "[PhishBot] Webchat initialized successfully."
        );
      };

    /*
     * ==========================================
     * BOTPRESS ERROR HANDLER
     * ==========================================
     */

    const handleBotpressError =
      (error) => {
        console.error(
          "[PhishBot] Botpress Webchat error:",
          error
        );

        if (!cancelled) {
          setHasError(true);
          setIsReady(false);
        }
      };

    /*
     * ==========================================
     * SETUP BOTPRESS
     * ==========================================
     */

    const setupBotpress = () => {
      if (
        cancelled ||
        !window.botpress
      ) {
        return;
      }

      console.log(
        "[PhishBot] Botpress is available."
      );

      /*
       * Listen for Webchat initialization.
       */
      if (window.botpress.on) {
        initializedUnsubscribe =
          window.botpress.on(
            "webchat:initialized",
            applyBotpressConfiguration
          );

        errorUnsubscribe =
          window.botpress.on(
            "error",
            handleBotpressError
          );
      }

      /*
       * If Webchat has already initialized,
       * configure it immediately.
       */
      if (window.botpress.config) {
        applyBotpressConfiguration();
      }

      /*
       * Load generated Botpress configuration
       * script if it doesn't already exist.
       */
      if (
        !document.getElementById(
          CONFIG_SCRIPT_ID
        )
      ) {
        const configScript =
          document.createElement(
            "script"
          );

        configScript.id =
          CONFIG_SCRIPT_ID;

        configScript.src =
          "https://files.bpcontent.cloud/2026/08/25/12/20260825124528-SHQG52Q5.js";

        configScript.defer = true;

        configScript.onload = () => {
          console.log(
            "[PhishBot] Botpress configuration loaded."
          );
        };

        configScript.onerror =
          (error) => {
            console.error(
              "[PhishBot] Failed to load Botpress configuration:",
              error
            );

            if (!cancelled) {
              setHasError(true);
            }
          };

        document.body.appendChild(
          configScript
        );
      }
    };

    /*
     * ==========================================
     * LOAD BOTPRESS INJECT SCRIPT
     * ==========================================
     */

    if (window.botpress) {
      setupBotpress();
    } else {
      let injectScript =
        document.getElementById(
          INJECT_SCRIPT_ID
        );

      /*
       * Create inject.js if it doesn't exist.
       */
      if (!injectScript) {
        injectScript =
          document.createElement(
            "script"
          );

        injectScript.id =
          INJECT_SCRIPT_ID;

        injectScript.src =
          "https://cdn.botpress.cloud/webchat/v3.7/inject.js";

        injectScript.async = true;

        injectScript.onload = () => {
          console.log(
            "[PhishBot] Botpress inject.js loaded."
          );

          setupBotpress();
        };

        injectScript.onerror =
          (error) => {
            console.error(
              "[PhishBot] Failed to load Botpress inject.js:",
              error
            );

            if (!cancelled) {
              setHasError(true);
            }
          };

        document.body.appendChild(
          injectScript
        );
      } else {
        /*
         * Script already exists.
         * Wait until window.botpress is ready.
         */
        let attempts = 0;

        const checkBotpress =
          setInterval(() => {
            attempts += 1;

            if (window.botpress) {
              clearInterval(
                checkBotpress
              );

              setupBotpress();
            }

            if (attempts >= 100) {
              clearInterval(
                checkBotpress
              );

              if (!cancelled) {
                console.error(
                  "[PhishBot] Botpress initialization timeout."
                );

                setHasError(true);
              }
            }
          }, 100);
      }
    }

    /*
     * ==========================================
     * CLEANUP
     * ==========================================
     */

    return () => {
      cancelled = true;

      if (
        initializedUnsubscribe
      ) {
        initializedUnsubscribe();
      }

      if (
        errorUnsubscribe
      ) {
        errorUnsubscribe();
      }
    };
  }, []);

  /*
   * ==========================================
   * OPEN PHISHBOT
   * ==========================================
   */

  const openAssistant = () => {
    closeHelp();

    if (
      window.botpress &&
      isReady &&
      window.botpress.open
    ) {
      window.botpress.open();

      setIsOpen(true);
    }
  };

  /*
   * ==========================================
   * TOGGLE PHISHBOT
   * ==========================================
   */

  const toggleChat = () => {
    closeHelp();

    if (
      window.botpress &&
      isReady &&
      window.botpress.toggle
    ) {
      window.botpress.toggle();

      setIsOpen(
        (previous) =>
          !previous
      );
    }
  };

  /*
   * ==========================================
   * CLOSE PHISHBOT
   * ==========================================
   */

  const closeAssistant = () => {
    if (
      window.botpress &&
      window.botpress.close
    ) {
      window.botpress.close();

      setIsOpen(false);
    }
  };

  /*
   * ==========================================
   * UI
   * ==========================================
   */

  return (
    <>
      {/* =====================================
          PHISHBOT HELP POPUP
      ===================================== */}

      {showHelp && !isOpen && (
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
                Nampak macam soalan ini agak
                mencabar. Nak saya terangkan
                topik ini dengan lebih mudah?
              </p>
            ) : (
              <p>
                Jangan risau! Awak nampak macam
                perlukan sedikit bantuan. Saya
                boleh bantu awak faham konsep
                phishing.
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

      {/* =====================================
          CONNECTION STATUS
      ===================================== */}

      {!isReady && !hasError && (
        <div
          style={{
            position: "fixed",
            bottom: "95px",
            right: "25px",
            zIndex: 9997,
            background: "#fff8df",
            color: "#6b5b00",
            padding:
              "8px 12px",
            borderRadius: "10px",
            fontSize: "12px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.12)",
          }}
        >
          ⏳ PhishBot sedang disambungkan...
        </div>
      )}

      {hasError && (
        <div
          style={{
            position: "fixed",
            bottom: "95px",
            right: "25px",
            zIndex: 9997,
            maxWidth: "280px",
            background: "#fff0f0",
            color: "#a33",
            padding:
              "10px 14px",
            borderRadius: "10px",
            fontSize: "12px",
            lineHeight: "1.4",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.12)",
          }}
        >
          ⚠️ PhishBot gagal disambungkan.
          <br />
          Sila refresh halaman dan cuba lagi.
        </div>
      )}

      {/* =====================================
          FLOATING PHISHBOT BUTTON
      ===================================== */}

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

      {/* =====================================
          TEMPORARY CLOSE BUTTON
      ===================================== */}

      {isOpen && (
        <button
          type="button"
          onClick={closeAssistant}
          style={{
            position: "fixed",
            bottom: "25px",
            right: "100px",
            zIndex: 10000,
            padding:
              "8px 12px",
            border: "none",
            borderRadius: "8px",
            background: "#555",
            color: "#fff",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Tutup PhishBot
        </button>
      )}
    </>
  );
}

export default FloatingAIAssistant;