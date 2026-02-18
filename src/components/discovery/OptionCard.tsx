"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardOption {
  id: string;
  label: string;
  description?: string;
}

interface OptionCardProps {
  options: readonly CardOption[];
  value?: string;
  onChange: (value: string) => void;
  columns?: 1 | 2;
}

export function OptionCard({
  options,
  value,
  onChange,
  columns = 1,
}: OptionCardProps) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 ? "sm:grid-cols-2" : "grid-cols-1"
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex items-start gap-4 p-4 rounded-xl text-left transition-all",
              "border-2",
              isSelected
                ? "bg-blue-50 border-blue-500"
                : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"
            )}
          >
            {/* Radio indicator */}
            <div
              className={cn(
                "shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all",
                isSelected
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              )}
            >
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  "font-medium block",
                  isSelected ? "text-blue-900" : "text-gray-900"
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <span
                  className={cn(
                    "text-sm block mt-0.5",
                    isSelected ? "text-blue-700" : "text-gray-500"
                  )}
                >
                  {option.description}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
