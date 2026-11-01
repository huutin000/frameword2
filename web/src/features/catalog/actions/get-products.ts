import { createClient } from "@/lib/supabase/server";
import { SAMPLE_PRODUCTS } from "../data/mock-products";
import type { CatalogProduct } from "../types";

interface DbProductVariantRow {
  id: string;
  sku: string;
  price_vnd: number;
  width_mm: number;
  height_mm: number;
  depth_mm: number;
  no_drill_flag: boolean;
  image_url: string;
  fit_score_explanation: string | null;
  stock_available: number;
}

interface DbCategoryRow {
  name: string;
  slug: string;
}

interface DbProductJoinedRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  categories: DbCategoryRow | DbCategoryRow[] | null;
  product_variants: DbProductVariantRow[] | null;
}

/**
 * Server action to fetch published products.
 * Queries Supabase database if configured; falls back gracefully to deterministic seed fixtures.
 */
export async function getPublishedProducts(): Promise<CatalogProduct[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        slug,
        title,
        subtitle,
        description,
        categories (name, slug),
        product_variants (
          id,
          sku,
          price_vnd,
          width_mm,
          height_mm,
          depth_mm,
          no_drill_flag,
          image_url,
          fit_score_explanation,
          stock_available
        )
      `)
      .eq("is_published", true);

    if (error || !data || data.length === 0) {
      return SAMPLE_PRODUCTS;
    }

    const items = data as unknown as DbProductJoinedRow[];

    return items.map((item) => {
      const variant = item.product_variants?.[0];
      const category = Array.isArray(item.categories) ? item.categories[0] : item.categories;

      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        category: category?.name ?? "Nội thất",
        roomType: "studio",
        roomTag: category?.name ?? "Phòng trọ",
        problem: "no-drill",
        problemTag: "Không khoan tường",
        dimensions: `${variant?.width_mm ?? 0} × ${variant?.depth_mm ?? 0} × ${variant?.height_mm ?? 0} mm`,
        widthMm: variant?.width_mm ?? 0,
        heightMm: variant?.height_mm ?? 0,
        depthMm: variant?.depth_mm ?? 0,
        noDrill: variant?.no_drill_flag ?? true,
        priceVnd: variant?.price_vnd ?? 0,
        imageUrl: variant?.image_url ?? "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800",
        fitScoreExplanation: variant?.fit_score_explanation ?? "Vừa phòng tiêu chuẩn",
        inStock: (variant?.stock_available ?? 0) > 0,
      };
    });
  } catch {
    return SAMPLE_PRODUCTS;
  }
}
