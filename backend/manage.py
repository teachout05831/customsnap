#!/usr/bin/env python3
"""
CLI tool for managing leads and clients in the Website Builder system.

Usage:
    python manage.py <command> [options]

Commands:
    init                    Initialize the database
    lead add               Add a new lead
    lead list              List all leads
    lead show <id>         Show a specific lead
    lead status <id> <status>  Update lead status
    client add             Add a new client (interactive)
    client list            List all clients
    client show <id>       Show a specific client
    client generate <id>   Generate JSON config for a client
    client generate-all    Generate JSON configs for all clients
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

import db

# Path to the Next.js client configs
CLIENTS_JSON_PATH = Path(__file__).parent.parent / "src" / "data" / "clients"


def slugify(text):
    """Convert text to a URL-friendly slug."""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = text.strip('-')
    return text


def generate_client_json(client):
    """Generate a JSON config file for the Next.js preview system."""
    # Default colors based on business type
    color_schemes = {
        "plumber": {"primary": "#2563eb", "secondary": "#1e40af", "accent": "#fbbf24"},
        "electrician": {"primary": "#f59e0b", "secondary": "#d97706", "accent": "#1f2937"},
        "hvac": {"primary": "#0891b2", "secondary": "#0e7490", "accent": "#f97316"},
        "landscaping": {"primary": "#16a34a", "secondary": "#15803d", "accent": "#84cc16"},
        "cleaning": {"primary": "#06b6d4", "secondary": "#0891b2", "accent": "#f0abfc"},
        "restaurant": {"primary": "#dc2626", "secondary": "#b91c1c", "accent": "#fbbf24"},
        "salon": {"primary": "#ec4899", "secondary": "#db2777", "accent": "#fbbf24"},
        "auto": {"primary": "#1f2937", "secondary": "#111827", "accent": "#ef4444"},
        "legal": {"primary": "#1e3a5f", "secondary": "#0f172a", "accent": "#c9a227"},
        "medical": {"primary": "#0ea5e9", "secondary": "#0284c7", "accent": "#22c55e"},
        "default": {"primary": "#2563eb", "secondary": "#1e40af", "accent": "#fbbf24"},
    }

    business_type = (client.get('business_type') or 'default').lower()
    colors = color_schemes.get(business_type, color_schemes['default'])

    # Parse services if stored as comma-separated string
    services_raw = client.get('services') or ''
    services_list = [s.strip() for s in services_raw.split(',') if s.strip()]

    # Build services array for template
    services = []
    for i, service in enumerate(services_list[:6]):  # Max 6 services
        services.append({
            "title": service,
            "description": f"Professional {service.lower()} services for your home or business.",
            "icon": "Wrench"  # Default icon
        })

    # If no services provided, add placeholder
    if not services:
        services = [
            {"title": "Service 1", "description": "Description of your first service.", "icon": "Wrench"},
            {"title": "Service 2", "description": "Description of your second service.", "icon": "Shield"},
            {"title": "Service 3", "description": "Description of your third service.", "icon": "Clock"},
        ]

    config = {
        "id": str(client['id']),
        "slug": client['slug'],
        "name": client['business_name'],
        "status": client.get('status', 'prospect'),
        "template": "service-business",
        "colors": {
            "primary": colors['primary'],
            "secondary": colors['secondary'],
            "accent": colors['accent'],
            "background": "#ffffff",
            "text": "#1f2937"
        },
        "content": {
            "hero": {
                "headline": f"Welcome to {client['business_name']}",
                "subheadline": f"Professional {business_type} services you can trust.",
                "cta": "Get a Free Quote",
                "ctaLink": "#contact"
            },
            "services": services,
            "about": {
                "title": f"About {client['business_name']}",
                "text": f"{client['business_name']} is your trusted local {business_type} service provider. We pride ourselves on quality workmanship, honest pricing, and exceptional customer service."
            },
            "testimonials": [
                {
                    "text": "Excellent service! They were professional, on time, and did a great job.",
                    "author": "Happy Customer",
                    "role": "Local Resident"
                }
            ],
            "contact": {
                "phone": client.get('phone') or "",
                "email": client.get('email') or "",
                "address": client.get('address') or "",
                "hours": "Mon-Fri: 8am-6pm, Sat: 9am-2pm"
            }
        },
        "createdAt": client.get('created_at', datetime.now().isoformat()),
        "updatedAt": datetime.now().isoformat()
    }

    return config


def save_client_json(client):
    """Save a client's JSON config to the Next.js data directory."""
    config = generate_client_json(client)

    # Ensure directory exists
    CLIENTS_JSON_PATH.mkdir(parents=True, exist_ok=True)

    # Save JSON file
    filepath = CLIENTS_JSON_PATH / f"{client['slug']}.json"
    with open(filepath, 'w') as f:
        json.dump(config, f, indent=2)

    return filepath


