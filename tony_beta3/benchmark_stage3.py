"""Benchmark script for Tony Beta 3 Stage 3 (Conversation Context & State Manager)."""

import json
import time
from tony_beta3.context import create_context, update_context

test_cases = [
    ("Case 1: 'Hi' on empty context", "Hi", None),
    ("Case 2: 'I need a Honda Civic bumper'", "I need a Honda Civic bumper", None),
    ("Case 3: '2018' (partial year)", "2018", {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": None},
        "part": "bumper", "details": {}, "pending_confirmation": None
    }),
    ("Case 4: 'front bumper' (part replacement)", "front bumper", {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "bumper", "details": {}, "pending_confirmation": None
    }),
    ("Case 5: 'left side' (partial side)", "left side", {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "front bumper", "details": {}, "pending_confirmation": None
    }),
    ("Case 6: 'black' (details merging)", "black", {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "front bumper", "details": {"side": "left"}, "pending_confirmation": None
    }),
    ("Case 7: 'Actually Toyota' (correction)", "Actually Toyota", {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "front bumper", "details": {"side": "left", "color": "black"}, "pending_confirmation": None
    }),
    ("Case 8: 'Hi' after information (greeting)", "Hi", {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "bumper", "details": {}, "pending_confirmation": None
    }),
    ("Case 9: Confirmation 'yes'", "yes", {
        "vehicle": {"manufacturer": None, "model": "Civic", "year": None},
        "part": None, "details": {},
        "pending_confirmation": {"field": "manufacturer", "candidate": "Honda", "confidence": 0.88}
    }),
    ("Case 10: Confirmation 'no'", "no", {
        "vehicle": {"manufacturer": None, "model": "Civic", "year": None},
        "part": None, "details": {},
        "pending_confirmation": {"field": "manufacturer", "candidate": "Honda", "confidence": 0.88}
    }),
    ("Case 11: Null extraction preserve", "thanks very much", {
        "vehicle": {"manufacturer": "Toyota", "model": "Corolla", "year": 2020},
        "part": "headlight", "details": {"side": "passenger"}, "pending_confirmation": None
    }),
    ("Case 12: Cumulative sequence step", "2018", {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": None},
        "part": None, "details": {}, "pending_confirmation": None
    }),
]


def run_benchmark():
    # Warmup
    for name, msg, ctx in test_cases:
        update_context(ctx, user_message=msg)

    print("=" * 75)
    print("TONY BETA 3 - STAGE 3 CONTEXT MANAGER TEST & LATENCY REPORT")
    print("=" * 75)

    latencies = []
    iterations = 100

    for i, (name, msg, ctx) in enumerate(test_cases, 1):
        iter_latencies = []
        res = None
        for _ in range(iterations):
            t0 = time.perf_counter()
            res = update_context(ctx, user_message=msg)
            t1 = time.perf_counter()
            iter_latencies.append((t1 - t0) * 1000)

        avg_lat = sum(iter_latencies) / len(iter_latencies)
        latencies.append(avg_lat)

        print(f"\n[{i}] {name}")
        print(f"    Message: \"{msg}\"")
        print(f"    Result Vehicle: {res['vehicle']}")
        print(f"    Result Part:    {res['part']}")
        print(f"    Result Details: {res['details']}")
        print(f"    Pending Conf:   {res['pending_confirmation']}")
        print(f"    Avg Latency ({iterations} runs): {avg_lat:.3f} ms")

    print("\n" + "=" * 75)
    total_avg = sum(latencies) / len(latencies)
    print(f"OVERALL STAGE 3 AVERAGE CONTEXT UPDATE LATENCY: {total_avg:.3f} ms ({total_avg * 1000:.1f} microseconds)")
    print("=" * 75)


if __name__ == "__main__":
    run_benchmark()
