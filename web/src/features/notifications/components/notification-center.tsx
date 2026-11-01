"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Package, Tag, MessageSquare, Info } from "lucide-react";
import { useNotifications, type AppNotification } from "../data/notification-store";

export function NotificationCenter() {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "order":
        return <Package className="w-3.5 h-3.5 text-[#5B7065]" />;
      case "promo":
        return <Tag className="w-3.5 h-3.5 text-[#A05C52]" />;
      case "support":
        return <MessageSquare className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <Info className="w-3.5 h-3.5 text-[#786C5E]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 sm:p-2 text-[#786C5E] hover:text-[#29241E] hover:bg-[#F3EFEA] rounded-md transition-colors relative"
        title="Thông báo hệ thống (U041)"
        aria-label="Thông báo sự kiện"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-[#A05C52] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E7E0D6] rounded-2xl shadow-xl z-50 overflow-hidden text-xs animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="p-3.5 bg-[#FAF8F5] border-b border-[#E7E0D6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#29241E]">Thông báo sự kiện (U041)</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF0ED] text-[#5B7065]">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-[#5B7065] hover:underline flex items-center gap-1 font-semibold"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đã đọc tất cả</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="divide-y divide-[#E7E0D6] max-h-80 overflow-y-auto">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                  item.isRead ? "bg-white hover:bg-[#FAF8F5]" : "bg-[#FAF8F5]/80 hover:bg-[#FAF8F5]"
                }`}
              >
                <div className="p-1.5 rounded-lg bg-white border border-[#E7E0D6] shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className={`block text-xs ${item.isRead ? "text-[#5A4033]" : "text-[#29241E] font-bold"}`}>
                      {item.title}
                    </strong>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#5B7065] shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#786C5E] leading-relaxed">{item.message}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-[#A05C52] font-mono">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                    {item.linkUrl && (
                      <Link
                        href={item.linkUrl}
                        onClick={() => setIsOpen(false)}
                        className="text-[11px] text-[#5B7065] font-semibold hover:underline"
                      >
                        Xem chi tiết →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

