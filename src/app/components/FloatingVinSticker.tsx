"use client";

import React from "react";
import Link from "next/link";

export default function FloatingVinSticker() {
  return (
    <div
      aria-label="Vehicle VIN verification quick access"
      className="fixed z-40 pointer-events-auto select-none"
      style={{
        bottom: "max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))",
        left: "max(1.25rem, calc(env(safe-area-inset-left, 0px) + 0.75rem))",
      }}
    >
      <Link
        href="/car-guide"
        aria-label="Check Part Through VIN"
        title="Check Part Through VIN"
        className="vin-sticker-btn group inline-flex items-center gap-2 sm:gap-2.5 rounded-full text-white font-semibold text-xs sm:text-sm tracking-normal shadow-[0_4px_16px_rgba(120,8,208,0.35)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.5)] focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:ring-offset-2 transition-all duration-300 ease-out"
        style={{
          backgroundColor: "#7808d0",
          borderRadius: "10rem",
          padding: "0.55rem 0.7rem 0.55rem 1.1rem",
          lineHeight: 1,
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        <span className="whitespace-nowrap font-semibold select-none">
          Check Part Through VIN
        </span>
        <span
          className="vin-sticker-icon-wrapper flex-shrink-0 relative rounded-full bg-white grid place-items-center overflow-hidden transition-colors duration-300 ease-out"
          style={{
            width: "28px",
            height: "28px",
            color: "#7808d0",
          }}
          aria-hidden="true"
        >
          {/* Primary SVG arrow */}
          <svg
            className="vin-sticker-icon-svg w-3 h-3.5 transition-transform duration-300 ease-in-out"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 15"
            fill="none"
          >
            <path
              fill="currentColor"
              d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.288.024z"
            />
          </svg>
          {/* Duplicate copy SVG arrow for hover slide effect */}
          <svg
            className="vin-sticker-icon-svg vin-sticker-icon-svg--copy w-3 h-3.5 absolute transition-transform duration-300 ease-in-out"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 15"
            fill="none"
          >
            <path
              fill="currentColor"
              d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.288.024z"
            />
          </svg>
        </span>
      </Link>
    </div>
  );
}
