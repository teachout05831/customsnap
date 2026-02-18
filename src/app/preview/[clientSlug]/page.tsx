import { notFound } from "next/navigation";
import { getClientBySlug, getAllClientSlugs } from "@/lib/clients";
import { ServiceBusinessTemplate } from "@/templates/service-business";

interface PreviewPageProps {
  params: Promise<{
    clientSlug: string;
  }>;
}

// Generate static params for all clients
export async function generateStaticParams() {
  const slugs = await getAllClientSlugs();
  return slugs.map((slug) => ({
    clientSlug: slug,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: PreviewPageProps) {
  const { clientSlug } = await params;
  const client = await getClientBySlug(clientSlug);

  if (!client) {
    return {
      title: "Preview Not Found",
    };
  }

  return {
    title: client.name,
    description: client.content.hero.subheadline || `Welcome to ${client.name}`,
  };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { clientSlug } = await params;
  const client = await getClientBySlug(clientSlug);

  if (!client) {
    notFound();
  }

  // Select template based on client config
  // For now, we only have service-business, but this can be expanded
  switch (client.template) {
    case "service-business":
    default:
      return <ServiceBusinessTemplate client={client} />;
  }
}
