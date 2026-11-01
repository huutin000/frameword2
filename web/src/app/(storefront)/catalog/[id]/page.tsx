import React from "react";
import { notFound } from "next/navigation";
import { SAMPLE_PRODUCTS } from "@/features/catalog/data/mock-products";
import { ProductDetailView } from "@/features/catalog/components/product-detail-view";

export async function generateStaticParams() {
  return SAMPLE_PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = SAMPLE_PRODUCTS.find((p) => p.id === id || p.slug === id);
  if (!product) return { title: "Không tìm thấy sản phẩm | Small Living 2026" };

  return {
    title: `${product.title} (${product.dimensions}) | Small Living 2026`,
    description: `${product.title} - ${product.fitScoreExplanation}. Kích thước chuẩn ${product.dimensions}.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = SAMPLE_PRODUCTS.find((p) => p.id === id || p.slug === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}

