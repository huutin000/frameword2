import { SkeletonHero, SkeletonGrid, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="site-container py-3">
      {/* 1. Hero Skeleton */}
      <SkeletonHero />

      {/* 2. Trust Bar Skeleton */}
      <div className="trust-bar my-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="trust-item" key={i}>
            <div className="skeleton-primitive" style={{ width: "40px", height: "40px", borderRadius: "10px" }} />
            <div className="d-flex flex-column gap-2" style={{ flex: 1 }}>
              <div className="skeleton-primitive skeleton-line" style={{ width: "70%", height: "14px" }} />
              <div className="skeleton-primitive skeleton-line" style={{ width: "90%", height: "12px" }} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Category Skeleton */}
      <div className="mb-5">
        <div className="skeleton-primitive skeleton-line mb-3" style={{ width: "220px", height: "24px" }} />
        <div className="category-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="category-card skeleton-primitive" key={i} style={{ height: "96px" }} />
          ))}
        </div>
      </div>

      {/* 4. Products Grid Skeleton */}
      <div className="mb-5">
        <div className="skeleton-primitive skeleton-line mb-3" style={{ width: "260px", height: "24px" }} />
        <SkeletonGrid count={8} />
      </div>
    </div>
  );
}

