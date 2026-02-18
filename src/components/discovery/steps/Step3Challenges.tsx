"use client";

import { QuestionCard } from "../QuestionCard";
import { OptionCard } from "../OptionCard";
import { OptionChipGroup } from "../OptionChip";
import { Textarea } from "@/components/ui/textarea";
import { CHALLENGE_OPTIONS, FRUSTRATION_OPTIONS } from "@/types/questionnaire";

interface Step3ChallengesProps {
  biggestChallenge?: string;
  otherFrustrations?: string[];
  problemImpact?: string;
  onChallengeChange: (challenge: string) => void;
  onFrustrationToggle: (frustration: string) => void;
  onImpactChange: (text: string) => void;
}

export function Step3Challenges({
  biggestChallenge,
  otherFrustrations = [],
  problemImpact = "",
  onChallengeChange,
  onFrustrationToggle,
  onImpactChange,
}: Step3ChallengesProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          What's not working?
        </h2>
        <p className="text-gray-500">
          Understanding your challenges helps us build something that actually solves them.
        </p>
      </div>

      {/* Biggest Challenge */}
      <QuestionCard
        title="What's your biggest challenge?"
        description="Pick the one that matters most right now"
        required
      >
        <OptionCard
          options={CHALLENGE_OPTIONS}
          value={biggestChallenge}
          onChange={onChallengeChange}
        />
      </QuestionCard>

      {/* Other Frustrations */}
      <QuestionCard
        title="Any other frustrations?"
        description="Select all that apply"
      >
        <OptionChipGroup
          options={FRUSTRATION_OPTIONS}
          selected={otherFrustrations}
          onToggle={onFrustrationToggle}
        />
        <p className="text-sm text-gray-400 mt-2">Optional</p>
      </QuestionCard>

      {/* Problem Impact */}
      <QuestionCard
        title="How is this affecting your business?"
        description="Help us understand the real impact"
      >
        <Textarea
          placeholder="e.g., 'Losing customers to competitors with better sites', 'Embarrassed to share my website link'..."
          value={problemImpact}
          onChange={(e) => onImpactChange(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <p className="text-sm text-gray-400 mt-2">Optional</p>
      </QuestionCard>
    </div>
  );
}
