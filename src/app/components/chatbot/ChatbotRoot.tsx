"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ChatbotLauncher } from "./ChatbotLauncher";

// Lazy-load the chat panel so initial bundle load is ultra lightweight
const ChatbotPanel = dynamic(
  () => import("./ChatbotPanel").then((mod) => mod.ChatbotPanel),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function ChatbotRoot() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chatbot temporarily disabled per user request
  const isEnabled = true;
  if (!isEnabled || !mounted) return null;

  return (
    <>
      <ChatbotLauncher isOpen={isOpen} onClick={() => setIsOpen(true)} />
      {isOpen && (
        <ChatbotPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
