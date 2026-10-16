/**
 * Confidence-based confirmation and correction engine for Tony Beta 3 (Stage 2).
 */

import { detectEntities } from "./detector";
import { normalizeText } from "./normalizer";
import { ConfirmationResult, ConfirmationState, DetectionResult } from "./types";

export const HIGH_CONFIDENCE_THRESHOLD = 0.90;
export const MEDIUM_CONFIDENCE_MIN = 0.75;

export const AFFIRMATIVE_RESPONSES: Set<string> = new Set([
  "yes",
  "yeah",
  "yep",
  "yup",
  "correct",
  "that's right",
  "thats right",
  "right",
  "sure",
  "y",
  "true",
  "exactly",
  "confirm",
  "confirmed",
]);

export const NEGATIVE_RESPONSES: Set<string> = new Set([
  "no",
  "nope",
  "nah",
  "wrong",
  "incorrect",
  "not really",
  "n",
  "negative",
  "cancel",
]);

export const GREETING_WORDS: Set<string> = new Set([
  "hello",
  "hi",
  "hey",
  "greetings",
  "good morning",
  "good afternoon",
  "good evening",
  "howdy",
  "thanks",
  "thank you",
  "thx",
  "ok",
  "okay",
  "cool",
  "great",
]);

export const OUT_OF_SCOPE_KEYWORDS: Set<string> = new Set([
  "weather", "joke", "jokes", "president", "news", "recipe", "crypto", "bitcoin",
  "stock", "stocks", "football", "basketball", "soccer", "music", "song", "movie",
  "movies", "game", "games", "who are you", "what can you do", "where do you live",
  "how old are you", "meaning of life", "chatgpt", "openai", "claude", "gemini",
  "translate", "write a poem", "python code", "tell me a story", "food", "restaurant",
  "pizza", "coffee", "temperature", "forecast", "rain", "sunny",
]);

export const OUT_OF_SCOPE_QUESTION_PREFIXES: string[] = [
  "what is ", "whats ", "what's ", "how is ", "hows ", "how's ",
  "tell me ", "who is ", "who was ", "when was ", "where is ", "why is ",
];

export function isOutOfScope(normalizedText: string): boolean {
  if (!normalizedText) return false;
  const words = normalizedText.split(" ");
  if (words.some((w) => OUT_OF_SCOPE_KEYWORDS.has(w))) {
    return true;
  }
  for (const kw of Array.from(OUT_OF_SCOPE_KEYWORDS)) {
    if (normalizedText.includes(kw)) {
      return true;
    }
  }
  for (const prefix of OUT_OF_SCOPE_QUESTION_PREFIXES) {
    if (
      normalizedText.startsWith(prefix) &&
      !["part", "car", "vehicle", "price", "bumper", "brake", "engine", "door", "light", "honda", "toyota", "ford", "bmw"].some((w) => normalizedText.includes(w))
    ) {
      return true;
    }
  }
  return false;
}

export function isAffirmative(normalizedText: string): boolean {
  return AFFIRMATIVE_RESPONSES.has(normalizedText);
}

export function isNegative(normalizedText: string): boolean {
  return NEGATIVE_RESPONSES.has(normalizedText);
}

export function createInitialConfirmationState(): ConfirmationState {
  return {
    confirmed_entities: {
      manufacturer: null,
      model: null,
      year: null,
      part: null,
      details: {},
    },
    pending_confirmation: null,
  };
}

