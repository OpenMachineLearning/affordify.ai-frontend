// components/ui/button.tsx
import React from "react";
import classNames from "classnames";

export const Button = ({
  children,
  onClick,
  disabled,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "px-8 py-4 rounded-xl font-medium transition-all",
        "bg-[#1976E1] text-white cursor-pointer disabled:bg-white disabled:text-[#2A2A33] disabled:cursor-not-allowed w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
