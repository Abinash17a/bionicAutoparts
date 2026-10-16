/**
 * Deterministic response engine for Tony Beta 3 (Stage 4).
 * Consumes Stage 3 context, selects appropriate response category, fetches templates,
 * interpolates variables, and returns structured reply.
 */

import { isValidName, isValidPhone, isValidZip } from "./customer_detector";
import { DEFAULT_RESPONSE_TEMPLATES } from "./database/default_catalog";
import { CatalogRepository, getRepository } from "./database/repository";
import { normalizeText } from "./normalizer";
import { ConfirmationResult, ConversationContext, ResponseOutput } from "./types";

export const GREETING_TRIGGERS: Set<string> = new Set([
  "hi",
  "hello",
  "hey",
  "greetings",
  "good morning",
  "good afternoon",
  "good evening",
  "howdy",
]);

export const THANKS_TRIGGERS: Set<string> = new Set([
  "thanks",
  "thank you",
  "thx",
  "thank u",
  "appreciate it",
  "many thanks",
]);

export const GOODBYE_TRIGGERS: Set<string> = new Set([
  "bye",
  "goodbye",
  "see you",
  "cya",
  "farewell",
  "have a good day",
  "have a nice day",
]);

export function buildVehicleString(
  mfg: string | null | undefined,
  model: string | null | undefined,
  year: number | string | null | undefined
): string {
  const parts: string[] = [];
  if (year) parts.push(String(year));
  if (mfg) parts.push(String(mfg));
  if (model) parts.push(String(model));
  return parts.join(" ").trim() || "vehicle";
}

export function buildDetailedPartString(
  part: string | null | undefined,
  details: Record<string, string> | null | undefined
): string {
  if (!part) return "";
  const basePart = String(part).trim();
  if (!details) return basePart;

  const side = (details.side || "").trim();
  const position = (details.position || "").trim();
  const color = (details.color || "").trim();

  const partTokens = new Set(basePart.toLowerCase().split(" "));
  const modifiers: string[] = [];

  if (side && !partTokens.has(side.toLowerCase())) {
    modifiers.push(side);
  }
  if (position && !partTokens.has(position.toLowerCase())) {
    modifiers.push(position);
  }
  if (color && !partTokens.has(color.toLowerCase())) {
    modifiers.push(color);
  }

  if (modifiers.length > 0) {
    return `${modifiers.join(" ")} ${basePart}`;
  }
  return basePart;
}

export function extractContextVariables(context: ConversationContext): Record<string, any> {
  const pending = context.pending_confirmation || ({} as any);
  const veh = context.vehicle || ({} as any);
  const mfg = veh.manufacturer || null;
  const model = veh.model || null;
  const year = veh.year != null ? veh.year : null;
  const part = context.part || null;
  const details = context.details || {};

  const vehicleStr = buildVehicleString(mfg, model, year);
  const detailedPart = buildDetailedPartString(part, details);

  return {
    candidate: pending.candidate || "",
    field: pending.field || "",
    manufacturer: mfg || "",
    model: model || "",
    year: year != null ? String(year) : "",
    part: part || "",
    detailed_part: detailedPart || part || "",
    side: details.side || "",
    position: details.position || "",
    color: details.color || "",
    vehicle: vehicleStr,
    name: context.customer?.name || "",
  };
}

