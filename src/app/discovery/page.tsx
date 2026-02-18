"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DiscoveryPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the static HTML discovery page
    window.location.href = "/discovery.html";
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  );
}
