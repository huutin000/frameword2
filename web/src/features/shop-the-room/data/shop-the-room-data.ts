import type { ShopRoomScene } from "../types";

export const SHOP_THE_ROOM_SCENES: ShopRoomScene[] = [
  {
    id: "scene-japandi-studio",
    title: "Phòng Trọ Studio 15m² Phong Cách Japandi Tối Giản",
    subtitle: "Kết hợp chất liệu gỗ sồi sáng và khung thép tĩnh điện thanh mảnh, không gây cảm giác chật chội.",
    roomStyle: "Japandi / Bắc Âu",
    areaM2: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85",
    description:
      "Không gian sống mẫu cho người độc thân tại đô thị lớn. Tất cả nội thất đều được tính toán để chừa lối đi thông thoáng trên 800mm và không yêu cầu khoan đục tường nhà thuê.",
    hotspots: [
      {
        id: "hs-1",
        productId: "p1",
        xPercent: 30,
        yPercent: 55,
        label: "Bàn Treo Tường Gấp Gọn",
        note: "Gấp phẳng sát tường khi không dùng",
      },
      {
        id: "hs-2",
        productId: "p2",
        xPercent: 68,
        yPercent: 38,
        label: "Kệ Sách Đa Năng 5 Tầng",
        note: "Tận dụng chiều cao trần nhà 1500mm",
      },
      {
        id: "hs-3",
        productId: "p3",
        xPercent: 82,
        yPercent: 72,
        label: "Giường Đơn Có Hộc Kéo Ngầm",
        note: "Chứa được 4 vali và chăn bông",
      },
    ],
  },
  {
    id: "scene-minimal-workspace",
    title: "Góc Làm Việc Cạnh Ban Công 0.8m²",
    subtitle: "Tận dụng tối đa nguồn sáng tự nhiên với bàn gấp siêu gọn và kệ đứng kẹp góc.",
    roomStyle: "Tối giản hiện đại",
    areaM2: 0.8,
    imageUrl:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1600&q=85",
    description:
      "Giải pháp làm việc tại nhà (WFH) dành cho căn phòng có diện tích cực nhỏ. Đảm bảo tư thế ngồi thoải mái mà không chiếm mặt sàn sinh hoạt.",
    hotspots: [
      {
        id: "hs-4",
        productId: "p1",
        xPercent: 45,
        yPercent: 60,
        label: "Bàn Treo Tường Gấp Gọn",
        note: "Chịu tải trọng 30kg",
      },
      {
        id: "hs-5",
        productId: "p2",
        xPercent: 72,
        yPercent: 42,
        label: "Kệ Đa Năng 5 Tầng",
        note: "Khung thép sơn tĩnh điện chống gỉ",
      },
    ],
  },
  {
    id: "scene-compact-kitchen",
    title: "Góc Bếp & Phòng Ăn Căn Hộ Mini 18m²",
    subtitle: "Bố trí khoa học giúp việc nấu nướng và đón tiếp bạn bè trở nên nhẹ nhàng.",
    roomStyle: "Công năng đa dụng",
    areaM2: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85",
    description:
      "Bàn ăn mở rộng có thể gấp gọn lại thành bàn phụ 80x80cm, kết hợp cùng hệ thống kệ gia vị nam châm hít trực tiếp vào tủ lạnh hoặc mặt thép.",
    hotspots: [
      {
        id: "hs-6",
        productId: "p6",
        xPercent: 32,
        yPercent: 35,
        label: "Kệ Gia Vị Hít Nam Châm",
        note: "Lực hít nam châm vĩnh cửu 5kg",
      },
      {
        id: "hs-7",
        productId: "p5",
        xPercent: 62,
        yPercent: 68,
        label: "Bàn Ăn Mở Rộng 4-6 Người",
        note: "Mặt gỗ chống nước, dễ lau chùi",
      },
    ],
  },
];

