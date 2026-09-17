/**
 * Data contracts and UI types for the automotive conversational assistant.
 * Matches the backend API contracts defined in part finder bot.
 */

export interface ChatRequestBody {
  session_id: string;
  message: string;
}

export interface ChatResponseBody {
  reply: string;
  intent: string[];
  context: {
    vehicle?: {
      year?: string | null;
      make?: string | null;
      model?: string | null;
      engine?: string | null;
      transmission?: string | null;
      body_style?: string | null;
      trim?: string | null;
    };
    request?: {
      part_name?: string | null;
      canonical_part_name?: string | null;
      side?: string | null;
      position?: string | null;
      category?: string | null;
    };
    location?: {
      city?: string | null;
      state?: string | null;
      zip?: string | null;
    };
    problem?: {
      description?: string | null;
      urgency?: string | null;
    };
    [key: string]: unknown;
  };
  missing_information: string[];
  session_id: string;
  request_id: string;
  clarification_needed: boolean;
  llm_used: boolean;
}

export interface ResetRequestBody {
  session_id: string;
}

export interface ResetResponseBody {
  reset: boolean;
  session_id: string;
  request_id: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: number;
}
