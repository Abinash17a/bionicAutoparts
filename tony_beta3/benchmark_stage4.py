"""Benchmark script for Tony Beta 3 Stage 4 (Deterministic Response Engine)."""

import time
from tony_beta3.context import create_context, update_context
from tony_beta3.response import generate_response

scenarios = [
    ("1. Greeting", "Hi", create_context()),
    ("2. Missing Vehicle", "I need a bumper", update_context(None, "I need a bumper")),
    ("3. Missing Model", "Honda 2018", update_context(None, "Honda 2018")),
    ("4. Missing Part", "2018 Honda Civic", update_context(None, "2018 Honda Civic")),
    ("5. Complete Request", "2018 Honda Civic front bumper", update_context(None, "2018 Honda Civic front bumper")),
    ("6. Confirmation Pending", "", {
        "vehicle": {"manufacturer": None, "model": "Civic", "year": None},
        "part": None, "details": {},
        "pending_confirmation": {"field": "manufacturer", "candidate": "Honda", "confidence": 0.88}
    }),
    ("7. Thanks", "thanks", {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "front bumper", "details": {}, "pending_confirmation": None
    }),
    ("8. Goodbye", "bye", create_context()),
    ("9. Details Interpolation", "", {
        "vehicle": {"manufacturer": "Honda", "model": "Civic", "year": 2018},
        "part": "front bumper", "details": {"side": "left", "color": "black"}, "pending_confirmation": None
    }),
    ("10. Random Selection Check", "Hi", create_context()),
]


def run_benchmark():
    print("=" * 80)
    print("TONY BETA 3 - STAGE 4 RESPONSE ENGINE BENCHMARK & TEST REPORT")
    print("=" * 80)

    latencies = []
    iterations = 100

    for i, (name, msg, ctx) in enumerate(scenarios, 1):
        iter_latencies = []
        res = None
        for _ in range(iterations):
            t0 = time.perf_counter()
            res = generate_response(ctx, user_message=msg, seed=42)
            t1 = time.perf_counter()
            iter_latencies.append((t1 - t0) * 1000)

        avg_lat = sum(iter_latencies) / len(iter_latencies)
        latencies.append(avg_lat)

        print(f"\n[{name}]")
        print(f"    Message:     \"{msg}\"")
        print(f"    Category:    {res['category']}")
        print(f"    Template ID: {res['template_id']}")
        print(f"    Reply:       \"{res['reply']}\"")
        print(f"    Avg Latency: {avg_lat:.4f} ms ({avg_lat * 1000:.1f} us)")

    print("\n" + "=" * 80)
    total_avg = sum(latencies) / len(latencies)
    print(f"OVERALL STAGE 4 AVERAGE RESPONSE GENERATION LATENCY: {total_avg:.4f} ms ({total_avg * 1000:.1f} microseconds)")
    print("=" * 80)


if __name__ == "__main__":
    run_benchmark()
