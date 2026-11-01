import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTemplateBySlug,
  CURATED_TEMPLATES,
} from "@/features/solutions/data/solution-store";
import { SolutionBuilderView } from "@/features/solutions/components/solution-builder-view";

interface SolutionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return CURATED_TEMPLATES.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = getTemplateBySlug(slug);

  if (!bundle) {
    return {
      title: "Giải pháp không tồn tại",
    };
  }

  return {
    title: `${bundle.title} — Small Living 2026`,
    description: bundle.subtitle,
  };
}

export default async function SolutionDetailPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const bundle = getTemplateBySlug(slug);

  if (!bundle) {
    notFound();
  }

  return <SolutionBuilderView bundle={bundle} />;
}

