"""High-performance fuzzy and exact matching algorithms for automotive entities."""

from typing import Any, NamedTuple


class MatchCandidate(NamedTuple):
    entity: Any
    canonical_name: str
    matched_text: str
    score: float
    span: tuple[int, int]  # (token_start_idx, token_end_idx)


def levenshtein_distance_fast(s1: str, s2: str, max_dist: int = 2) -> int:
    """Compute Levenshtein distance with early exit if exceeding max_dist."""
    len1, len2 = len(s1), len(s2)
    if s1 == s2:
        return 0
    if abs(len1 - len2) > max_dist:
        return max_dist + 1

    # Ensure s1 is the shorter string to optimize memory
    if len1 > len2:
        s1, s2 = s2, s1
        len1, len2 = len2, len1

    current_row = list(range(len1 + 1))

    for i in range(1, len2 + 1):
        ch2 = s2[i - 1]
        previous_row = current_row
        current_row = [i] + [0] * len1
        min_in_row = current_row[0]

        for j in range(1, len1 + 1):
            ch1 = s1[j - 1]
            cost = 0 if ch1 == ch2 else 1
            current_row[j] = min(
                previous_row[j] + 1,        # deletion
                current_row[j - 1] + 1,     # insertion
                previous_row[j - 1] + cost  # substitution
            )
            if current_row[j] < min_in_row:
                min_in_row = current_row[j]

        # Early exit if the minimum distance in this row already exceeds max_dist
        if min_in_row > max_dist:
            return max_dist + 1

    return current_row[len1]


def levenshtein_distance(s1: str, s2: str) -> int:
    """Compute exact Levenshtein edit distance between two strings."""
    return levenshtein_distance_fast(s1, s2, max_dist=max(len(s1), len(s2)))


def compute_string_similarity(query: str, target: str) -> float:
    """Compute a calibrated similarity score between query and target strings (0.0 to 1.0).

    Rules:
    - Exact match: 1.0
    - Very short strings (len <= 3, e.g. "bmw", "kia", "cr-v"): requires exact match.
    - 1-character typo on 4-5 char word (e.g. "henda"->"honda", "civik"->"civic"): 0.88
    - 1-character variation on 6-7 char word (e.g. "toyotaa"->"toyota", "bumber"->"bumper"): 0.92
    - 1-character variation on >=8 char phrase (e.g. "front bumber"->"front bumper"): 0.94
    - 2-character variation on >=7 char word: 0.78 - 0.82
    - Anything with edit distance > 2 or below threshold: 0.0
    """
    q = query.strip().lower()
    t = target.strip().lower()

    if q == t:
        return 1.0

    len_q = len(q)
    len_t = len(t)
    min_len = min(len_q, len_t)
    max_len = max(len_q, len_t)

    # Do not fuzzy match very short tokens (<= 3 chars) to avoid false positives (e.g. "car" matching "kia" or "cr-v")
    if min_len <= 3:
        return 0.0

    if abs(len_q - len_t) > 2:
        return 0.0

    # For words of length 4-5, only allow max 1 edit (2 edits on a 5-char word is 40% change)
    max_allowed_dist = 1 if min_len <= 5 else 2

    dist = levenshtein_distance_fast(q, t, max_dist=max_allowed_dist)
    if dist > max_allowed_dist:
        return 0.0

    if dist == 1:
        if max_len <= 5:
            return 0.88
        elif max_len <= 7:
            return 0.92
        else:
            return 0.94
    elif dist == 2 and min_len >= 6:
        if max_len <= 8:
            return 0.78
        else:
            return 0.82

    return 0.0


def find_best_candidate_in_index(
    tokens: list[str],
    indexed_catalog: Any,
    min_confidence: float = 0.75,
    max_ngram: int = 3,
) -> MatchCandidate | None:
    """Search token stream against pre-indexed catalog with O(1) exact lookup and length-bucketed fuzzy matching."""
    if not tokens or not indexed_catalog:
        return None

    num_tokens = len(tokens)
    exact_map = indexed_catalog.exact_map
    by_length = indexed_catalog.by_length
    canonical_key = indexed_catalog.canonical_key
    name_key = indexed_catalog.name_key

    # 1. First pass: Check exact matches across n-grams (prefer longer n-grams)
    for n in range(min(max_ngram, num_tokens), 0, -1):
        for i in range(num_tokens - n + 1):
            window_str = " ".join(tokens[i : i + n]).strip().lower()
            if window_str in exact_map:
                item = exact_map[window_str]
                canonical_name = item.get(canonical_key, item.get(name_key, ""))
                return MatchCandidate(
                    entity=item,
                    canonical_name=canonical_name,
                    matched_text=window_str,
                    score=1.0,
                    span=(i, i + n),
                )

    # 2. Second pass: Fast fuzzy matching on length-compatible items
    best_candidate: MatchCandidate | None = None
    best_score = 0.0
    best_ngram_len = 0

    for n in range(min(max_ngram, num_tokens), 0, -1):
        for i in range(num_tokens - n + 1):
            window_str = " ".join(tokens[i : i + n]).strip().lower()
            len_window = len(window_str)
            if len_window <= 3:
                continue

            for target_len in range(len_window - 2, len_window + 3):
                targets = by_length.get(target_len, [])
                for lowered_target, canonical_target, item in targets:
                    score = compute_string_similarity(window_str, lowered_target)
                    if score >= min_confidence:
                        is_better = False
                        if score > best_score + 0.05:
                            is_better = True
                        elif abs(score - best_score) <= 0.05 and n > best_ngram_len:
                            is_better = True
                        elif score > best_score:
                            is_better = True

                        if is_better:
                            best_score = score
                            best_ngram_len = n
                            best_candidate = MatchCandidate(
                                entity=item,
                                canonical_name=canonical_target,
                                matched_text=window_str,
                                score=score,
                                span=(i, i + n),
                            )

    return best_candidate


def find_best_candidate(
    tokens: list[str],
    catalog_items: list[dict],
    name_key: str = "name",
    canonical_key: str = "name",
    min_confidence: float = 0.75,
    max_ngram: int = 3,
) -> MatchCandidate | None:
    """Fallback search function for unindexed lists."""
    from tony_beta3.database.repository import IndexedCatalog
    indexed = IndexedCatalog(catalog_items, name_key=name_key, canonical_key=canonical_key)
    return find_best_candidate_in_index(
        tokens=tokens,
        indexed_catalog=indexed,
        min_confidence=min_confidence,
        max_ngram=max_ngram,
    )
