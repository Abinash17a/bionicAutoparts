"use client";

import React, { useEffect, useRef } from "react";
import { ChatMessage } from "@/lib/chatbot/types";
import { ChatMessageItem } from "./ChatMessageItem";
import { BOT_CONFIG } from "@/lib/chatbot/config";
import { Wrench } from "lucide-react";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
}) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-900/50 scroll-smooth"
      role="log"
      aria-live="polite"
      aria-label="Chat conversation history"
    >
      {messages.map((msg) => (
        <ChatMessageItem key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className="flex w-full justify-start items-end gap-2">
          <div
            className="w-7 h-7 rounded-full bg-[#023047] text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm mb-1"
            aria-hidden="true"
          >
            <Wrench className="w-3.5 h-3.5 text-blue-300" />
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl rounded-bl-xs border border-slate-200/70 dark:border-slate-700/60 px-4 py-3 text-sm shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
            <span className="sr-only">{BOT_CONFIG.name} is typing...</span>
          </div>
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
};
