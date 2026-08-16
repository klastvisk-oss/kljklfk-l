import React, { useEffect, useRef, useState } from "react";

/* ————— SVG filter bank (mounted once) ————— */
export function SvgFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="rough-hi" x="-6%" y="-12%" width="112%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.035" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="rough-md" x="-6%" y="-12%" width="112%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022 0.03" numOctaves="2" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="rough-lo" x="-6%" y="-12%" width="112%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.028" numOctaves="1" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="rough-lines" x="-4%" y="-8%" width="108%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="1" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* long-wavelength wobble for box outlines — the ink frame, not the contents */}
        <filter id="rough-box" x="-6%" y="-10%" width="112%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.019" numOctaves="2" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* the same ruling, gently redrawn — a seeded cycle makes every box edge shimmer, low-key */}
        <filter id="rough-box-boil" x="-6%" y="-10%" width="112%" height="120%">
          <feTurbulence id="boil-box-noise" type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ink-bleed" x="-8%" y="-14%" width="116%" height="128%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.1" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9" result="threshold" />
          <feComposite in="threshold" in2="SourceGraphic" operator="over" />
        </filter>
        <filter id="boil" x="-7%" y="-14%" width="114%" height="128%">
          <feTurbulence id="boil-noise" type="fractalNoise" baseFrequency="0.02 0.045" numOctaves="2" seed="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

/* ————— line boil: cycle turbulence seeds — hero edges fast, box edges slow ————— */
export function useBoil() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const noise = document.getElementById("boil-noise");
    const boxNoise = document.getElementById("boil-box-noise");
    let seed = 1;
    let boxSeed = 2;
    const t = setInterval(() => { if (noise) noise.setAttribute("seed", String(seed++ % 8)); }, 130);
    const t2 = setInterval(() => { if (boxNoise) boxNoise.setAttribute("seed", String(1 + (boxSeed++ % 6))); }, 175);
    return () => { clearInterval(t); clearInterval(t2); };
  }, []);
}

/* ————— scroll reveal ————— */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("revealed");
            io.disconnect();
          }
        });
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ————— hand-drawn squiggle underline ————— */
export function Squiggle({ color = "var(--orange)", w = 190, h = 10, className = "" }: { color?: string; w?: number; h?: number; className?: string }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden="true" style={{ display: "block" }}>
      <path
        d={`M2 ${h / 2 + 1} Q ${w * 0.1} 1 ${w * 0.18} ${h / 2} T ${w * 0.36} ${h / 2 + 1} T ${w * 0.54} ${h / 2 - 1} T ${w * 0.72} ${h / 2 + 1} T ${w * 0.9} ${h / 2} T ${w - 2} ${h / 2 + 1}`}
        fill="none"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ————— hand divider (torn rule) ————— */
export function HandDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 12" preserveAspectRatio="none" className={`w-full ${className}`} style={{ height: 12 }} aria-hidden="true">
      <path
        d="M0 6 Q 30 2 60 6 T 120 6 T 180 7 T 240 5 T 300 6 T 360 7 T 420 5 T 480 6 T 540 7 T 600 6 T 660 5 T 720 7 T 780 6 T 840 5 T 900 6"
        fill="none"
        stroke="var(--ink)"
        strokeOpacity="0.4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ————— curly arrow with optional margin note ————— */
export function CurlyArrow({
  label,
  flip = false,
  className = "",
}: {
  label?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <svg width="54" height="58" viewBox="0 0 54 58" aria-hidden="true">
        <path
          d="M8 4 C 40 6, 48 22, 38 34 C 31 42, 18 40, 20 48 C 21 52, 27 53, 32 51"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="300"
          strokeDashoffset="300"
          style={{ animation: "dash-draw 0.9s 0.3s ease forwards" }}
        />
        <path d="M26 47 L34 51 L27 56" fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label && (
        <span className="mono text-[11px] font-semibold tracking-wide" style={{ color: "var(--orange)", transform: flip ? "scaleX(-1)" : undefined }}>
          {label}
        </span>
      )}
    </div>
  );
}

/* ————— status stamp ————— */
export function StatusStamp({ status, small = false }: { status: "done" | "wip" | "planned"; small?: boolean }) {
  const map = {
    done: { txt: "done", cls: "stamp-green" },
    wip: { txt: "in progress", cls: "stamp-orange" },
    planned: { txt: "planned", cls: "stamp-ink" },
  }[status];
  return (
    <span className={`stamp ${map.cls}`} style={small ? { fontSize: 10.5, padding: "1px 8px 2px", letterSpacing: "0.1em" } : undefined}>
      {map.txt}
    </span>
  );
}

