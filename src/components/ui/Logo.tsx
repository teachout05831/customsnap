interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  dark?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: "w-8 h-8", text: "text-lg", svg: "w-4 h-4" },
  md: { icon: "w-10 h-10", text: "text-xl", svg: "w-5 h-5" },
  lg: { icon: "w-14 h-14", text: "text-2xl", svg: "w-7 h-7" },
};

export function Logo({ size = "md", variant = "full", dark = false, className = "" }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon mark — grid blocks */}
      <div className={`${s.icon} ${dark ? "bg-white" : "bg-slate-900"} rounded-lg flex items-center justify-center`}>
        <svg viewBox="0 0 24 24" fill="none" className={`${s.svg} ${dark ? "text-slate-900" : "text-white"}`}>
          <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      {/* Wordmark */}
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
