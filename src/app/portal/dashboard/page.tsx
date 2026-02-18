"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  Clock,
  FileText,
  Eye,
  LogOut,
  Sparkles,
  Calendar,
  ArrowRight,
  ExternalLink,
  Monitor,
  Smartphone,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface PreviewUrl {
  url: string;
  label: string;
}

interface Project {
  id: string;
  status: string;
  progress: number;
  current_step: string;
  preview_url?: string;
  created_at: string;
  updated_at: string;
}

// Helper to parse preview URLs - supports both old single URL and new JSON array format
function parsePreviewUrls(preview_url?: string): PreviewUrl[] {
  if (!preview_url) return [];
  try {
    const parsed = JSON.parse(preview_url);
    if (Array.isArray(parsed)) return parsed;
    return [{ url: preview_url, label: "Preview" }];
  } catch {
    return [{ url: preview_url, label: "Preview" }];
  }
}

interface Activity {
  id: string;
  action: string;
  description: string;
  created_at: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  intake: { label: "Discovery", color: "bg-blue-100 text-blue-700" },
  design: { label: "Design Phase", color: "bg-purple-100 text-purple-700" },
  development: { label: "Development", color: "bg-orange-100 text-orange-700" },
  review: { label: "Review", color: "bg-yellow-100 text-yellow-700" },
  revision: { label: "Revision", color: "bg-pink-100 text-pink-700" },
  launched: { label: "Launched", color: "bg-green-100 text-green-700" },
};

const milestones = [
  { key: "intake", label: "Discovery", icon: FileText },
  { key: "design", label: "Design", icon: Sparkles },
  { key: "development", label: "Build", icon: Clock },
  { key: "review", label: "Review", icon: Eye },
  { key: "launched", label: "Launched", icon: CheckCircle2 },
];

