"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { ClientConfig } from "@/types";

interface ContactSectionProps {
  client: ClientConfig;
}

export function ContactSection({ client }: ContactSectionProps) {
  const { contact } = client.content;

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch for a free quote or to schedule service
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you shortly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="Your phone number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your project..."
                    rows={4}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  style={{ backgroundColor: client.colors.primary }}
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone.replace(/\D/g, "")}`}
                      className="flex items-start gap-4 group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${client.colors.primary}15`,
                          color: client.colors.primary,
                        }}
                      >
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">
                          {contact.phone}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Call us anytime
                        </p>
                      </div>
                    </a>
                  )}

                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-start gap-4 group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${client.colors.primary}15`,
                          color: client.colors.primary,
                        }}
                      >
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">
                          {contact.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Send us an email
                        </p>
                      </div>
                    </a>
                  )}

                  {contact.address && (
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${client.colors.primary}15`,
                          color: client.colors.primary,
                        }}
                      >
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{contact.address}</p>
                        <p className="text-sm text-muted-foreground">
                          Our location
                        </p>
                      </div>
                    </div>
                  )}

                  {contact.hours && (
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${client.colors.primary}15`,
                          color: client.colors.primary,
                        }}
                      >
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{contact.hours}</p>
                        <p className="text-sm text-muted-foreground">
                          Business hours
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map placeholder */}
            {contact.mapUrl && (
              <Card className="overflow-hidden">
                <iframe
                  src={contact.mapUrl}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
