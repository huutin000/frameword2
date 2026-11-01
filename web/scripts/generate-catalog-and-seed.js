const fs = require("fs");
const path = require("path");

// =============================================================================
// CURATED MEDIA ASSETS
// =============================================================================

const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1540518614846-7ede433c4ef8?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1505692794407-1647464a938c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1595515106886-f8312e523fca?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1595515106871-33cf6a88b209?w=800&auto=format&fit=crop&q=80",
];

const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
];

// Problem types mapping
const PROBLEMS = [
  { code: "no-drill", tag: "Không khoan tường" },
  { code: "tight-space", tag: "Phòng hẹp dưới 15m²" },
  { code: "dead-corner", tag: "Góc chết & khe hẹp" },
  { code: "foldable", tag: "Gấp gọn đa năng" },
];

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// =============================================================================
// CATEGORIES CONFIGURATION (50 PRODUCTS EACH)
// =============================================================================

const CATEGORY_DEFINITIONS = [
  {
    roomType: "studio",
    roomTag: "Phòng trọ / Studio",
    categoryId: "c1000000-0000-0000-0000-000000000001",
    subcategories: ["Kệ & Tủ đứng", "Nội thất xếp gọn", "Vách ngăn thông minh", "Bàn ghế đa năng", "Lưu trữ đa tầng"],
    baseTitles: [
      "Kệ Đứng Chống Trần Tăng Giảm Đa Tầng",
      "Kệ Bậc Thang Chia Ngăn Tận Dụng Góc",
      "Vách Ngăn Di Động Kèm Kệ Treo Quần Áo",
      "Tủ Giày Siêu Mỏng Cửa Lật 3 Tầng",
      "Sofa Giường Đệm Cao Su Gấp 3 Đoạn",
      "Gương Soi Toàn Thân Tích Hợp Giá Treo",
      "Bàn Trà Thông Minh Nâng Hạ Mặt Bàn",
      "Kệ Ngăn Phòng Trọ Khung Thép Sơn Tĩnh Điện",
      "Tủ Quần Áo Vải Khung Thép Không Ốc Vít",
      "Giá Để Vali Và Túi Du Lịch Gầm Giường",
    ],
    widthRange: [400, 1200],
    depthRange: [250, 750],
    heightRange: [450, 2600],
    priceRange: [280000, 2450000],
    adviceList: [
      "Phù hợp trần 2.2m – 2.8m, chiếm diện tích sàn chỉ 0.15m².",
      "Tối ưu phòng trọ 12–18m², chia đôi không gian ngủ và tiếp khách.",
      "Cơ chế chân cao su chống trượt tuyệt đối không trầy sàn gạch men.",
      "Dày dưới 17cm khi áp sát tường hành lang ra vào.",
      "Giải phóng 60% mặt sàn bằng cách tận dụng chiều cao không gian đứng.",
    ],
  },
  {
    roomType: "bedroom",
    roomTag: "Phòng ngủ nhỏ",
    categoryId: "c1000000-0000-0000-0000-000000000002",
    subcategories: ["Nội thất phòng ngủ", "Tủ quần áo", "Kệ đầu giường", "Lưu trữ gầm giường"],
    baseTitles: [
      "Tủ Quần Áo Cửa Lùa Gương Toàn Cảnh",
      "Hộp Đựng Chăn Màn Khung Thép Gầm Giường",
      "Kệ Đầu Giường Treo Khung Nhôm Không Khoan",
      "Giá Treo Quần Áo Chữ A Xếp Gọn Tiện Lợi",
      "Bàn Trang Điểm Treo Tường Gương Led Cảm Ứng",
      "Móc Treo Sau Cánh Cửa Phòng Chịu Lực 15kg",
      "Kệ Đựng Đồ Lót Và Tất Chia Ngăn Tự Động",
      "Giường Ngủ Nâng Giát Piston Chứa Đồ Đáy Giường",
      "Tủ Đầu Giường 2 Tầng Kèm Ổ Cắm Điện",
      "Thanh Treo Rèm Cửa Kẹp Áp Lực Hai Đầu",
    ],
    widthRange: [300, 1600],
    depthRange: [200, 850],
    heightRange: [400, 2200],
    priceRange: [180000, 3400000],
    adviceList: [
      "Vừa vặn khoảng hở đầu giường từ 25cm, mở cửa phòng không vướng.",
      "Lọt trọn vẹn gầm giường từ 18cm, chống bụi và ẩm mốc vượt trội.",
      "Tận dụng cánh cửa phòng ngủ biến thành giá treo đồ cá nhân gọn gàng.",
      "Cánh lùa trượt ray êm ái, không cần chừa khoảng hở mở cánh tủ.",
      "Chất liệu vải dệt Oxford thoáng khí, bảo quản trang phục tinh tươm.",
    ],
  },
  {
    roomType: "workspace",
    roomTag: "Góc làm việc mini",
    categoryId: "c1000000-0000-0000-0000-000000000003",
    subcategories: ["Bàn làm việc", "Ghế công thái học", "Phụ kiện bàn làm việc", "Kệ sách mini"],
    baseTitles: [
      "Bàn Làm Việc Gấp Gọn Piston Thủy Lực",
      "Ghế Công Thái Học Lưng Lưới Gấp Gọn Đệm Dày",
      "Bảng Pegboard Kim Loại Treo Phụ Kiện Kẹp Bàn",
      "Kệ Nâng Màn Hình 2 Tầng Kèm Ngăn Kéo Bàn Phím",
      "Máng Luồn Dây Điện Giấu Ổ Cắm Gầm Bàn",
      "Giá Đỡ Laptop Hợp Kim Nhôm Xoay 360 Độ",
      "Kệ Sách Để Bàn Đa Năng Co Giãn Kích Thước",
      "Đèn Bàn Kẹp Cạnh Bàn Tích Hợp Sạc Không Dây",
      "Bàn Làm Việc Chân Chữ Z Có Giá Để Cây Máy Tính",
      "Tủ Tài Liệu Mini 3 Ngăn Kéo Khóa Số Có Bánh Xe",
    ],
    widthRange: [250, 1200],
    depthRange: [180, 650],
    heightRange: [100, 1150],
    priceRange: [160000, 2850000],
    adviceList: [
      "Dày chỉ 8cm khi gập sát tường, biến góc ngủ thành góc làm việc chỉ 3 giây.",
      "Kẹp mép bàn từ 10–60mm chắc chắn mà không cần khoan đục mặt gỗ.",
      "Nâng màn hình ngang tầm mắt bảo vệ đốt sống cổ, giải phóng 0.25m² mặt bàn.",
      "Gọn gàng dây cáp 100%, bảo đảm không gian làm việc tập trung cao độ.",
      "Gấp phẳng ghế đẩy lọt gầm bàn giúp lối đi rộng thêm 70cm.",
    ],
  },
  {
    roomType: "kitchen",
    roomTag: "Nhà bếp nhỏ",
    categoryId: "c1000000-0000-0000-0000-000000000004",
    subcategories: ["Kệ nhà bếp", "Kệ gia vị", "Lưu trữ bồn rửa", "Phụ kiện tủ bếp"],
    baseTitles: [
      "Kệ Gia Vị Khe Tủ Lạnh 15cm Có Bánh Xe",
      "Thanh Hít Dao & Kéo Từ Tính Inox 304",
      "Kệ Úp Chén Bát Đặt Trên Bồn Rửa Chén Tăng Giảm",
      "Thùng Rác Treo Cánh Tủ Bếp Cửa Gạt Tiện Lợi",
      "Khay Chia Muỗng Đũa Ngăn Kéo Điều Chỉnh Chiều Rộng",
      "Kệ Góc Tam Giác Nhà Bếp Inox 304 Chân Đệm Cao Su",
      "Kệ Lò Vi Sóng Khung Thép 2 Tầng Chịu Tải 50kg",
      "Móc Treo Xoong Nồi Chảo Xoay 360 Độ Đáy Tủ",
      "Hộp Đựng Gạo Thông Minh Đong Tự Động 10kg",
      "Kệ Để Nắp Vung Và Thớt Treo Cánh Tủ Bếp Không Khoan",
    ],
    widthRange: [150, 1000],
    depthRange: [120, 550],
    heightRange: [50, 1100],
    priceRange: [120000, 1850000],
    adviceList: [
      "Lọt vừa mọi khe hở kẹp giữa tủ lạnh và tường từ 16cm.",
      "Nam châm vĩnh cửu Neodymium siêu bám, treo vững dao làm bếp 2kg.",
      "Nước rửa bát nhỏ trực tiếp xuống bồn chậu, mặt bếp luôn khô ráo.",
      "Tận dụng triệt để góc chữ L 90 độ của bàn đá bếp mini.",
      "Treo phẳng lên mặt trong cánh tủ, giải phóng 100% diện tích mặt đá nấu nướng.",
    ],
  },
  {
    roomType: "balcony",
    roomTag: "Ban công & Giặt phơi",
    categoryId: "c1000000-0000-0000-0000-000000000005",
    subcategories: ["Phụ kiện ban công", "Giàn phơi thông minh", "Kệ máy giặt", "Vỉ lót sàn ngoài trời"],
    baseTitles: [
      "Giàn Phơi Xếp Gọn Nan Inox Lan Can Ban Công",
      "Kệ Máy Giặt 3 Tầng Chống Rung Lắc Inox 304",
      "Bàn Treo Lan Can Ban Công Gấp Phẳng Uống Cà Phê",
      "Chậu Hoa Trồng Cây Kẹp Lan Can Ban Công Nhựa PP",
      "Móc Phơi Quần Áo Chống Gió Bay Inox 30 Lỗ",
      "Tủ Dụng Cụ Vệ Sinh Ban Công Chống Nước Mưa",
      "Vỉ Gỗ Tràm Tự Nhiên Lót Sàn Ban Công Thoát Nước Nhanh",
      "Khung Giàn Cây Dây Leo Ban Công Tăng Giảm Kích Thước",
      "Dây Phơi Quần Áo Dây Cáp Rút Tự Động Hộp Kim Loại",
      "Kệ Treo Cục Nóng Điều Hòa Để Chậu Cây Tối Ưu Diện Tích",
    ],
    widthRange: [300, 1200],
    depthRange: [150, 700],
    heightRange: [80, 1800],
    priceRange: [130000, 1950000],
    adviceList: [
      "Ngàm kẹp lan can từ 3cm đến 16cm, gấp phẳng dày 4cm khi không dùng.",
      "Khung Inox 304 kháng muối mặn và nắng mưa nhiệt đới 10 năm không gỉ.",
      "Chân tăng chỉnh chống bập bênh theo độ dốc thoát nước của sàn ban công.",
      "Biến lan can hẹp thành bàn làm việc ngoài trời thư giãn ngắm cảnh.",
      "Tận dụng khoảng không trên nắp máy giặt làm kho nước giặt xả gọn gàng.",
    ],
  },
];

