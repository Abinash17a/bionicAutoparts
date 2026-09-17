"use client";

import React, { useState, useRef, useEffect } from "react";
import { BOT_CONFIG } from "@/lib/chatbot/config";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setText("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= BOT_CONFIG.maxMessageLength) {
      setText(val);
      // Auto adjust height up to 100px
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`;
      }
    }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="flex items-end gap-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl px-3 py-2 border border-slate-200/80 dark:border-slate-700/80 focus-within:border-[#023047] focus-within:ring-1 focus-within:ring-[#023047] transition-all">
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask for an engine, mirror, door..."
          disabled={disabled}
          maxLength={BOT_CONFIG.maxMessageLength}
          aria-label="Your message to the auto parts assistant"
          className="w-full bg-transparent resize-none outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 max-h-[100px] leading-relaxed py-0.5"
        />

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          title="Send message"
          className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
            canSend
              ? "bg-[#023047] hover:bg-[#034262] text-white shadow-sm"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
          }`}
        >
          <SendHorizonal className="w-4 h-4" />
        </button>
      </div>
      <div className="flex justify-between items-center mt-1.5 px-1 text-[11px] text-slate-400">
        <span>Press Enter to send</span>
        {text.length > 3000 && (
          <span>
            {text.length}/{BOT_CONFIG.maxMessageLength}
          </span>
        )}
      </div>
    </form>
  );
};
