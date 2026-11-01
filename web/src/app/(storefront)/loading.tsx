import React from "react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      <div className="h-8 bg-[#E7E0D6] rounded-xl w-1/4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-white border border-[#E7E0D6] rounded-2xl p-4 space-y-4">
            <div className="aspect-4/3 bg-[#F3EFEA] rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-4 bg-[#E7E0D6] rounded w-3/4"></div>
              <div className="h-3 bg-[#F3EFEA] rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-[#E7E0D6] rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

