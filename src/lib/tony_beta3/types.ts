/**
 * Type definitions for Tony Beta 3 core engine.
 */

export interface VehicleContext {
  manufacturer: string | null;
  model: string | null;
  year: number | null;
}

export interface PendingConfirmation {
  field: string;
  candidate: string | number;
  confidence: number;
}

export interface CustomerContext {
  name: string | null;
  phone: string | null;
  zip: string | null;
}

export interface ConversationContext {
  vehicle: VehicleContext;
  part: string | null;
  details: Record<string, string>;
  pending_confirmation: PendingConfirmation | null;
  customer?: CustomerContext;
}

export interface ConfirmationState {
  confirmed_entities: {
    manufacturer: string | null;
    model: string | null;
    year: number | null;
    part: string | null;
    details: Record<string, string>;
  };
  pending_confirmation: PendingConfirmation | null;
  unrecognized_tokens?: string[];
}

export interface DetectionEntities {
  manufacturer: string | null;
  model: string | null;
  year: number | null;
  part: string | null;
  details: Record<string, string>;
  unrecognized_tokens: string[];
}

export interface DetectionConfidence {
  manufacturer: number;
  model: number;
  year: number;
  part: number;
  details: number;
}

export interface DetectionResult {
  original_text: string;
  normalized_text: string;
  entities: DetectionEntities;
  confidence: DetectionConfidence;
}

export interface ConfirmationResult {
  action: "accept" | "confirm" | "request_input" | "none" | "out_of_scope";
  field: string | null;
  candidate: any;
  confidence: number;
  state: ConfirmationState;
}

export interface ResponseOutput {
  category: string;
  template_id: string | number;
  reply: string;
}

export interface ChatOutput {
  session_id?: string | null;
  reply: string;
  context: ConversationContext;
  action: string;
  category: string;
}

export interface SessionRecord {
  id: string | number | null;
  session_id: string;
  context: ConversationContext;
  created_at: string;
  updated_at: string;
}
