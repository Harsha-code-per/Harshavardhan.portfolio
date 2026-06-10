"use client";

import { LoaderCircle, Sliders, Activity } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { sendContactEmail } from "@/app/actions/sendEmail";

export function ContactForm() {
  const [isPending, setIsPending] = useState(false);
  const [frequency, setFrequency] = useState(433.92);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] TRANSCEIVER ONLINE: STANDBY FOR USER PAYLOAD",
    "[SYSTEM] AWAITING ENVELOPE INPUT..."
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => {
      const updated = [...prev, msg];
      // Keep only the last 6 lines to fit neatly in the HUD box
      return updated.slice(-6);
    });
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setFrequency(val);
    const noise = (Math.random() * 2 + 0.1).toFixed(2);
    // Determine signal strength
    let strength = "STABLE";
    if (val > 470) strength = "NOISY";
    else if (val < 415) strength = "ATTENUATED";
    else if (val >= 430 && val <= 438) strength = "OPTIMAL PEAK";

    addLog(`[TELEMETRY] FREQ CALIBRATED TO ${val.toFixed(2)} MHz | MODE: ${strength} | NOISE: ${noise} dB`);
  };

  const handleInputFocus = (field: string) => {
    addLog(`[CONSOLE] CONNECTED TO DIRECTORY: ${field.toUpperCase()}`);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsPending(true);
    addLog("[SIGNAL] PACKING ENVELOPE PAYLOAD...");
    addLog("[CONNECTIVITY] INJECTING QUANTUM HANDSHAKE TO PORT 443...");
    addLog("[SECURITY] APPLYING SSL ENCRYPTION ENVELOPE...");

    try {
      // Simulate visual signal handshake lag
      await new Promise((resolve) => setTimeout(resolve, 900));
      
      const result = await sendContactEmail(formData);

      if ("success" in result && result.success) {
        addLog("[STATUS] BROADCAST SUCCESSFUL (200 OK)");
        addLog(`[TELEMETRY] SECURE HASH: SHA-256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
        addLog("[SYSTEM] TRANSPONDER READY FOR NEW MISSION");
        toast.success("Transmission sent successfully.");
        form.reset();
        setFrequency(433.92);
        return;
      }

      if ("error" in result) {
        addLog(`[ERROR] BROADCAST REFUSED: ${result.error.toUpperCase()}`);
        addLog("[SYSTEM] SIGNAL FAULT DETECTED. READY TO RETRY.");
        toast.error(result.error);
      }
    } catch {
      addLog("[ERROR] TRANSMISSION TIMED OUT AT SERVICE PORT");
      addLog("[SYSTEM] SIGNAL FAULT DETECTED. READY TO RETRY.");
      toast.error("Unable to send signal right now.");
    } finally {
      setIsPending(false);
    }
  };

  // Helper to color code log outputs
  const renderLogLine = (log: string, idx: number) => {
    let colorClass = "text-white/40";
    if (log.startsWith("[ERROR]")) colorClass = "text-red-400 font-bold animate-pulse";
    else if (log.startsWith("[STATUS]")) colorClass = "text-emerald-400 font-bold";
    else if (log.startsWith("[SYSTEM]")) colorClass = "text-yellow-300/80";
    else if (log.startsWith("[TELEMETRY]")) colorClass = "text-[var(--accent-primary-light)]";
    else if (log.startsWith("[CONNECTIVITY]") || log.startsWith("[SECURITY]")) colorClass = "text-cyan-400";
    else if (log.startsWith("[SIGNAL]")) colorClass = "text-pink-400";
    else if (log.startsWith("[CONSOLE]")) colorClass = "text-white/60";

    return (
      <div key={idx} className={`${colorClass} leading-tight font-mono text-[9px] uppercase tracking-wide`}>
        {log}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Dynamic Terminal Screen Output */}
      <div className="relative border border-white/10 bg-black/60 rounded-sm p-4 h-32 flex flex-col justify-end space-y-1 overflow-hidden shadow-inner">
        <div className="absolute right-3 top-3 flex items-center gap-1.5 font-mono text-[8px] text-white/30">
          <Activity className="h-3 w-3 text-[var(--accent-primary)] animate-pulse" />
          <span>CONSOLE SHIELD ACTIVE</span>
        </div>
        {logs.map((log, idx) => renderLogLine(log, idx))}
      </div>

      {/* Holographic Frequency Alignment Tuner */}
      <div className="space-y-2.5 p-3.5 border border-white/5 bg-white/[0.01] rounded-sm">
        <div className="flex justify-between items-center text-[10px] font-mono uppercase">
          <span className="text-white/40 flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
            Signal Frequency Align
          </span>
          <span className="font-bold text-[var(--accent-primary-light)]">
            {frequency.toFixed(2)} MHz
          </span>
        </div>
        <input 
          type="range"
          min="400.00"
          max="499.99"
          step="0.05"
          value={frequency}
          onChange={handleFrequencyChange}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
        />
        <div className="flex justify-between text-[8px] font-mono text-white/30">
          <span>400.00 MHz</span>
          <span>499.99 MHz</span>
        </div>
      </div>

      {/* Cockpit inputs */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            NAME://
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            onFocus={() => handleInputFocus("name")}
            placeholder="ACCESS PROTOCOL IDENTIFIER"
            className="w-full rounded-sm border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-xs uppercase tracking-wide text-white outline-none transition placeholder:text-white/20 focus:border-[var(--accent-primary)] focus:shadow-[0_0_15px_var(--accent-primary-glow)]"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            EMAIL://
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            onFocus={() => handleInputFocus("email")}
            placeholder="ROUTING GATEWAY DESTINATION"
            className="w-full rounded-sm border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-xs text-white outline-none transition placeholder:text-white/20 focus:border-[var(--accent-primary)] focus:shadow-[0_0_15px_var(--accent-primary-glow)]"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            MESSAGE://
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            onFocus={() => handleInputFocus("message")}
            placeholder="INJECT SECURE MASS PAYLOAD DIRECTIVE..."
            className="w-full resize-none rounded-sm border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-xs text-white outline-none transition placeholder:text-white/20 focus:border-[var(--accent-primary)] focus:shadow-[0_0_15px_var(--accent-primary-glow)]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="relative overflow-hidden w-full h-12 rounded-sm border border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 flex items-center justify-center font-mono text-xs font-black uppercase tracking-[0.25em] text-[var(--accent-primary)] transition-all hover:bg-[var(--accent-primary)] hover:text-black hover:shadow-[0_0_30px_var(--accent-primary-glow)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            BROADCASTING PAYLOAD...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            TRANSMIT SIGNAL
          </span>
        )}
      </button>
    </form>
  );
}
