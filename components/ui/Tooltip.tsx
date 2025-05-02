/* Tooltip.tsx */
"use client";
import { ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  return (
    /* ── wrapper ── */
    <span className="relative inline-flex items-center group">
      {children}

      {/* ── balloon ── */}
      <span
        /* the pointer-events-none keeps
           the tooltip from stealing focus */
        className="
          absolute
          bottom-full left-1/2 -translate-x-1/2 mb-2
          w-80 max-w-xs rounded-xl bg-white p-4 text-sm leading-snug text-[#2A2A33]
          shadow-lg
          
          opacity-0 scale-95
          transition-all duration-200 ease-out
          pointer-events-none
          group-hover:opacity-100 group-hover:scale-100
          z-10
        "
      >
        {text}
      </span>
    </span>
  );
}
