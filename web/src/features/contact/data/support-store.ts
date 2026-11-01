export interface SupportTicket {
  id: string; // TKT-2026-XXXX
  fullName: string;
  phone: string;
  roomType: string;
  dimensions: string;
  problemDescription: string;
  status: "pending" | "in_progress" | "resolved";
  adminReply?: string;
  createdAt: string;
}

const SEED_TICKETS: SupportTicket[] = [
  {
    id: "TKT-2026-001",
    fullName: "Trần Phương Thảo",
    phone: "0987 654 321",
    roomType: "Phòng trọ cho thuê (dưới 15m²)",
    dimensions: "3.2m x 2.8m, trần 2.6m",
    problemDescription: "Chủ nhà không cho khoan đục tường, muốn có bàn làm việc nhưng phòng ngủ quá chật, cần tư vấn giải pháp bàn kẹp và giá sách kẹp.",
    status: "resolved",
    adminReply: "Đã tư vấn combo Bàn Gập Tường Chân Kẹp (p1) và Kệ Đứng Đa Năng. Lối đi thông thoáng 75cm.",
    createdAt: "2026-01-22T10:00:00Z",
  },
  {
    id: "TKT-2026-002",
    fullName: "Vũ Hải Yến",
    phone: "0912 888 999",
    roomType: "Căn hộ Studio mini (15m² - 25m²)",
    dimensions: "Dài 4.5m x Rộng 3.2m",
    problemDescription: "Kẽ hẹp giữa tủ quần áo và cửa sổ chỉ có 28cm, cần kệ để vừa đồ skincare và phụ kiện.",
    status: "pending",
    createdAt: "2026-02-01T14:15:00Z",
  },
];

let ticketStore: SupportTicket[] = [...SEED_TICKETS];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function getAllSupportTickets(): SupportTicket[] {
  return [...ticketStore];
}

export function createSupportTicket(data: {
  fullName: string;
  phone: string;
  roomType: string;
  dimensions: string;
  problemDescription: string;
}): SupportTicket {
  const serial = Math.floor(1000 + Math.random() * 9000);
  const newTicket: SupportTicket = {
    id: `TKT-2026-${serial}`,
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    roomType: data.roomType,
    dimensions: data.dimensions.trim() || "Chưa cung cấp",
    problemDescription: data.problemDescription.trim(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  ticketStore = [newTicket, ...ticketStore];
  notify();
  return newTicket;
}

export function updateSupportTicketStatus(
  ticketId: string,
  status: SupportTicket["status"],
  adminReply?: string
): boolean {
  const target = ticketStore.find((t) => t.id === ticketId);
  if (!target) return false;
  target.status = status;
  if (adminReply) target.adminReply = adminReply;
  notify();
  return true;
}

export function resetSupportStoreToSeed(): void {
  ticketStore = [...SEED_TICKETS];
  notify();
}

