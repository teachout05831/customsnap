"use client";

import { QuestionCard } from "../QuestionCard";
import { OptionCard } from "../OptionCard";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  GOAL_OPTIONS,
  TIMELINE_OPTIONS,
  Timeline,
} from "@/types/questionnaire";

interface Step5GoalsProps {
  primaryGoal?: string;
  timeline?: Timeline;
  additionalNotes?: string;
  onGoalChange: (goal: string) => void;
  onTimelineChange: (timeline: Timeline) => void;
  onNotesChange: (notes: string) => void;
}

export function Step5Goals({
  primaryGoal,
  timeline,
  additionalNotes = "",
  onGoalChange,
  onTimelineChange,
  onNotesChange,
}: Step5GoalsProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          What does success look like?
        </h2>
        <p className="text-gray-500">
          Almost done! Tell us your main goal and timeline.
        </p>
      </div>

      {/* Primary Goal */}
      <QuestionCard
        title="#1 goal for your website"
        description="What's the most important thing it should do?"
        required
      >
        <OptionCard
          options={GOAL_OPTIONS}
          value={primaryGoal}
          onChange={onGoalChange}
          columns={2}
        />
      </QuestionCard>

      {/* Timeline */}
      <QuestionCard
        title="When do you need this?"
        description="No pressure - just helps us plan"
        required
      >
        <div className="grid grid-cols-2 gap-3">
          {TIMELINE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onTimelineChange(option.id as Timeline)}
              className={cn(
                "p-4 rounded-lg text-sm font-medium transition-all text-left",
                "border-2",
                timeline === option.id
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </QuestionCard>

      {/* Additional Notes */}
      <QuestionCard
        title="Anything else we should know?"
        description="Special requests, upcoming events, unique aspects of your business..."
      >
        <Textarea
          placeholder="Tell us anything that might help us build the perfect website for you..."
          value={additionalNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-[120px] resize-none"
        />
        <p className="text-sm text-gray-400 mt-2">Optional</p>
      </QuestionCard>
    </div>
  );
}
