import { ChatMessage } from "./types";
import { BOT_CONFIG } from "./config";

const SESSION_KEY = "bionic_chatbot_session_id";
const MESSAGES_KEY = "bionic_chatbot_messages";

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return "ssr-placeholder-session";
  }

  try {
    let sessionId = window.sessionStorage.getItem(SESSION_KEY);
    if (!sessionId || !/^[A-Za-z0-9._:-]{1,128}$/.test(sessionId)) {
      sessionId = generateUUID();
      window.sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return generateUUID();
  }
}

export function getStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.sessionStorage.getItem(MESSAGES_KEY);
    if (!raw) {
      return [
        {
          id: "welcome-message",
          sender: "bot",
          text: BOT_CONFIG.welcomeMessage,
          timestamp: Date.now(),
        },
      ];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Fall back to default welcome
  }

  return [
    {
      id: "welcome-message",
      sender: "bot",
      text: BOT_CONFIG.welcomeMessage,
      timestamp: Date.now(),
    },
  ];
}

export function saveStoredMessages(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch {
    // Ignore storage quota or disabled storage errors
  }
}

export function clearStoredSession(): string {
  if (typeof window === "undefined") return generateUUID();

  try {
    const newSessionId = generateUUID();
    window.sessionStorage.setItem(SESSION_KEY, newSessionId);
    window.sessionStorage.removeItem(MESSAGES_KEY);
    window.sessionStorage.removeItem("bionic_chatbot_state");
    return newSessionId;
  } catch {
    return generateUUID();
  }
}
