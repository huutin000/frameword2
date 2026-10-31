export function getImageUrl(image) {
  if (!image) return "/asset/image/logo-menu.png";
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/products/${image}`;
  }
  return `/asset/image/${image}`;
}

