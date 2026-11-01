import React from "react";
import { StorefrontHeader } from "@/components/layout/storefront-header";
import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { CartProvider } from "@/features/cart/context/cart-context";
import { WishlistProvider } from "@/features/wishlist/context/wishlist-context";
import { CompareProvider } from "@/features/compare/context/compare-context";
import { CompareBar } from "@/features/compare/components/compare-bar";
import { RoomProfileProvider } from "@/features/room-profile/context/room-profile-context";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoomProfileProvider>
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            <div className="flex flex-col min-h-screen">
              <StorefrontHeader />
              <main className="flex-1">{children}</main>
              <StorefrontFooter />
              <CompareBar />
            </div>
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </RoomProfileProvider>
  );
}
