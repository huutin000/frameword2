import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#5B7065",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Small Living 2026",
    default: "Small Living — Nền Tảng Thiết Kế & Nội Thất Không Gian Nhỏ 2026",
  },
  description:
    "Nền tảng thương mại điện tử & quy hoạch không gian thông minh: đo đạc phòng SpaceFit, thiết kế 2D/3D tương tác, giải pháp lưu trữ không cần khoan tường.",
  keywords: [
    "small living",
    "nội thất thông minh",
    "không khoan tường",
    "space planning",
    "phòng trọ",
    "căn hộ nhỏ",
    "room planner",
  ],
  authors: [{ name: "Small Living Studio" }],
  openGraph: {
    title: "Small Living — Giải Pháp Không Gian Sống Tinh Gọn 2026",
    description: "Tối ưu hóa từng centimet không gian sống với công nghệ SpaceFit và 2D/3D Planner.",
    type: "website",
    locale: "vi_VN",
    siteName: "Small Living",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen bg-[#FAF8F5] text-[#29241E] antialiased selection:bg-[#5B7065] selection:text-white">
        {/* Persistent Demo Disclaimer Bar */}
        <div className="bg-[#5A4033] text-[#FAF8F5] px-4 py-1.5 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#B85D43] animate-pulse" />
          <span>HỆ THỐNG DEMO PORTFOLIO 2026 — Toàn bộ đơn hàng, thanh toán và số liệu đều là dữ liệu mô phỏng.</span>
        </div>
        {children}
      </body>
    </html>
  );
}
