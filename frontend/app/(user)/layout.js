import "@/public/style/globals.css";
import "@/public/bootstrap/css/bootstrap.min.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoreProvider from "@/lib/store/StoreProvider";
import Script from "next/script";

export const metadata = {
  title: "CellPhoneS",
  description: "Chào mừng bạn đến với CellPhoneS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Header />
          <div className="box-banner">
            <img src="/asset/image/banner-new.png" alt="Banner" />
          </div>
          <div className="box-banner-quangcao">
            <img src="/asset/image/banner-3.png" alt="Banner quảng cáo" />
          </div>

          <main>{children}</main>

          <Footer />
        </StoreProvider>

        <Script
          src="https://kit.fontawesome.com/4c86dbce13.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="/bootstrap/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
