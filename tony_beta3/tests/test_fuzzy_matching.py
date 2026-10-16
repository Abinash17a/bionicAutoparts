"""Unit tests for string similarity and fuzzy matching."""

from tony_beta3.matching import compute_string_similarity, levenshtein_distance


def test_levenshtein_distance():
    assert levenshtein_distance("honda", "honda") == 0
    assert levenshtein_distance("henda", "honda") == 1
    assert levenshtein_distance("civik", "civic") == 1
    assert levenshtein_distance("toyotaa", "toyota") == 1
    assert levenshtein_distance("bumber", "bumper") == 1


def test_compute_string_similarity_exact():
    assert compute_string_similarity("honda", "Honda") == 1.0
    assert compute_string_similarity("civic", "Civic") == 1.0


def test_compute_string_similarity_fuzzy():
    # 1-char typo on 5-letter word
    score_henda = compute_string_similarity("henda", "Honda")
    assert 0.85 <= score_henda <= 0.95

    # 1-char typo on 5-letter word
    score_civik = compute_string_similarity("civik", "Civic")
    assert 0.85 <= score_civik <= 0.95

    # 1-char extra on 7-letter word
    score_toyotaa = compute_string_similarity("toyotaa", "Toyota")
    assert 0.88 <= score_toyotaa <= 0.96

    # 1-char typo on 6-letter word
    score_bumber = compute_string_similarity("bumber", "bumper")
    assert 0.85 <= score_bumber <= 0.95


def test_compute_string_similarity_rejections():
    # Unrelated short tokens should not match
    assert compute_string_similarity("car", "cr-v") == 0.0
    assert compute_string_similarity("car", "kia") == 0.0
    assert compute_string_similarity("hello", "Honda") == 0.0
    assert compute_string_similarity("something", "Civic") == 0.0
