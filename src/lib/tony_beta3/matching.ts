/**
 * High-performance fuzzy and exact matching algorithms for automotive entities.
 */

export interface MatchCandidate {
  entity: any;
  canonical_name: string;
  matched_text: string;
  score: number;
  span: [number, number]; // [token_start_idx, token_end_idx]
}

export function levenshteinDistanceFast(s1: string, s2: string, maxDist: number = 2): number {
  let len1 = s1.length;
  let len2 = s2.length;
  if (s1 === s2) return 0;
  if (Math.abs(len1 - len2) > maxDist) return maxDist + 1;

  // Ensure s1 is the shorter string
  if (len1 > len2) {
    const tempS = s1;
    s1 = s2;
    s2 = tempS;
    const tempL = len1;
    len1 = len2;
    len2 = tempL;
  }

  let currentRow = Array.from({ length: len1 + 1 }, (_, i) => i);

  for (let i = 1; i <= len2; i++) {
    const ch2 = s2[i - 1];
    const previousRow = currentRow;
    currentRow = [i, ...new Array(len1).fill(0)];
    let minInRow = currentRow[0];

    for (let j = 1; j <= len1; j++) {
      const ch1 = s1[j - 1];
      const cost = ch1 === ch2 ? 0 : 1;
      currentRow[j] = Math.min(
        previousRow[j] + 1, // deletion
        currentRow[j - 1] + 1, // insertion
        previousRow[j - 1] + cost // substitution
      );
      if (currentRow[j] < minInRow) {
        minInRow = currentRow[j];
      }
    }

    if (minInRow > maxDist) {
      return maxDist + 1;
    }
  }

  return currentRow[len1];
}

export function levenshteinDistance(s1: string, s2: string): number {
  return levenshteinDistanceFast(s1, s2, Math.max(s1.length, s2.length));
}

export function computeStringSimilarity(query: string, target: string): number {
  const q = query.trim().toLowerCase();
  const t = target.trim().toLowerCase();

  if (q === t) return 1.0;

  const lenQ = q.length;
  const lenT = t.length;
  const minLen = Math.min(lenQ, lenT);
  const maxLen = Math.max(lenQ, lenT);

  // Do not fuzzy match very short tokens (<= 3 chars)
  if (minLen <= 3) return 0.0;
  if (Math.abs(lenQ - lenT) > 2) return 0.0;

  // For words of length 4-5, only allow max 1 edit
  const maxAllowedDist = minLen <= 5 ? 1 : 2;
  const dist = levenshteinDistanceFast(q, t, maxAllowedDist);

  if (dist > maxAllowedDist) return 0.0;

  if (dist === 1) {
    if (maxLen <= 5) return 0.88;
    if (maxLen <= 7) return 0.92;
    return 0.94;
  } else if (dist === 2 && minLen >= 6) {
    if (maxLen <= 8) return 0.78;
    return 0.82;
  }

  return 0.0;
}

export function findBestCandidateInIndex(
  tokens: string[],
  indexedCatalog: any,
  minConfidence: number = 0.75,
  maxNgram: number = 3
): MatchCandidate | null {
  if (!tokens || tokens.length === 0 || !indexedCatalog) {
    return null;
  }

  const numTokens = tokens.length;
  const exactMap = indexedCatalog.exact_map || indexedCatalog.exactMap;
  const byLength = indexedCatalog.by_length || indexedCatalog.byLength;
  const canonicalKey = indexedCatalog.canonical_key || indexedCatalog.canonicalKey || "name";
  const nameKey = indexedCatalog.name_key || indexedCatalog.nameKey || "name";

  // 1. First pass: Exact matches across n-grams (prefer longer n-grams)
  for (let n = Math.min(maxNgram, numTokens); n > 0; n--) {
    for (let i = 0; i <= numTokens - n; i++) {
      const windowStr = tokens.slice(i, i + n).join(" ").trim().toLowerCase();
      if (exactMap && exactMap[windowStr]) {
        const item = exactMap[windowStr];
        const canonicalName = item[canonicalKey] || item[nameKey] || "";
        return {
          entity: item,
          canonical_name: canonicalName,
          matched_text: windowStr,
          score: 1.0,
          span: [i, i + n],
        };
      }
    }
  }

  // 2. Second pass: Fast fuzzy matching on length-compatible items
  let bestCandidate: MatchCandidate | null = null;
  let bestScore = 0.0;
  let bestNgramLen = 0;

  for (let n = Math.min(maxNgram, numTokens); n > 0; n--) {
    for (let i = 0; i <= numTokens - n; i++) {
      const windowStr = tokens.slice(i, i + n).join(" ").trim().toLowerCase();
      const lenWindow = windowStr.length;
      if (lenWindow <= 3) continue;

      for (let targetLen = lenWindow - 2; targetLen <= lenWindow + 2; targetLen++) {
        const targets = byLength ? byLength[targetLen] || [] : [];
        for (const [loweredTarget, canonicalTarget, item] of targets) {
          const score = computeStringSimilarity(windowStr, loweredTarget);
          if (score >= minConfidence) {
            let isBetter = false;
            if (score > bestScore + 0.05) {
              isBetter = true;
            } else if (Math.abs(score - bestScore) <= 0.05 && n > bestNgramLen) {
              isBetter = true;
            } else if (score > bestScore) {
              isBetter = true;
            }

            if (isBetter) {
              bestScore = score;
              bestNgramLen = n;
              bestCandidate = {
                entity: item,
                canonical_name: canonicalTarget,
                matched_text: windowStr,
                score,
                span: [i, i + n],
              };
            }
          }
        }
      }
    }
  }

  return bestCandidate;
}