export function evaluateConfirmation(
  message: string | null | undefined,
  currentState?: ConfirmationState | null,
  detectionResult?: DetectionResult | null
): ConfirmationResult {
  const rawMessage = message == null ? "" : String(message);
  const normalized = normalizeText(rawMessage);

  const state: ConfirmationState = {
    confirmed_entities: {
      manufacturer: null,
      model: null,
      year: null,
      part: null,
      details: {},
    },
    pending_confirmation: null,
  };

  if (currentState) {
    if (currentState.confirmed_entities && typeof currentState.confirmed_entities === "object") {
      state.confirmed_entities = { ...currentState.confirmed_entities };
    }
    if (currentState.pending_confirmation && typeof currentState.pending_confirmation === "object") {
      state.pending_confirmation = { ...currentState.pending_confirmation };
    }
  }

  const pending = state.pending_confirmation;

  // 1. Handle active pending confirmation
  if (pending && pending.field && pending.candidate != null) {
    const pendingField = pending.field as keyof typeof state.confirmed_entities;
    const pendingCandidate = pending.candidate;
    const pendingConfidence = Number(pending.confidence || 0.0);

    if (isAffirmative(normalized)) {
      (state.confirmed_entities as any)[pendingField] = pendingCandidate;
      state.pending_confirmation = null;
      return {
        action: "accept",
        field: pending.field,
        candidate: pendingCandidate,
        confidence: pendingConfidence,
        state,
      };
    }

    if (isNegative(normalized)) {
      (state.confirmed_entities as any)[pendingField] = null;
      state.pending_confirmation = null;
      return {
        action: "request_input",
        field: pending.field,
        candidate: null,
        confidence: 0.0,
        state,
      };
    }

    // User provided a correction or new input -> clear pending
    state.pending_confirmation = null;
  }

  // 2. Run Stage 1 entity detector if not pre-computed
  const detection = detectionResult || detectEntities(rawMessage);
  const entities = detection.entities || {};
  const confidence = detection.confidence || {};
  const unrecognizedTokens = entities.unrecognized_tokens || [];

  const mfg = entities.manufacturer;
  const mfgConf = confidence.manufacturer || 0.0;

  const model = entities.model;
  const modelConf = confidence.model || 0.0;

  const year = entities.year;
  const yearConf = confidence.year || 0.0;

  const part = entities.part;
  const partConf = confidence.part || 0.0;

  const details = entities.details || {};
  const detailsConf = confidence.details || 0.0;

  const hasAnyEntity = Boolean(mfg || model || year || part || Object.keys(details).length > 0);

  if (unrecognizedTokens.length > 0) {
    state.unrecognized_tokens = unrecognizedTokens;
    if (mfg === null && model === null) {
      state.confirmed_entities.manufacturer = null;
      state.confirmed_entities.model = null;
    }
  }

  // 3. Handle greetings / non-automotive input / out of scope queries
  if (!hasAnyEntity) {
    if (GREETING_WORDS.has(normalized)) {
      return {
        action: "none",
        field: null,
        candidate: null,
        confidence: 0.0,
        state,
      };
    }

    if (isOutOfScope(normalized)) {
      return {
        action: "out_of_scope",
        field: null,
        candidate: null,
        confidence: 0.0,
        state,
      };
    }

    return {
      action: "request_input",
      field: null,
      candidate: null,
      confidence: 0.0,
      state,
    };
  }

  // 4. Process high confidence entities (automatically accept >= 0.90)
  if (mfg && mfgConf >= HIGH_CONFIDENCE_THRESHOLD) {
    state.confirmed_entities.manufacturer = mfg;
  }
  if (model && modelConf >= HIGH_CONFIDENCE_THRESHOLD) {
    state.confirmed_entities.model = model;
  }
  if (year && yearConf >= HIGH_CONFIDENCE_THRESHOLD) {
    state.confirmed_entities.year = year;
  }
  if (part && partConf >= HIGH_CONFIDENCE_THRESHOLD) {
    state.confirmed_entities.part = part;
  }
  if (details && Object.keys(details).length > 0 && detailsConf >= HIGH_CONFIDENCE_THRESHOLD) {
    state.confirmed_entities.details = { ...details };
  }

  // 5. Check for medium confidence entities (0.75 - 0.89) requiring confirmation
  // Priority: manufacturer -> model -> part -> year
  const candidatesToConfirm: Array<[string, any, number]> = [];

  if (mfg && mfgConf >= MEDIUM_CONFIDENCE_MIN && mfgConf < HIGH_CONFIDENCE_THRESHOLD) {
    candidatesToConfirm.push(["manufacturer", mfg, mfgConf]);
  }
  if (model && modelConf >= MEDIUM_CONFIDENCE_MIN && modelConf < HIGH_CONFIDENCE_THRESHOLD) {
    candidatesToConfirm.push(["model", model, modelConf]);
  }
  if (part && partConf >= MEDIUM_CONFIDENCE_MIN && partConf < HIGH_CONFIDENCE_THRESHOLD) {
    candidatesToConfirm.push(["part", part, partConf]);
  }
  if (year && yearConf >= MEDIUM_CONFIDENCE_MIN && yearConf < HIGH_CONFIDENCE_THRESHOLD) {
    candidatesToConfirm.push(["year", year, yearConf]);
  }

  if (candidatesToConfirm.length > 0) {
    const [field, candidate, conf] = candidatesToConfirm[0];
    state.pending_confirmation = {
      field,
      candidate,
      confidence: conf,
    };
    return {
      action: "confirm",
      field,
      candidate,
      confidence: conf,
      state,
    };
  }

  // 6. All detected entities are High Confidence
  return {
    action: "accept",
    field: null,
    candidate: null,
    confidence: 1.0,
    state,
  };
}
