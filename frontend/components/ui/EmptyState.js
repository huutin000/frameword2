import React from "react";
import Link from "next/link";

export default function EmptyState({
  icon = "box",
  title = "Không tìm thấy dữ liệu",
  description = "Hiện tại không có mục nào để hiển thị trong khu vực này.",
  actionLabel = "Tiếp tục khám phá",
  actionHref = "/product",
  onAction = null,
}) {
  const renderIcon = () => {
    switch (icon) {
      case "cart":
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-state-svg">
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
        );
      case "search":
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-state-svg">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" strokeDasharray="2 2" />
          </svg>
        );
      case "error":
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-state-svg text-danger">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      default:
        return (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-state-svg">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        );
    }
  };

  return (
    <div className="empty-state-card">
      <div className="empty-state-icon-wrap">{renderIcon()}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {onAction ? (
        <button type="button" onClick={onAction} className="btn btn-primary px-4 py-2 rounded-3 fw-bold">
          {actionLabel}
        </button>
      ) : actionHref ? (
        <Link href={actionHref} className="btn btn-primary px-4 py-2 rounded-3 fw-bold">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