# CLI Commands
def cmd_init(args):
    """Initialize the database."""
    db.init_db()
    print("Database initialized successfully.")


def cmd_lead_add(args):
    """Add a new lead interactively."""
    print("\n=== Add New Lead ===\n")

    first_name = input("First Name: ").strip()
    last_name = input("Last Name: ").strip()
    email = input("Email: ").strip()
    phone = input("Phone: ").strip()
    current_website = input("Current Website (optional): ").strip() or None
    source = input("Source [landing_page]: ").strip() or "landing_page"

    lead_id = db.add_lead(first_name, last_name, email, phone, current_website, source)
    print(f"\n✓ Lead added successfully! ID: {lead_id}")


def cmd_lead_list(args):
    """List all leads."""
    leads = db.get_all_leads(args.status if hasattr(args, 'status') else None)

    if not leads:
        print("No leads found.")
        return

    print(f"\n{'ID':<5} {'Name':<25} {'Email':<30} {'Status':<12} {'Created':<20}")
    print("-" * 95)

    for lead in leads:
        name = f"{lead['first_name']} {lead['last_name']}"
        created = lead['created_at'][:16] if lead['created_at'] else ''
        print(f"{lead['id']:<5} {name:<25} {lead['email']:<30} {lead['status']:<12} {created:<20}")


def cmd_lead_show(args):
    """Show a specific lead."""
    lead = db.get_lead(args.id)

    if not lead:
        print(f"Lead {args.id} not found.")
        return

    print(f"\n=== Lead #{lead['id']} ===")
    print(f"Name: {lead['first_name']} {lead['last_name']}")
    print(f"Email: {lead['email']}")
    print(f"Phone: {lead['phone']}")
    print(f"Current Website: {lead['current_website'] or 'N/A'}")
    print(f"Source: {lead['source']}")
    print(f"Status: {lead['status']}")
    print(f"Notes: {lead['notes'] or 'N/A'}")
    print(f"Created: {lead['created_at']}")
    print(f"Updated: {lead['updated_at']}")


def cmd_lead_status(args):
    """Update a lead's status."""
    db.update_lead_status(args.id, args.status, args.notes if hasattr(args, 'notes') else None)
    print(f"✓ Lead {args.id} status updated to: {args.status}")


def cmd_client_add(args):
    """Add a new client interactively."""
    print("\n=== Add New Client ===\n")

    # Check if converting from a lead
    lead_id = input("Lead ID (optional, press Enter to skip): ").strip()
    lead_id = int(lead_id) if lead_id else None

    lead = None
    if lead_id:
        lead = db.get_lead(lead_id)
        if lead:
            print(f"  Found lead: {lead['first_name']} {lead['last_name']} ({lead['email']})")

    business_name = input("Business Name: ").strip()
    slug = input(f"Slug [{slugify(business_name)}]: ").strip() or slugify(business_name)
    business_type = input("Business Type (plumber, electrician, restaurant, etc.): ").strip()
    phone = input(f"Phone [{lead['phone'] if lead else ''}]: ").strip() or (lead['phone'] if lead else None)
    email = input(f"Email [{lead['email'] if lead else ''}]: ").strip() or (lead['email'] if lead else None)
    address = input("Address: ").strip() or None
    services = input("Services (comma-separated): ").strip() or None

    client_id = db.add_client(
        slug=slug,
        business_name=business_name,
        business_type=business_type,
        lead_id=lead_id,
        phone=phone,
        email=email,
        address=address,
        services=services
    )

    # Update lead status if we have one
    if lead_id:
        db.update_lead_status(lead_id, "converted", f"Converted to client #{client_id}")

    print(f"\n✓ Client added successfully! ID: {client_id}")

    # Ask if they want to generate JSON
    generate = input("\nGenerate preview JSON now? [Y/n]: ").strip().lower()
    if generate != 'n':
        client = db.get_client(client_id)
        filepath = save_client_json(client)
        print(f"✓ JSON config saved to: {filepath}")
        print(f"  Preview URL: http://localhost:5000/preview/{slug}")


