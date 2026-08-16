import React, { useEffect, useRef, useState } from "react";

/* shared lab furniture */

export function useTicker(active: boolean, speed: number, onTick: () => void, interval = 700) {
  const cb = useRef(onTick);
  cb.current = onTick;
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => cb.current(), Math.max(90, interval / speed));
    return () => clearInterval(t);
  }, [active, speed, interval]);
}

export function SpeedSlider({ speed, setSpeed }: { speed: number; setSpeed: (v: number) => void }) {
  return (
    <label className="flex items-center gap-2 mono text-[11px] font-bold tracking-wide" style={{ color: "var(--ink-soft)" }}>
      SPEED
      <input
        type="range"
        min={0.5}
        max={2.5}
        step={0.25}
        value={speed}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
        style={{ width: 90 }}
        aria-label="playback speed"
      />
      <span className="w-9">{speed.toFixed(2).replace(/0$/, "")}×</span>
    </label>
  );
}

export function LabControls({
  playing,
  onPlay,
  onStep,
  onReset,
  speed,
  setSpeed,
  stepLabel = "step",
}: {
  playing: boolean;
  onPlay: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  setSpeed: (v: number) => void;
  stepLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className="btn btn-sm btn-ink" onClick={onPlay}>
        {playing ? (
          <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden="true"><rect x="1" y="1" width="3.4" height="10" fill="currentColor" /><rect x="6.6" y="1" width="3.4" height="10" fill="currentColor" /></svg>
        ) : (
          <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden="true"><path d="M1.5 1 L10 6 L1.5 11 Z" fill="currentColor" /></svg>
        )}
        {playing ? "pause" : "play"}
      </button>
      <button className="btn btn-sm" onClick={onStep}>{stepLabel} →</button>
      <button className="btn btn-sm btn-ghost" onClick={onReset}>↺ reset</button>
      <SpeedSlider speed={speed} setSpeed={setSpeed} />
    </div>
  );
}

export function LabFrame({
  code,
  title,
  children,
  footer,
  accent = "var(--orange)",
}: {
  code: string;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="card sketch-boil my-4 overflow-hidden" style={{ background: "var(--card)", "--sketch-inset": "1px" } as React.CSSProperties}>
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b-2 border-[var(--ink)]" style={{ background: accent, color: "#fbf5e4" }}>
        <span className="mono text-[11px] font-bold tracking-[0.18em]">LAB {code}</span>
        <span className="f-ui text-[14px] rough-lo" style={{ fontWeight: 750 }}>{title}</span>
        <span className="mono text-[10px] tracking-[0.14em] opacity-80 hidden sm:block">INTERACTIVE</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
      {footer && <div className="px-4 sm:px-5 py-2.5 border-t-2 border-dashed border-[var(--ink-faint)] text-[13px] italic" style={{ color: "var(--ink-soft)" }}>{footer}</div>}
    </div>
  );
}

/* one array cell */
export function Cell({
  value,
  state = "idle",
  small = false,
  label,
}: {
  value: React.ReactNode;
  state?: "idle" | "active" | "dim" | "hit" | "dead";
  small?: boolean;
  label?: React.ReactNode;
}) {
  const bg =
    state === "active" ? "var(--orange)" :
    state === "hit" ? "var(--green)" :
    state === "dead" ? "rgba(29,47,78,0.10)" :
    state === "dim" ? "rgba(29,47,78,0.06)" : "#fcf8ec";
  const color =
    state === "active" ? "#fdf3e7" :
    state === "hit" ? "#eef6ea" :
    state === "dead" ? "rgba(29,47,78,0.38)" : "var(--ink)";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="border-2 border-[var(--ink)] mono font-bold flex items-center justify-center transition-all duration-200"
        style={{
          width: small ? 30 : 40,
          height: small ? 30 : 40,
          fontSize: small ? 11.5 : 14,
          background: bg,
          color,
          borderRadius: "7px 10px 6px 11px / 10px 6px 11px 7px",
          textDecoration: state === "dead" ? "line-through 2.5px var(--orange)" : undefined,
          transform: state === "active" ? "translateY(-4px)" : undefined,
          boxShadow: state === "active" || state === "hit" ? "2px 2px 0 var(--ink)" : undefined,
        }}
      >
        {value}
      </div>
      {label !== undefined && <div className="mono text-[9.5px] font-semibold" style={{ color: "var(--ink-soft)" }}>{label}</div>}
    </div>
  );
}

/* a labeled variable box for the "memory" panel */
export function VarBox({ name, value, accent = "var(--ink)" }: { name: string; value: React.ReactNode; accent?: string }) {
  return (
    <div className="border-2 border-[var(--ink)] px-3 py-1.5 bg-[#fcf8ec] min-w-[74px]" style={{ borderRadius: "8px 12px 7px 13px / 12px 7px 13px 8px" }}>
      <div className="mono text-[10px] font-bold tracking-[0.12em]" style={{ color: accent }}>{name}</div>
      <div className="mono text-[19px] font-bold leading-tight">{value}</div>
    </div>
  );
}

export function LabNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="card-2 px-4 py-3 mt-3 text-[14.5px]" style={{ borderRadius: "6px 14px 8px 12px / 14px 8px 12px 6px" }}>
      {children}
    </div>
  );
}
