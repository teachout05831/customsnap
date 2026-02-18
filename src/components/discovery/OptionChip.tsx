"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function OptionChip({ label, selected, onClick, disabled }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
        "border-2",
        selected
          ? "bg-blue-50 border-blue-500 text-blue-700"
          : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {selected && <Check className="w-4 h-4" />}
      {label}
    </button>
  );
}

interface OptionChipGroupProps {
  options: readonly { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  disabledIds?: string[];
}

export function OptionChipGroup({
  options,
  selected,
  onToggle,
  disabledIds = [],
}: OptionChipGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <OptionChip
          key={option.id}
          label={option.label}
          selected={selected.includes(option.id)}
          onClick={() => onToggle(option.id)}
          disabled={disabledIds.includes(option.id)}
        />
      ))}
    </div>
  );
}
