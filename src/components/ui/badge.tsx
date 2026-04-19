import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)] ${className ?? ""}`}
      {...props}
    >
      {children}
    </span>
  );
}
