import { BOT_CONFIG } from "./config";
import { ChatRequestBody, ChatResponseBody, ResetRequestBody, ResetResponseBody } from "./types";

interface SendMessageResult {
  success: boolean;
  reply: string;
  response?: ChatResponseBody;
  error?: string;
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

  const endpoint = `${BOT_CONFIG.apiUrl.replace(/\/+$/, "")}/chat`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BOT_CONFIG.requestTimeoutMs);

  try {
    const payload: ChatRequestBody = {
      session_id: sessionId,
      message: cleanMessage,
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
    return {
      success: true,
      reply: data.reply || BOT_CONFIG.defaultErrorMessage,
      response: data,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    const isAbort =
      err instanceof DOMException && err.name === "AbortError" ||
      (typeof err === "object" && err !== null && "name" in err && err.name === "AbortError");

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
  const endpoint = `${BOT_CONFIG.apiUrl.replace(/\/+$/, "")}/reset-session`;
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
