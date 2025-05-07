// components/ui/card.tsx
import React from "react";
import classNames from "classnames";

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={classNames("bg-[#F5F5F5]  p-8 ", className)}>{children}</div>
);

export const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={classNames("space-y-4", className)}>{children}</div>;
