"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  LogOut,
  RefreshCw,
  Mail,
  Phone,
  Globe,
  Calendar,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Edit3,
  Check,
  X,
  ExternalLink,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface Lead {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  current_website?: string;
  source?: string;
  status?: string;
  created_at?: string;
}

interface Discovery {
  id: string;
  lead_id?: string;
  style_directions?: string[];
  style_reasons?: string[];
  challenges?: string[];
  pages_needed?: string[];
  must_have_features?: string[];
  website_goals?: string[];
  completed_at?: string;
  created_at?: string;
}

interface PreviewUrl {
  url: string;
  label: string;
}

interface Project {
  id: string;
  lead_id: string;
  discovery_id?: string;
  status: string;
  progress: number;
  current_step?: string;
  preview_url?: string;
  created_at?: string;
  updated_at?: string;
  lead?: Lead;
}

// Helper to parse preview URLs - supports both old single URL and new JSON array format
function parsePreviewUrls(preview_url?: string): PreviewUrl[] {
  if (!preview_url) return [];
  try {
    const parsed = JSON.parse(preview_url);
    if (Array.isArray(parsed)) return parsed;
    // If it's not an array, treat as single URL
    return [{ url: preview_url, label: "Preview" }];
  } catch {
    // If JSON parse fails, it's an old single URL format
    return [{ url: preview_url, label: "Preview" }];
  }
}

// Helper to stringify preview URLs for storage
function stringifyPreviewUrls(urls: PreviewUrl[]): string {
  if (urls.length === 0) return "";
  if (urls.length === 1 && urls[0].label === "Preview") {
    // Keep backward compatibility for single URL
    return urls[0].url;
  }
  return JSON.stringify(urls);
}

const STATUS_OPTIONS = [
  { value: "intake", label: "Discovery", color: "bg-blue-100 text-blue-700" },
  { value: "design", label: "Design", color: "bg-purple-100 text-purple-700" },
  { value: "development", label: "Development", color: "bg-orange-100 text-orange-700" },
  { value: "review", label: "Review", color: "bg-yellow-100 text-yellow-700" },
  { value: "revision", label: "Revision", color: "bg-pink-100 text-pink-700" },
  { value: "launched", label: "Launched", color: "bg-green-100 text-green-700" },
];

