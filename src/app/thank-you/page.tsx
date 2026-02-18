"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Phone,
  Clock,
  Upload,
  Palette,
  Ban,
  Target,
  FileText,
  Sparkles,
  ArrowRight,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  STYLE_OPTIONS,
  CHALLENGE_OPTIONS,
  GOAL_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/types/questionnaire";

const STORAGE_KEY = "discovery-questionnaire";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SurveyData = Record<string, any>;

// Helper to get label from options
function getLabel(options: readonly { id: string; label: string }[], id?: string) {
  return options.find((o) => o.id === id)?.label || id || "—";
}

function getLabels(options: readonly { id: string; label: string }[], ids: string[]) {
  return ids.map((id) => getLabel(options, id)).join(", ") || "—";
}

function getArray(data: SurveyData, arrayKey: string, singleKey: string): string[] {
  const arr = data[arrayKey];
  if (Array.isArray(arr) && arr.length > 0) return arr;
  const single = data[singleKey];
  if (single) return [single];
  return [];
}

export default function ThankYouPage() {
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [questionnaire, setQuestionnaire] = useState<SurveyData | null>(null);

  // Load questionnaire data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setQuestionnaire(JSON.parse(saved));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const hasQuestionnaireData = questionnaire && questionnaire.completedAt;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Success Header */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">You're In!</h1>
            <p className="text-xl text-gray-300 mb-8">
              We've received your request and we're excited to show you what's
              possible.
            </p>

            {/* Portal Access Card */}
            <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 shadow-xl mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold">Your Client Portal</h3>
                      <p className="text-indigo-100 text-sm">
                        Track your project progress anytime
                      </p>
                    </div>
                  </div>
                  <a
                    href="/portal"
                    className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors"
                  >
                    Access Portal
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Questionnaire Summary */}
      {hasQuestionnaireData && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-white text-center mb-8">
                Here's What You Told Us
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Style */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <Palette className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Style Direction
                        </h3>
                        <p className="text-white font-semibold">
                          {getLabels(STYLE_OPTIONS, getArray(questionnaire, "styleDirections", "styleDirection"))}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Avoid */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <Ban className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Avoiding
                        </h3>
                        <p className="text-white text-sm">
                          {(questionnaire.avoidFeatures || []).length} pet peeves noted
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Challenge */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <Target className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Challenges
                        </h3>
                        <p className="text-white font-semibold text-sm">
                          {getLabels(CHALLENGE_OPTIONS, getArray(questionnaire, "challenges", "biggestChallenge"))}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pages */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Pages Needed
                        </h3>
                        <p className="text-white text-sm">
                          {(questionnaire.pagesNeeded || []).length} pages selected
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Goal */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <Sparkles className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Goals
                        </h3>
                        <p className="text-white font-semibold text-sm">
                          {getLabels(GOAL_OPTIONS, getArray(questionnaire, "websiteGoals", "primaryGoal"))}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline / Notes */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <Clock className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          {questionnaire.timeline ? "Timeline" : "Features"}
                        </h3>
                        <p className="text-white font-semibold text-sm">
                          {questionnaire.timeline
                            ? getLabel(TIMELINE_OPTIONS, questionnaire.timeline)
                            : `${(questionnaire.mustHaveFeatures || []).length} must-have features`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* What Happens Next */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              What Happens Next
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Phone,
                  title: "We'll Reach Out",
                  desc: "Expect a call or email within 24 hours to learn more about your business.",
                  highlight: true,
                },
                {
                  icon: Clock,
                  title: "We Build",
                  desc: "Our team hand-crafts your custom preview in 2-3 business days.",
                },
                {
                  icon: CheckCircle,
                  title: "You Review",
                  desc: "See your preview, give feedback, and decide if you want to move forward.",
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className={`${
                    item.highlight
                      ? "border-green-500 border-2"
                      : "border-gray-700"
                  } bg-gray-800/50`}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 ${
                        item.highlight ? "bg-green-500" : "bg-gray-700"
                      } rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Optional Logo Upload */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Want to Get Ahead?
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Upload your logo now and we'll include it in your preview.
                  </p>

                  {!logoUploaded ? (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-gray-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="logo-upload"
                        onChange={() => setLogoUploaded(true)}
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="h-10 w-10 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">
                          <span className="text-white font-medium">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          PNG, JPG, SVG up to 10MB
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                      <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-4" />
                      <p className="text-green-400 font-medium">
                        Logo uploaded successfully!
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        We'll include it in your preview.
                      </p>
                    </div>
                  )}

                  <p className="text-gray-500 text-sm mt-4">
                    Don't have a logo? No problem — we can work with that too.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-gray-400 mb-4">Questions? Reach out anytime:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Phone className="h-4 w-4 mr-2" />
                (555) 123-4567
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                hello@yourcompany.com
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 text-gray-500 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} CustomSnap. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
