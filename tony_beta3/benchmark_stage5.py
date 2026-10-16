"""Stage 5 End-to-End Latency Benchmark for Tony Beta 3.

Measures the execution time of full chat orchestration across 10 multi-turn conversation steps:
1. 'Hi' -> GREETING
2. 'I need a honda' -> ASK_MODEL
3. 'Actually henda' -> CONFIRM
4. 'yes' -> ASK_MODEL
5. '2018 civic' -> ASK_PART
6. 'front bumper' -> FOUND
7. 'left side' -> FOUND
8. 'black' -> FOUND
9. 'thanks' -> THANKS
10. 'bye' -> GOODBYE
"""

import time
import json
from tony_beta3.chat import chat
from tony_beta3.database.repository import get_repository


def run_benchmark():
    # Warm up database repository
    repo = get_repository()

    steps = [
        "Hi",
        "I need a honda",
        "Actually henda",
        "yes",
        "2018 civic",
        "front bumper",
        "left side",
        "black",
        "thanks",
        "bye",
    ]

    print("================================================================================")
    print("           TONY BETA 3 - STAGE 5 END-TO-END CHAT BENCHMARK                      ")
    print("================================================================================")

    # Run conversation trace
    context = None
    latencies = []

    print("\n--- 10-Message Multi-Turn Conversation Trace ---")
    for i, msg in enumerate(steps, 1):
        start = time.perf_counter()
        result = chat(msg, context=context, repository=repo, seed=42)
        elapsed_ms = (time.perf_counter() - start) * 1000
        latencies.append(elapsed_ms)
        context = result["context"]

        print(f"\n[Turn {i}] User: '{msg}'")
        print(f"  Latency : {elapsed_ms:.3f} ms")
        print(f"  Action  : {result['action']}")
        print(f"  Category: {result['category']}")
        print(f"  Reply   : \"{result['reply']}\"")
        vehicle = context.get("vehicle", {})
        print(f"  Context : vehicle={vehicle}, part={context.get('part')}, details={context.get('details')}, pending={context.get('pending_confirmation')}")

    # Run 50 iterations of the full 10-turn conversation for robust timing
    iterations = 50
    total_turn_times = []

    for _ in range(iterations):
        ctx = None
        for msg in steps:
            t0 = time.perf_counter()
            res = chat(msg, context=ctx, repository=repo)
            t1 = time.perf_counter()
            total_turn_times.append((t1 - t0) * 1000)
            ctx = res["context"]

    avg_turn_ms = sum(total_turn_times) / len(total_turn_times)
    min_turn_ms = min(total_turn_times)
    max_turn_ms = max(total_turn_times)
    p95_turn_ms = sorted(total_turn_times)[int(len(total_turn_times) * 0.95)]

    print("\n================================================================================")
    print("                       BENCHMARK RESULTS SUMMARY                                ")
    print("================================================================================")
    print(f"Total conversation turns benchmarked: {len(total_turn_times)} ({iterations} full runs x 10 turns)")
    print(f"Average latency per turn: {avg_turn_ms:.3f} ms")
    print(f"Min turn latency        : {min_turn_ms:.3f} ms")
    print(f"Max turn latency        : {max_turn_ms:.3f} ms")
    print(f"P95 turn latency        : {p95_turn_ms:.3f} ms")
    print(f"Full 10-turn flow avg   : {(avg_turn_ms * 10):.3f} ms")
    print("================================================================================\n")


if __name__ == "__main__":
    run_benchmark()
