"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function PortalLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/portal/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        // Store session
        sessionStorage.setItem("portalAuth", "true");
        sessionStorage.setItem("portalEmail", email);
        sessionStorage.setItem("portalLeadId", result.leadId);
        sessionStorage.setItem("portalName", result.name);
        router.push("/portal/dashboard");
      } else {
        setError(result.message || "Email not found. Please check and try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" variant="icon" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 mt-1">Check on your website progress</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email you signed up with"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Checking...
                </span>
              ) : (
                "View My Project"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have a project yet?{" "}
            <a href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Get started
            </a>
          </p>
        </div>

        {/* Brand */}
        <div className="flex justify-center mt-6">
          <Logo size="sm" variant="full" />
        </div>
      </div>
    </div>
  );
}
