import React from "react";

export function Skeleton({ className = "", style = {}, variant = "rect" }) {
  return (
    <div
      className={`skeleton-primitive skeleton-${variant} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 1, className = "", lastLineWidth = "60%" }) {
  return (
    <div className={`skeleton-text-group ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="skeleton-primitive skeleton-line"
          style={{ width: index === lines - 1 && lines > 1 ? lastLineWidth : "100%" }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="product-card skeleton-card" aria-hidden="true">
      {/* Thumbnail placeholder */}
      <div className="card-thumbnail-wrap">
        <div className="skeleton-primitive skeleton-img-box" />
      </div>

      {/* Body placeholder */}
      <div className="card-body">
        {/* Category tag */}
        <div className="skeleton-primitive skeleton-pill" style={{ width: "35%", height: "14px" }} />

        {/* Title */}
        <div className="skeleton-primitive skeleton-line" style={{ width: "90%", height: "16px", marginTop: "8px" }} />
        <div className="skeleton-primitive skeleton-line" style={{ width: "65%", height: "16px", marginTop: "4px" }} />

        {/* Price */}
        <div className="skeleton-primitive skeleton-line" style={{ width: "50%", height: "20px", marginTop: "12px" }} />

        {/* Button */}
        <div className="skeleton-primitive skeleton-btn" style={{ width: "100%", height: "38px", marginTop: "14px", borderRadius: "8px" }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="hero-section skeleton-hero-wrap" aria-hidden="true">
      <div className="hero-grid">
        <div className="hero-main-card skeleton-primitive" style={{ minHeight: "380px" }} />
        <div className="hero-side-cards d-none d-lg-flex flex-column gap-3">
          <div className="hero-promo-card skeleton-primitive" style={{ height: "180px" }} />
          <div className="hero-promo-card skeleton-primitive" style={{ height: "180px" }} />
        </div>
      </div>
    </div>
  );
}

