"use client";

import { ServiceHeader } from "@/components/templates/headers/ServiceHeader";
import { ServiceHero } from "@/components/templates/heroes/ServiceHero";
import { ServiceGrid } from "@/components/templates/services/ServiceGrid";
import { TestimonialSection } from "@/components/templates/testimonials/TestimonialSection";
import { ContactSection } from "@/components/templates/contact/ContactSection";
import { ServiceFooter } from "@/components/templates/footers/ServiceFooter";
import type { ClientConfig } from "@/types";

interface ServiceBusinessTemplateProps {
  client: ClientConfig;
}

export function ServiceBusinessTemplate({ client }: ServiceBusinessTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <ServiceHeader client={client} />
      <main className="flex-1">
        <ServiceHero client={client} />
        <ServiceGrid client={client} />

        {/* About Section */}
        {client.content.about && (
          <section id="about" className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                {client.content.about.image && (
                  <div className="order-2 md:order-1">
                    <img
                      src={client.content.about.image}
                      alt="About us"
                      className="rounded-lg shadow-lg w-full"
                    />
                  </div>
                )}
                <div className={client.content.about.image ? "order-1 md:order-2" : "md:col-span-2 text-center max-w-3xl mx-auto"}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    {client.content.about.title || "About Us"}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {client.content.about.text}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <TestimonialSection client={client} />
        <ContactSection client={client} />
      </main>
      <ServiceFooter client={client} />
    </div>
  );
}

export default ServiceBusinessTemplate;
