import { type ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "ghost" | "outline";
type Size = "md" | "lg";

const base = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed";
const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};
const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-95",
  ghost: "bg-transparent hover:bg-black/5",
  outline: "border border-border hover:bg-black/5",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return (
    <button ref={ref} className={twMerge(base, sizes[size], variants[variant], className)} {...props} />
  );
});