def cmd_client_list(args):
    """List all clients."""
    clients = db.get_all_clients(args.status if hasattr(args, 'status') else None)

    if not clients:
        print("No clients found.")
        return

    print(f"\n{'ID':<5} {'Business Name':<30} {'Type':<15} {'Status':<12} {'Slug':<25}")
    print("-" * 90)

    for client in clients:
        btype = client['business_type'] or 'N/A'
        print(f"{client['id']:<5} {client['business_name']:<30} {btype:<15} {client['status']:<12} {client['slug']:<25}")


def cmd_client_show(args):
    """Show a specific client."""
    client = db.get_client(args.id)

    if not client:
        print(f"Client {args.id} not found.")
        return

    print(f"\n=== Client #{client['id']} ===")
    print(f"Business Name: {client['business_name']}")
    print(f"Slug: {client['slug']}")
    print(f"Business Type: {client['business_type'] or 'N/A'}")
    print(f"Phone: {client['phone'] or 'N/A'}")
    print(f"Email: {client['email'] or 'N/A'}")
    print(f"Address: {client['address'] or 'N/A'}")
    print(f"Services: {client['services'] or 'N/A'}")
    print(f"Status: {client['status']}")
    print(f"Tier: {client['tier']}")
    print(f"Lead ID: {client['lead_id'] or 'N/A'}")
    print(f"Notes: {client['notes'] or 'N/A'}")
    print(f"Created: {client['created_at']}")
    print(f"Updated: {client['updated_at']}")
    print(f"\nPreview URL: http://localhost:5000/preview/{client['slug']}")


def cmd_client_generate(args):
    """Generate JSON config for a client."""
    client = db.get_client(args.id)

    if not client:
        print(f"Client {args.id} not found.")
        return

    filepath = save_client_json(client)
    print(f"✓ JSON config saved to: {filepath}")
    print(f"  Preview URL: http://localhost:5000/preview/{client['slug']}")


def cmd_client_generate_all(args):
    """Generate JSON configs for all clients."""
    clients = db.get_all_clients()

    if not clients:
        print("No clients found.")
        return

    for client in clients:
        filepath = save_client_json(client)
        print(f"✓ {client['business_name']} -> {filepath}")

    print(f"\n✓ Generated {len(clients)} client configs.")


def main():
    parser = argparse.ArgumentParser(description="Website Builder Management CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # init command
    subparsers.add_parser("init", help="Initialize the database")

    # lead commands
    lead_parser = subparsers.add_parser("lead", help="Lead management")
    lead_subparsers = lead_parser.add_subparsers(dest="lead_command")

    lead_subparsers.add_parser("add", help="Add a new lead")
    lead_list = lead_subparsers.add_parser("list", help="List all leads")
    lead_list.add_argument("--status", help="Filter by status")

    lead_show = lead_subparsers.add_parser("show", help="Show a lead")
    lead_show.add_argument("id", type=int, help="Lead ID")

    lead_status = lead_subparsers.add_parser("status", help="Update lead status")
    lead_status.add_argument("id", type=int, help="Lead ID")
    lead_status.add_argument("status", help="New status")
    lead_status.add_argument("--notes", help="Optional notes")

    # client commands
    client_parser = subparsers.add_parser("client", help="Client management")
    client_subparsers = client_parser.add_subparsers(dest="client_command")

    client_subparsers.add_parser("add", help="Add a new client")
    client_list = client_subparsers.add_parser("list", help="List all clients")
    client_list.add_argument("--status", help="Filter by status")

    client_show = client_subparsers.add_parser("show", help="Show a client")
    client_show.add_argument("id", type=int, help="Client ID")

    client_generate = client_subparsers.add_parser("generate", help="Generate client JSON")
    client_generate.add_argument("id", type=int, help="Client ID")

    client_subparsers.add_parser("generate-all", help="Generate all client JSONs")

    args = parser.parse_args()

    # Route to appropriate command
    if args.command == "init":
        cmd_init(args)
    elif args.command == "lead":
        if args.lead_command == "add":
            cmd_lead_add(args)
        elif args.lead_command == "list":
            cmd_lead_list(args)
        elif args.lead_command == "show":
            cmd_lead_show(args)
        elif args.lead_command == "status":
            cmd_lead_status(args)
        else:
            lead_parser.print_help()
    elif args.command == "client":
        if args.client_command == "add":
            cmd_client_add(args)
        elif args.client_command == "list":
            cmd_client_list(args)
        elif args.client_command == "show":
            cmd_client_show(args)
        elif args.client_command == "generate":
            cmd_client_generate(args)
        elif args.client_command == "generate-all":
            cmd_client_generate_all(args)
        else:
            client_parser.print_help()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
