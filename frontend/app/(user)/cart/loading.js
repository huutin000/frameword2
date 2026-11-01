export default function CartLoading() {
  return (
    <div className="site-container py-4">
      <div className="skeleton-primitive skeleton-line mb-4" style={{ width: "200px", height: "32px" }} />

      <div className="cart-layout">
        {/* Left Column: Items */}
        <div className="cart-items-card">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="cart-item-row py-3 border-bottom">
              <div className="skeleton-primitive" style={{ width: "80px", height: "80px", borderRadius: "8px" }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton-primitive skeleton-line mb-2" style={{ width: "70%", height: "18px" }} />
                <div className="skeleton-primitive skeleton-line" style={{ width: "40%", height: "16px" }} />
              </div>
              <div className="skeleton-primitive" style={{ width: "100px", height: "36px", borderRadius: "6px" }} />
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary */}
        <div className="cart-summary-card">
          <div className="skeleton-primitive skeleton-line mb-3" style={{ width: "60%", height: "22px" }} />
          <div className="skeleton-primitive skeleton-line mb-2" style={{ width: "100%", height: "16px" }} />
          <div className="skeleton-primitive skeleton-line mb-4" style={{ width: "80%", height: "16px" }} />
          <div className="skeleton-primitive skeleton-line mb-4" style={{ width: "100%", height: "28px" }} />
          <div className="skeleton-primitive" style={{ width: "100%", height: "48px", borderRadius: "8px" }} />
        </div>
      </div>
    </div>
  );
}

