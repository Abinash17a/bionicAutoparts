/**
 * Main entity detection orchestrator for Tony Beta 3 (Stage 1).
 */

import { CatalogRepository, getRepository } from "./database/repository";
import { COLORS, detectDetails, POSITION_MAP, SIDE_MAP } from "./details_detector";
import { findBestCandidateInIndex } from "./matching";
import { normalizeText } from "./normalizer";
import { DetectionResult } from "./types";
import { detectYear } from "./year_detector";

export const MIN_ACCEPTABLE_CONFIDENCE = 0.75;

export const STOP_WORDS: Set<string> = new Set([
  "i", "need", "a", "an", "the", "for", "my", "me", "car", "auto", "vehicle", "cars",
  "please", "can", "you", "find", "get", "looking", "want", "have", "of", "to", "is",
  "it", "with", "and", "or", "in", "on", "some", "any", "give", "actually", "no",
  "wait", "make", "that", "sorry", "its", "change", "hello", "hi", "hey", "thanks",
  "thank", "ok", "okay", "bye", "goodbye", "do", "does", "what", "whats", "how",
  "hows", "where", "who", "why", "tell", "searching", "check", "got", "just", "like",
  "s", "re", "ve", "t", "d", "ll", "m", "side", "hand", "view", "part", "parts",
  "model", "make", "year", "type", "piece",
]);

export function detectEntities(
  message: string | null | undefined,
  repository?: CatalogRepository | null
): DetectionResult {
  const rawMessage = message == null ? "" : String(message);
  const normalized = normalizeText(rawMessage);
  const tokens = normalized ? normalized.split(" ") : [];

  const repo = repository || getRepository();
  const matchedIndices: Set<number> = new Set();

  // 1. Year detection (deterministic)
  const yearResult = detectYear(normalized);
  const yearVal = yearResult.value;
  const yearConf = yearResult.confidence;
  if (yearVal !== null) {
    tokens.forEach((tok, idx) => {
      if (/^\d{4}$/.test(tok) && parseInt(tok, 10) === yearVal) {
        matchedIndices.add(idx);
      }
    });
  }

  // 2. Details detection (side, position, color)
  const detailsResult = detectDetails(normalized);
  const detailsVal = detailsResult.value;
  const detailsConf = detailsResult.confidence;
  if (Object.keys(detailsVal).length > 0) {
    tokens.forEach((tok, idx) => {
      const isSide = Object.keys(SIDE_MAP).some((phrase) => phrase.split(" ").includes(tok));
      const isPos = Object.keys(POSITION_MAP).some((phrase) => phrase.split(" ").includes(tok));
      const isColor = COLORS.has(tok);
      if (isSide || isPos || isColor) {
        matchedIndices.add(idx);
      }
    });
  }

  // 3. Manufacturer detection (exact + fuzzy against Supabase catalog)
  let mfgVal: string | null = null;
  let mfgConf: number = 0.0;
  let detectedMfgId: string | null = null;
  let mfgCandidate: any = null;

  if (tokens.length > 0 && repo.indexed_manufacturers) {
    mfgCandidate = findBestCandidateInIndex(
      tokens,
      repo.indexed_manufacturers,
      MIN_ACCEPTABLE_CONFIDENCE,
      2
    );
    if (mfgCandidate) {
      mfgVal = mfgCandidate.canonical_name;
      mfgConf = mfgCandidate.score;
      detectedMfgId = mfgCandidate.entity ? mfgCandidate.entity.id : null;
      for (let i = mfgCandidate.span[0]; i < mfgCandidate.span[1]; i++) {
        matchedIndices.add(i);
      }
    }
  }

  // 4. Model detection (exact + fuzzy against Supabase catalog)
  let modelVal: string | null = null;
  let modelConf: number = 0.0;
  let modelCandidate: any = null;

  if (tokens.length > 0) {
    if (detectedMfgId && repo.indexed_models_by_mfg_id[detectedMfgId]) {
      const mfgModelsIndexed = repo.indexed_models_by_mfg_id[detectedMfgId];
      modelCandidate = findBestCandidateInIndex(
        tokens,
        mfgModelsIndexed,
        MIN_ACCEPTABLE_CONFIDENCE,
        3
      );
    }

    // Fallback to global model search if not found within manufacturer
    if (!modelCandidate && repo.indexed_all_models) {
      modelCandidate = findBestCandidateInIndex(
        tokens,
        repo.indexed_all_models,
        MIN_ACCEPTABLE_CONFIDENCE,
        3
      );
    }

    if (modelCandidate) {
      modelVal = modelCandidate.canonical_name;
      modelConf = modelCandidate.score;
      for (let i = modelCandidate.span[0]; i < modelCandidate.span[1]; i++) {
        matchedIndices.add(i);
      }
    }
  }

  // 5. Part detection (exact + fuzzy against parts + part_synonyms)
  let partVal: string | null = null;
  let partConf: number = 0.0;

  if (tokens.length > 0 && repo.indexed_parts) {
    const partCandidate = findBestCandidateInIndex(
      tokens,
      repo.indexed_parts,
      MIN_ACCEPTABLE_CONFIDENCE,
      3
    );
    if (partCandidate) {
      partVal = partCandidate.canonical_name;
      partConf = partCandidate.score;
      for (let i = partCandidate.span[0]; i < partCandidate.span[1]; i++) {
        matchedIndices.add(i);
      }
    }
  }

  // Identify unrecognized substantive tokens
  const unrecognizedTokens = tokens.filter((tok, i) => {
    return (
      !matchedIndices.has(i) &&
      !STOP_WORDS.has(tok.toLowerCase()) &&
      tok.length > 1 &&
      !/^\d+$/.test(tok)
    );
  });

  return {
    original_text: rawMessage,
    normalized_text: normalized,
    entities: {
      manufacturer: mfgVal,
      model: modelVal,
      year: yearVal,
      part: partVal,
      details: detailsVal,
      unrecognized_tokens: unrecognizedTokens,
    },
    confidence: {
      manufacturer: mfgConf,
      model: modelConf,
      year: yearConf,
      part: partConf,
      details: detailsConf,
    },
  };
}
