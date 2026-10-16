/**
 * Deterministic detection of customer contact fields (name, phone, ZIP) for Tony Beta 3.
 * Values returned here are already validated/normalized; anything invalid is returned as null.
 */

import { detectEntities, STOP_WORDS } from "./detector";
import { CustomerContext } from "./types";

// Phone format candidate regex:
// Optional leading '+' and country code (1-3 digits), optional area code, and main number segments.
const PHONE_CANDIDATE_RE = /(?<!\w|\+)(?:\+\d{1,3}[\s.-]*)?(?:\(?\d{1,5}\)?[\s.-]*)?\d{3,5}[\s.-]*\d{3,5}(?:[\s.-]*\d{1,5})?(?!\w|\d)/g;
const ZIP_RE = /(?<!\d)(\d{6})(?!\d)/;
const EXPLICIT_NAME_RE = /\b(?:my name is|my name's|name is|i am|i'm|im|this is|call me)\s+([a-z][a-z' -]*)/i;

// Words that can never be (part of) a customer name.
const NOT_NAME = new Set([
  "yes", "yeah", "yep", "sure", "nope", "nah", "not", "dont", "don't", "idk", "know", "skip", "pass", "none",
  "later", "rather", "looking", "searching", "trying", "interested", "calling", "here", "fine", "good",
  "great", "cool", "phone", "number", "zip", "code", "zipcode", "name", "cell", "mobile", "call", "text",
  "but", "so", "at", "be", "am", "are", "was", "will", "would", "from", "this", "there", "if", "by",
]);

/**
 * Validates whether a given string contains exactly 10 or 11 numeric digits.
 */
export function isValidPhone(v: unknown): v is string {
  if (typeof v !== "string" || !v.trim()) return false;
  const clean = v.trim();
  return /^\d{10,11}$/.test(clean);
}

export function isValidZip(v: unknown): v is string {
  return typeof v === "string" && /^\d{6}$/.test(v.trim());
}

export function isValidName(v: unknown): v is string {
  return typeof v === "string" && v.replace(/[^a-z]/gi, "").length >= 2;
}

export function isCustomerComplete(c: CustomerContext | null | undefined): boolean {
  return Boolean(c && isValidName(c.name) && isValidPhone(c.phone) && isValidZip(c.zip));
}

/** Keep leading name-like words, stop at the first word that can't be part of a name. */
function cleanName(candidate: string): string | null {
  const words: string[] = [];
  for (const w of candidate.trim().split(/\s+/)) {
    const lw = w.toLowerCase();
    if (!/^[a-z][a-z'-]*$/i.test(w) || STOP_WORDS.has(lw) || NOT_NAME.has(lw) || words.length === 3) break;
    words.push(w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }
  const name = words.join(" ");
  if (!isValidName(name)) return null;
  // A vehicle/part answer is not a name (e.g. "Silverado").
  const { entities } = detectEntities(name);
  if (entities.manufacturer || entities.model || entities.part) return null;
  return name;
}

/**
 * Extracts and normalizes phone number candidates from text.
 * The national phone number must contain EXACTLY 10 or 11 digits.
 * Country code prefixes (e.g. +91, +1, +44) are separated and not counted toward the 10/11-digit requirement.
 * Returns normalized 10 or 11-digit national number string (e.g. "9011657373", "16175551234").
 */
export function extractAndNormalizePhone(text: string): { raw: string; normalized: string } | null {
  if (!text) return null;
  const matches = [...text.matchAll(PHONE_CANDIDATE_RE)];
  for (const m of matches) {
    const rawMatch = m[0].trim();
    if (!rawMatch) continue;

    let nationalDigits = "";

    if (rawMatch.startsWith("+")) {
      // Explicit separator after country code (e.g., "+91 9011657373", "+1-617-555-1234", "+44 20 7946 0991")
      const separatedMatch = rawMatch.match(/^\+(\d{1,3})[\s.-]+(.*)$/);
      if (separatedMatch) {
        nationalDigits = separatedMatch[2].replace(/\D/g, "");
      } else {
        // No separator after + (e.g., "+919011657373", "+16175551234", "+971501234567")
        const allDigits = rawMatch.slice(1).replace(/\D/g, "");
        if (allDigits.length === 11) {
          // 1-digit country code (+1 + 10 digits) -> 10 digits, or 11-digit national
          nationalDigits = allDigits.startsWith("1") ? allDigits.slice(1) : allDigits;
        } else if (allDigits.length === 12) {
          // 2-digit country code (+91, +44 + 10 digits) -> 10 digits
          nationalDigits = allDigits.slice(2);
        } else if (allDigits.length === 13) {
          // 3-digit country code (+971 + 10 digits) or 2-digit (+91 + 11 digits)
          nationalDigits = allDigits.slice(2).length === 11 ? allDigits.slice(2) : allDigits.slice(3);
        } else if (allDigits.length === 10) {
          nationalDigits = allDigits;
        } else {
          continue;
        }
      }
    } else {
      // Bare number without '+' prefix (e.g. "9011657373", "16175551234", "90116573730")
      nationalDigits = rawMatch.replace(/\D/g, "");
    }

    if (nationalDigits.length === 10 || nationalDigits.length === 11) {
      return { raw: rawMatch, normalized: nationalDigits };
    }
  }
  return null;
}

export interface CustomerDetection {
  customer: CustomerContext;
  /** Message with detected contact info removed, safe to feed into vehicle/part detection. */
  remaining: string;
}

/**
 * @param askingForName true when Tony's pending question is the customer name, so a bare
 *   reply like "John" is accepted.
 */
export function detectCustomer(message: string, askingForName = false): CustomerDetection {
  let remaining = message;
  const customer: CustomerContext = { name: null, phone: null, zip: null };

  const phoneExtraction = extractAndNormalizePhone(remaining);
  if (phoneExtraction && isValidPhone(phoneExtraction.normalized)) {
    customer.phone = phoneExtraction.normalized;
    remaining = remaining.replace(phoneExtraction.raw, " ");
  }

  const zip = remaining.match(ZIP_RE);
  if (zip && isValidZip(zip[0])) {
    customer.zip = zip[0];
    remaining = remaining.replace(zip[0], " ");
  }

  // ponytail: heuristic name extraction (explicit phrase, bare answer to the name question,
  // or the leading words before contact info). Upgrade path: NER if names get misread.
  const explicit = remaining.match(EXPLICIT_NAME_RE);
  let candidate: string | null = null;
  let source = "";
  if (explicit) {
    candidate = explicit[1];
    source = explicit[0];
  } else if (askingForName) {
    candidate = remaining.replace(/[^a-z' -]/gi, " ");
    source = remaining;
  } else if (customer.phone || customer.zip) {
    candidate = remaining.split(/[,.;:\n]/)[0];
    source = candidate;
  }
  if (candidate) {
    const name = cleanName(candidate);
    if (name) {
      customer.name = name;
      const idx = remaining.toLowerCase().indexOf(name.toLowerCase(), remaining.indexOf(source));
      if (idx >= 0) remaining = remaining.slice(0, idx) + " " + remaining.slice(idx + name.length);
    }
  }

  // Contact keywords would otherwise surface as unrecognized tokens and clear make/model in Stage 2.
  remaining = remaining.replace(/\bzip\s*code\b|\b(?:phone|number|zip|zipcode|postal|cell|mobile|name)\b/gi, " ");

  return { customer, remaining };
}
