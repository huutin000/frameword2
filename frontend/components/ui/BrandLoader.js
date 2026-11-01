"use client";

import React from "react";

export default function BrandLoader({ size = "md", label = "Đang tải dữ liệu...", fullScreen = false }) {
  const sizeMap = {
    sm: { width: 36, height: 36, mark: 36 },
    md: { width: 56, height: 56, mark: 56 },
    lg: { width: 80, height: 80, mark: 80 },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`brand-loader-wrap ${fullScreen ? "full-screen" : ""}`} role="status" aria-live="polite">
      <div className="brand-loader-inner">
        <div
          className="brand-loader-mark"
          style={{ width: `${currentSize.width}px`, height: `${currentSize.height}px` }}
        >
          {/* KOVIQO Monogram K SVG with pulsating glow */}
          <svg viewBox="0 0 64 64" fill="none" className="loader-svg" width="100%" height="100%">
            <defs>
              <linearGradient id="loader-stem" x1="12" y1="8" x2="26" y2="56" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="loader-wing" x1="26" y1="8" x2="54" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="#0B0F19" />
            <rect x="12" y="12" width="10" height="40" rx="5" fill="url(#loader-stem)" className="loader-element stem" />
            <path d="M26 30L44 14C45.8 12.4 48.5 13.8 48.5 16.2V21.5C48.5 22.8 47.8 24 46.8 24.8L34 35L26 30Z" fill="url(#loader-wing)" className="loader-element wing-top" />
            <path d="M28 33L47.2 49C48.2 49.8 48.8 51.1 48.8 52.4V52.8C48.8 55.2 45.9 56.6 44.1 54.9L26 38.5L28 33Z" fill="#1E40AF" className="loader-element wing-bot" />
            <circle cx="28" cy="34" r="2.5" fill="#93C5FD" className="loader-element apex" />
          </svg>
        </div>
        {label && <span className="brand-loader-label">{label}</span>}
      </div>
    </div>
  );

  return content;
}