// Materials and finishes
const MATERIALS = [
  "Thép carbon sơn tĩnh điện + MDF phủ Melamine",
  "Gỗ cao su tự nhiên ghép thanh tiêu chuẩn E1",
  "Inox 304 kháng gỉ ngoài trời + Nhựa ABS nguyên sinh",
  "Hợp kim nhôm đúc Anodized + Đệm silicone chống trượt",
  "Thép hộp chịu lực + Vải Oxford 600D chống thấm",
  "Nhựa PP nguyên sinh cao cấp chịu nhiệt",
];

const COLORS = [
  "Trắng Bắc Âu / Gỗ Sồi Sáng",
  "Thép Đen Nhám / Gỗ Óc Chó",
  "Bạc Inox Xước Mờ",
  "Xám Xi Măng Tối Giản",
  "Vàng Gỗ Tự Nhiên Vân Mờ",
];

// Generate exactly 250 products (50 per category)
const allProducts = [];
let globalIndex = 1;

for (const cat of CATEGORY_DEFINITIONS) {
  for (let i = 1; i <= 50; i++) {
    const id = `p${globalIndex}`;
    let baseTitle = cat.baseTitles[(i - 1) % cat.baseTitles.length];
    const subcategory = cat.subcategories[(i - 1) % cat.subcategories.length];
    const problem = PROBLEMS[(i - 1) % PROBLEMS.length];

    // Dimensional progression
    let widthMm = Math.round(
      (cat.widthRange[0] + ((cat.widthRange[1] - cat.widthRange[0]) * ((i * 7) % 50)) / 50) / 10
    ) * 10;
    let depthMm = Math.round(
      (cat.depthRange[0] + ((cat.depthRange[1] - cat.depthRange[0]) * ((i * 11) % 50)) / 50) / 10
    ) * 10;
    let heightMm = Math.round(
      (cat.heightRange[0] + ((cat.heightRange[1] - cat.heightRange[0]) * ((i * 13) % 50)) / 50) / 10
    ) * 10;

    // Price progression
    let priceVnd = Math.round(
      (cat.priceRange[0] + ((cat.priceRange[1] - cat.priceRange[0]) * ((i * 9) % 50)) / 50) / 10000
    ) * 10000;

    let noDrill = problem.code === "no-drill" ? true : i % 3 !== 0;

    let title = `${baseTitle} ${widthMm}mm (Bản ${i < 10 ? "0" + i : i})`;
    let slug = slugify(`${baseTitle}-${widthMm}-${globalIndex}`);

    // Preserve exact canonical specs for p1, p2, p3 to guarantee test integrity
    if (id === "p1") {
      title = "Kệ Đứng Chống Trần Tăng Giảm Đa Tầng 600mm";
      slug = "ke-chong-tran-thong-minh-600";
      priceVnd = 680000;
      widthMm = 600;
      depthMm = 280;
      heightMm = 2600;
      noDrill = true;
    } else if (id === "p2") {
      title = "Bàn Làm Việc Gấp Gọn Piston Thủy Lực 800mm";
      slug = "ban-lam-viec-gap-piston-800";
      priceVnd = 1150000;
      widthMm = 800;
      depthMm = 500;
      heightMm = 750;
      noDrill = false;
    } else if (id === "p3") {
      title = "Kệ Gia Vị Khe Tủ Lạnh 15cm Có Bánh Xe";
      slug = "ke-khe-tu-lanh-15cm-banh-xe";
      priceVnd = 420000;
      widthMm = 150;
      depthMm = 450;
      heightMm = 850;
      noDrill = true;
    }

    const imageIndex = (globalIndex - 1) % UNSPLASH_IMAGES.length;
    const imageUrl = UNSPLASH_IMAGES[imageIndex];
    const galleryImages = [
      UNSPLASH_IMAGES[(imageIndex + 3) % UNSPLASH_IMAGES.length],
      UNSPLASH_IMAGES[(imageIndex + 7) % UNSPLASH_IMAGES.length],
      UNSPLASH_IMAGES[(imageIndex + 12) % UNSPLASH_IMAGES.length],
    ];

    // Assign videos to ~40% of products
    const hasVideo = i % 2 === 0 || i % 5 === 0;
    const videoUrl = hasVideo ? SAMPLE_VIDEOS[(globalIndex - 1) % SAMPLE_VIDEOS.length] : undefined;

    const advice = cat.adviceList[(i - 1) % cat.adviceList.length];
    const material = MATERIALS[(i - 1) % MATERIALS.length];
    const color = COLORS[(i - 1) % COLORS.length];

    allProducts.push({
      id,
      slug,
      title,
      category: subcategory,
      roomType: cat.roomType,
      roomTag: cat.roomTag,
      categoryId: cat.categoryId,
      problem: problem.code,
      problemTag: problem.tag,
      dimensions: `${widthMm} × ${depthMm} × ${heightMm} mm`,
      widthMm,
      depthMm,
      heightMm,
      noDrill,
      priceVnd,
      imageUrl,
      galleryImages,
      videoUrl,
      fitScoreExplanation: advice,
      inStock: i % 19 !== 0, // 95% in stock
      material,
      color,
      weightKg: Math.round((2.5 + (widthMm * depthMm * heightMm) / 1e8) * 10) / 10,
      maxLoadKg: noDrill ? 25 : 60,
      stockAvailable: 10 + ((i * 3) % 25),
      sku: `SL-${cat.roomType.toUpperCase().substring(0, 3)}-${String(i).padStart(3, "0")}`,
    });

    globalIndex++;
  }
}

