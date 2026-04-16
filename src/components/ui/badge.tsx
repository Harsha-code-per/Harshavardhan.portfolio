import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[#e0d1bc] bg-[#f9f4eb] px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-700 ${className ?? ""}`}
      {...props}
    >
      {children}
    </span>
  );
}
