import { SkeletonGrid } from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div className="site-container py-4">
      {/* Header & Controls Placeholder */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="skeleton-primitive skeleton-line" style={{ width: "240px", height: "32px" }} />
          <div className="skeleton-primitive skeleton-line mt-2" style={{ width: "160px", height: "16px" }} />
        </div>
        <div className="d-flex gap-2">
          <div className="skeleton-primitive" style={{ width: "140px", height: "40px", borderRadius: "8px" }} />
          <div className="skeleton-primitive" style={{ width: "120px", height: "40px", borderRadius: "8px" }} />
        </div>
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="d-flex gap-2 mb-4">
        <div className="skeleton-primitive" style={{ width: "100px", height: "36px", borderRadius: "20px" }} />
        <div className="skeleton-primitive" style={{ width: "120px", height: "36px", borderRadius: "20px" }} />
        <div className="skeleton-primitive" style={{ width: "110px", height: "36px", borderRadius: "20px" }} />
      </div>

      {/* Product Cards Grid */}
      <SkeletonGrid count={8} />
    </div>
  );
}

