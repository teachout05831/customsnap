"use client";

import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import type { ClientConfig } from "@/types";

interface ServiceHeroProps {
  client: ClientConfig;
}

export function ServiceHero({ client }: ServiceHeroProps) {
  const { hero, contact } = client.content;

  return (
    <section
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        background: hero.backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${hero.backgroundImage}) center/cover`
          : `linear-gradient(135deg, ${client.colors.primary}15 0%, ${client.colors.secondary}15 100%)`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
              hero.backgroundImage ? "text-white" : ""
            }`}
          >
            {hero.headline}
          </h1>

          {hero.subheadline && (
            <p
              className={`text-lg md:text-xl mb-8 ${
                hero.backgroundImage ? "text-white/90" : "text-muted-foreground"
              }`}
            >
              {hero.subheadline}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg hover:opacity-90"
              style={{ backgroundColor: client.colors.primary }}
              asChild
            >
              <a href={hero.ctaLink || "#contact"}>
                {hero.cta || "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>

            {contact.phone && (
              <Button
                size="lg"
                variant="outline"
                className="text-lg"
                asChild
              >
                <a href={`tel:${contact.phone.replace(/\D/g, "")}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  {contact.phone}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute -bottom-1 left-0 right-0 h-16"
        style={{
          background: "linear-gradient(to top, white, transparent)",
        }}
      />
    </section>
  );
}
