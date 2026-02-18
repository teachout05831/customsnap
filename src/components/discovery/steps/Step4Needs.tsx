"use client";

import { QuestionCard } from "../QuestionCard";
import { OptionChipGroup } from "../OptionChip";
import { OptionCard } from "../OptionCard";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PAGE_OPTIONS,
  FEATURE_OPTIONS,
  SERVICE_COUNT_OPTIONS,
  ServiceCount,
} from "@/types/questionnaire";

interface Step4NeedsProps {
  pagesNeeded: string[];
  mustHaveFeatures: string[];
  serviceCount?: ServiceCount;
  onPageToggle: (page: string) => void;
  onFeatureToggle: (feature: string) => void;
  onServiceCountChange: (count: ServiceCount) => void;
}

export function Step4Needs({
  pagesNeeded,
  mustHaveFeatures,
  serviceCount,
  onPageToggle,
  onFeatureToggle,
  onServiceCountChange,
}: Step4NeedsProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          What do you need?
        </h2>
        <p className="text-gray-500">
          Let's scope out your website. We've pre-selected the basics.
        </p>
      </div>

      {/* Pages Needed */}
      <QuestionCard
        title="What pages do you need?"
        description="We've pre-selected the essentials. Add or remove as needed."
        required
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PAGE_OPTIONS.map((page) => {
            const isSelected = pagesNeeded.includes(page.id);
            const isDisabled = 'disabled' in page && page.disabled;

            return (
              <button
                key={page.id}
                type="button"
                onClick={() => !isDisabled && onPageToggle(page.id)}
                disabled={isDisabled}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-all text-left",
                  "border-2",
                  isSelected
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700 hover:border-blue-300",
                  isDisabled && "opacity-60 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
                    isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="truncate">{page.label}</span>
              </button>
            );
          })}
        </div>
      </QuestionCard>

      {/* Must-Have Features */}
      <QuestionCard
        title="Must-have features"
        description="What functionality is essential?"
        required
      >
        <OptionChipGroup
          options={FEATURE_OPTIONS}
          selected={mustHaveFeatures}
          onToggle={onFeatureToggle}
        />
      </QuestionCard>

      {/* Service Count */}
      <QuestionCard
        title="How many services do you offer?"
        description="This helps us plan your services page"
        required
      >
        <div className="flex flex-wrap gap-3">
          {SERVICE_COUNT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onServiceCountChange(option.id as ServiceCount)}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-all",
                "border-2",
                serviceCount === option.id
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </QuestionCard>
    </div>
  );
}
