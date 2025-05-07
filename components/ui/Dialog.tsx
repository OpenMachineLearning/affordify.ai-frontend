"use client";

import React, { ReactNode, useEffect } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Dialog({ isOpen, onClose, children }: DialogProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-[#2a2a337a] overflow-y-scroll">
      <div className="bg-white shadow-lg px-18 py-18 w-[1650px] h-[850px] min:h-full relative">
        <button
          className="absolute top-4 right-4 text-gray-700 text-4xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
