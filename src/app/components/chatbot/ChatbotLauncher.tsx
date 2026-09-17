"use client";

import React from "react";
import { MessageSquare, Bot } from "lucide-react";
import { BOT_CONFIG } from "@/lib/chatbot/config";

interface ChatbotLauncherProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnread?: boolean;
}

export const ChatbotLauncher: React.FC<ChatbotLauncherProps> = ({
  isOpen,
  onClick,
  hasUnread = false,
}) => {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 select-none pb-[env(safe-area-inset-bottom)]">
      <button
        type="button"
        onClick={onClick}
        aria-label="Open auto parts assistant"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title={`Chat with ${BOT_CONFIG.name}`}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#023047] hover:bg-[#034262] text-white shadow-xl hover:shadow-2xl border-2 border-white/20 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <Bot className="w-3 h-3 text-blue-300 absolute -bottom-1 -right-1" />
        </div>

        {hasUnread && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white animate-pulse" />
        )}

        {/* Small desktop hover tooltip */}
        <span className="sr-only">Open chat with {BOT_CONFIG.name}</span>
      </button>
    </div>
  );
};
