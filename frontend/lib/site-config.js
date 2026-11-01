/**
 * KOVIQO — Brand & Site Configuration
 * Single Source of Truth for brand identity, metadata, navigation, and visual tokens.
 */

export const siteConfig = {
  name: "KOVIQO",
  shortName: "KOVIQO",
  legalName: "KOVIQO Technology Retail Co., Ltd.",
  tagline: "Khám phá thiết bị công nghệ đỉnh cao",
  description:
    "Hệ thống bán lẻ điện thoại thông minh, laptop cao cấp, máy tính bảng và phụ kiện công nghệ hàng đầu với cam kết 100% chính hãng, bảo hành toàn quốc và dịch vụ vượt trội.",
  keywords: [
    "KOVIQO",
    "điện thoại chính hãng",
    "laptop cao cấp",
    "phụ kiện công nghệ",
    "smartphone",
    "macbook",
    "mua điện thoại trả góp",
  ],
  url: "https://koviqo.vn",
  locale: "vi_VN",
  themeColor: "#0b0f19",
  brandColor: "#2563eb",

  // Contact & Support
  contact: {
    hotlineSales: "1800 8888",
    hotlineSupport: "1800 8889",
    hotlineHours: "7:30 - 22:00 hàng ngày",
    email: "contact@koviqo.vn",
    supportEmail: "support@koviqo.vn",
    address: "Tòa nhà Công nghệ KOVIQO, 17 Phan Văn Hớn, Quận 12, TP. Hồ Chí Minh",
  },

  // Brand Asset Paths
  assets: {
    logoLight: "/brand/koviqo-logo.svg",
    logoDark: "/brand/koviqo-logo-dark.svg",
    mark: "/brand/koviqo-mark.svg",
    compact: "/brand/koviqo-compact.svg",
    monochrome: "/brand/koviqo-monochrome.svg",
    favicon: "/favicon.ico",
    appleTouchIcon: "/apple-icon.png",
    ogImage: "/brand/og-koviqo.png",
    productPlaceholder: "/brand/product-placeholder.svg",
  },

  // Value Propositions
  guarantees: [
    {
      title: "Giao Nhanh Siêu Tốc 2H",
      desc: "Miễn phí giao hàng nội thành cho đơn từ 500k",
      icon: "fa-solid fa-truck-fast",
    },
    {
      title: "100% Chính Hãng",
      desc: "Nguồn gốc minh bạch, đầy đủ hóa đơn VAT",
      icon: "fa-solid fa-shield-check",
    },
    {
      title: "1 Đổi 1 Trong 30 Ngày",
      desc: "Đổi mới lập tức nếu phát sinh lỗi nhà sản xuất",
      icon: "fa-solid fa-rotate-left",
    },
    {
      title: "Trả Góp 0% Lãi Suất",
      desc: "Thủ tục xét duyệt online chỉ mất 5 phút",
      icon: "fa-solid fa-credit-card",
    },
  ],

  // Navigation Links
  mainNav: [
    { label: "Trang chủ", href: "/" },
    { label: "Điện thoại", href: "/product?cat=phone" },
    { label: "Laptop", href: "/product?cat=laptop" },
    { label: "Phụ kiện", href: "/product?cat=accessories" },
    { label: "Giới thiệu", href: "/about" },
    { label: "Liên hệ", href: "/contact" },
  ],
};

export default siteConfig;

