"use client";

import { QuestionCard } from "../QuestionCard";
import { StyleSelector } from "../StyleSelector";
import { OptionChipGroup } from "../OptionChip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  STYLE_OPTIONS,
  STYLE_REASONS,
  StyleDirection,
} from "@/types/questionnaire";

interface Step1StyleProps {
  styleDirection?: StyleDirection;
  styleReasons: string[];
  inspirationUrls?: string[];
  onStyleChange: (style: StyleDirection) => void;
  onReasonToggle: (reason: string) => void;
  onUrlsChange: (urls: string[]) => void;
}

export function Step1Style({
  styleDirection,
  styleReasons,
  inspirationUrls = [],
  onStyleChange,
  onReasonToggle,
  onUrlsChange,
}: Step1StyleProps) {
  const [newUrl, setNewUrl] = useState("");

  const addUrl = () => {
    if (newUrl.trim() && inspirationUrls.length < 3) {
      onUrlsChange([...inspirationUrls, newUrl.trim()]);
      setNewUrl("");
    }
  };

  const removeUrl = (index: number) => {
    onUrlsChange(inspirationUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          What's your vibe?
        </h2>
        <p className="text-gray-500">
          Pick a style that speaks to you. We'll use this as inspiration.
        </p>
      </div>

      {/* Style Direction */}
      <QuestionCard
        title="Pick a style direction"
        description="Which of these feels most like your brand?"
        required
      >
        <StyleSelector
          options={STYLE_OPTIONS}
          value={styleDirection}
          onChange={(v) => onStyleChange(v as StyleDirection)}
        />
      </QuestionCard>

      {/* Style Reasons */}
      <QuestionCard
        title="What draws you to that style?"
        description="Select all that apply"
        required
      >
        <OptionChipGroup
          options={STYLE_REASONS}
          selected={styleReasons}
          onToggle={onReasonToggle}
        />
      </QuestionCard>

      {/* Inspiration URLs (Optional) */}
      <QuestionCard
        title="Any websites you love?"
        description="Share up to 3 websites that inspire you (any industry)"
      >
        <div className="space-y-3">
          {/* Existing URLs */}
          {inspirationUrls.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
            >
              <span className="flex-1 text-sm text-gray-700 truncate">
                {url}
              </span>
              <button
                type="button"
                onClick={() => removeUrl(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add new URL */}
          {inspirationUrls.length < 3 && (
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addUrl}
                disabled={!newUrl.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}

          {inspirationUrls.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              Optional - skip if you don't have any in mind
            </p>
          )}
        </div>
      </QuestionCard>
    </div>
  );
}
