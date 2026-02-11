import { type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={twMerge("rounded-lg border border-border bg-card shadow-card", className)}>{children}</div>;
}
export function CardHeader({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={twMerge("p-6", className)}>{children}</div>;
}
export function CardContent({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={twMerge("px-6 pb-6", className)}>{children}</div>;
}
