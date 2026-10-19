/**
 * Country-aware phone / postal-code rules shared by the chat contact form (client)
 * and the Tony Beta 3 customer detector (server). Pure, dependency-free.
 */

export interface ContactCountry {
  iso: string;
  name: string;
  flag: string;
  dial: string; // calling code without "+"
  national: RegExp; // national significant number (digits only, no trunk prefix)
  trunk0: boolean; // national dialling prefix "0" is not part of the international number
  postal: RegExp; // case-insensitive
  postalExample: string;
}

// ponytail: national-number rules are length/leading-digit checks, not a full libphonenumber
// numbering plan. Upgrade path: libphonenumber-js if per-range validation is needed.
export const CONTACT_COUNTRIES: ContactCountry[] = [
  { iso: "US", name: "United States", flag: "≡ƒç║≡ƒç╕", dial: "1", national: /^[2-9]\d{2}[2-9]\d{6}$/, trunk0: false, postal: /^\d{5}(-\d{4})?$/, postalExample: "90210 or 90210-1234" },
  { iso: "CA", name: "Canada", flag: "≡ƒç¿≡ƒçª", dial: "1", national: /^[2-9]\d{2}[2-9]\d{6}$/, trunk0: false, postal: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i, postalExample: "K1A 0B1" },
  { iso: "IN", name: "India", flag: "≡ƒç«≡ƒç│", dial: "91", national: /^[6-9]\d{9}$/, trunk0: true, postal: /^[1-9]\d{5}$/, postalExample: "411001" },
  { iso: "GB", name: "United Kingdom", flag: "≡ƒç¼≡ƒçº", dial: "44", national: /^[1-9]\d{8,9}$/, trunk0: true, postal: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, postalExample: "SW1A 1AA" },
  { iso: "AU", name: "Australia", flag: "≡ƒçª≡ƒç║", dial: "61", national: /^[2-578]\d{8}$/, trunk0: true, postal: /^\d{4}$/, postalExample: "2000" },
  { iso: "MX", name: "Mexico", flag: "≡ƒç▓≡ƒç╜", dial: "52", national: /^[1-9]\d{9}$/, trunk0: false, postal: /^\d{5}$/, postalExample: "06000" },
  { iso: "DE", name: "Germany", flag: "≡ƒç⌐≡ƒç¬", dial: "49", national: /^[1-9]\d{9,10}$/, trunk0: true, postal: /^\d{5}$/, postalExample: "10115" },
  { iso: "FR", name: "France", flag: "≡ƒç½≡ƒç╖", dial: "33", national: /^[1-9]\d{8}$/, trunk0: true, postal: /^\d{5}$/, postalExample: "75001" },
  { iso: "AE", name: "UAE", flag: "≡ƒçª≡ƒç¬", dial: "971", national: /^[2-9]\d{8}$/, trunk0: true, postal: /^[A-Z0-9][A-Z0-9 -]{1,9}$/i, postalExample: "00000 (UAE has no postal codes)" },
  { iso: "SG", name: "Singapore", flag: "≡ƒç╕≡ƒç¼", dial: "65", national: /^[3689]\d{7}$/, trunk0: false, postal: /^\d{6}$/, postalExample: "238823" },
  { iso: "JP", name: "Japan", flag: "≡ƒç»≡ƒç╡", dial: "81", national: /^[1-9]\d{9}$/, trunk0: true, postal: /^\d{3}-?\d{4}$/, postalExample: "100-0001" },
  { iso: "ES", name: "Spain", flag: "≡ƒç¬≡ƒç╕", dial: "34", national: /^[5-9]\d{8}$/, trunk0: false, postal: /^\d{5}$/, postalExample: "28001" },
  { iso: "IT", name: "Italy", flag: "≡ƒç«≡ƒç╣", dial: "39", national: /^\d{9,10}$/, trunk0: false, postal: /^\d{5}$/, postalExample: "00100" }, // Italian landlines keep their leading 0
  { iso: "BR", name: "Brazil", flag: "≡ƒçº≡ƒç╖", dial: "55", national: /^[1-9]\d{9,10}$/, trunk0: false, postal: /^\d{5}-?\d{3}$/, postalExample: "01310-100" },
  { iso: "ZA", name: "South Africa", flag: "≡ƒç┐≡ƒçª", dial: "27", national: /^[1-9]\d{8}$/, trunk0: true, postal: /^\d{4}$/, postalExample: "0001" },
];

export const getCountry = (iso: string) => CONTACT_COUNTRIES.find((c) => c.iso === iso);

/**
 * Detects if a digit string starts with a known country dial code.
 * Sorted by dial code length descending so +971 (UAE) matches before +9.
 */
