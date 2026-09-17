"use client";

import React from "react";
import { ChatMessage } from "@/lib/chatbot/types";
import { Wrench } from "lucide-react";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = React.memo(
  ({ message }) => {
    const isUser = message.sender === "user";

    return (
      <div
        className={`flex w-full ${isUser ? "justify-end" : "justify-start"} items-end gap-2`}
      >
        {!isUser && (
          <div
            className="w-7 h-7 rounded-full bg-[#023047] text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm mb-1"
            aria-hidden="true"
          >
            <Wrench className="w-3.5 h-3.5 text-blue-300" />
          </div>
        )}

        <div
          className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
            isUser
              ? "bg-[#023047] text-white rounded-br-xs font-normal"
              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/70 dark:border-slate-700/60"
          }`}
        >
          <div className="whitespace-pre-wrap break-words">{message.text}</div>
          <div
            className={`text-[10px] mt-1 ${
              isUser ? "text-blue-200/80 text-right" : "text-slate-400 text-left"
            }`}
          >
            {new Intl.DateTimeFormat("en-US", {
              hour: "numeric",
              minute: "numeric",
            }).format(new Date(message.timestamp))}
          </div>
        </div>
      </div>
    );
  }
);

ChatMessageItem.displayName = "ChatMessageItem";
