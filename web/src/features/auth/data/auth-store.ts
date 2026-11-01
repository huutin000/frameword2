import type { CustomerUser, CustomerAddress } from "../types";

const AUTH_STORAGE_KEY = "small_living_auth_user_v1";

export const DEMO_CUSTOMER: CustomerUser = {
  id: "usr-demo-001",
  email: "demo.customer@smallliving.vn",
  fullName: "Lê Minh Tuấn",
  phone: "0912 345 678",
  role: "customer",
  createdAt: "2026-01-15T08:00:00Z",
  addresses: [
    {
      id: "addr-001",
      userId: "usr-demo-001",
      recipientName: "Lê Minh Tuấn",
      phone: "0912 345 678",
      street: "Phòng 302, Tòa nhà Xanh, Ngõ 120 Hoàng Quốc Việt",
      ward: "Nghĩa Đô",
      district: "Cầu Giấy",
      province: "Hà Nội",
      isDefault: true,
      notes: "Căn hộ mini tầng 3 không thang máy",
    },
  ],
};

export const DEMO_ADMIN: CustomerUser = {
  id: "usr-admin-001",
  email: "admin@smallliving.vn",
  fullName: "Quản Trị Viên Small Living",
  phone: "0900 123 456",
  role: "admin",
  createdAt: "2026-01-01T00:00:00Z",
  addresses: [],
};

let currentUser: CustomerUser | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function initAuth() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      currentUser = JSON.parse(raw);
    } else {
      // Default auto-login to demo customer for seamless portfolio review
      currentUser = DEMO_CUSTOMER;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_CUSTOMER));
    }
  } catch {
    currentUser = DEMO_CUSTOMER;
  }
}

// Client initialization
if (typeof window !== "undefined") {
  initAuth();
}

export function getCurrentUser(): CustomerUser | null {
  return currentUser;
}

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function loginCustomer(email: string, password: string): { success: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) {
    return { success: false, error: "Vui lòng nhập đầy đủ email và mật khẩu." };
  }

  if (cleanEmail === DEMO_ADMIN.email) {
    currentUser = DEMO_ADMIN;
  } else {
    currentUser = {
      ...DEMO_CUSTOMER,
      email: cleanEmail,
      fullName: cleanEmail.startsWith("admin") ? "Quản Trị Viên" : "Khách Hàng Trải Nghiệm",
    };
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
  }
  notify();
  return { success: true };
}

export function registerCustomer(fullName: string, email: string, phone: string): { success: boolean; error?: string } {
  if (!fullName.trim() || !email.trim() || !phone.trim()) {
    return { success: false, error: "Vui lòng điền đủ họ tên, email và số điện thoại." };
  }

  const newUser: CustomerUser = {
    id: `usr-${Date.now()}`,
    email: email.trim().toLowerCase(),
    fullName: fullName.trim(),
    phone: phone.trim(),
    role: "customer",
    createdAt: new Date().toISOString(),
    addresses: [],
  };

  currentUser = newUser;
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
  }
  notify();
  return { success: true };
}

export function logoutCustomer(): void {
  currentUser = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  notify();
}

export function updateCustomerProfile(updates: Partial<Pick<CustomerUser, "fullName" | "phone" | "avatarUrl">>): void {
  if (!currentUser) return;
  currentUser = { ...currentUser, ...updates };
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
  }
  notify();
}

export function addCustomerAddress(address: Omit<CustomerAddress, "id" | "userId">): CustomerAddress {
  if (!currentUser) throw new Error("Chưa đăng nhập");
  const newAddr: CustomerAddress = {
    ...address,
    id: `addr-${Date.now()}`,
    userId: currentUser.id,
  };

  const updatedAddresses = address.isDefault
    ? currentUser.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
    : [...currentUser.addresses, newAddr];

  currentUser = { ...currentUser, addresses: updatedAddresses };
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
  }
  notify();
  return newAddr;
}

export function removeCustomerAddress(addressId: string): void {
  if (!currentUser) return;
  currentUser = {
    ...currentUser,
    addresses: currentUser.addresses.filter((a) => a.id !== addressId),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
  }
  notify();
}

export function requestPasswordReset(email: string): { success: boolean; message: string } {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Email không đúng định dạng." };
  }
  return {
    success: true,
    message: `Đã gửi liên kết khôi phục mật khẩu demo đến ${email}. (Sandbox mode: Không gửi email thực tế).`,
  };
}

