"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
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

  return (
    <div className="absolute bottom-0 right-0 z-50 flex h-[5.5rem] w-[18.75rem] items-center justify-center bg-white text-center pointer-events-none md:h-24 md:w-[21.5rem]">
      <span className="text-2xl font-semibold tracking-[0.04em] text-[#4a3527] md:text-3xl">
        {formattedTime}
      </span>
    </div>
  );
}
