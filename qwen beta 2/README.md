---
title: Autopartsbot
emoji: 🚗
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
short_description: Auto parts extraction API and chatbot
---

# 🚗 Auto Parts AI Extraction Bot & API

FastAPI and Gradio service extracting structured auto parts information from customer messages using **Qwen/Qwen2.5-1.5B-Instruct**.

---

## 📡 REST API Usage

You can call the endpoints directly via any HTTP client or backend:

### 1. Extract & Chat (`POST /chat`)
```bash
curl -X POST "https://vighneshkumbhar-autopartsbot.hf.space/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "Hi, looking for front brake pads for a 2018 Toyota Camry"}'
```

### 2. Pure Extraction (`POST /extract`)
```bash
curl -X POST "https://vighneshkumbhar-autopartsbot.hf.space/extract" \
     -H "Content-Type: application/json" \
     -d '{"message": "Do you have an alternator for a 2015 Ford F-150?"}'
```

### 3. Health Status (`GET /health`)
```bash
curl "https://vighneshkumbhar-autopartsbot.hf.space/health"
```
