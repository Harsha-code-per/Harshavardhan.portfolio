"use client";

import { useEffect, useState } from "react";

interface LiveClockProps {
  size?: "sm" | "lg";
}

export function LiveClock({ size = "sm" }: LiveClockProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => {
      setTime(new Date());
    };

    const initialTimer = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, []);

  const formattedTime = time
    ? time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "--:--:-- --";

  const formattedDate = time
    ? time.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

  if (size === "lg") {
    return (
      <div className="flex flex-col items-end gap-0.5">
        <span
          className="font-mono text-base tracking-[0.18em] tabular-nums"
          style={{ color: "var(--text-primary)" }}
        >
          {formattedTime}
        </span>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "var(--text-muted)" }}
        >
          {formattedDate} · IST
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-[var(--border-default)] bg-[color:rgba(17,17,24,0.72)] px-3 py-1.5">
      <span className="font-mono text-xs tracking-[0.22em] text-[var(--text-muted)]">
        {formattedTime}
      </span>
    </div>
  );
}