console.log(`Generated ${allProducts.length} products across 5 categories.`);

// =============================================================================
// WRITE web/src/features/catalog/data/mock-products.ts
// =============================================================================

const mockProductsCode = `import type { CatalogProduct } from "../types";

export const SAMPLE_PRODUCTS: CatalogProduct[] = ${JSON.stringify(
  allProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    roomType: p.roomType,
    roomTag: p.roomTag,
    problem: p.problem,
    problemTag: p.problemTag,
    dimensions: p.dimensions,
    widthMm: p.widthMm,
    heightMm: p.heightMm,
    depthMm: p.depthMm,
    noDrill: p.noDrill,
    priceVnd: p.priceVnd,
    imageUrl: p.imageUrl,
    galleryImages: p.galleryImages,
    ...(p.videoUrl ? { videoUrl: p.videoUrl } : {}),
    fitScoreExplanation: p.fitScoreExplanation,
    inStock: p.inStock,
  })),
  null,
  2
)};
`;

const mockProductsPath = path.resolve(__dirname, "../src/features/catalog/data/mock-products.ts");
fs.writeFileSync(mockProductsPath, mockProductsCode, "utf8");
console.log(`Updated ${mockProductsPath} successfully.`);

// =============================================================================
// WRITE supabase/seed.sql
// =============================================================================

