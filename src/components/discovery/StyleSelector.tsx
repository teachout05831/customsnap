"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StyleOption {
  id: string;
  label: string;
  description: string;
}

interface StyleSelectorProps {
  options: readonly StyleOption[];
  value?: string;
  onChange: (value: string) => void;
}

// Color schemes for each style
const STYLE_COLORS: Record<string, { bg: string; accent: string; text: string }> = {
  'modern-clean': {
    bg: 'bg-gradient-to-br from-gray-50 to-white',
    accent: 'border-gray-300',
    text: 'text-gray-900',
  },
  'bold-colorful': {
    bg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    accent: 'border-purple-400',
    text: 'text-white',
  },
  'warm-friendly': {
    bg: 'bg-gradient-to-br from-amber-100 to-orange-100',
    accent: 'border-amber-300',
    text: 'text-amber-900',
  },
  'professional-polished': {
    bg: 'bg-gradient-to-br from-slate-800 to-slate-900',
    accent: 'border-slate-600',
    text: 'text-white',
  },
};

export function StyleSelector({ options, value, onChange }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((option) => {
        const isSelected = value === option.id;
        const colors = STYLE_COLORS[option.id] || STYLE_COLORS['modern-clean'];

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "relative rounded-xl p-6 text-left transition-all duration-200",
              "border-2 hover:scale-[1.02]",
              colors.bg,
              isSelected
                ? "border-blue-500 ring-2 ring-blue-200"
                : `${colors.accent} hover:border-blue-300`
            )}
          >
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Style preview area */}
            <div className={cn("h-16 mb-4 rounded-lg border", colors.accent, "flex items-center justify-center")}>
              <div className="flex gap-1">
                <div className={cn("w-2 h-2 rounded-full", option.id === 'bold-colorful' ? 'bg-white/50' : 'bg-gray-300')} />
                <div className={cn("w-2 h-2 rounded-full", option.id === 'bold-colorful' ? 'bg-white/70' : 'bg-gray-400')} />
                <div className={cn("w-2 h-2 rounded-full", option.id === 'bold-colorful' ? 'bg-white' : 'bg-gray-500')} />
              </div>
            </div>

            {/* Label and description */}
            <h4 className={cn("font-semibold mb-1", colors.text)}>
              {option.label}
            </h4>
            <p className={cn("text-sm opacity-80", colors.text)}>
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
