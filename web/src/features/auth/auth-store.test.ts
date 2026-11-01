import { describe, it, expect, beforeEach } from "vitest";
import {
  getCurrentUser,
  loginCustomer,
  logoutCustomer,
  updateCustomerProfile,
  addCustomerAddress,
  removeCustomerAddress,
  requestPasswordReset,
  DEMO_CUSTOMER,
} from "./data/auth-store";

describe("Customer & Admin Auth Domain Suite (U021, U022, U023, U024)", () => {
  beforeEach(() => {
    // Reset to demo customer before each test
    loginCustomer(DEMO_CUSTOMER.email, "password123");
  });

  it("[U021] logs in demo customer successfully", () => {
    const res = loginCustomer("demo.customer@smallliving.vn", "password123");
    expect(res.success).toBe(true);
    const user = getCurrentUser();
    expect(user).not.toBeNull();
    expect(user?.email).toBe(DEMO_CUSTOMER.email);
    expect(user?.role).toBe("customer");
  });

  it("[U021] logs in admin with admin role", () => {
    const res = loginCustomer("admin@smallliving.vn", "admin123");
    expect(res.success).toBe(true);
    const user = getCurrentUser();
    expect(user?.role).toBe("admin");
  });

  it("[U021] rejects empty login fields", () => {
    const res = loginCustomer("", "");
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });

  it("[U024] updates customer profile fields", () => {
    updateCustomerProfile({ fullName: "Nguyễn Văn Test", phone: "0999888777" });
    const user = getCurrentUser();
    expect(user?.fullName).toBe("Nguyễn Văn Test");
    expect(user?.phone).toBe("0999888777");
  });

  it("[U023] adds and removes shipping addresses", () => {
    const newAddr = addCustomerAddress({
      recipientName: "Bạn Cùng Phòng",
      phone: "0988 777 666",
      street: "Phòng 101, Tòa B, Ngõ 45 Cầu Giấy",
      ward: "Dịch Vọng",
      district: "Cầu Giấy",
      province: "Hà Nội",
      isDefault: true,
      notes: "Cửa hẹp 70cm",
    });

    expect(newAddr.id).toBeDefined();
    let user = getCurrentUser();
    expect(user?.addresses.some((a) => a.id === newAddr.id)).toBe(true);
    expect(user?.addresses.find((a) => a.id === newAddr.id)?.isDefault).toBe(true);

    // Remove address
    removeCustomerAddress(newAddr.id);
    user = getCurrentUser();
    expect(user?.addresses.some((a) => a.id === newAddr.id)).toBe(false);
  });

  it("[U022] triggers password reset sandbox without side effects", () => {
    const validRes = requestPasswordReset("demo.customer@smallliving.vn");
    expect(validRes.success).toBe(true);
    expect(validRes.message).toContain("demo.customer@smallliving.vn");

    const invalidRes = requestPasswordReset("not-an-email");
    expect(invalidRes.success).toBe(false);
  });

  it("[U021] logs out customer cleanly", () => {
    logoutCustomer();
    expect(getCurrentUser()).toBeNull();
  });
});