function escapeSql(str) {
  if (str === null || str === undefined) return "NULL";
  return `'${String(str).replace(/'/g, "''")}'`;
}

let seedSql = `-- =============================================================================
-- SMALL LIVING 2026 — COMPREHENSIVE HIGH-VOLUME DEMO SEED DATA
-- 250 Curated Space-Saving Products (50 per category) with Photos & Video Demos
-- Fully compatible with PostgreSQL 15+ & Supabase RLS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CATEGORIES (ROOMS & SPATIAL PROBLEMS)
-- -----------------------------------------------------------------------------
INSERT INTO public.categories (id, slug, name, description, type, icon_name, display_order)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'phong-tro-studio', 'Phòng trọ / Studio', 'Giải pháp cho căn hộ dịch vụ và phòng trọ 12-25m²', 'room', 'Home', 1),
  ('c1000000-0000-0000-0000-000000000002', 'phong-ngu-nho', 'Phòng ngủ nhỏ', 'Tận dụng không gian dưới gầm giường và góc đầu giường', 'room', 'Bed', 2),
  ('c1000000-0000-0000-0000-000000000003', 'goc-lam-viec-mini', 'Góc làm việc mini', 'Bàn gấp và phụ kiện treo tường giải phóng mặt sàn', 'room', 'Laptop', 3),
  ('c1000000-0000-0000-0000-000000000004', 'nha-bep-nho', 'Nhà bếp nhỏ', 'Kệ khe hẹp kẹp tủ lạnh và móc treo chịu lực', 'room', 'Utensils', 4),
  ('c1000000-0000-0000-0000-000000000005', 'ban-cong-giat-phoi', 'Ban công & Giặt phơi', 'Giàn phơi xếp gọn lan can và kệ máy giặt', 'room', 'Sun', 5),

  -- Problems
  ('c2000000-0000-0000-0000-000000000001', 'khong-khoan-tuong', 'Không khoan tường', 'Chân đế tăng giảm, thanh kẹp, giác hút cơ học', 'problem', 'ShieldCheck', 1),
  ('c2000000-0000-0000-0000-000000000002', 'phong-hep-duoi-15m2', 'Phòng hẹp dưới 15m²', 'Đồ dùng đa năng tận dụng chiều cao không gian đứng', 'problem', 'Ruler', 2),
  ('c2000000-0000-0000-0000-000000000003', 'goc-chet-khe-hep', 'Góc chết & khe hẹp', 'Kệ trượt 15cm, kệ tam giác bo góc 90 độ', 'problem', 'Maximize2', 3),
  ('c2000000-0000-0000-0000-000000000004', 'gap-gon-da-nang', 'Gấp gọn đa năng', 'Bàn ghế và phụ kiện xếp phẳng độ dày dưới 8cm', 'problem', 'RefreshCw', 4)
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. PRODUCTS & VARIANTS (250 ITEMS)
-- -----------------------------------------------------------------------------
`;

