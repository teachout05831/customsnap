"use client";

import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import type { ClientConfig } from "@/types";

interface ServiceFooterProps {
  client: ClientConfig;
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

export function ServiceFooter({ client }: ServiceFooterProps) {
  const { contact, social } = client.content;
  const currentYear = new Date().getFullYear();

  const socialLinks = social
    ? Object.entries(social).filter(([_, url]) => url)
    : [];

  return (
    <footer
      className="py-12 text-white"
      style={{ backgroundColor: client.colors.secondary || client.colors.primary }}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{client.name}</h3>
            {client.content.about?.text && (
              <p className="text-white/80 text-sm">
                {client.content.about.text.slice(0, 150)}...
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#services" className="text-white/80 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/80 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/80 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-white/80">
              {contact.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\D/g, "")}`}
                    className="hover:text-white transition-colors"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.address && <li>{contact.address}</li>}
            </ul>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-4">
                {socialLinks.map(([platform, url]) => {
                  const Icon = socialIcons[platform];
                  if (!Icon) return null;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>
            &copy; {currentYear} {client.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
