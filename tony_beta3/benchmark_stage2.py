"""Benchmark script for Tony Beta 3 Stage 2 (Confirmation & Correction Engine)."""

import json
import time
from tony_beta3.confirmation import evaluate_confirmation

test_scenarios = [
    ("Case 1: All High Confidence", "I need a Honda Civic bumper", None),
    ("Case 2: Fuzzy Manufacturer", "I need a henda Civic", None),
    ("Case 3: User Confirms Yes", "yes", {
        "confirmed_entities": {"manufacturer": None, "model": "Civic", "year": None, "part": None, "details": {}},
        "pending_confirmation": {"field": "manufacturer", "candidate": "Honda", "confidence": 0.88}
    }),
    ("Case 4: User Rejects No", "no", {
        "confirmed_entities": {"manufacturer": None, "model": "Civic", "year": None, "part": None, "details": {}},
        "pending_confirmation": {"field": "manufacturer", "candidate": "Honda", "confidence": 0.88}
    }),
    ("Case 5: Fuzzy Model", "I need a civik", None),
    ("Case 6: Fuzzy Part", "I need a front bumber", None),
    ("Case 7: Generic Car Request", "I need something", None),
    ("Case 8: Unrelated Message", "hello", None),
    ("Case 9: Rejected Stays Rejected", "nope", {
        "confirmed_entities": {"manufacturer": None, "model": "Civic", "year": None, "part": None, "details": {}},
        "pending_confirmation": {"field": "manufacturer", "candidate": "Honda", "confidence": 0.88}
    }),
    ("Case 10: High Confidence Exact", "I need a Toyota Camry", None),
]


def run_benchmark():
    # Warmup
    for name, msg, st in test_scenarios:
        evaluate_confirmation(msg, current_state=st)

    print("=" * 75)
    print("TONY BETA 3 - STAGE 2 CONFIRMATION ENGINE LATENCY & TEST REPORT")
    print("=" * 75)

    latencies = []
    iterations = 100

    for i, (name, msg, st) in enumerate(test_scenarios, 1):
        iter_latencies = []
        res = None
        for _ in range(iterations):
            t0 = time.perf_counter()
            res = evaluate_confirmation(msg, current_state=st)
            t1 = time.perf_counter()
            iter_latencies.append((t1 - t0) * 1000)

        avg_lat = sum(iter_latencies) / len(iter_latencies)
        latencies.append(avg_lat)

        print(f"\n[{i}] {name}")
        print(f"    Message: \"{msg}\" | Pending: {st.get('pending_confirmation') if st else None}")
        print(f"    Action: {res['action']} | Field: {res['field']} | Candidate: {res['candidate']} | Conf: {res['confidence']}")
        print(f"    Confirmed Entities: {res['state']['confirmed_entities']}")
        print(f"    Pending in State:   {res['state']['pending_confirmation']}")
        print(f"    Avg Latency ({iterations} runs): {avg_lat:.3f} ms")

    print("\n" + "=" * 75)
    total_avg = sum(latencies) / len(latencies)
    print(f"OVERALL STAGE 2 AVERAGE EVALUATION LATENCY: {total_avg:.3f} ms ({total_avg * 1000:.1f} microseconds)")
    print("=" * 75)


if __name__ == "__main__":
    run_benchmark()