export default function PortalDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [selectedPreview, setSelectedPreview] = useState(0);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    // Check for admin "View As" mode via URL params
    const urlParams = new URLSearchParams(window.location.search);
    const viewAsLeadId = urlParams.get("viewAs");

    if (viewAsLeadId) {
      // Admin viewing as customer
      setIsAdminView(true);
      fetchLeadInfo(viewAsLeadId);
      fetchProjectData(viewAsLeadId);
      return;
    }

    // Normal customer auth check
    const isAuth = sessionStorage.getItem("portalAuth");
    if (!isAuth) {
      router.push("/portal");
      return;
    }

    const name = sessionStorage.getItem("portalName") || "there";
    const leadId = sessionStorage.getItem("portalLeadId");
    setCustomerName(name);

    if (leadId) {
      fetchProjectData(leadId);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const fetchLeadInfo = async (leadId: string) => {
    try {
      // Fetch lead info for admin view
      const response = await fetch(`/api/leads`);
      const data = await response.json();
      if (data.success) {
        const lead = data.leads.find((l: any) => l.id === leadId);
        if (lead) {
          setCustomerName(`${lead.first_name} ${lead.last_name}`);
        }
      }
    } catch (error) {
      console.error("Error fetching lead info:", error);
    }
  };

  const fetchProjectData = async (leadId: string) => {
    try {
      const response = await fetch(`/api/portal/project?leadId=${leadId}`);
      const data = await response.json();

      if (data.success) {
        setProject(data.project);
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("portalAuth");
    sessionStorage.removeItem("portalEmail");
    sessionStorage.removeItem("portalLeadId");
    sessionStorage.removeItem("portalName");
    router.push("/portal");
  };

  const getCurrentMilestoneIndex = () => {
    if (!project) return 0;
    return milestones.findIndex((m) => m.key === project.status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Get preview URLs
  const previewUrls = project ? parsePreviewUrls(project.preview_url) : [];
  const currentPreviewUrl = previewUrls[selectedPreview]?.url || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Admin View Banner */}
      {isAdminView && (
        <div className="bg-amber-500 text-amber-900 px-4 py-2 text-center text-sm font-medium sticky top-0 z-[60]">
          <Eye className="w-4 h-4 inline mr-2" />
          Admin View - Viewing portal as: {customerName}
          <button
            onClick={() => window.close()}
            className="ml-4 underline hover:no-underline"
          >
            Close
          </button>
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-200/50 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="hidden sm:block">
            <Logo size="sm" variant="full" />
          </div>
          <div className="block sm:hidden">
            <Logo size="sm" variant="icon" />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm hidden sm:block">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome & Status Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back, {customerName.split(" ")[0]}!
            </h1>
            <p className="text-slate-500 mt-1">
              {project?.current_step || "Here's the latest on your website project."}
            </p>
          </div>
          {project && (
            <div className={`px-4 py-2 rounded-full text-sm font-medium self-start ${statusLabels[project.status]?.color || "bg-slate-100 text-slate-600"}`}>
              {statusLabels[project.status]?.label || project.status}
            </div>
          )}
        </div>

        {project ? (
          <>
            {/* Progress Bar - Compact */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-100/50 p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Progress */}
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-slate-500 mb-2">
                    <span className="font-medium">Project Progress</span>
                    <span className="font-bold text-indigo-600">{project.progress}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Milestones - Horizontal on desktop, hidden on mobile */}
                <div className="hidden lg:flex items-center gap-2">
                  {milestones.map((milestone, index) => {
                    const Icon = milestone.icon;
                    const isComplete = index <= getCurrentMilestoneIndex();
                    const isCurrent = index === getCurrentMilestoneIndex();

                    return (
                      <div key={milestone.key} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isComplete
                              ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          } ${isCurrent ? "ring-2 ring-indigo-200" : ""}`}
                          title={milestone.label}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {index < milestones.length - 1 && (
                          <div className={`w-6 h-0.5 ${isComplete ? "bg-indigo-400" : "bg-slate-200"}`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* HERO PREVIEW SECTION */}
            {previewUrls.length > 0 ? (
              <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 p-4 sm:p-8 mb-6 overflow-hidden">
                {/* Preview Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <Eye className="w-6 h-6 text-indigo-600" />
                      {previewUrls.length > 1 ? "Your Website Options" : "Your Website Preview"}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      {previewUrls.length > 1
                        ? "Review each design option and let us know your favorite"
                        : "This is a live preview of your website in progress"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Device Toggle */}
                    <div className="flex bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => setPreviewMode("desktop")}
                        className={`p-2 rounded-md transition-all ${previewMode === "desktop" ? "bg-white shadow text-indigo-600" : "text-slate-500"}`}
                      >
                        <Monitor className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setPreviewMode("mobile")}
                        className={`p-2 rounded-md transition-all ${previewMode === "mobile" ? "bg-white shadow text-indigo-600" : "text-slate-500"}`}
                      >
                        <Smartphone className="w-5 h-5" />
                      </button>
                    </div>
                    {/* Open in New Tab */}
                    <a
                      href={currentPreviewUrl.startsWith("http") ? currentPreviewUrl : `https://${currentPreviewUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 sm:px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition-all text-sm sm:text-base"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">Open Full Site</span>
                      <span className="sm:hidden">Open</span>
                    </a>
                  </div>
                </div>

                {/* Multiple Options Banner + Tabs */}
                {previewUrls.length > 1 && (
                  <div className="mb-6">
                    {/* Attention Banner */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 mb-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-amber-900 text-lg">
                          You have {previewUrls.length} design options to review!
                        </h3>
                        <p className="text-amber-700 text-sm">
                          Click each option below to compare and find your favorite
                        </p>
                      </div>
                    </div>

                    {/* Option Tabs */}
                    <div className="flex flex-wrap gap-2">
                      {previewUrls.map((preview, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPreview(index)}
                          className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                            selectedPreview === index
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
                              : "bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                            selectedPreview === index ? "bg-white/20" : "bg-slate-100"
                          }`}>
                            {index + 1}
                          </span>
                          {preview.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Browser Frame */}
                <div className="relative">
                  {/* Desktop View */}
                  <div className={`${previewMode === "mobile" ? "hidden" : "block"}`}>
                    {/* Browser Chrome */}
                    <div className="bg-slate-800 rounded-t-2xl px-4 py-3 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-slate-700 rounded-lg px-4 py-1.5 text-slate-400 text-sm truncate">
                          {currentPreviewUrl}
                        </div>
                      </div>
                    </div>
                    {/* iframe */}
                    <div className="bg-white border-x-4 border-b-4 border-slate-800 rounded-b-2xl overflow-hidden">
                      <iframe
                        src={currentPreviewUrl.startsWith("http") ? currentPreviewUrl : `https://${currentPreviewUrl}`}
                        className="w-full h-[500px] sm:h-[600px] lg:h-[700px]"
                        title="Website Preview"
                      />
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className={`${previewMode === "mobile" ? "flex justify-center" : "hidden"}`}>
                    <div className="relative">
                      {/* Phone Frame */}
                      <div className="bg-slate-800 rounded-[3rem] p-3 shadow-2xl">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl"></div>
                        {/* Screen */}
                        <div className="bg-white rounded-[2.25rem] overflow-hidden w-[320px] sm:w-[375px]">
                          <iframe
                            src={currentPreviewUrl.startsWith("http") ? currentPreviewUrl : `https://${currentPreviewUrl}`}
                            className="w-full h-[600px] sm:h-[700px]"
                            title="Website Preview Mobile"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* No Preview Yet - Animated Mockup */
              <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 p-4 sm:p-8 mb-6 overflow-hidden">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                    We're Building Your Website
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Your preview will appear here soon
                  </p>
                </div>

                {/* Animated Browser Mockup */}
                <div className="relative">
                  {/* Browser Chrome */}
                  <div className="bg-slate-800 rounded-t-2xl px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-slate-700 rounded-lg px-4 py-1.5 text-slate-400 text-sm">
                        <span className="animate-pulse">yourwebsite.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated Website Skeleton */}
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50 border-x-4 border-b-4 border-slate-800 rounded-b-2xl overflow-hidden h-[400px] sm:h-[500px] lg:h-[550px] relative">
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>

                    {/* Fake Header */}
                    <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl animate-pulse"></div>
                        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                      <div className="hidden sm:flex gap-4">
                        <div className="h-3 w-16 bg-slate-200 rounded animate-pulse delay-100"></div>
                        <div className="h-3 w-16 bg-slate-200 rounded animate-pulse delay-200"></div>
                        <div className="h-3 w-16 bg-slate-200 rounded animate-pulse delay-300"></div>
                        <div className="h-8 w-24 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg animate-pulse"></div>
                      </div>
                    </div>

                    {/* Hero Section */}
                    <div className="p-6 sm:p-10">
                      <div className="max-w-2xl">
                        <div className="h-8 sm:h-12 w-3/4 bg-slate-200 rounded-lg mb-4 animate-pulse"></div>
                        <div className="h-4 w-full bg-slate-100 rounded mb-2 animate-pulse delay-100"></div>
                        <div className="h-4 w-5/6 bg-slate-100 rounded mb-6 animate-pulse delay-200"></div>
                        <div className="flex gap-3">
                          <div className="h-12 w-32 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl animate-pulse"></div>
                          <div className="h-12 w-32 bg-slate-200 rounded-xl animate-pulse delay-100"></div>
                        </div>
                      </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm" style={{ animationDelay: `${i * 150}ms` }}>
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mb-3 animate-pulse"></div>
                          <div className="h-4 w-2/3 bg-slate-200 rounded mb-2 animate-pulse"></div>
                          <div className="h-3 w-full bg-slate-100 rounded mb-1 animate-pulse"></div>
                          <div className="h-3 w-4/5 bg-slate-100 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-20 right-10 w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute bottom-20 left-10 w-12 h-12 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
                    <div className="absolute top-40 left-1/4 w-8 h-8 bg-gradient-to-br from-green-200 to-teal-300 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
                  </div>
                </div>

                {/* Status Message */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                  <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                    Currently in progress
                  </div>
                  <p className="text-slate-500 text-sm">
                    We'll notify you when your preview is ready to view
                  </p>
                </div>
              </div>
            )}

            {/* Activity Feed - Below Preview */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-100/50 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Recent Activity
              </h3>
              {activities.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activities.slice(0, 6).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex gap-3 p-4 bg-slate-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm">
                          {activity.action}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatDate(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>Updates will appear here as we work on your project.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* No Project State */
          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your Project is Being Set Up
            </h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              We're reviewing your discovery responses and will begin working on
              your website shortly. Check back soon!
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative mt-8 border-t border-slate-200/50 bg-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-sm text-slate-400">
            Questions? Contact us at{" "}
            <a
              href="mailto:support@customsnap.io"
              className="text-indigo-600 hover:text-indigo-800"
            >
              support@customsnap.io
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
