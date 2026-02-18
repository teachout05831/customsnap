"""
Database setup and models for the Website Builder lead management system.
Uses SQLite for simplicity - no server setup needed.
"""

import sqlite3
import os
from datetime import datetime
from pathlib import Path

# Database file location
DB_PATH = Path(__file__).parent / "website_builder.db"

def get_connection():
    """Get a database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn

def init_db():
    """Initialize the database with required tables."""
    conn = get_connection()
    cursor = conn.cursor()

    # Leads table - people who filled out the landing page form
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            current_website TEXT,
            source TEXT DEFAULT 'landing_page',
            status TEXT DEFAULT 'new',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Clients table - leads that became clients (we're building their site)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lead_id INTEGER,
            slug TEXT UNIQUE NOT NULL,
            business_name TEXT NOT NULL,
            business_type TEXT,
            phone TEXT,
            email TEXT,
            address TEXT,
            services TEXT,
            status TEXT DEFAULT 'intake',
            tier TEXT DEFAULT 'website_only',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lead_id) REFERENCES leads (id)
        )
    ''')

    # Assets table - logos, photos uploaded by clients
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS assets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            asset_type TEXT NOT NULL,
            filename TEXT NOT NULL,
            filepath TEXT NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients (id)
        )
    ''')

    conn.commit()
    conn.close()
    print(f"Database initialized at: {DB_PATH}")

# Lead functions
def add_lead(first_name, last_name, email, phone, current_website=None, source="landing_page"):
    """Add a new lead to the database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO leads (first_name, last_name, email, phone, current_website, source)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (first_name, last_name, email, phone, current_website, source))
    lead_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return lead_id

def get_lead(lead_id):
    """Get a lead by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM leads WHERE id = ?', (lead_id,))
    lead = cursor.fetchone()
    conn.close()
    return dict(lead) if lead else None

def get_all_leads(status=None):
    """Get all leads, optionally filtered by status."""
    conn = get_connection()
    cursor = conn.cursor()
    if status:
        cursor.execute('SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC', (status,))
    else:
        cursor.execute('SELECT * FROM leads ORDER BY created_at DESC')
    leads = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return leads

def update_lead_status(lead_id, status, notes=None):
    """Update a lead's status."""
    conn = get_connection()
    cursor = conn.cursor()
    if notes:
        cursor.execute('''
            UPDATE leads SET status = ?, notes = ?, updated_at = ?
            WHERE id = ?
        ''', (status, notes, datetime.now().isoformat(), lead_id))
    else:
        cursor.execute('''
            UPDATE leads SET status = ?, updated_at = ?
            WHERE id = ?
        ''', (status, datetime.now().isoformat(), lead_id))
    conn.commit()
    conn.close()

# Client functions
def add_client(slug, business_name, business_type=None, lead_id=None, phone=None, email=None, address=None, services=None):
    """Add a new client to the database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO clients (slug, business_name, business_type, lead_id, phone, email, address, services)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (slug, business_name, business_type, lead_id, phone, email, address, services))
    client_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return client_id

def get_client(client_id):
    """Get a client by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM clients WHERE id = ?', (client_id,))
    client = cursor.fetchone()
    conn.close()
    return dict(client) if client else None

def get_client_by_slug(slug):
    """Get a client by slug."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM clients WHERE slug = ?', (slug,))
    client = cursor.fetchone()
    conn.close()
    return dict(client) if client else None

def get_all_clients(status=None):
    """Get all clients, optionally filtered by status."""
    conn = get_connection()
    cursor = conn.cursor()
    if status:
        cursor.execute('SELECT * FROM clients WHERE status = ? ORDER BY created_at DESC', (status,))
    else:
        cursor.execute('SELECT * FROM clients ORDER BY created_at DESC')
    clients = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return clients

def update_client(client_id, **kwargs):
    """Update client fields."""
    conn = get_connection()
    cursor = conn.cursor()

    # Build UPDATE query dynamically
    fields = []
    values = []
    for key, value in kwargs.items():
        if value is not None:
            fields.append(f"{key} = ?")
            values.append(value)

    if fields:
        fields.append("updated_at = ?")
        values.append(datetime.now().isoformat())
        values.append(client_id)

        query = f"UPDATE clients SET {', '.join(fields)} WHERE id = ?"
        cursor.execute(query, values)
        conn.commit()

    conn.close()

def update_client_status(client_id, status):
    """Update a client's status."""
    update_client(client_id, status=status)

# Initialize database when module is imported
if not DB_PATH.exists():
    init_db()
