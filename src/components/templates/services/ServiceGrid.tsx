"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Droplets,
  Flame,
  Bath,
  Wrench,
  Home,
  Shield,
  Clock,
  Star,
  Zap,
  Hammer,
  Settings,
} from "lucide-react";
import type { ClientConfig, ServiceItem } from "@/types";

// Icon mapping for common service icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  AlertTriangle,
  Droplets,
  Flame,
  Bath,
  Wrench,
  Home,
  Shield,
  Clock,
  Star,
  Zap,
  Hammer,
  Settings,
};

interface ServiceGridProps {
  client: ClientConfig;
}

export function ServiceGrid({ client }: ServiceGridProps) {
  const services = client.content.services || [];

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional services tailored to meet your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon
              ? iconMap[service.icon] || Wrench
              : Wrench;

            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
              >
                <CardHeader>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors"
                    style={{
                      backgroundColor: `${client.colors.primary}15`,
                      color: client.colors.primary,
                    }}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