// Insert products in batches
const productValues = allProducts.map((p, idx) => {
  const pUuid = `p1000000-0000-0000-0000-${String(idx + 1).padStart(12, "0")}`;
  const isFeatured = idx < 12;
  return `  (${escapeSql(pUuid)}, ${escapeSql(p.slug)}, ${escapeSql(p.title)}, ${escapeSql(
    p.category
  )}, ${escapeSql(p.fitScoreExplanation)}, ${escapeSql(p.categoryId)}, true, ${isFeatured})`;
});

seedSql += `INSERT INTO public.products (id, slug, title, subtitle, description, category_id, is_published, featured)\nVALUES\n${productValues.join(
  ",\n"
)}\nON CONFLICT (slug) DO NOTHING;\n\n`;

// Insert variants
const variantValues = allProducts.map((p, idx) => {
  const vUuid = `v1000000-0000-0000-0000-${String(idx + 1).padStart(12, "0")}`;
  const pUuid = `p1000000-0000-0000-0000-${String(idx + 1).padStart(12, "0")}`;
  const comparePrice = Math.round(p.priceVnd * 1.15);
  return `  (${escapeSql(vUuid)}, ${escapeSql(pUuid)}, ${escapeSql(p.sku)}, ${escapeSql(
    p.title
  )}, ${p.priceVnd}, ${comparePrice}, ${p.widthMm}, ${p.depthMm}, ${p.heightMm}, ${p.weightKg}, ${p.maxLoadKg}, ${
    p.noDrill
  }, ${escapeSql(p.material)}, ${escapeSql(p.color)}, ${p.stockAvailable}, 0, ${escapeSql(
    p.imageUrl
  )}, ${escapeSql(p.fitScoreExplanation)})`;
});