export function determineResponseCategory(
  context: ConversationContext,
  userMessage?: string | null,
  stage2Result?: ConfirmationResult | null
): string {
  if (stage2Result && stage2Result.action === "out_of_scope") {
    return "OUT_OF_SCOPE";
  }

  const normMsg = normalizeText(userMessage || "");

  // 1. Active pending confirmation
  const pending = context.pending_confirmation;
  if (pending && pending.candidate) {
    return "CONFIRM";
  }

  // 2. Conversational Intent Triggers
  if (GREETING_TRIGGERS.has(normMsg)) {
    return "GREETING";
  }
  if (THANKS_TRIGGERS.has(normMsg)) {
    return "THANKS";
  }
  if (GOODBYE_TRIGGERS.has(normMsg)) {
    return "GOODBYE";
  }

  const veh = context.vehicle || ({} as any);
  const mfg = veh.manufacturer;
  const model = veh.model;
  const year = veh.year;
  const part = context.part;
  const customer = context.customer;

  // 3. Vehicle + part known: complete ONLY when customer name, phone and ZIP are also valid
  if (mfg && model && year && part) {
    if (!isValidName(customer?.name)) return "ASK_NAME";
    if (!isValidPhone(customer?.phone)) return "ASK_PHONE";
    if (!isValidZip(customer?.zip)) return "ASK_ZIP";
    return "REQUEST_COMPLETE";
  }

  // 4. Have make + model, missing year (year is collected before part)
  if (mfg && model && !year) {
    return "ASK_YEAR";
  }

  // 5. Have make + model, missing part
  if (mfg && model && !part) {
    return "ASK_PART";
  }

  // 6. Have make, missing model
  if (mfg && !model) {
    return "ASK_MODEL";
  }

  // 7. Have model, missing make
  if (!mfg && model) {
    return "ASK_MAKE";
  }

  // 8. Have part or year, missing vehicle make & model
  if (!mfg && !model && (part || year)) {
    return "ASK_VEHICLE";
  }

  // 9. Unfulfilled / empty context (customer info alone still needs the vehicle)
  if (!mfg && !model && !year && !part) {
    return customer?.name || customer?.phone || customer?.zip ? "ASK_VEHICLE" : "NOT_FOUND";
  }

  return "ASK_VEHICLE";
}

export function fetchTemplates(category: string, repository?: CatalogRepository | null): any[] {
  const repo = repository || getRepository();
  let templates = repo.getResponseTemplates(category);
  if (!templates || templates.length === 0) {
    // Remote template tables may predate newer categories (e.g. ASK_NAME); use the bundled ones.
    templates = DEFAULT_RESPONSE_TEMPLATES.filter((t) => t.category === category);
  }
  if (!templates || templates.length === 0) {
    templates = repo.getResponseTemplates("NOT_FOUND");
  }
  return templates && templates.length > 0
    ? templates
    : [{ id: "fallback", category, template_text: "How can I help with your vehicle parts search?" }];
}

export function chooseTemplate(templates: any[], seed?: number | null): any {
  if (!templates || templates.length === 0) {
    return { id: "default", template_text: "" };
  }
  if (seed !== undefined && seed !== null) {
    const idx = Math.abs(seed) % templates.length;
    return templates[idx];
  }
  const idx = Math.floor(Math.random() * templates.length);
  return templates[idx];
}

export function fillVariables(templateText: string, variables: Record<string, any>): string {
  let rendered = templateText;

  // Pre-clean "a {part}" if part is empty
  if (!variables.part) {
    rendered = rendered.replace("a {part} for", "parts for");
    rendered = rendered.replace("a {part}", "parts");
  }

  // If template contains {part} but does NOT contain explicit {side}/{position}/{color},
  // use detailed_part for {part}
  const hasExplicitDetails = ["{side}", "{position}", "{color}"].some((ph) => rendered.includes(ph));
  const partToUse = hasExplicitDetails
    ? variables.part || ""
    : variables.detailed_part || variables.part || "";

  const substitutions: Record<string, any> = { ...variables, part: partToUse };

  for (const [key, val] of Object.entries(substitutions)) {
    const placeholder = `{${key}}`;
    rendered = rendered.split(placeholder).join(String(val));
  }

  // Clean up grammar artifacts
  rendered = rendered.replace(/\b(a|an)\s+for\b/gi, "parts for");
  rendered = rendered.replace(/\b(a|an)\s+\./gi, ".");
  rendered = rendered.replace(/\s+/g, " ");
  return rendered.trim();
}

export function generateResponse(
  context: ConversationContext,
  userMessage?: string | null,
  stage2Result?: ConfirmationResult | null,
  repository?: CatalogRepository | null,
  seed?: number | null,
  categoryOverride?: string | null
): ResponseOutput {
  const repo = repository || getRepository();

  // 1. Determine response category
  const category = categoryOverride || determineResponseCategory(context, userMessage, stage2Result);

  // 2. Extract context variables
  const variables = extractContextVariables(context);

  // 3. Fetch matching templates
  const templates = fetchTemplates(category, repo);

  // 4. Choose response template
  const chosenTpl = chooseTemplate(templates, seed);
  const tplId = chosenTpl.id || "default";
  const tplText = chosenTpl.template_text || "";

  // 5. Fill variables
  const reply = fillVariables(tplText, variables);

  return {
    category,
    template_id: tplId,
    reply,
  };
}

export const generateReply = generateResponse;
