"use client";

export function MarqueeBanner() {
  return (
    <div className="relative w-full h-32 md:h-40 bg-[var(--bg-base)] z-20 flex items-center justify-center mt-8 mb-4">
      <div className="absolute w-[110vw] -left-[5vw] -rotate-2 bg-[var(--accent-secondary)] py-3 z-0 pointer-events-none shadow-2xl">
        <div 
          className="flex whitespace-nowrap w-max text-2xl font-black uppercase tracking-[0.1em] text-[var(--bg-base)]"
          style={{ animation: 'marquee 20s linear infinite' }}
        >
          <span className="pr-12">ENERGY · DISCIPLINE · DRIVE · RESILIENCE · FOCUS</span>
          <span className="pr-12">ENERGY · DISCIPLINE · DRIVE · RESILIENCE · FOCUS</span>
          <span className="pr-12">ENERGY · DISCIPLINE · DRIVE · RESILIENCE · FOCUS</span>
          <span className="pr-12">ENERGY · DISCIPLINE · DRIVE · RESILIENCE · FOCUS</span>
          <span className="pr-12">ENERGY · DISCIPLINE · DRIVE · RESILIENCE · FOCUS</span>
          <span className="pr-12">ENERGY · DISCIPLINE · DRIVE · RESILIENCE · FOCUS</span>
          <span className="pr-12">ENERGY · DISCIPLINE · DRIVE · RESILIENCE · FOCUS</span>
          <span className="pr-12">ENERGY · DISCIPLINE · DRIVE · RESILIENCE · FOCUS</span>
        </div>
      </div>
    </div>
  );
}
