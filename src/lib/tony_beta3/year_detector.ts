/**
 * Deterministic year detection module for vehicle queries.
 */

export const MIN_VALID_YEAR = 1990;
export const MAX_VALID_YEAR = 2026;

export interface YearDetectionResult {
  value: number | null;
  confidence: number;
}

export function detectYear(text: string | null | undefined): YearDetectionResult {
  if (!text) {
    return { value: null, confidence: 0.0 };
  }

  // Search for standalone 4-digit years bounded by word boundaries
  const matches = text.match(/\b(\d{4})\b/g);
  if (matches) {
    for (const match of matches) {
      const year = parseInt(match, 10);
      if (year >= MIN_VALID_YEAR && year <= MAX_VALID_YEAR) {
        return { value: year, confidence: 1.0 };
      }
    }
  }

  return { value: null, confidence: 0.0 };
}