/* ————— glossary popover — hover / focus any term ————— */
export function Term({ children, def, color = "var(--orange)" }: { children: React.ReactNode; def: string; color?: string }) {
  return (
    <span className="relative inline-block group/t term-anchor" tabIndex={0}>
      <span
        className="cursor-help"
        style={{
          textDecoration: "underline",
          textDecorationStyle: "dotted",
          textDecorationColor: color,
          textDecorationThickness: 2,
          textUnderlineOffset: 3,
        }}
      >
        {children}
      </span>
      <span
        role="tooltip"
        className="absolute z-40 left-1/2 bottom-full mb-2 w-60 -translate-x-1/2 scale-95 opacity-0 pointer-events-none transition-all duration-150 group-hover/t:opacity-100 group-hover/t:scale-100 group-focus-within/t:opacity-100 group-focus-within/t:scale-100"
      >
        <span className="block card-2 px-3 py-2 text-[13px] leading-snug" style={{ boxShadow: "3px 3px 0 var(--ink)", fontWeight: 480 }}>
          <span className="mono block text-[10px] font-bold tracking-[0.14em] mb-0.5" style={{ color: "var(--orange)" }}>
            DEFINITION
          </span>
          {def}
        </span>
        <svg width="14" height="8" viewBox="0 0 14 8" className="mx-auto block" style={{ marginTop: -1 }} aria-hidden="true">
          <path d="M1 1 L7 7 L13 1" fill="var(--card-2)" stroke="var(--ink)" strokeWidth="1.6" />
        </svg>
      </span>
    </span>
  );
}

/* ————— tiny C syntax highlighter ————— */
const C_RULES: [RegExp, string][] = [
  [/\/\/[^\n]*/g, "tk-c"],
  [/"(?:[^"\\\n]|\\.)*"/g, "tk-s"],
  [/#\s*\w+[^\n]*/g, "tk-p"],
  [/\b(int|long|char|float|double|void|unsigned|size_t|bool|auto|const|static|struct|typedef|enum)\b/g, "tk-t"],
  [/\b(if|else|for|while|do|return|break|continue|switch|case|default|sizeof|true|false|NULL)\b/g, "tk-k"],
  [/\b\d+(?:\.\d+)?[uUlL]*\b/g, "tk-n"],
];

function highlightC(code: string): React.ReactNode[] {
  type Tok = { start: number; end: number; cls: string };
  const toks: Tok[] = [];
  for (const [re, cls] of C_RULES) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(code))) {
      const start = m.index, end = m.index + m[0].length;
      if (toks.some((t) => start < t.end && end > t.start)) continue;
      toks.push({ start, end, cls });
    }
  }
  toks.sort((a, b) => a.start - b.start);
  const out: React.ReactNode[] = [];
  let pos = 0;
  toks.forEach((t, i) => {
    if (t.start > pos) out.push(code.slice(pos, t.start));
    out.push(
      <span key={i} className={t.cls}>
        {code.slice(t.start, t.end)}
      </span>
    );
    pos = t.end;
  });
  if (pos < code.length) out.push(code.slice(pos));
  return out;
}

export function CodeBlock({ code, caption, title }: { code: string; caption?: string; title?: string }) {
  return (
    <figure className="my-1">
      {title && (
        <div className="mono inline-block text-[10.5px] font-bold tracking-[0.16em] px-3 py-1 border-2 border-b-0 border-[var(--ink)] rounded-t-[10px] bg-[var(--ink)] text-[var(--paper)]" style={{ borderRadius: "9px 13px 0 0" }}>
          {title}
        </div>
      )}
      <div className="codeframe" style={title ? { borderRadius: "0 14px 12px 10px / 0 9px 15px 10px" } : undefined}>
        <pre className="codeblock">
          <code>{highlightC(code)}</code>
        </pre>
      </div>
      {caption && (
        <figcaption className="mt-2 text-[13.5px] italic" style={{ color: "var(--ink-soft)" }}>
          ↳ {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ————— ink progress bar ————— */
export function InkProgress({ value, color = "var(--green)", label }: { value: number; color?: string; label?: string }) {
  return (
    <div>
      {label && (
        <div className="flex justify-between mono text-[11px] font-bold mb-1 tracking-wide" style={{ color: "var(--ink-soft)" }}>
          <span>{label}</span>
          <span>{Math.round(value * 100)}%</span>
        </div>
      )}
      <div className="h-[13px] border-2 border-[var(--ink)] bg-[#fcf8ec] rough-lo" style={{ borderRadius: "7px 10px 6px 11px / 10px 6px 11px 7px" }}>
        <div
          className="h-full transition-[width] duration-700 ease-out"
          style={{
            width: `${Math.max(2, value * 100)}%`,
            background: color,
            borderRadius: "4px 8px 4px 8px",
            backgroundImage: "repeating-linear-gradient(-45deg, rgba(243,235,215,0.28) 0 5px, transparent 5px 10px)",
          }}
        />
      </div>
    </div>
  );
}

/* ————— reviewed-lessons persistence ————— */
const LS_KEY = "maratona-lab-reviewed";
export function useReviewed() {
  const [reviewed, setReviewed] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(LS_KEY) || "[]") as string[]);
    } catch {
      return new Set<string>();
    }
  });
  const toggle = (id: string) =>
    setReviewed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify([...next]));
      } catch {
        /* private mode */
      }
      return next;
    });
  const mark = (id: string) =>
    setReviewed((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify([...next]));
      } catch {
        /* private mode */
      }
      return next;
    });
  return { reviewed, toggle, mark };
}

export const ReviewedContext = React.createContext<ReturnType<typeof useReviewed> | null>(null);
export function useReviewedCtx() {
  return React.useContext(ReviewedContext);
}
