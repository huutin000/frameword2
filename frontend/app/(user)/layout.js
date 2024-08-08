import "@/public/style/globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import "@/public/bootstrap/css/bootstrap.min.css";
import Providers from "./redux/Provider";
export const metadata = {
  title: "CellPhoneS",
  description: "Chào mừng bạn đến với CellPhoneS",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
        <body>
          <script src="https://kit.fontawesome.com/4c86dbce13.js" crossOrigin="anonymous"></script>
          <Header></Header>
          {/* <img id="slide-tet" src="/asset/image/logo-tet.png" alt="" />
        <img id="slide-tet1" src="/asset/image/logo-tet.png" alt="" /> */}
          <div className="box-banner">
            <img src="/asset/image/banner-new.png" alt="" />
          </div>
          <div className="box-banner-quangcao">
            <img src="/asset/image/banner-3.png" alt="" />
          </div>

          <main>{children}</main>

          <script src="/bootstrap/js/bootstrap.bundle.min.js"></script>
          <Footer></Footer>
        </body>
      </Providers>
    </html>
  );
}
