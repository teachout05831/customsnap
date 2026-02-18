"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Check, Sparkles, Clock, Shield, Heart } from "lucide-react";

// Design 2: Dark Mode - Modern & Bold
export default function Landing2() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 px-4 py-2 rounded-full text-sm mb-8">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-gray-300">Custom-built websites, not templates</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              See Your New Website{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text">
                — Free
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
              We'll hand-build you a custom preview in 2-3 days. No payment. No commitment. Just results.
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-md mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Smith"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-gray-300">Current Website (optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="yourcompany.com"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-lg py-6"
                >
                  Get My Free Preview
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 text-center mt-4">
                No credit card required. Ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It <span className="text-purple-400">Works</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { num: "01", title: "Submit Your Info", desc: "Tell us about your business in 2 minutes" },
              { num: "02", title: "We Design", desc: "Our team hand-crafts your preview in 2-3 days" },
              { num: "03", title: "You Decide", desc: "Love it? Go live. Not ready? No pressure." }
            ].map((item) => (
              <div key={item.num} className="relative">
                <div className="text-6xl font-bold text-gray-800 mb-4">{item.num}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Human-Crafted", desc: "Real designers, not AI slop" },
              { icon: Clock, title: "2-3 Day Delivery", desc: "Fast, but not rushed" },
              { icon: Shield, title: "Zero Risk", desc: "Free preview, no catches" },
              { icon: Sparkles, title: "Conversion-Focused", desc: "Built to get you leads" }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                <item.icon className="h-10 w-10 text-purple-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Not Another <span className="text-red-400 line-through">Template</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30">
              <h3 className="text-xl font-bold text-red-400 mb-4">Other AI Builders</h3>
              <ul className="space-y-3 text-gray-400">
                {["Same template, different logo", "Generated in 60 seconds", "Looks like everyone else", "No human review", "Cookie-cutter copy"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30">
              <h3 className="text-xl font-bold text-green-400 mb-4">What We Do</h3>
              <ul className="space-y-3 text-gray-400">
                {["Actually custom design", "Hand-crafted in 2-3 days", "Unique to your business", "Human quality control", "Conversion-focused copy"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to see what's possible?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Your free preview is waiting. No payment required.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-cyan-500 text-lg px-8 py-6">
            Get My Free Preview
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 text-gray-500 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} CustomSnap. All rights reserved.</p>
      </footer>
    </div>
  );
}
