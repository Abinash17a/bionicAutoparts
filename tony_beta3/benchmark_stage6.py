"""Stage 6 Persistent Chat Sessions Latency & Conversation Benchmark.

Measures:
- Session Load Latency (Supabase / Session Repository)
- Stage 5 Processing Latency (Detector + Confirmation + Context + Template Engine)
- Session Save Latency (Supabase / Session Repository)
- Total End-to-End Chat Latency

Executes the Section 16 multi-turn test conversation on session 'production-session-001':
1. 'Hi'
2. 'I need a Honda Civic'
3. '2018'
4. 'front bumper'
5. 'left side'
6. 'black'
7. [SIMULATE APPLICATION RESTART]
8. 'thanks'
"""

import time
import json
from tony_beta3.chat import chat
from tony_beta3.database.repository import get_repository
from tony_beta3.database.session_repository import SessionRepository, get_session_repository


def run_benchmark():
    session_id = "production-session-001"
    catalog_repo = get_repository()

    # Shared persistent backend simulation
    persistent_storage_backend = {}

    # Initial session repository before restart
    session_repo = SessionRepository(use_supabase=False)
    session_repo._local_store = persistent_storage_backend

    steps = [
        ("Turn 1", "Hi"),
        ("Turn 2", "I need a Honda Civic"),
        ("Turn 3", "2018"),
        ("Turn 4", "front bumper"),
        ("Turn 5", "left side"),
        ("Turn 6", "black"),
    ]

    print("================================================================================")
    print("      TONY BETA 3 - STAGE 6 PERSISTENT SESSIONS BENCHMARK & TEST TRACE          ")
    print("================================================================================")
    print(f"Target Session ID: {session_id}")

    load_times = []
    proc_times = []
    save_times = []
    total_times = []

    print("\n--- Part 1: Initial Turns (Pre-Restart) ---")
    for label, msg in steps:
        # Measure load
        t0 = time.perf_counter()
        session_record = session_repo.get_session(session_id)
        current_ctx = session_record["context"] if session_record else None
        t1 = time.perf_counter()
        load_ms = (t1 - t0) * 1000

        # Measure chat processing
        res = chat(msg, context=current_ctx, repository=catalog_repo, seed=42)
        t2 = time.perf_counter()
        proc_ms = (t2 - t1) * 1000

        # Measure save
        session_repo.save_session(session_id, res["context"])
        t3 = time.perf_counter()
        save_ms = (t3 - t2) * 1000
        tot_ms = (t3 - t0) * 1000

        load_times.append(load_ms)
        proc_times.append(proc_ms)
        save_times.append(save_ms)
        total_times.append(tot_ms)

        print(f"\n[{label}] User: '{msg}'")
        print(f"  Load Time : {load_ms:.3f} ms | Process Time: {proc_ms:.3f} ms | Save Time: {save_ms:.3f} ms | Total: {tot_ms:.3f} ms")
        print(f"  Action    : {res['action']}")
        print(f"  Category  : {res['category']}")
        print(f"  Reply     : \"{res['reply']}\"")
        vehicle = res["context"].get("vehicle", {})
        print(f"  Context   : vehicle={vehicle}, part={res['context'].get('part')}, details={res['context'].get('details')}, pending={res['context'].get('pending_confirmation')}")

    # Simulating application restart: instantiate a brand new SessionRepository
    print("\n--------------------------------------------------------------------------------")
    print(" >>> [SIMULATING APPLICATION RESTART: Re-initializing all runtime instances] <<< ")
    print("--------------------------------------------------------------------------------")

    restarted_session_repo = SessionRepository(use_supabase=False)
    restarted_session_repo._local_store = persistent_storage_backend

    # Turn after restart: 'thanks'
    t0 = time.perf_counter()
    session_record = restarted_session_repo.get_session(session_id)
    reloaded_ctx = session_record["context"] if session_record else None
    t1 = time.perf_counter()
    load_ms = (t1 - t0) * 1000

    res_post_restart = chat("thanks", context=reloaded_ctx, repository=catalog_repo, seed=42)
    t2 = time.perf_counter()
    proc_ms = (t2 - t1) * 1000

    restarted_session_repo.save_session(session_id, res_post_restart["context"])
    t3 = time.perf_counter()
    save_ms = (t3 - t2) * 1000
    tot_ms = (t3 - t0) * 1000

    load_times.append(load_ms)
    proc_times.append(proc_ms)
    save_times.append(save_ms)
    total_times.append(tot_ms)

    print(f"\n[Turn 7 (Post-Restart)] User: 'thanks'")
    print(f"  Load Time : {load_ms:.3f} ms | Process Time: {proc_ms:.3f} ms | Save Time: {save_ms:.3f} ms | Total: {tot_ms:.3f} ms")
    print(f"  Action    : {res_post_restart['action']}")
    print(f"  Category  : {res_post_restart['category']}")
    print(f"  Reply     : \"{res_post_restart['reply']}\"")
    final_ctx = res_post_restart["context"]
    print(f"  Final Context State:")
    print(json.dumps(final_ctx, indent=4))

    # Verify context integrity as required in Section 16
    expected_ctx = {
        "vehicle": {
            "manufacturer": "Honda",
            "model": "Civic",
            "year": 2018
        },
        "part": "front bumper",
        "details": {
            "position": "front",
            "side": "left",
            "color": "black"
        },
        "pending_confirmation": None
    }

    assert final_ctx["vehicle"] == expected_ctx["vehicle"], f"Vehicle mismatch: {final_ctx['vehicle']}"
    assert final_ctx["part"] == expected_ctx["part"], f"Part mismatch: {final_ctx['part']}"
    assert final_ctx["details"] == expected_ctx["details"], f"Details mismatch: {final_ctx['details']}"
    assert final_ctx["pending_confirmation"] is None, f"Pending confirmation not None: {final_ctx['pending_confirmation']}"
    print("\n[VERIFICATION SUCCESSFUL] Post-restart context matches Section 16 specification exactly!")

    # Performance loop for 100 multi-turn iterations
    iterations = 100
    bench_loads, bench_procs, bench_saves, bench_totals = [], [], [], []
    for _ in range(iterations):
        t_start = time.perf_counter()
        rec = restarted_session_repo.get_session(session_id)
        c = rec["context"]
        t_l = time.perf_counter()

        r = chat("I need a front bumper", context=c, repository=catalog_repo)
        t_p = time.perf_counter()

        restarted_session_repo.save_session(session_id, r["context"])
        t_s = time.perf_counter()

        bench_loads.append((t_l - t_start) * 1000)
        bench_procs.append((t_p - t_l) * 1000)
        bench_saves.append((t_s - t_p) * 1000)
        bench_totals.append((t_s - t_start) * 1000)

    avg_load = sum(bench_loads) / len(bench_loads)
    avg_proc = sum(bench_procs) / len(bench_procs)
    avg_save = sum(bench_saves) / len(bench_saves)
    avg_tot = sum(bench_totals) / len(bench_totals)

    print("\n================================================================================")
    print("                       BENCHMARK METRICS SUMMARY                                ")
    print("================================================================================")
    print(f"Total benchmark iterations: {iterations}")
    print(f"Session Load Latency     : {avg_load:.3f} ms")
    print(f"Bot Processing Latency   : {avg_proc:.3f} ms")
    print(f"Session Save Latency     : {avg_save:.3f} ms")
    print(f"Total /chat Latency      : {avg_tot:.3f} ms")
    print("================================================================================\n")


if __name__ == "__main__":
    run_benchmark()