seedSql += `INSERT INTO public.product_variants (\n  id, product_id, sku, title, price_vnd, compare_at_price_vnd,\n  width_mm, depth_mm, height_mm, weight_kg, max_load_kg,\n  no_drill_flag, material, color, stock_available, stock_reserved,\n  image_url, fit_score_explanation\n)\nVALUES\n${variantValues.join(
  ",\n"
)}\nON CONFLICT (sku) DO NOTHING;\n\n`;

// Insert tags
const tagValues = [];
allProducts.forEach((p, idx) => {
  const pUuid = `p1000000-0000-0000-0000-${String(idx + 1).padStart(12, "0")}`;
  tagValues.push(`  (${escapeSql(pUuid)}, ${escapeSql(p.roomType)}, 'room')`);
  tagValues.push(`  (${escapeSql(pUuid)}, ${escapeSql(p.problem)}, 'problem')`);
});

seedSql += `INSERT INTO public.product_tags (product_id, tag, tag_type)\nVALUES\n${tagValues.join(
  ",\n"
)}\nON CONFLICT DO NOTHING;\n\n`;

// Inventory movements for first 20 products
const movementValues = allProducts.slice(0, 20).map((p, idx) => {
  const mUuid = `m1000000-0000-0000-0000-${String(idx + 1).padStart(12, "0")}`;
  const vUuid = `v1000000-0000-0000-0000-${String(idx + 1).padStart(12, "0")}`;
  return `  (${escapeSql(mUuid)}, ${escapeSql(vUuid)}, 'restock', ${p.stockAvailable}, ${
    p.stockAvailable
  }, ${escapeSql(`INITIAL-RESTOCK-${p.sku}`)}, ${escapeSql("Nhập kho lô hàng đầu kỳ Small Living 2026")})`;
});

seedSql += `INSERT INTO public.inventory_movements (id, variant_id, movement_type, delta_quantity, balance_after, reference_id, reason)\nVALUES\n${movementValues.join(
  ",\n"
)}\nON CONFLICT DO NOTHING;\n\n`;

