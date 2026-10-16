/**
 * Final chatbot orchestration layer for Tony Beta 3 (Stages 5 & 6).
 */

import { evaluateConfirmation } from "./confirmation";
import { createContext, updateContext } from "./context";
import {
  detectCustomer,
  isCustomerComplete,
  isValidName,
  isValidPhone,
  isValidZip,
} from "./customer_detector";
import {
  CustomerRequestRepository,
  getCustomerRequestRepository,
} from "./database/customer_request_repository";
import { CatalogRepository, getRepository } from "./database/repository";
import { getSessionRepository, SessionRepository } from "./database/session_repository";
import { determineResponseCategory, generateResponse } from "./response";
import { ChatOutput, ConversationContext, CustomerContext } from "./types";

export interface ChatOptions {
  context?: ConversationContext | null;
  sessionId?: string | null;
  customerName?: string | null;
  phone?: string | null;
  email?: string | null;
  repository?: CatalogRepository | null;
  sessionRepository?: SessionRepository | null;
  customerRequestRepository?: CustomerRequestRepository | null;
  seed?: number | null;
}

export async function chat(
  message: string | null | undefined,
  options?: ChatOptions
): Promise<ChatOutput> {
  const repo = options?.repository || getRepository();
  const sessionRepo = options?.sessionRepository || getSessionRepository();
  const customerRequestRepo =
    options?.customerRequestRepository || getCustomerRequestRepository();
  const rawMsg = message == null ? "" : String(message);
  const sessionId = options?.sessionId ? options.sessionId.trim() : null;
  const explicitContext = options?.context || null;
  const seed = options?.seed ?? null;

  // 1. Resolve Session Context (Stage 6) if sessionId is provided
  let currentCtx: ConversationContext;
  if (sessionId) {
    const sessionRecord = await sessionRepo.getSession(sessionId);
    if (sessionRecord && sessionRecord.context) {
      currentCtx = sessionRecord.context;
    } else {
      currentCtx = explicitContext ? JSON.parse(JSON.stringify(explicitContext)) : createContext();
    }
  } else {
    currentCtx = explicitContext ? JSON.parse(JSON.stringify(explicitContext)) : createContext();
  }

  // 2. Extract customer contact info (name / phone / ZIP) and strip it from the text
  //    passed to vehicle/part detection so digits and names aren't misread as vehicle data.
  const prevCustomer = currentCtx.customer || {
    name: options?.customerName || null,
    phone: options?.phone || null,
    zip: null,
  };
  const askingForName = determineResponseCategory(currentCtx, "", null) === "ASK_NAME";
  const { customer: found, remaining: vehicleMsg } = detectCustomer(rawMsg, askingForName);
  // Newly supplied valid values overwrite older ones (corrections); invalid values are never stored.
  const customer: CustomerContext = {
    name: found.name || (isValidName(prevCustomer.name) ? prevCustomer.name : null),
    phone: found.phone || (isValidPhone(prevCustomer.phone) ? prevCustomer.phone : null),
    zip: found.zip || (isValidZip(prevCustomer.zip) ? prevCustomer.zip : null),
  };

  // 3. Stage 2: Evaluate Confirmation / Rejection / New Detection
  const internalState = {
    confirmed_entities: {
      manufacturer: currentCtx.vehicle.manufacturer,
      model: currentCtx.vehicle.model,
      year: currentCtx.vehicle.year,
      part: currentCtx.part,
      details: { ...currentCtx.details },
    },
    pending_confirmation: currentCtx.pending_confirmation,
  };

  const stage2Result = evaluateConfirmation(vehicleMsg, internalState);
  const action = stage2Result.action || "none";

  // 4. Stage 3: Update Conversation Context
  const updatedCtx = updateContext(currentCtx, undefined, stage2Result);
  updatedCtx.customer = customer;

  // COMPLETION GUARD: all 7 required fields must be present and valid.
  const mfg = updatedCtx.vehicle?.manufacturer;
  const model = updatedCtx.vehicle?.model;
  const year = updatedCtx.vehicle?.year;
  const part = updatedCtx.part;
  const isComplete = Boolean(mfg && model && year != null && part && isCustomerComplete(customer));

  let category: string;
  let reply: string;

  if (isComplete) {
    // Attempt to persist the completed customer request
    const details = { ...updatedCtx.details, zip: String(customer.zip) };
    const saveResult = await customerRequestRepo.saveCustomerRequest({
      session_id: sessionId,
      customer_name: customer.name,
      phone: customer.phone,
      email: options?.email || null,
      manufacturer: String(mfg),
      model: String(model),
      year: Number(year),
      part: String(part),
      details_json: details,
      status: "new",
    });

    if (saveResult.success) {
      // 5. Generate Deterministic Response from REQUEST_COMPLETE Templates
      const responseObj = generateResponse(
        updatedCtx,
        vehicleMsg,
        stage2Result,
        repo,
        seed,
        "REQUEST_COMPLETE"
      );
      category = "REQUEST_COMPLETE";
      reply = responseObj.reply || "Thanks! We have all the details we need. Our team will get in touch with you shortly.";
    } else {
      console.error("[TonyBeta3 Chat] Customer request save failed:", saveResult.error);
      // Failure safety: do NOT claim success or return REQUEST_COMPLETE
      category = "ERROR";
      reply = "Sorry, I'm having trouble recording your request right now. Please try again in a moment.";
    }
  } else {
    // 5. Stage 4: Generate Deterministic Response from Templates (asks for the next missing field)
    const responseObj = generateResponse(
      updatedCtx,
      vehicleMsg,
      stage2Result,
      repo,
      seed
    );
    category = responseObj.category || "NOT_FOUND";
    reply = responseObj.reply || "";
  }

  // 5. Persist Updated Context to Supabase (Stage 6)
  if (sessionId) {
    try {
      await sessionRepo.saveSession(sessionId, updatedCtx);
    } catch {
      // Non-blocking save error handling
    }
  }

  const result: ChatOutput = {
    reply,
    context: updatedCtx,
    action,
    category,
  };

  if (sessionId) {
    result.session_id = sessionId;
  }

  return result;
}

