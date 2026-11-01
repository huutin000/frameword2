import { describe, it, expect, beforeEach } from "vitest";
import {
  getAllSupportTickets,
  createSupportTicket,
  updateSupportTicketStatus,
  resetSupportStoreToSeed,
} from "./data/support-store";

describe("Customer Support & Inquiries Domain (U040, A033)", () => {
  beforeEach(() => {
    resetSupportStoreToSeed();
  });

  it("[U040] lists seeded support tickets", () => {
    const list = getAllSupportTickets();
    expect(list.length).toBeGreaterThanOrEqual(2);
  });

  it("[U040] creates new support ticket with deterministic TKT code", () => {
    const ticket = createSupportTicket({
      fullName: "Nguyễn Văn Hùng",
      phone: "0934 567 890",
      roomType: "Phòng trọ 15m2",
      dimensions: "3.5m x 4.0m",
      problemDescription: "Cửa sổ bị kẹt rèm, cần giá treo đa năng không khoan tường",
    });

    expect(ticket.id).toMatch(/^TKT-2026-\d{4}$/);
    expect(ticket.status).toBe("pending");

    const all = getAllSupportTickets();
    expect(all.some((t) => t.id === ticket.id)).toBe(true);
  });

  it("[A033] updates ticket status and attaches admin reply", () => {
    const list = getAllSupportTickets();
    const target = list[0];

    const updated = updateSupportTicketStatus(
      target.id,
      "resolved",
      "Đã gửi bản vẽ đề xuất qua Zalo khách hàng."
    );
    expect(updated).toBe(true);

    const recheck = getAllSupportTickets().find((t) => t.id === target.id);
    expect(recheck?.status).toBe("resolved");
    expect(recheck?.adminReply).toContain("Zalo");
  });
});

