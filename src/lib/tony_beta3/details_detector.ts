/**
 * Deterministic detection of auxiliary part details (side, position, color).
 */

export interface DetailsDetectionResult {
  value: Record<string, string>;
  confidence: number;
}

export const SIDE_MAP: Record<string, string> = {
  left: "left",
  lh: "left",
  "left hand": "left",
  "left side": "left",
  driver: "driver",
  "driver side": "driver",
  "drivers side": "driver",
  right: "right",
  rh: "right",
  "right hand": "right",
  "right side": "right",
  passenger: "passenger",
  "passenger side": "passenger",
  "passengers side": "passenger",
};

export const POSITION_MAP: Record<string, string> = {
  front: "front",
  rear: "rear",
  back: "rear",
  upper: "upper",
  top: "upper",
  lower: "lower",
  bottom: "lower",
  inner: "inner",
  inside: "inner",
  outer: "outer",
  outside: "outer",
  center: "center",
  middle: "center",
};

export const COLORS: Set<string> = new Set([
  "black",
  "white",
  "silver",
  "grey",
  "gray",
  "red",
  "blue",
  "green",
  "yellow",
  "gold",
  "brown",
  "orange",
  "maroon",
  "navy",
  "beige",
  "tan",
  "charcoal",
  "burgundy",
  "dark blue",
  "dark grey",
  "dark gray",
  "light blue",
]);

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function detectDetails(text: string | null | undefined): DetailsDetectionResult {
  if (!text) {
    return { value: {}, confidence: 0.0 };
  }

  const lowered = ` ${text.toLowerCase()} `;
  const detected: Record<string, string> = {};

  // 1. Detect side (check longest phrases first)
  const sideEntries = Object.entries(SIDE_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [phrase, canonical] of sideEntries) {
    const regex = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "i");
    if (regex.test(lowered)) {
      detected.side = canonical;
      break;
    }
  }

  // 2. Detect position
  const positionEntries = Object.entries(POSITION_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [phrase, canonical] of positionEntries) {
    const regex = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "i");
    if (regex.test(lowered)) {
      detected.position = canonical;
      break;
    }
  }

  // 3. Detect color
  const colorList = Array.from(COLORS).sort((a, b) => b.length - a.length);
  for (const color of colorList) {
    const regex = new RegExp(`\\b${escapeRegExp(color)}\\b`, "i");
    if (regex.test(lowered)) {
      detected.color = color;
      break;
    }
  }

  if (Object.keys(detected).length > 0) {
    return { value: detected, confidence: 1.0 };
  }

  return { value: {}, confidence: 0.0 };
}
