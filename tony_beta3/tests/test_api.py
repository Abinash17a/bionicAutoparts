"""Tests for minimal FastAPI detection, confirmation, context, and chat endpoints."""

from fastapi.testclient import TestClient
from tony_beta3.api import app

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok", "service": "tony_beta3"}


def test_detect_endpoint():
    payload = {"message": "I need a front bumper for a 2018 Honda Civic"}
    res = client.post("/detect", json=payload)
    assert res.status_code == 200

    data = res.json()
    assert data["original_text"] == "I need a front bumper for a 2018 Honda Civic"
    assert data["normalized_text"] == "i need a front bumper for a 2018 honda civic"
    assert data["entities"]["manufacturer"] == "Honda"
    assert data["entities"]["model"] == "Civic"
    assert data["entities"]["year"] == 2018
    assert data["entities"]["part"] == "front bumper"
    assert data["confidence"]["year"] == 1.0
    assert data["confidence"]["manufacturer"] >= 0.95
    assert data["confidence"]["model"] >= 0.95
    assert data["confidence"]["part"] >= 0.95


def test_confirm_endpoint():
    # Step 1: fuzzy message needing confirmation
    payload1 = {"message": "I need a henda Civic"}
    res1 = client.post("/confirm", json=payload1)
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["action"] == "confirm"
    assert data1["field"] == "manufacturer"
    assert data1["candidate"] == "Honda"

    # Step 2: user confirms 'yes'
    payload2 = {"message": "yes", "state": data1["state"]}
    res2 = client.post("/confirm", json=payload2)
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["action"] == "accept"
    assert data2["field"] == "manufacturer"
    assert data2["candidate"] == "Honda"
    assert data2["state"]["confirmed_entities"]["manufacturer"] == "Honda"


def test_context_endpoint():
    # Message 1: Honda Civic
    res1 = client.post("/context", json={"message": "Honda Civic", "context": None})
    assert res1.status_code == 200
    ctx1 = res1.json()
    assert ctx1["vehicle"]["manufacturer"] == "Honda"
    assert ctx1["vehicle"]["model"] == "Civic"

    # Message 2: 2018
    res2 = client.post("/context", json={"message": "2018", "context": ctx1})
    assert res2.status_code == 200
    ctx2 = res2.json()
    assert ctx2["vehicle"]["year"] == 2018
    assert ctx2["vehicle"]["manufacturer"] == "Honda"
    assert ctx2["vehicle"]["model"] == "Civic"


def test_chat_endpoint():
    # Message: "I need a 2018 Honda Civic front bumper"
    payload = {"message": "I need a 2018 Honda Civic front bumper", "context": None}
    res = client.post("/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["context"]["vehicle"]["manufacturer"] == "Honda"
    assert data["context"]["vehicle"]["model"] == "Civic"
    assert data["context"]["vehicle"]["year"] == 2018
    assert data["context"]["part"] == "front bumper"
    assert data["category"] in ("FOUND", "PART_SEARCH")
    assert len(data["reply"]) > 0


def test_chat_endpoint_with_session():
    sid = "api-session-100"
    # Turn 1
    res1 = client.post("/chat", json={"session_id": sid, "message": "I need a Toyota Corolla"})
    assert res1.status_code == 200
    d1 = res1.json()
    assert d1["session_id"] == sid
    assert d1["context"]["vehicle"]["manufacturer"] == "Toyota"
    assert d1["context"]["vehicle"]["model"] == "Corolla"

    # Turn 2
    res2 = client.post("/chat", json={"session_id": sid, "message": "2020"})
    assert res2.status_code == 200
    d2 = res2.json()
    assert d2["session_id"] == sid
    assert d2["context"]["vehicle"]["manufacturer"] == "Toyota"
    assert d2["context"]["vehicle"]["model"] == "Corolla"
    assert d2["context"]["vehicle"]["year"] == 2020

    # Retrieve session
    res_get = client.get(f"/sessions/{sid}")
    assert res_get.status_code == 200
    assert res_get.json()["context"]["vehicle"]["year"] == 2020

    # Delete session
    res_del = client.delete(f"/sessions/{sid}")
    assert res_del.status_code == 200
    assert res_del.json()["deleted"] is True


def test_reset_session_endpoint():
    sid = "api-session-reset-test"
    # Seed session with chat turn
    client.post("/chat", json={"session_id": sid, "message": "I need a 2018 Honda Civic engine"})
    # Verify session exists
    assert client.get(f"/sessions/{sid}").status_code == 200

    # Call reset-session
    res = client.post("/reset-session", json={"session_id": sid})
    assert res.status_code == 200
    assert res.json()["reset"] is True
    assert res.json()["session_id"] == sid

    # Verify session deleted
    assert client.get(f"/sessions/{sid}").status_code == 404


def test_extract_endpoint_alias():
    res = client.post("/extract", json={"message": "I need alternator for 2015 Ford F-150"})
    assert res.status_code == 200
    data = res.json()
    assert data["entities"]["manufacturer"] == "Ford"
    assert data["entities"]["year"] == 2015


def test_chat_endpoint_webinterface_compatibility():
    # Test session_state payload alias + extracted_data response
    payload = {
        "session_id": "web-compat-01",
        "message": "I need a 2020 Toyota Camry headlight",
        "session_state": None,
    }
    res = client.post("/chat", json=payload, headers={"Origin": "http://localhost:3000"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "extracted_data" in data
    assert data["extracted_data"]["vehicle"]["make"] == "Toyota"
    assert data["extracted_data"]["vehicle"]["model"] == "Camry"
    assert data["extracted_data"]["vehicle"]["year"] == 2020
    assert data["extracted_data"]["part"] == "headlight"
    assert res.headers.get("access-control-allow-origin") == "*"



