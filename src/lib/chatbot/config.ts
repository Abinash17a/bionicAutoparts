/**
 * Configuration constants for the Bionic Auto Parts Assistant.
 * Centralized settings ensure easy branding updates and synchronization with backend constraints.
 */

export const BOT_CONFIG = {
  name: "Mya",
  subtitle: "Auto Parts Assistant",
  welcomeMessage:
    "Hi! I can help you find the right used auto part. Tell me what vehicle you have and what part you're looking for.",
  maxMessageLength: 4000,
  apiUrl: process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:3005",
  requestTimeoutMs: 15000,
  defaultErrorMessage:
    "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
} as const;