export function findCountryByDialDigits(digits: string): ContactCountry | undefined {
  const sorted = [...CONTACT_COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  return sorted.find((c) => digits.startsWith(c.dial));
}

/**
 * Detects the user's country from browser timezone or locale.
 * Defaults to "US" if unable to detect or on server.
 */
export function detectDefaultCountry(): string {
  if (typeof window === "undefined") return "US";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return "IN";
    if (tz.startsWith("Europe/London")) return "GB";
    if (tz.startsWith("Australia/")) return "AU";
    if (tz.startsWith("Canada/")) return "CA";
    if (tz.startsWith("Europe/Paris")) return "FR";
    if (tz.startsWith("Europe/Berlin")) return "DE";
    if (tz.startsWith("Asia/Dubai")) return "AE";
    if (tz.startsWith("Asia/Singapore")) return "SG";
    if (tz.startsWith("Asia/Tokyo")) return "JP";
    if (tz.startsWith("Europe/Madrid")) return "ES";
    if (tz.startsWith("Europe/Rome")) return "IT";
    if (tz.startsWith("America/Sao_Paulo")) return "BR";
    if (tz.startsWith("Africa/Johannesburg")) return "ZA";
    if (tz.startsWith("America/Mexico_City")) return "MX";

    const lang = (navigator.language || "").toLowerCase();
    if (lang.includes("-in")) return "IN";
    if (lang.includes("-gb")) return "GB";
    if (lang.includes("-ca")) return "CA";
    if (lang.includes("-au")) return "AU";
  } catch {
    void 0;
  }
  return "US";
}

export type Checked = { ok: true; value: string } | { ok: false; error: string };

/** Returns E.164 (e.g. "+16175551234"). Accepts national or international input without duplicating the code. */
export function normalizePhone(iso: string, input: string): Checked {
  const c = getCountry(iso);
  if (!c) return { ok: false, error: "Please select a country." };
  const raw = input.trim();
  let d = raw.replace(/\D/g, "");
  if (!d) return { ok: false, error: "Please enter your phone number." };
  if (/^[^\d]*\+/.test(raw) || d.startsWith("00")) {
    d = d.startsWith("00") && !raw.includes("+") ? d.slice(2) : d;
    if (!d.startsWith(c.dial)) {
      const other = findCountryByDialDigits(d);
      if (other) {
        return {
          ok: false,
          error: `That number starts with +${other.dial} (${other.name}). Please select ${other.name} from the country dropdown.`,
        };
      }
      return { ok: false, error: `That number doesn't start with +${c.dial}. Pick the matching country.` };
    }
    d = d.slice(c.dial.length);
  } else if (c.trunk0 && d.startsWith("0")) {
    d = d.slice(1);
  } else if (d.startsWith(c.dial) && !c.national.test(d) && c.national.test(d.slice(c.dial.length))) {
    d = d.slice(c.dial.length); // e.g. "917..." or "1617..." typed with the code but no "+"
  } else {
    // Check if the user entered another country's dial code without '+' (e.g. typed 919011657373 while US selected)
    const other = findCountryByDialDigits(d);
    if (other && other.iso !== c.iso && other.national.test(d.slice(other.dial.length))) {
      return {
        ok: false,
        error: `That looks like a ${other.name} (+${other.dial}) number. Please select ${other.name} from the country dropdown.`,
      };
    }
  }
  if (c.trunk0 && d.startsWith("0")) d = d.slice(1); // "+44 (0)20..." style
  if (!c.national.test(d)) {
    if (c.iso === "US" && d.length === 10 && /^[6-9]\d{9}$/.test(d)) {
      return {
        ok: false,
        error: `That looks like an India phone number. Please select India (≡ƒç«≡ƒç│ +91) from the country dropdown.`,
      };
    }
    return { ok: false, error: `Enter a valid ${c.name} phone number (without the +${c.dial} code).` };
  }
  return { ok: true, value: `+${c.dial}${d}` };
}

/** Returns the postal code as a normalized string (never a number). */
export function normalizePostal(iso: string, input: string): Checked {
  const c = getCountry(iso);
  if (!c) return { ok: false, error: "Please select a country." };
  let v = input.trim().replace(/\s+/g, " ");
  if (!c.postal.test(v)) return { ok: false, error: `Enter a valid ${c.name} postal code (e.g. ${c.postalExample}).` };
  if (iso === "CA" || iso === "GB") v = v.toUpperCase();
  if (iso === "CA" || iso === "GB") v = v.replace(/^(\S+?)\s?(\S{3})$/, "$1 $2");
  return { ok: true, value: v };
}

/** Any supported country's postal format (used where the country isn't carried in the stored value). */
export const isAnyValidPostal = (v: string) => CONTACT_COUNTRIES.some((c) => c.postal.test(v.trim()));

export const isE164 = (v: string) => /^\+[1-9]\d{7,14}$/.test(v);

/** Single-line message the contact form sends through the normal chat flow. */
export function formatContactMessage(iso: string, phoneE164: string, postal: string) {
  const c = getCountry(iso)!;
  return `+${c.dial} ${phoneE164.slice(c.dial.length + 1)}, ZIP: ${postal} [${iso}]`;
}

const CONTACT_MESSAGE_RE = /^\s*(\+\d{1,3}) (\d{4,14}), ZIP: (.+?) \[([A-Z]{2})\]\s*$/;

/** Parses and re-validates a formatContactMessage() string; null when it isn't one or fails validation. */
export function parseContactMessage(msg: string): { phone: string; zip: string } | null {
  const m = msg.match(CONTACT_MESSAGE_RE);
  const c = m && getCountry(m[4]);
  if (!m || !c || m[1] !== `+${c.dial}`) return null;
  const phone = normalizePhone(c.iso, `${m[1]}${m[2]}`);
  const zip = normalizePostal(c.iso, m[3]);
  return phone.ok && zip.ok ? { phone: phone.value, zip: zip.value } : null;
}
