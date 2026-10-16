import { BOT_CONFIG } from "./config";
import { ChatRequestBody, ChatResponseBody, SessionState, ResetRequestBody, ResetResponseBody } from "./types";

interface SendMessageResult {
  success: boolean;
  reply: string;
  response?: ChatResponseBody;
  sessionState?: SessionState;
  error?: string;
}

const SESSION_STATE_KEY = "bionic_chatbot_state";

function getStoredSessionState(): SessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSessionState(state: SessionState): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_STATE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function clearSessionState(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(SESSION_STATE_KEY);
  } catch {
    // Ignore
  }
}

export async function sendChatMessage(
  message: string,
  sessionId: string
): Promise<SendMessageResult> {
  const cleanMessage = message.trim();
  if (!cleanMessage) {
    return {
      success: false,
      reply: "Please enter a message.",
      error: "EMPTY_MESSAGE",
    };
  }

  const rawUrl = BOT_CONFIG.apiUrl.replace(/\/+$/, "");
  const endpoint = rawUrl.endsWith("/chat") ? rawUrl : `${rawUrl}/chat`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BOT_CONFIG.requestTimeoutMs);

  try {
    const currentState = getStoredSessionState();
    const payload: ChatRequestBody = {
      session_id: sessionId,
      message: cleanMessage,
      context: currentState,
      session_state: currentState,
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorDetail = "";
      try {
        const errorJson = await res.json();
        errorDetail = errorJson?.error?.message || "";
      } catch {
        // Ignore json parse error on error response
      }

      if (process.env.NODE_ENV !== "production") {
        console.error(`[Chatbot API] Error ${res.status}:`, errorDetail || res.statusText);
      }

      return {
        success: false,
        reply: BOT_CONFIG.defaultErrorMessage,
        error: `HTTP_${res.status}`,
      };
    }

    const data = (await res.json()) as ChatResponseBody;
    const resolvedState = data.context || data.extracted_data;

    // Persist merged session state from backend response
    if (resolvedState) {
      saveSessionState(resolvedState);
    }

    return {
      success: true,
      reply: data.reply || BOT_CONFIG.defaultErrorMessage,
      response: data,
      sessionState: resolvedState,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    const isAbort =
      (err instanceof DOMException && err.name === "AbortError") ||
      (typeof err === "object" && err !== null && "name" in err && (err as { name?: string }).name === "AbortError");

    if (process.env.NODE_ENV !== "production") {
      console.error("[Chatbot API] Network/Fetch exception:", isAbort ? "Request timed out" : err);
    }

    return {
      success: false,
      reply: isAbort
        ? "Request timed out. Please check your connection and try again."
        : BOT_CONFIG.defaultErrorMessage,
      error: isAbort ? "TIMEOUT" : "NETWORK_ERROR",
    };
  }
}

export async function resetChatSession(sessionId: string): Promise<boolean> {
  clearSessionState();

  const rawUrl = BOT_CONFIG.apiUrl.replace(/\/+$/, "");
  const endpoint = rawUrl.endsWith("/chat")
    ? rawUrl.replace(/\/chat$/, "/reset-session")
    : `${rawUrl}/reset-session`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const payload: ResetRequestBody = { session_id: sessionId };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as ResetResponseBody;
      return Boolean(data.reset);
    }
    return false;
  } catch (err) {
    clearTimeout(timeoutId);
    if (process.env.NODE_ENV !== "production") {
      console.error("[Chatbot API] Failed to reset session:", err);
    }
    return false;
  }
}
