export default function ProductDetailLoading() {
  return (
    <div className="site-container py-4">
      {/* Breadcrumb Skeleton */}
      <div className="skeleton-primitive skeleton-line mb-4" style={{ width: "220px", height: "16px" }} />

      <div className="detail-layout">
        {/* Gallery / Image Skeleton */}
        <div className="detail-gallery-card">
          <div className="skeleton-primitive skeleton-img-box" style={{ width: "100%", height: "420px", borderRadius: "12px" }} />
          <div className="d-flex gap-2 mt-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-primitive" style={{ width: "70px", height: "70px", borderRadius: "8px" }} />
            ))}
          </div>
        </div>

        {/* Info & Purchase Area Skeleton */}
        <div className="detail-info-card">
          <div className="skeleton-primitive skeleton-pill mb-2" style={{ width: "90px", height: "16px" }} />
          <div className="skeleton-primitive skeleton-line mb-2" style={{ width: "85%", height: "28px" }} />
          <div className="skeleton-primitive skeleton-line mb-4" style={{ width: "60%", height: "20px" }} />

          <div className="p-3 bg-light rounded-3 mb-4">
            <div className="skeleton-primitive skeleton-line" style={{ width: "40%", height: "32px" }} />
          </div>

          <div className="d-flex gap-3 mb-4">
            <div className="skeleton-primitive" style={{ width: "110px", height: "44px", borderRadius: "8px" }} />
            <div className="skeleton-primitive" style={{ flex: 1, height: "44px", borderRadius: "8px" }} />
          </div>

          <div className="skeleton-primitive skeleton-line mb-2" style={{ width: "100%", height: "16px" }} />
          <div className="skeleton-primitive skeleton-line mb-2" style={{ width: "95%", height: "16px" }} />
          <div className="skeleton-primitive skeleton-line" style={{ width: "75%", height: "16px" }} />
        </div>
      </div>
    </div>
  );
}

