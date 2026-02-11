import { forwardRef, type InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, ...props }, ref
) {
  return (
    <input
      ref={ref}
      className={twMerge(
        "h-12 w-full rounded-lg border border-border bg-card px-4 text-[15px] outline-none placeholder:text-muted focus:ring-2 focus:ring-primary/30",
        className
      )}
      {...props}
    />
  );
});