const PROGRESS_BY_STATUS: Record<string, number> = {
  intake: 20,
  design: 40,
  development: 60,
  review: 80,
  revision: 85,
  launched: 100,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [discoveryData, setDiscoveryData] = useState<Discovery[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"projects" | "leads" | "discovery">("projects");
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ status: "", progress: 0, current_step: "" });
  const [editPreviewUrls, setEditPreviewUrls] = useState<PreviewUrl[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem("adminAuth");
    if (!isAuth) {
      router.push("/admin");
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [leadsRes, discoveryRes, projectsRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/discovery"),
        fetch("/api/admin/projects"),
      ]);

      const leadsData = await leadsRes.json();
      const discoveryDataRes = await discoveryRes.json();
      const projectsData = await projectsRes.json();

      if (leadsData.success) setLeads(leadsData.leads || []);
      if (discoveryDataRes.success) setDiscoveryData(discoveryDataRes.leads || []);
      if (projectsData.success) setProjects(projectsData.projects || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminUser");
    router.push("/admin");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const startEdit = (project: Project) => {
    setEditingProject(project.id);
    setEditForm({
      status: project.status,
      progress: project.progress,
      current_step: project.current_step || "",
    });
    setEditPreviewUrls(parsePreviewUrls(project.preview_url));
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setEditForm({ status: "", progress: 0, current_step: "" });
    setEditPreviewUrls([]);
  };

  const addPreviewUrl = () => {
    setEditPreviewUrls([...editPreviewUrls, { url: "", label: `Option ${editPreviewUrls.length + 1}` }]);
  };

  const removePreviewUrl = (index: number) => {
    setEditPreviewUrls(editPreviewUrls.filter((_, i) => i !== index));
  };

  const updatePreviewUrl = (index: number, field: "url" | "label", value: string) => {
    const updated = [...editPreviewUrls];
    updated[index] = { ...updated[index], [field]: value };
    setEditPreviewUrls(updated);
  };

  const viewAsCustomer = (leadId: string) => {
    // Open portal in new tab with the lead's session
    const portalUrl = `/portal/dashboard?viewAs=${leadId}`;
    window.open(portalUrl, "_blank");
  };

  const saveProject = async (projectId: string) => {
    setSaving(true);
    try {
      // Filter out empty URLs
      const validUrls = editPreviewUrls.filter(u => u.url.trim() !== "");
      const preview_url = stringifyPreviewUrls(validUrls);

      const response = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId, ...editForm, preview_url }),
      });

      const result = await response.json();
      if (result.success) {
        await fetchData();
        setEditingProject(null);
      } else {
        alert("Failed to update project: " + result.message);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project");
    }
    setSaving(false);
  };

  const handleStatusChange = (newStatus: string) => {
    setEditForm({
      ...editForm,
      status: newStatus,
      progress: PROGRESS_BY_STATUS[newStatus] || editForm.progress,
    });
  };

  const getStatusBadge = (status: string) => {
    const option = STATUS_OPTIONS.find((s) => s.value === status);
    return option || { label: status, color: "bg-gray-100 text-gray-700" };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" variant="full" />
            <span className="text-sm text-gray-500 border-l border-gray-200 pl-3">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                <p className="text-sm text-gray-500">Active Projects</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
                <p className="text-sm text-gray-500">Total Leads</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{discoveryData.length}</p>
                <p className="text-sm text-gray-500">Discovery Forms</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {leads.filter((l) => {
                    const date = new Date(l.created_at || "");
                    const today = new Date();
                    return date.toDateString() === today.toDateString();
                  }).length}
                </p>
                <p className="text-sm text-gray-500">Today's Leads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === "projects" ? "default" : "outline"}
            onClick={() => setActiveTab("projects")}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Projects ({projects.length})
          </Button>
          <Button
            variant={activeTab === "leads" ? "default" : "outline"}
            onClick={() => setActiveTab("leads")}
          >
            <Users className="w-4 h-4 mr-2" />
            Leads ({leads.length})
          </Button>
          <Button
            variant={activeTab === "discovery" ? "default" : "outline"}
            onClick={() => setActiveTab("discovery")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Discovery ({discoveryData.length})
          </Button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              Loading...
            </div>
          ) : activeTab === "projects" ? (
            /* Projects Tab */
            projects.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No projects yet</p>
                <p className="text-sm">Projects are created when leads complete the discovery form</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {projects.map((project) => {
                  const statusBadge = getStatusBadge(project.status);
                  const isEditing = editingProject === project.id;

                  return (
                    <div key={project.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">
                              {(project.lead?.first_name?.[0] || "?").toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {project.lead?.first_name} {project.lead?.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{project.lead?.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                              {statusBadge.label}
                            </span>
                            <div className="w-24">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{project.progress}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-500 rounded-full transition-all"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                            </div>
                            {!isEditing && (
                              <Button variant="ghost" size="sm" onClick={() => startEdit(project)}>
                                <Edit3 className="w-4 h-4" />
                              </Button>
                            )}
                            <button onClick={() => toggleExpand(project.id)} className="p-1">
                              {expandedItem === project.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Edit Form */}
                      {expandedItem === project.id && (
                        <div className="mt-4 ml-14 p-4 bg-gray-50 rounded-lg">
                          {isEditing ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                  </label>
                                  <select
                                    value={editForm.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  >
                                    {STATUS_OPTIONS.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Progress ({editForm.progress}%)
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={editForm.progress}
                                    onChange={(e) => setEditForm({ ...editForm, progress: parseInt(e.target.value) })}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Current Step (shown to customer)
                                </label>
                                <input
                                  type="text"
                                  value={editForm.current_step}
                                  onChange={(e) => setEditForm({ ...editForm, current_step: e.target.value })}
                                  placeholder="e.g., Working on homepage design..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Preview URLs
                                  </label>
                                  <Button variant="outline" size="sm" onClick={addPreviewUrl}>
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add Preview
                                  </Button>
                                </div>
                                {editPreviewUrls.length === 0 ? (
                                  <p className="text-sm text-gray-500 italic">No preview URLs added. Click "Add Preview" to add one.</p>
                                ) : (
                                  <div className="space-y-2">
                                    {editPreviewUrls.map((preview, index) => (
                                      <div key={index} className="flex gap-2 items-center">
                                        <input
                                          type="text"
                                          value={preview.label}
                                          onChange={(e) => updatePreviewUrl(index, "label", e.target.value)}
                                          placeholder="Label (e.g., Option A)"
                                          className="w-32 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                          type="url"
                                          value={preview.url}
                                          onChange={(e) => updatePreviewUrl(index, "url", e.target.value)}
                                          placeholder="https://preview.example.com"
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removePreviewUrl(index)}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={() => saveProject(project.id)} disabled={saving}>
                                  {saving ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  ) : (
                                    <Check className="w-4 h-4 mr-2" />
                                  )}
                                  Save Changes
                                </Button>
                                <Button variant="outline" onClick={cancelEdit}>
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2 text-sm">
                              <div className="flex gap-4">
                                <span className="text-gray-500">Current Step:</span>
                                <span className="text-gray-900">{project.current_step || "Not set"}</span>
                              </div>
                              {project.preview_url && (
                                <div>
                                  <span className="text-gray-500">Preview URLs:</span>
                                  <div className="mt-1 space-y-1">
                                    {parsePreviewUrls(project.preview_url).map((preview, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{preview.label}</span>
                                        <a
                                          href={preview.url.startsWith("http") ? preview.url : `https://${preview.url}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-indigo-600 hover:underline flex items-center gap-1"
                                        >
                                          {preview.url}
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="flex gap-4">
                                <span className="text-gray-500">Created:</span>
                                <span className="text-gray-900">{formatDate(project.created_at)}</span>
                              </div>
                              <div className="flex gap-4">
                                <span className="text-gray-500">Updated:</span>
                                <span className="text-gray-900">{formatDate(project.updated_at)}</span>
                              </div>
                              <div className="pt-2 flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => startEdit(project)}>
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit Project
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => viewAsCustomer(project.lead_id)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Portal
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : activeTab === "leads" ? (
            /* Leads Tab */
            leads.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No leads yet</p>
                <p className="text-sm">Leads will appear here when people fill out the form</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-4 hover:bg-gray-50">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpand(lead.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {(lead.first_name?.[0] || "?").toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {lead.first_name} {lead.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{lead.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">{formatDate(lead.created_at)}</span>
                        {expandedItem === lead.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedItem === lead.id && (
                      <div className="mt-4 pl-14 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {lead.phone || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {lead.email || "N/A"}
                        </div>
                        {lead.current_website && (
                          <div className="flex items-center gap-2 text-gray-600 col-span-2">
                            <Globe className="w-4 h-4" />
                            <a
                              href={lead.current_website.startsWith("http") ? lead.current_website : `https://${lead.current_website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {lead.current_website}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Discovery Tab */
            discoveryData.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No discovery forms yet</p>
                <p className="text-sm">Forms will appear here when people complete the questionnaire</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {discoveryData.map((form) => (
                  <div key={form.id} className="p-4 hover:bg-gray-50">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpand(form.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Discovery Form #{form.id.slice(-6)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {form.style_directions?.join(", ") || "No styles selected"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">
                          {formatDate(form.completed_at || form.created_at)}
                        </span>
                        {expandedItem === form.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedItem === form.id && (
                      <div className="mt-4 pl-14 space-y-3 text-sm">
                        {form.lead_id && (
                          <div>
                            <span className="font-medium text-gray-700">Linked Lead ID: </span>
                            <span className="text-gray-600">{form.lead_id}</span>
                          </div>
                        )}
                        {form.style_directions && form.style_directions.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-700">Style Directions: </span>
                            <span className="text-gray-600">{form.style_directions.join(", ")}</span>
                          </div>
                        )}
                        {form.challenges && form.challenges.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-700">Challenges: </span>
                            <span className="text-gray-600">{form.challenges.join(", ")}</span>
                          </div>
                        )}
                        {form.pages_needed && form.pages_needed.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-700">Pages Needed: </span>
                            <span className="text-gray-600">{form.pages_needed.join(", ")}</span>
                          </div>
                        )}
                        {form.must_have_features && form.must_have_features.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-700">Features: </span>
                            <span className="text-gray-600">{form.must_have_features.join(", ")}</span>
                          </div>
                        )}
                        {form.website_goals && form.website_goals.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-700">Goals: </span>
                            <span className="text-gray-600">{form.website_goals.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
