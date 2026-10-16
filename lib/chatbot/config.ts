/**
 * Configuration constants for the Bionic Auto Parts Assistant.
 * Centralized settings ensure easy branding updates and synchronization with backend constraints.
 */

export const BOT_CONFIG = {
  name: "Tony",
  subtitle: "Auto Parts Assistant",
  welcomeMessage:
    "Hi! I can help you find the right used auto part. Tell me what vehicle you have and what part you're looking for.",
  maxMessageLength: 4000,
  apiUrl: process.env.NEXT_PUBLIC_BOT_API_URL || "/api/chat",
  requestTimeoutMs: 30000,
  defaultErrorMessage:
    "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
} as const;
