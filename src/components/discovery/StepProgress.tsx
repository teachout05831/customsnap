"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const STEP_LABELS = [
  "Style",
  "Avoid",
  "Challenges",
  "Needs",
  "Goals",
];

export function StepProgress({
  currentStep,
  totalSteps,
  onStepClick,
}: StepProgressProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />

        {/* Progress line */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {/* Step circles */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }, (_, i) => {
            const step = i + 1;
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            const isClickable = step < currentStep;

            return (
              <button
                key={step}
                type="button"
                onClick={() => isClickable && onStepClick?.(step)}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center",
                  isClickable && "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    isCompleted && "bg-blue-500 text-white",
                    isCurrent && "bg-blue-500 text-white ring-4 ring-blue-100",
                    !isCompleted && !isCurrent && "bg-gray-200 text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium hidden sm:block",
                    isCurrent && "text-blue-600",
                    isCompleted && "text-gray-600",
                    !isCompleted && !isCurrent && "text-gray-400"
                  )}
                >
                  {STEP_LABELS[i]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile step indicator */}
      <div className="sm:hidden mt-4 text-center">
        <span className="text-sm font-medium text-gray-600">
          Step {currentStep} of {totalSteps}: {STEP_LABELS[currentStep - 1]}
        </span>
      </div>
    </div>
  );
}
