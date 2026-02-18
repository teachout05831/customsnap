"use client";

import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import type { ClientConfig } from "@/types";

interface ServiceHeaderProps {
  client: ClientConfig;
}

export function ServiceHeader({ client }: ServiceHeaderProps) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#testimonials", label: "Reviews" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={
        {
          "--header-primary": client.colors.primary,
        } as React.CSSProperties
      }
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          {client.logo ? (
            <img src={client.logo} alt={client.name} className="h-8 w-auto" />
          ) : (
            <span
              className="text-xl font-bold"
              style={{ color: client.colors.primary }}
            >
              {client.name}
            </span>
          )}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          {client.content.contact.phone && (
            <a
              href={`tel:${client.content.contact.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Phone className="h-4 w-4" />
              {client.content.contact.phone}
            </a>
          )}
          <Button
            style={{ backgroundColor: client.colors.primary }}
            className="hover:opacity-90"
          >
            {client.content.hero.cta || "Contact Us"}
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {client.content.contact.phone && (
                <a
                  href={`tel:${client.content.contact.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-lg font-medium mt-4"
                  style={{ color: client.colors.primary }}
                >
                  <Phone className="h-5 w-5" />
                  {client.content.contact.phone}
                </a>
              )}
              <Button
                className="mt-4"
                style={{ backgroundColor: client.colors.primary }}
              >
                {client.content.hero.cta || "Contact Us"}
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
