/**
 * Repository for Supabase customer_requests table.
 * Records completed customer part requests when all required vehicle and part info is collected.
 */

import { getSupabaseClient } from "./supabase_client";

export interface CustomerRequestInput {
  session_id?: string | null;
  customer_name?: string | null;
  phone?: string | null;
  email?: string | null;
  manufacturer: string;
  model: string;
  year: number;
  part: string;
  details_json?: Record<string, any> | null;
  status?: string;
}

export interface CustomerRequestRecord extends CustomerRequestInput {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SaveRequestResult {
  success: boolean;
  isDuplicate?: boolean;
  record?: CustomerRequestRecord;
  error?: string;
}

export class CustomerRequestRepository {
  public useSupabase: boolean;
  private localStore: Map<string, CustomerRequestRecord> = new Map();
  private localIdCounter = 1;

  constructor(useSupabase: boolean = true) {
    this.useSupabase = useSupabase;
  }

  private getUtcNow(): string {
    return new Date().toISOString();
  }

  /**
   * Check if a request already exists for this session_id.
   */
  public async getRequestBySessionId(sessionId: string): Promise<CustomerRequestRecord | null> {
    if (!sessionId || !sessionId.trim()) return null;
    const cleanSessionId = sessionId.trim();

    const client = this.useSupabase ? getSupabaseClient() : null;
    if (client) {
      try {
        const { data, error } = await client
          .from("usaautopartsbot_customer_requests")
          .select("*")
          .eq("session_id", cleanSessionId)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          const row = data[0];
          return {
            id: row.id,
            session_id: row.session_id,
            customer_name: row.customer_name,
            phone: row.phone,
            email: row.email,
            manufacturer: row.manufacturer,
            model: row.model,
            year: Number(row.year),
            part: row.part,
            details_json: typeof row.details_json === "string" ? JSON.parse(row.details_json) : row.details_json,
            status: row.status || "new",
            created_at: row.created_at || this.getUtcNow(),
            updated_at: row.updated_at || this.getUtcNow(),
          };
        }
      } catch {
        // Fall back to localStore
      }
    }

    // Check local store
    for (const record of this.localStore.values()) {
      if (record.session_id === cleanSessionId) {
        return record;
      }
    }

    return null;
  }

  /**
   * Save or update a completed customer request.
   * If a request already exists for this session_id, avoids inserting duplicate rows.
   */
  public async saveCustomerRequest(input: CustomerRequestInput): Promise<SaveRequestResult> {
    const cleanSessionId = input.session_id ? input.session_id.trim() : null;

    // Validate required fields
    if (!input.manufacturer || !input.model || !input.year || !input.part || !input.customer_name || !input.phone) {
      return {
        success: false,
        error: "Missing required fields: customer_name, phone, manufacturer, model, year, and part are required.",
      };
    }

    const now = this.getUtcNow();
    const detailsJson = input.details_json && Object.keys(input.details_json).length > 0
      ? input.details_json
      : null;

    // Duplicate check: if session_id provided, check if already recorded
    if (cleanSessionId) {
      const existing = await this.getRequestBySessionId(cleanSessionId);
      if (existing) {
        // Already recorded for this session; update details/updated_at if changed, but do not create duplicate row
        const client = this.useSupabase ? getSupabaseClient() : null;
        if (client) {
          try {
            await client
              .from("usaautopartsbot_customer_requests")
              .update({
                customer_name: input.customer_name,
                phone: input.phone,
                manufacturer: input.manufacturer,
                model: input.model,
                year: input.year,
                part: input.part,
                details_json: detailsJson,
                updated_at: now,
              })
              .eq("id", existing.id);
          } catch {
            // Non-fatal if update fails
          }
        }

        existing.customer_name = input.customer_name;
        existing.phone = input.phone;
        existing.manufacturer = input.manufacturer;
        existing.model = input.model;
        existing.year = input.year;
        existing.part = input.part;
        existing.details_json = detailsJson;
        existing.updated_at = now;
        this.localStore.set(existing.id, existing);

        return {
          success: true,
          isDuplicate: true,
          record: existing,
        };
      }
    }

    // Insert new record
    const client = this.useSupabase ? getSupabaseClient() : null;
    if (client) {
      try {
        const payload: any = {
          session_id: cleanSessionId,
          customer_name: input.customer_name || null,
          phone: input.phone || null,
          email: input.email || null,
          manufacturer: input.manufacturer,
          model: input.model,
          year: input.year,
          part: input.part,
          details_json: detailsJson,
          status: input.status || "new",
          created_at: now,
          updated_at: now,
        };

        const { data, error } = await client
          .from("usaautopartsbot_customer_requests")
          .insert([payload])
          .select();

        if (error) {
          throw error;
        }

        const inserted = (data && data[0]) || { ...payload, id: `req_${Date.now()}` };
        const record: CustomerRequestRecord = {
          id: inserted.id,
          session_id: inserted.session_id,
          customer_name: inserted.customer_name,
          phone: inserted.phone,
          email: inserted.email,
          manufacturer: inserted.manufacturer,
          model: inserted.model,
          year: Number(inserted.year),
          part: inserted.part,
          details_json: typeof inserted.details_json === "string" ? JSON.parse(inserted.details_json) : inserted.details_json,
          status: inserted.status || "new",
          created_at: inserted.created_at || now,
          updated_at: inserted.updated_at || now,
        };

        this.localStore.set(record.id, record);
        return {
          success: true,
          isDuplicate: false,
          record,
        };
      } catch (err: any) {
        // If client is present but Supabase call failed, return error for failure safety
        return {
          success: false,
          error: err?.message || "Failed to save customer request to Supabase",
        };
      }
    }

    // If useSupabase is enabled, DO NOT use local in-memory fallback to prevent false success in production
    if (this.useSupabase) {
      return {
        success: false,
        error: "Supabase client is not available or not properly configured.",
      };
    }

    // Local in-memory fallback (ONLY when explicitly instantiated with useSupabase = false for unit tests)
    const id = `req_${this.localIdCounter++}_${Date.now()}`;
    const record: CustomerRequestRecord = {
      id,
      session_id: cleanSessionId,
      customer_name: input.customer_name || null,
      phone: input.phone || null,
      email: input.email || null,
      manufacturer: input.manufacturer,
      model: input.model,
      year: input.year,
      part: input.part,
      details_json: detailsJson,
      status: input.status || "new",
      created_at: now,
      updated_at: now,
    };

    this.localStore.set(id, record);
    return {
      success: true,
      isDuplicate: false,
      record,
    };
  }

  public getAllLocalRecords(): CustomerRequestRecord[] {
    return Array.from(this.localStore.values());
  }

  public clearLocalStore(): void {
    this.localStore.clear();
    this.localIdCounter = 1;
  }
}

let globalCustomerRequestRepo: CustomerRequestRepository | null = null;

export function getCustomerRequestRepository(useSupabase: boolean = true): CustomerRequestRepository {
  if (!globalCustomerRequestRepo) {
    globalCustomerRequestRepo = new CustomerRequestRepository(useSupabase);
  }
  return globalCustomerRequestRepo;
}

export function resetCustomerRequestRepository(): void {
  globalCustomerRequestRepo = null;
}
