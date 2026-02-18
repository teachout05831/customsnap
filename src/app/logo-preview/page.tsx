"use client";

import { useState } from "react";

/* ── Design 1: Bolt — Electric blue with lightning bolt icon ── */
function Logo1({ size = "md", variant = "full", dark = false }: LogoBaseProps) {
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s.icon} relative rounded-xl bg-gradient-to-br ${dark ? "from-blue-400 to-cyan-400" : "from-blue-600 to-cyan-500"} flex items-center justify-center shadow-lg ${dark ? "shadow-blue-400/30" : "shadow-blue-300/50"}`}>
        <svg viewBox="0 0 24 24" fill="none" className={`${s.svg} text-white`}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
        </svg>
      </div>
      {variant === "full" && (
        <span className={`font-extrabold ${dark ? "text-white" : "text-slate-900"} ${s.text} tracking-tight`}>
          Custom<span className={dark ? "text-cyan-300" : "text-blue-600"}>Snap</span>
        </span>
      )}
    </div>
  );
}

/* ── Design 2: Rounded — Warm gradient, soft pill shape ── */
function Logo2({ size = "md", variant = "full", dark = false }: LogoBaseProps) {
  const s = sizes[size];
  return (
    <div className="flex items-center gap-3">
      <div className={`${s.icon} rounded-2xl bg-gradient-to-br from-orange-400 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-200/50`}>
        <span className={`text-white font-black ${s.iconText} tracking-tighter`}>cs</span>
      </div>
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold ${dark ? "text-white" : "text-slate-900"} ${s.text} tracking-tight`}>
            customsnap
          </span>
          <span className={`${dark ? "text-white/50" : "text-slate-400"} ${s.sub} font-medium tracking-[0.2em]`}>
            websites that work
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Design 3: Sharp — Black and accent, angular and minimal ── */
function Logo3({ size = "md", variant = "full", dark = false }: LogoBaseProps) {
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2">
      <div className={`${s.icon} ${dark ? "bg-white" : "bg-slate-900"} rounded-lg flex items-center justify-center`}>
        <svg viewBox="0 0 24 24" fill="none" className={`${s.svg} ${dark ? "text-slate-900" : "text-white"}`}>
          <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      {variant === "full" && (
        <div className="flex items-baseline gap-1">
          <span className={`font-black ${dark ? "text-white" : "text-slate-900"} ${s.text} uppercase tracking-wider`}>
            Custom
          </span>
          <span className={`font-black text-emerald-500 ${s.text} uppercase tracking-wider`}>
            Snap
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Design 4: Cursor — Mouse pointer / click concept ── */
function Logo4({ size = "md", variant = "full", dark = false }: LogoBaseProps) {
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s.icon} rounded-xl ${dark ? "bg-violet-500" : "bg-gradient-to-br from-violet-600 to-indigo-600"} flex items-center justify-center shadow-lg shadow-violet-200/50 relative`}>
        <svg viewBox="0 0 24 24" fill="none" className={`${s.svg} text-white`}>
          <path d="M5 3l14 8-6.5 2L9 19.5 5 3z" fill="currentColor" />
        </svg>
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />
      </div>
      {variant === "full" && (
        <span className={`font-bold ${dark ? "text-white" : "text-slate-900"} ${s.text} tracking-tight`}>
          Custom<span className={dark ? "text-violet-300" : "text-violet-600"}>Snap</span>
          <span className={`${dark ? "text-white/40" : "text-slate-300"} font-normal`}>.io</span>
        </span>
      )}
    </div>
  );
}

/* ── Design 5: Stack — Layered cards / website builder concept ── */
function Logo5({ size = "md", variant = "full", dark = false }: LogoBaseProps) {
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s.icon} relative flex items-center justify-center`}>
        {/* Stacked layers */}
        <div className={`absolute inset-0 ${dark ? "bg-teal-300/30" : "bg-teal-200"} rounded-lg translate-x-1 translate-y-1`} />
        <div className={`absolute inset-0 ${dark ? "bg-teal-400/50" : "bg-teal-300"} rounded-lg translate-x-0.5 translate-y-0.5`} />
        <div className={`relative inset-0 ${s.icon} bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md`}>
          <svg viewBox="0 0 24 24" fill="none" className={`${s.svg} text-white`}>
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M4 9h16" stroke="currentColor" strokeWidth="2" />
            <circle cx="7" cy="6.5" r="1" fill="currentColor" />
            <circle cx="10" cy="6.5" r="1" fill="currentColor" />
          </svg>
        </div>
      </div>
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold ${dark ? "text-white" : "text-slate-900"} ${s.text} tracking-tight`}>
            Custom<span className={dark ? "text-teal-300" : "text-teal-600"}>Snap</span>
          </span>
          <span className={`${dark ? "text-white/50" : "text-slate-400"} ${s.sub} tracking-widest uppercase font-medium`}>
            .io
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Design 6: Stack Blue — Same layered cards but in blue to complement orange ── */
function Logo6({ size = "md", variant = "full", dark = false }: LogoBaseProps) {
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s.icon} relative flex items-center justify-center`}>
        {/* Stacked layers */}
        <div className={`absolute inset-0 ${dark ? "bg-blue-300/30" : "bg-blue-200"} rounded-lg translate-x-1 translate-y-1`} />
        <div className={`absolute inset-0 ${dark ? "bg-blue-400/50" : "bg-blue-300"} rounded-lg translate-x-0.5 translate-y-0.5`} />
        <div className={`relative inset-0 ${s.icon} bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md`}>
          <svg viewBox="0 0 24 24" fill="none" className={`${s.svg} text-white`}>
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M4 9h16" stroke="currentColor" strokeWidth="2" />
            <circle cx="7" cy="6.5" r="1" fill="currentColor" />
            <circle cx="10" cy="6.5" r="1" fill="currentColor" />
          </svg>
        </div>
      </div>
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold ${dark ? "text-white" : "text-slate-900"} ${s.text} tracking-tight`}>
            Custom<span className={dark ? "text-blue-300" : "text-blue-600"}>Snap</span>
          </span>
          <span className={`${dark ? "text-white/50" : "text-slate-400"} ${s.sub} tracking-widest uppercase font-medium`}>
            .io
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Design 7: Sharp Blue — Same as #3 but Snap in blue instead of emerald ── */
function Logo7({ size = "md", variant = "full", dark = false }: LogoBaseProps) {
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2">
      <div className={`${s.icon} ${dark ? "bg-white" : "bg-slate-900"} rounded-lg flex items-center justify-center`}>
        <svg viewBox="0 0 24 24" fill="none" className={`${s.svg} ${dark ? "text-slate-900" : "text-white"}`}>
          <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      {variant === "full" && (
        <div className="flex items-baseline gap-1">
          <span className={`font-black ${dark ? "text-white" : "text-slate-900"} ${s.text} uppercase tracking-wider`}>
            Custom
          </span>
          <span className={`font-black text-blue-600 ${s.text} uppercase tracking-wider`}>
            Snap
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Shared types and sizes ── */
interface LogoBaseProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  dark?: boolean;
}

const sizes = {
  sm: { icon: "w-8 h-8", text: "text-lg", sub: "text-[10px]", svg: "w-4 h-4", iconText: "text-sm" },
  md: { icon: "w-10 h-10", text: "text-xl", sub: "text-xs", svg: "w-5 h-5", iconText: "text-base" },
  lg: { icon: "w-14 h-14", text: "text-2xl", sub: "text-sm", svg: "w-7 h-7", iconText: "text-lg" },
};

/* ── Preview Page ── */
export default function LogoPreview() {
  const [darkMode, setDarkMode] = useState(false);

  const logos = [
    { name: "Bolt", desc: "Electric blue, lightning bolt icon — techy and fast", Component: Logo1 },
    { name: "Rounded", desc: "Warm gradient pill, lowercase — friendly and approachable", Component: Logo2 },
    { name: "Sharp", desc: "Black + accent, grid icon — minimal and professional", Component: Logo3 },
    { name: "Cursor", desc: "Violet with mouse pointer — web-focused and modern", Component: Logo4 },
    { name: "Stack", desc: "Teal layered cards, browser icon — builder concept", Component: Logo5 },
    { name: "Stack Blue", desc: "Blue layered cards, browser icon — complements orange brand", Component: Logo6 },
    { name: "Sharp Blue", desc: "Same as #3 Sharp but with 'Snap' in blue — pairs with orange brand", Component: Logo7 },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-slate-50"} transition-colors`}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
              Logo Options
            </h1>
            <p className={`mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Pick your favorite — click the number to select
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              darkMode ? "bg-white text-slate-900" : "bg-slate-900 text-white"
            }`}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="space-y-8">
          {logos.map((logo, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 border-2 transition-all ${
                darkMode
                  ? "bg-slate-800/50 border-slate-700 hover:border-slate-500"
                  : "bg-white border-slate-200 hover:border-slate-400"
              } shadow-sm hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    darkMode ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-700"
                  } mr-3`}>
                    {i + 1}
                  </span>
                  <span className={`font-bold text-lg ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {logo.name}
                  </span>
                  <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"} ml-11`}>
                    {logo.desc}
                  </p>
                </div>
              </div>

              {/* Size variants */}
              <div className="space-y-6 ml-11">
                {/* Full logos at different sizes */}
                <div className="flex items-center gap-10 flex-wrap">
                  <div>
                    <p className={`text-xs font-medium mb-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>LARGE</p>
                    <logo.Component size="lg" variant="full" dark={darkMode} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium mb-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>MEDIUM</p>
                    <logo.Component size="md" variant="full" dark={darkMode} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium mb-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>SMALL</p>
                    <logo.Component size="sm" variant="full" dark={darkMode} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium mb-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>ICON</p>
                    <logo.Component size="md" variant="icon" dark={darkMode} />
                  </div>
                </div>

                {/* On colored bar preview */}
                <div className="rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 flex items-center justify-between">
                    <logo.Component size="sm" variant="full" dark={true} />
                    <span className="text-white/70 text-sm">On colored header</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
