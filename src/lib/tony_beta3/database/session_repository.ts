/**
 * Session repository for Supabase chat_sessions table.
 * Manages persistent conversation states across multi-turn chat sessions.
 */

import { ConversationContext, SessionRecord } from "../types";
import { getSupabaseClient } from "./supabase_client";

function createInitialContext(): ConversationContext {
  return {
    vehicle: {
      manufacturer: null,
      model: null,
      year: null,
    },
    part: null,
    details: {},
    pending_confirmation: null,
  };
}

export class SessionPersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionPersistenceError";
  }
}

export class SessionRepository {
  public useSupabase: boolean;
  private localStore: Map<string, SessionRecord> = new Map();

  constructor(useSupabase: boolean = true) {
    this.useSupabase = useSupabase;
  }

  private getUtcNow(): string {
    return new Date().toISOString();
  }

  public async getSession(sessionId: string): Promise<SessionRecord | null> {
    if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
      throw new Error("session_id must be a non-empty string.");
    }

    const cleanSessionId = sessionId.trim();
    const client = this.useSupabase ? getSupabaseClient() : null;

    if (client) {
      try {
        const { data, error } = await client
          .from("chat_sessions")
          .select("id, session_id, context_json, created_at, updated_at")
          .eq("session_id", cleanSessionId)
          .limit(1);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const row = data[0];
          const rawCtx = row.context_json;
          let ctx: ConversationContext;
          if (typeof rawCtx === "string") {
            try {
              ctx = JSON.parse(rawCtx);
            } catch {
              ctx = createInitialContext();
            }
          } else if (rawCtx && typeof rawCtx === "object") {
            ctx = rawCtx as ConversationContext;
          } else {
            ctx = createInitialContext();
          }

          return {
            id: row.id,
            session_id: cleanSessionId,
            context: ctx,
            created_at: row.created_at || this.getUtcNow(),
            updated_at: row.updated_at || this.getUtcNow(),
          };
        }
        return null;
      } catch {
        // Fall back to local in-memory store
      }
    }

    if (this.localStore.has(cleanSessionId)) {
      const record = this.localStore.get(cleanSessionId)!;
      return {
        id: record.id,
        session_id: cleanSessionId,
        context: JSON.parse(JSON.stringify(record.context)),
        created_at: record.created_at,
        updated_at: record.updated_at,
      };
    }

    return null;
  }

  public async saveSession(sessionId: string, context: ConversationContext): Promise<SessionRecord> {
    if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
      throw new Error("session_id must be a non-empty string.");
    }

    const cleanSessionId = sessionId.trim();
    const ctx = JSON.parse(JSON.stringify(context));
    const nowTs = this.getUtcNow();
    const client = this.useSupabase ? getSupabaseClient() : null;

    if (client) {
      try {
        const existing = await this.getSession(cleanSessionId);
        if (existing) {
          const { data, error } = await client
            .from("chat_sessions")
            .update({ context_json: ctx, updated_at: nowTs })
            .eq("session_id", cleanSessionId)
            .select();

          if (error) throw error;
          const updatedRow = data && data.length > 0 ? data[0] : {};
          return {
            id: updatedRow.id || existing.id,
            session_id: cleanSessionId,
            context: ctx,
            created_at: existing.created_at,
            updated_at: nowTs,
          };
        } else {
          const rowData = {
            session_id: cleanSessionId,
            context_json: ctx,
            created_at: nowTs,
            updated_at: nowTs,
          };
          const { data, error } = await client.from("chat_sessions").insert(rowData).select();
          if (error) throw error;
          const newId = data && data.length > 0 ? data[0].id : cleanSessionId;
          return {
            id: newId,
            session_id: cleanSessionId,
            context: ctx,
            created_at: nowTs,
            updated_at: nowTs,
          };
        }
      } catch {
        // Fall back to local store
      }
    }

    if (this.localStore.has(cleanSessionId)) {
      const existing = this.localStore.get(cleanSessionId)!;
      existing.context = JSON.parse(JSON.stringify(ctx));
      existing.updated_at = nowTs;
      return {
        id: existing.id,
        session_id: cleanSessionId,
        context: ctx,
        created_at: existing.created_at,
        updated_at: nowTs,
      };
    } else {
      const newRecord: SessionRecord = {
        id: `local-${cleanSessionId}`,
        session_id: cleanSessionId,
        context: JSON.parse(JSON.stringify(ctx)),
        created_at: nowTs,
        updated_at: nowTs,
      };
      this.localStore.set(cleanSessionId, newRecord);
      return {
        id: newRecord.id,
        session_id: cleanSessionId,
        context: ctx,
        created_at: nowTs,
        updated_at: nowTs,
      };
    }
  }

  public async deleteSession(sessionId: string): Promise<boolean> {
    if (!sessionId || typeof sessionId !== "string") {
      return false;
    }

    const cleanSessionId = sessionId.trim();
    const client = this.useSupabase ? getSupabaseClient() : null;

    if (client) {
      try {
        const { data, error } = await client
          .from("chat_sessions")
          .delete()
          .eq("session_id", cleanSessionId)
          .select();

        if (!error && data && data.length > 0) {
          this.localStore.delete(cleanSessionId);
          return true;
        }
      } catch {
        // Fall through to local delete
      }
    }

    const wasPresent = this.localStore.delete(cleanSessionId);
    return wasPresent;
  }
}

let sessionRepositoryInstance: SessionRepository | null = null;

export function getSessionRepository(): SessionRepository {
  if (!sessionRepositoryInstance) {
    sessionRepositoryInstance = new SessionRepository();
  }
  return sessionRepositoryInstance;
}