// Promotions
seedSql += `-- -----------------------------------------------------------------------------
-- 3. PROMOTIONS
-- -----------------------------------------------------------------------------
INSERT INTO public.promotions (id, code, description, discount_percent, max_discount_vnd, min_order_amount_vnd, is_active)
VALUES
  ('pr000000-0000-0000-0000-000000000001', 'SMALL2026', 'Giảm 10% cho đơn hàng đầu tiên trải nghiệm Small Living', 10, 200000, 500000, true),
  ('pr000000-0000-0000-0000-000000000002', 'NODRILL', 'Ưu đãi giải pháp không khoan tường', 5, 100000, 300000, true),
  ('pr000000-0000-0000-0000-000000000003', 'STUDIO50', 'Trợ giá sinh viên thuê trọ đầu năm học', 8, 150000, 400000, true)
ON CONFLICT (code) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. DEMO ORDERS & EVENTS
-- -----------------------------------------------------------------------------
INSERT INTO public.orders (
  id, customer_name, customer_email, customer_phone, shipping_address,
  status, subtotal_vnd, discount_vnd, shipping_vnd, total_amount_vnd,
  applied_promotion_code, idempotency_key, is_demo
) VALUES
  (
    'ORD-2026-001', 'Nguyễn Văn A', 'customer.a@demo.local', '0901234567',
    'Căn hộ 402, Tòa nhà Studio, Phường Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    'processing', 2250000, 100000, 0, 2150000,
    'SMALL2026', 'idemp_demo_order_001', true
  ),
  (
    'ORD-2026-002', 'Trần Thị B', 'customer.b@demo.local', '0912345678',
    'Phòng 203, Ký túc xá ĐHQG, TP. Thủ Đức, TP. Hồ Chí Minh',
    'placed', 680000, 0, 0, 680000,
    NULL, 'idemp_demo_order_002', true
  ),
  (
    'ORD-2026-003', 'Lê Hoàng C', 'customer.c@demo.local', '0987654321',
    'Số 15 ngõ 82 Kim Mã, Ba Đình, Hà Nội',
    'delivered', 1570000, 100000, 0, 1470000,
    'SMALL2026', 'idemp_demo_order_003', true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_items (
  order_id, variant_id, sku, title_snapshot, dimensions_snapshot,
  unit_price_vnd, quantity, line_total_vnd
) VALUES
  ('ORD-2026-001', 'v1000000-0000-0000-0000-000000000001', 'SL-STU-001', 'Kệ Đứng Chống Trần Tăng Giảm Đa Tầng', '600 × 280 × 2600 mm', 680000, 1, 680000),
  ('ORD-2026-001', 'v1000000-0000-0000-0000-000000000101', 'SL-WOR-001', 'Bàn Làm Việc Gấp Gọn Piston Thủy Lực', '800 × 500 × 750 mm', 1150000, 1, 1150000),
  ('ORD-2026-001', 'v1000000-0000-0000-0000-000000000151', 'SL-KIT-001', 'Kệ Gia Vị Khe Tủ Lạnh 15cm Có Bánh Xe', '150 × 450 × 850 mm', 420000, 1, 420000),
  ('ORD-2026-002', 'v1000000-0000-0000-0000-000000000001', 'SL-STU-001', 'Kệ Đứng Chống Trần Tăng Giảm Đa Tầng', '600 × 280 × 2600 mm', 680000, 1, 680000)
ON CONFLICT DO NOTHING;

INSERT INTO public.order_events (order_id, event_type, actor_role, message)
VALUES
  ('ORD-2026-001', 'placed', 'customer', 'Khách hàng tạo đơn hàng mô phỏng thành công.'),
  ('ORD-2026-001', 'payment_simulated', 'system', 'Mô phỏng thanh toán thành công (Mã giao dịch Demo: TX_SIM_001).'),
  ('ORD-2026-001', 'processing_started', 'staff', 'Kho xác nhận đơn và đang đóng gói sản phẩm.'),
  ('ORD-2026-002', 'placed', 'customer', 'Đơn hàng mới tạo, đang chờ xác nhận từ hệ thống.'),
  ('ORD-2026-003', 'delivered', 'staff', 'Đơn hàng đã giao thành công tới người nhận.')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 5. ROOM TEMPLATE (STARTER FOR PLANNER)
-- -----------------------------------------------------------------------------
INSERT INTO public.room_profiles (id, name, width_mm, depth_mm, height_mm, no_drill_required, budget_vnd, is_template)
VALUES (
  'rp000000-0000-0000-0000-000000000001',
  'Mẫu phòng trọ Studio 16m²',
  4000, 4000, 2600,
  true, 5000000, true
) ON CONFLICT DO NOTHING;

INSERT INTO public.room_scenes (id, room_profile_id, name)
VALUES (
  'rs000000-0000-0000-0000-000000000001',
  'rp000000-0000-0000-0000-000000000001',
  'Bố cục mặt bằng tối ưu 16m²'
) ON CONFLICT DO NOTHING;

INSERT INTO public.scene_objects (scene_id, variant_id, x_mm, y_mm, rotation_deg)
VALUES
  ('rs000000-0000-0000-0000-000000000001', 'v1000000-0000-0000-0000-000000000001', 300, 300, 0),
  ('rs000000-0000-0000-0000-000000000002', 'v1000000-0000-0000-0000-000000000101', 1400, 300, 0)
ON CONFLICT DO NOTHING;
`;

const seedSqlPath = path.resolve(__dirname, "../../supabase/seed.sql");
fs.writeFileSync(seedSqlPath, seedSql, "utf8");
console.log(`Updated ${seedSqlPath} successfully.`);
