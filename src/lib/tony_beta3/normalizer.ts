/**
 * Text normalization layer for Tony Beta 3 entity detection.
 */

export function normalizeText(text: string | null | undefined): string {
  if (!text) {
    return "";
  }

  // Normalize unicode (decompose combined characters)
  let normalized = String(text).normalize("NFKD");

  // Convert to lowercase
  normalized = normalized.toLowerCase();

  // Replace punctuation and special characters with spaces
  // Keep alphanumeric characters, underscores, and hyphens
  normalized = normalized.replace(/[^\w\s-]/g, " ");

  // Replace hyphens surrounded by spaces with a space
  normalized = normalized.replace(/\s+-\s+/g, " ");

  // Remove leading/trailing hyphens
  normalized = normalized.replace(/^-+\s*|\s*-+$/g, " ");

  // Collapse repeated whitespace (tabs, newlines, multiple spaces) to a single space
  normalized = normalized.replace(/\s+/g, " ");

  // Strip leading/trailing spaces
  return normalized.trim();
}
