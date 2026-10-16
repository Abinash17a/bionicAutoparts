/**
 * Conversation context and state manager for Tony Beta 3 (Stage 3).
 * Stores confirmed automotive information and details cumulatively across messages.
 */

import { evaluateConfirmation } from "./confirmation";
import { getRepository } from "./database/repository";
import { ConfirmationResult, ConversationContext } from "./types";

export function createContext(): ConversationContext {
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

export function updateContext(
  currentContext: ConversationContext | null | undefined,
  userMessage?: string | null,
  stage2Result?: ConfirmationResult | null
): ConversationContext {
  const context: ConversationContext = {
    vehicle: {
      manufacturer: null,
      model: null,
      year: null,
    },
    part: null,
    details: {},
    pending_confirmation: null,
  };

  if (currentContext) {
    const veh = currentContext.vehicle;
    if (veh) {
      context.vehicle.manufacturer = veh.manufacturer || null;
      context.vehicle.model = veh.model || null;
      context.vehicle.year = veh.year != null ? Number(veh.year) : null;
    }
    context.part = currentContext.part || null;
    if (currentContext.details && typeof currentContext.details === "object") {
      context.details = { ...currentContext.details };
    }
    if (currentContext.pending_confirmation && typeof currentContext.pending_confirmation === "object") {
      context.pending_confirmation = { ...currentContext.pending_confirmation };
    }
  }

  // If stage2Result is not pre-computed, run Stage 2 evaluator
  let stage2 = stage2Result;
  if (!stage2 && userMessage !== undefined && userMessage !== null) {
    const internalState = {
      confirmed_entities: {
        manufacturer: context.vehicle.manufacturer,
        model: context.vehicle.model,
        year: context.vehicle.year,
        part: context.part,
        details: { ...context.details },
      },
      pending_confirmation: context.pending_confirmation,
    };
    stage2 = evaluateConfirmation(userMessage, internalState);
  }

  if (!stage2) {
    return context;
  }

  const action = stage2.action;
  const field = stage2.field;
  const candidate = stage2.candidate;
  const resultState = stage2.state || {};
  const confirmedInResult = resultState.confirmed_entities || {};
  const unrecognizedTokens = resultState.unrecognized_tokens || [];

  // 1. Action: "none" (Greeting/noise) or "out_of_scope" -> Preserve context unchanged
  if (action === "none" || action === "out_of_scope") {
    return context;
  }

  // 2. Action: "accept" (Confirmed via 'yes' or High-Confidence match)
  if (action === "accept") {
    // Handle explicit single-field confirmation from previous pending
    if (field && candidate != null) {
      if (field === "manufacturer") {
        context.vehicle.manufacturer = String(candidate);
      } else if (field === "model") {
        context.vehicle.model = String(candidate);
      } else if (field === "year") {
        context.vehicle.year = Number(candidate);
      } else if (field === "part") {
        context.part = String(candidate);
      }
    }

    // Merge confirmed entities from Stage 2 state
    if (confirmedInResult.manufacturer !== undefined && confirmedInResult.manufacturer !== null) {
      context.vehicle.manufacturer = confirmedInResult.manufacturer;
    }
    if (confirmedInResult.model !== undefined && confirmedInResult.model !== null) {
      context.vehicle.model = confirmedInResult.model;
    }
    if (confirmedInResult.year !== undefined && confirmedInResult.year !== null) {
      context.vehicle.year = confirmedInResult.year;
    }
    if (confirmedInResult.part !== undefined && confirmedInResult.part !== null) {
      context.part = confirmedInResult.part;
    }
    if (confirmedInResult.details && typeof confirmedInResult.details === "object") {
      Object.assign(context.details, confirmedInResult.details);
    }

    // If incoming message contains unrecognized entity tokens where a vehicle make/model would be,
    // clear stale vehicle make & model
    if (
      unrecognizedTokens.length > 0 &&
      confirmedInResult.manufacturer == null &&
      confirmedInResult.model == null
    ) {
      context.vehicle.manufacturer = null;
      context.vehicle.model = null;
    }

    // Validate manufacturer and model compatibility
    const repo = getRepository();
    const currentMfg = context.vehicle.manufacturer;
    const currentMod = context.vehicle.model;
    if (currentMfg && currentMod) {
      if (!repo.isModelCompatible(currentMfg, currentMod)) {
        context.vehicle.model = null;
      }
    }

    context.pending_confirmation = resultState.pending_confirmation || null;
    return context;
  }

  // 3. Action: "confirm" (Candidate requires confirmation)
  if (action === "confirm") {
    if (confirmedInResult.manufacturer !== undefined && confirmedInResult.manufacturer !== null) {
      context.vehicle.manufacturer = confirmedInResult.manufacturer;
    }
    if (confirmedInResult.model !== undefined && confirmedInResult.model !== null) {
      context.vehicle.model = confirmedInResult.model;
    }
    if (confirmedInResult.year !== undefined && confirmedInResult.year !== null) {
      context.vehicle.year = confirmedInResult.year;
    }
    if (confirmedInResult.part !== undefined && confirmedInResult.part !== null) {
      context.part = confirmedInResult.part;
    }
    if (confirmedInResult.details && typeof confirmedInResult.details === "object") {
      Object.assign(context.details, confirmedInResult.details);
    }

    // Validate manufacturer and model compatibility
    const repo = getRepository();
    const currentMfg = context.vehicle.manufacturer;
    const currentMod = context.vehicle.model;
    if (currentMfg && currentMod) {
      if (!repo.isModelCompatible(currentMfg, currentMod)) {
        context.vehicle.model = null;
      }
    }

    context.pending_confirmation = resultState.pending_confirmation || null;
    return context;
  }

  // 4. Action: "request_input" (User rejected via 'no' or generic unfulfilled query)
  if (action === "request_input") {
    context.pending_confirmation = null;
    return context;
  }

  return context;
}
