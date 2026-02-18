"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import type { ClientConfig, TestimonialItem } from "@/types";

interface TestimonialSectionProps {
  client: ClientConfig;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export function TestimonialSection({ client }: TestimonialSectionProps) {
  const testimonials = client.content.testimonials || [];

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take our word for it
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-6">
                <Quote
                  className="absolute top-4 right-4 h-8 w-8 opacity-10"
                  style={{ color: client.colors.primary }}
                />

                {testimonial.rating && (
                  <div className="mb-4">
                    <StarRating rating={testimonial.rating} />
                  </div>
                )}

                <p className="text-muted-foreground mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <Avatar>
                    {testimonial.avatar && (
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    )}
                    <AvatarFallback
                      style={{ backgroundColor: `${client.colors.primary}20` }}
                    >
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    {testimonial.role && (
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                        {testimonial.company && `, ${testimonial.company}`}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
