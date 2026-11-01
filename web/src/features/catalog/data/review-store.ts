export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1 to 5
  spaceType: string; // e.g. "Phòng trọ 12m2", "Gác xép mini"
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
}

// XSS Sanitizer for review inputs (E003)
export function sanitizeReviewText(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

const SEED_REVIEWS: ProductReview[] = [
  {
    id: "rev-001",
    productId: "p1",
    userName: "Hoàng Linh (SV ĐH Quốc Gia)",
    rating: 5,
    spaceType: "Phòng trọ 14m² gác xép",
    title: "Chân kẹp đỉnh cao, chủ nhà khó tính cũng không nói gì",
    comment: "Bàn kê sát góc tường vừa khít 100cm, cơ chế chân kẹp rất chắc không cần bắt vít vào tường. Gấp lại khi dọn phòng cực nhanh.",
    verifiedBuyer: true,
    status: "approved",
    createdAt: "2026-01-20T14:30:00Z",
  },
  {
    id: "rev-002",
    productId: "p1",
    userName: "Trần Đức Anh",
    rating: 4,
    spaceType: "Studio 18m² Cầu Giấy",
    title: "Gọn gàng, chất lượng gỗ MDF melamine ổn",
    comment: "Góc bàn bo cong an toàn, đi lại trong phòng nhỏ không sợ va chạm bầm tím. Đóng gói cẩn thận có xốp chống sốc.",
    verifiedBuyer: true,
    status: "approved",
    createdAt: "2026-01-28T09:15:00Z",
  },
  {
    id: "rev-003",
    productId: "p2",
    userName: "Vũ Hải Yến",
    rating: 5,
    spaceType: "Phòng trọ 12m²",
    title: "Kệ 20cm cứu tinh cho kẽ hở giữa tủ và tường",
    comment: "Nhà mình có đúng 25cm giữa tủ lạnh và vách ngăn, nhét chiếc kệ này vào để được 15 hộp gia vị và đồ hộp. Bánh xe trượt rất êm.",
    verifiedBuyer: true,
    status: "approved",
    createdAt: "2026-02-02T16:00:00Z",
  },
  {
    id: "rev-004",
    productId: "p3",
    userName: "Nguyễn Hải Đăng",
    rating: 5,
    spaceType: "Góc làm việc 1.2m²",
    title: "Ghế đẩy gọn hoàn toàn dưới gầm bàn",
    comment: "Lưng lưới thông thoáng, tay vịn gập lên được nên đẩy sâu vào gầm bàn khi không ngồi, giải phóng trọn vẹn 0.5m2 lối đi.",
    verifiedBuyer: true,
    status: "approved",
    createdAt: "2026-02-10T11:20:00Z",
  },
  {
    id: "rev-005",
    productId: "p4",
    userName: "Lê Minh Tuấn",
    rating: 5,
    spaceType: "Chung cư mini 22m²",
    title: "Chống trần lò xo siêu chắc chắn",
    comment: "Lắp đặt 15 phút không cần máy khoan, treo được 8 chiếc áo khoác và túi xách mà không lung lay.",
    verifiedBuyer: true,
    status: "approved",
    createdAt: "2026-02-14T08:45:00Z",
  },
];

let reviewStore: ProductReview[] = [...SEED_REVIEWS];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function getAllReviews(): ProductReview[] {
  return [...reviewStore];
}

export function getApprovedReviews(productId: string): ProductReview[] {
  return reviewStore.filter((r) => r.productId === productId && r.status === "approved");
}

export function getProductRatingSummary(productId: string): { average: number; count: number } {
  const list = getApprovedReviews(productId);
  if (list.length === 0) return { average: 5, count: 0 };
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Math.round((sum / list.length) * 10) / 10,
    count: list.length,
  };
}

export function submitProductReview(data: {
  productId: string;
  userName: string;
  rating: number;
  spaceType: string;
  title: string;
  comment: string;
}): { success: boolean; review: ProductReview } {
  const sanitizedTitle = sanitizeReviewText(data.title.trim());
  const sanitizedComment = sanitizeReviewText(data.comment.trim());
  const sanitizedName = sanitizeReviewText(data.userName.trim() || "Khách hàng ẩn danh");
  const sanitizedSpace = sanitizeReviewText(data.spaceType.trim() || "Không gian nhỏ");

  const newReview: ProductReview = {
    id: `rev-${Date.now()}`,
    productId: data.productId,
    userName: sanitizedName,
    rating: Math.max(1, Math.min(5, Math.round(data.rating))),
    spaceType: sanitizedSpace,
    title: sanitizedTitle,
    comment: sanitizedComment,
    verifiedBuyer: true,
    status: "approved", // Auto-approved for portfolio demo interactivity
    createdAt: new Date().toISOString(),
  };

  reviewStore = [newReview, ...reviewStore];
  notify();
  return { success: true, review: newReview };
}

export function moderateReview(reviewId: string, action: "approve" | "reject"): boolean {
  const target = reviewStore.find((r) => r.id === reviewId);
  if (!target) return false;
  target.status = action === "approve" ? "approved" : "rejected";
  notify();
  return true;
}

export function resetReviewStoreToSeed(): void {
  reviewStore = [...SEED_REVIEWS];
  notify();
}

