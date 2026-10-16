"""Benchmark script for Tony Beta 3 entity detector."""

import json
import time
from tony_beta3.detector import detect_entities

test_messages = [
    "I need a Honda Civic bumper",
    "I need a henda civik",
    "I need a front bumper for a 2018 Honda Civic",
    "I need the left black front bumper",
    "I need a Toyota Corolla head lamp",
    "I need something for my car",
    "I need a 2038 Honda Civic bumper",
    "I need a BMW",
    "civik front bumber",
    "hello",
]


def run_benchmark():
    # Warmup
    for msg in test_messages:
        detect_entities(msg)

    print("=" * 70)
    print("TONY BETA 3 - ENTITY DETECTOR TEST & LATENCY REPORT")
    print("=" * 70)

    latencies = []
    iterations = 100

    for i, msg in enumerate(test_messages, 1):
        # Time across multiple iterations for statistical accuracy
        iter_latencies = []
        res = None
        for _ in range(iterations):
            t0 = time.perf_counter()
            res = detect_entities(msg)
            t1 = time.perf_counter()
            iter_latencies.append((t1 - t0) * 1000)

        avg_lat = sum(iter_latencies) / len(iter_latencies)
        latencies.append(avg_lat)

        print(f"\n[Test Case {i}] Message: \"{msg}\"")
        print(f"Normalized: \"{res['normalized_text']}\"")
        print("Entities & Confidence:")
        print(f"  - Manufacturer: {res['entities']['manufacturer']} (conf: {res['confidence']['manufacturer']})")
        print(f"  - Model:        {res['entities']['model']} (conf: {res['confidence']['model']})")
        print(f"  - Year:         {res['entities']['year']} (conf: {res['confidence']['year']})")
        print(f"  - Part:         {res['entities']['part']} (conf: {res['confidence']['part']})")
        print(f"  - Details:      {res['entities']['details']} (conf: {res['confidence']['details']})")
        print(f"Avg Latency ({iterations} runs): {avg_lat:.3f} ms")

    print("\n" + "=" * 70)
    total_avg = sum(latencies) / len(latencies)
    print(f"OVERALL AVERAGE DETECTION LATENCY: {total_avg:.3f} ms ({total_avg * 1000:.1f} microseconds)")
    print("=" * 70)


if __name__ == "__main__":
    run_benchmark()
