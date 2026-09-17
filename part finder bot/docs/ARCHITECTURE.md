# Architecture

Customer -> HTTP API -> Conversation Manager -> deterministic extraction -> local automotive knowledge base -> normalization -> correction/conflict engine -> structured memory -> intent engine -> response policy -> optional LLM. Future inventory, vehicle, VIN, compatibility, pricing, and shipping services remain explicit interfaces.

Memory defaults to bounded TTL in-process storage. `STORAGE_PROVIDER=sqlite` enables SQLite session persistence.

The runtime queries `AutomotiveKnowledgeBase` backed by SQLite for aliases, vehicles, categories, and part candidates before updating memory. Facts carry confidence and source metadata. OpenAI fallback is opt-in through `LLM_PROVIDER=openai`; `deterministic` and `none` require no key.
