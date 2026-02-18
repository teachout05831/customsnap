import fs from "fs";
import path from "path";
import type { ClientConfig } from "@/types";

const clientsDir = path.join(process.cwd(), "src/data/clients");

// Get all client slugs for static generation
export async function getAllClientSlugs(): Promise<string[]> {
  try {
    const files = fs.readdirSync(clientsDir);
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(".json", ""));
  } catch {
    return [];
  }
}

// Get a single client by slug
export async function getClientBySlug(
  slug: string
): Promise<ClientConfig | null> {
  try {
    const filePath = path.join(clientsDir, `${slug}.json`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents) as ClientConfig;
  } catch {
    return null;
  }
}

// Get all clients
export async function getAllClients(): Promise<ClientConfig[]> {
  try {
    const slugs = await getAllClientSlugs();
    const clients = await Promise.all(
      slugs.map((slug) => getClientBySlug(slug))
    );
    return clients.filter((client): client is ClientConfig => client !== null);
  } catch {
    return [];
  }
}

// Save a client configuration
export async function saveClient(client: ClientConfig): Promise<void> {
  const filePath = path.join(clientsDir, `${client.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(client, null, 2));
}

// Delete a client
export async function deleteClient(slug: string): Promise<boolean> {
  try {
    const filePath = path.join(clientsDir, `${slug}.json`);
    fs.unlinkSync(filePath);
    return true;
  } catch {
    return false;
  }
}

// Create a new client with defaults
export function createDefaultClient(
  slug: string,
  name: string
): ClientConfig {
  return {
    id: Date.now().toString(),
    slug,
    name,
    status: "prospect",
    template: "service-business",
    colors: {
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#fbbf24",
      background: "#ffffff",
      text: "#1f2937",
    },
    content: {
      hero: {
        headline: `Welcome to ${name}`,
        subheadline: "Professional services for your needs",
        cta: "Contact Us",
        ctaLink: "#contact",
      },
      contact: {
        phone: "",
        email: "",
        address: "",
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
