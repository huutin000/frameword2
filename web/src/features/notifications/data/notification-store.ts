import { useSyncExternalStore } from "react";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "order" | "promo" | "support" | "system";
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

const STORAGE_KEY = "small_living_notifications_v1";

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Đơn hàng đang xử lý đóng gói",
    message: "Đơn hàng #SL-2026-001 của bạn đã được đối chiếu kích thước và đang chuẩn bị đóng kiện vận chuyển.",
    type: "order",
    linkUrl: "/account",
    isRead: false,
    createdAt: "2026-02-15T08:30:00Z",
  },
  {
    id: "notif-2",
    title: "Ưu đãi combo không gian nhỏ",
    message: "Mã giảm giá SMALL2026 (giảm 10% tối đa 500.000đ) sẵn sàng áp dụng cho mọi đơn hàng từ 1 món.",
    type: "promo",
    linkUrl: "/solutions",
    isRead: false,
    createdAt: "2026-02-14T09:00:00Z",
  },
  {
    id: "notif-3",
    title: "Yêu cầu tư vấn đã tiếp nhận",
    message: "Kiến trúc sư Small Living đã lưu số đo phòng trọ của bạn (Mã ticket: TKT-2026-001).",
    type: "support",
    linkUrl: "/contact",
    isRead: true,
    createdAt: "2026-02-10T14:15:00Z",
  },
];

let notifications: AppNotification[] = [...SEED_NOTIFICATIONS];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function initNotifications() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      notifications = JSON.parse(raw);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_NOTIFICATIONS));
    }
  } catch {
    notifications = SEED_NOTIFICATIONS;
  }
}

if (typeof window !== "undefined") {
  initNotifications();
}

export function getAllNotifications(): AppNotification[] {
  return notifications;
}

export function markAllNotificationsAsRead(): void {
  notifications = notifications.map((n) => ({ ...n, isRead: true }));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }
  notify();
}

export function markNotificationAsRead(id: string): void {
  notifications = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }
  notify();
}

export function addAppNotification(notif: Omit<AppNotification, "id" | "isRead" | "createdAt">): AppNotification {
  const newNotif: AppNotification = {
    ...notif,
    id: `notif-${Date.now()}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  notifications = [newNotif, ...notifications];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }
  notify();
  return newNotif;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useNotifications() {
  const notifs = useSyncExternalStore(
    subscribe,
    getAllNotifications,
    () => SEED_NOTIFICATIONS // Server snapshot
  );

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  return {
    notifications: notifs,
    unreadCount,
    markAllAsRead: markAllNotificationsAsRead,
    markAsRead: markNotificationAsRead,
    addNotification: addAppNotification,
  };
}

