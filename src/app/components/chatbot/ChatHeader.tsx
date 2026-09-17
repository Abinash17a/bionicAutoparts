"use client";

import React from "react";
import { BOT_CONFIG } from "@/lib/chatbot/config";
import { RotateCcw, X, Bot } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
  onReset: () => void;
  isResetting?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClose,
  onReset,
  isResetting = false,
}) => {
  return (
    <div className="bg-[#023047] text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10 select-none">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 shadow-inner">
            <Bot className="w-5 h-5 text-blue-300" />
          </div>
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#023047]"
            title="Online"
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-white tracking-wide">
              {BOT_CONFIG.name}
            </h2>
            <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30">
              Bot
            </span>
          </div>
          <p className="text-xs text-blue-100/75 leading-tight">
            {BOT_CONFIG.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onReset}
          disabled={isResetting}
          aria-label="New conversation"
          title="Start new conversation"
          className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <RotateCcw
            className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`}
          />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close auto parts assistant"
          title="Close auto parts assistant"
          className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
