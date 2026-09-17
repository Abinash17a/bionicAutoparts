"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "@/lib/chatbot/types";
import {
  getOrCreateSessionId,
  getStoredMessages,
  saveStoredMessages,
  clearStoredSession,
} from "@/lib/chatbot/session";
import { sendChatMessage, resetChatSession } from "@/lib/chatbot/api";
import { BOT_CONFIG } from "@/lib/chatbot/config";

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatbotPanel: React.FC<ChatbotPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");

  // Initialize session and messages on mount
  useEffect(() => {
    const sId = getOrCreateSessionId();
    setSessionId(sId);
    const initialMessages = getStoredMessages();
    setMessages(initialMessages);
  }, []);

  // Sync messages to storage whenever updated
  useEffect(() => {
    if (messages.length > 0) {
      saveStoredMessages(messages);
    }
  }, [messages]);

  // Handle Escape key to close dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: "user",
        text: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const currentSessionId = sessionId || getOrCreateSessionId();
      if (!sessionId) setSessionId(currentSessionId);

      const result = await sendChatMessage(text.trim(), currentSessionId);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: "bot",
        text: result.reply || BOT_CONFIG.defaultErrorMessage,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    },
    [isLoading, sessionId]
  );

  const handleReset = useCallback(async () => {
    if (isResetting) return;
    setIsResetting(true);

    if (sessionId) {
      await resetChatSession(sessionId);
    }

    const newSessionId = clearStoredSession();
    setSessionId(newSessionId);

    const freshWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: "bot",
      text: BOT_CONFIG.welcomeMessage,
      timestamp: Date.now(),
    };

    setMessages([freshWelcome]);
    saveStoredMessages([freshWelcome]);
    setIsResetting(false);
  }, [isResetting, sessionId]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={`${BOT_CONFIG.name} Auto Parts Assistant`}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[calc(100vh-5.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200"
    >
      <ChatHeader
        onClose={onClose}
        onReset={handleReset}
        isResetting={isResetting}
      />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};
