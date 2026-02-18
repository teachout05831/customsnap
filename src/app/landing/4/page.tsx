"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Check, Clock, Users, Zap, Award, Loader2, User } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

// Design 4: Orange Energy - Bold & Warm
export default function Landing4() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const leadData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      currentWebsite: formData.get("website") || null,
    };

    try {
      // Save lead to database
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      const result = await response.json();

      if (result.success) {
        // Store lead ID for portal access
        localStorage.setItem("leadId", result.leadId);
        localStorage.setItem("leadEmail", leadData.email as string);
        localStorage.setItem("leadData", JSON.stringify(leadData));

        // Redirect to discovery survey
        router.push("/discovery");
      } else {
        // If save failed, still redirect to discovery
        router.push("/discovery");
      }
    } catch (error) {
      console.error("Error saving lead:", error);
      // Redirect to discovery even on error
      router.push("/discovery");
    }
  };
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Top Bar with Portal Link */}
      <div className="bg-orange-600 text-white">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Logo size="sm" variant="full" dark />
          <Link
            href="/portal"
            className="flex items-center gap-1.5 text-sm font-medium hover:text-orange-200 transition-colors"
          >
            <User className="w-4 h-4" />
            Login
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)', backgroundSize: '50px 50px' }} />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Tired of Your{" "}
              <span className="underline decoration-yellow-300 decoration-4">Outdated Website?</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-10 max-w-2xl mx-auto">
              Get a free preview of your upgrade. Custom-built by real humans. Ready in 2-3 days. Zero risk.
            </p>

            {/* Inline Form */}
            <div id="signup-form" className="bg-white rounded-2xl p-8 max-w-lg mx-auto text-left shadow-2xl">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                    <Input id="firstName" name="firstName" placeholder="John" className="border-gray-300 text-gray-900" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                    <Input id="lastName" name="lastName" placeholder="Smith" className="border-gray-300 text-gray-900" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="john@company.com" className="border-gray-300 text-gray-900" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">Phone</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" className="border-gray-300 text-gray-900" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-gray-700">Current Website (optional)</Label>
                  <Input id="website" name="website" placeholder="yourcompany.com" className="border-gray-300 text-gray-900" />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6 font-bold disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Get My Free Preview
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
              <p className="text-sm text-gray-500 text-center mt-4">
                No payment. No commitment. Just results.
              </p>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100V0C240 66 480 100 720 100C960 100 1200 66 1440 0V100H0Z" fill="#fff7ed"/>
          </svg>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-8 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {[
              { icon: Award, text: "Human-Crafted Quality" },
              { icon: Users, text: "Trusted by Local Businesses" },
              { icon: Clock, text: "2-3 Day Turnaround" },
              { icon: Zap, text: "Free Preview" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-700">
                <item.icon className="h-5 w-5 text-orange-500" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Here's How It Works
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Three simple steps. One amazing website.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { num: "1", title: "Tell Us About You", desc: "Quick form, takes 2 minutes. Tell us about your business and what you need.", color: "bg-orange-500" },
              { num: "2", title: "We Build Your Preview", desc: "Our team hand-crafts a custom design in 2-3 business days. For free.", color: "bg-orange-600" },
              { num: "3", title: "You Decide", desc: "Love it? We make it live. Not ready? Keep the preview, no pressure.", color: "bg-red-500" }
            ].map((item) => (
              <div key={item.num} className="relative">
                <div className={`w-14 h-14 ${item.color} text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-4`}>
                  {item.num}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Why We're <span className="text-orange-500">Different</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Other "AI Builders"</h3>
              <ul className="space-y-3 text-gray-600">
                {["Generic templates with your logo", "Built in 60 seconds = looks like it", "Same layout as everyone else", "No human ever sees it"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What We Do</h3>
              <ul className="space-y-3 text-gray-600">
                {["Actually custom to your business", "Hand-crafted in 2-3 days", "Unique design, just for you", "Human quality control on every site"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tired of Your <span className="underline decoration-yellow-300 decoration-4">Outdated Website?</span>
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Get a free preview of your upgrade. Custom-built by real humans. Ready in 2-3 days. Zero risk.
          </p>
          <Button
            size="lg"
            className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-6 font-bold"
            onClick={() => document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get My Free Preview
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-orange-100 mt-4">
            No payment. No commitment. Just results.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} CustomSnap. All rights reserved.</p>
      </footer>
    </div>
  );
}
