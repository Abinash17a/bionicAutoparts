/**
 * Data contracts and UI types for the automotive conversational assistant.
 * Matches the backend API contracts defined in Tony Beta 3 bot.
 */

export interface ChatRequestBody {
  session_id: string;
  message: string;
  context?: SessionState | null;
  session_state?: SessionState | null;
}

export interface SessionState {
  customer?: {
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    zip?: string | null;
  };
  intent?: string;
  vehicle?: {
    year?: number | string | null;
    make?: string | null;
    manufacturer?: string | null;
    model?: string | null;
  };
  part?: string | null;
  details?: Record<string, unknown>;
  missing_fields?: string[];
  pending_confirmation?: Record<string, unknown> | null;
  status?: string;
  reply?: string;
}

export interface ChatResponseBody {
  status: string;
  session_id?: string;
  reply: string;
  context?: SessionState;
  extracted_data?: SessionState;
  action?: string;
  category?: string;
  inference_time_seconds?: number;
}

export interface ResetRequestBody {
  session_id: string;
}

export interface ResetResponseBody {
  reset: boolean;
  session_id: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: number;
}
