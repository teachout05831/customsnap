"use client";

import { QuestionCard } from "../QuestionCard";
import { OptionChipGroup } from "../OptionChip";
import { Textarea } from "@/components/ui/textarea";
import { AVOID_OPTIONS } from "@/types/questionnaire";

interface Step2AvoidProps {
  avoidFeatures: string[];
  dealbreakers?: string;
  onFeatureToggle: (feature: string) => void;
  onDealbrokersChange: (text: string) => void;
}

export function Step2Avoid({
  avoidFeatures,
  dealbreakers = "",
  onFeatureToggle,
  onDealbrokersChange,
}: Step2AvoidProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          What do you hate?
        </h2>
        <p className="text-gray-500">
          Help us understand what to avoid. Pick all the things that make you cringe.
        </p>
      </div>

      {/* Pet Peeves */}
      <QuestionCard
        title="Website pet peeves"
        description="Select all that apply - be honest!"
        required
      >
        <OptionChipGroup
          options={AVOID_OPTIONS}
          selected={avoidFeatures}
          onToggle={onFeatureToggle}
        />
      </QuestionCard>

      {/* Dealbreakers */}
      <QuestionCard
        title="Anything else to avoid?"
        description="Specific things you'd hate to see on your site"
      >
        <Textarea
          placeholder="e.g., 'No sliders', 'Don't use blue', 'No stock photos of handshakes'..."
          value={dealbreakers}
          onChange={(e) => onDealbrokersChange(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <p className="text-sm text-gray-400 mt-2">Optional</p>
      </QuestionCard>
    </div>
  );
}
