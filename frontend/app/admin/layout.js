import "@/public/style/globals.css";
import "@/public/bootstrap/css/bootstrap.min.css";
import "@/public/bootstrap/css/style.css";
import "@/public/bootstrap/css/fontawesome.css";
import Leftbar from "./components/leftbar";
import Link from "next/link";
Link;
export const metadata = {
  title: "Admin CellPhoneS",
  description: "Chào mừng đến với trang Admin CellPhoneS.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ background: "#eff8ff" }}>
        <div className="d-flex min-vh-100">
          <div
            className="d-flex flex-column flex-shrink-0 p-3 text-bg-primary"
            style={{ maxwidth: 280 + "px" }}
            data-bs-theme="dark"
          >
            <Link
              href="/admin"
              className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none justify-content-center"
            >
              <img src="/asset/image/logo.svg" alt="" />
              <span className="fs-4 d-none d-sm-inline-block">ADMIN CELLPHONES</span>
            </Link>
            <hr />
            <Leftbar />
          </div>
          <div className="w-100">
            <nav className="navbar navbar-expand-md text-bg-primary" data-bs-theme="dark">
              <div className="container-fluid ps-0">
                <div className="d-flex justify-content-between w-100">
                  <form className="d-flex w-100" role="search" data-bs-theme="light">
                    <div className="input-group">
                      <button type="submit" className="btn btn-primary rounded-0 border-white">
                        <i className="far fa-search"></i>
                      </button>
                      <input className="form-control me-2 rounded-0 border-white" type="search" placeholder="Search" />
                    </div>
                  </form>
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>
                </div>
                <div className="collapse navbar-collapse w-100" id="navbarSupportedContent">
                  <ul className="navbar-nav ms-auto" data-bs-theme="light">
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <strong>
                          <i className="fas fa-bell"></i>
                        </strong>
                      </Link>
                      <ul className="dropdown-menu rounded-0 dropdown-menu-md-end">
                        <li>
                          <Link className="dropdown-item" href="#">
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" href="#">
                            Settings action
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link className="dropdown-item" href="#">
                            Sign out
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img
                          src="https://github.com/mdo.png"
                          alt=""
                          width="32"
                          height="32"
                          className="rounded-circle me-2"
                        />
                        <strong>Hữu Tín</strong>
                      </Link>
                      <ul className="dropdown-menu rounded-0 dropdown-menu-md-end">
                        <li>
                          <Link className="dropdown-item" href="../admin/login/dangnhap">
                         Login
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" href="#">
                            Settings action
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link className="dropdown-item" href="#">
                            Sign out
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

            <div className="container-fluid p-4">{children}</div>
          </div>
        </div>
        <script src="/bootstrap/js/google.chart.js"></script>
        <script src="/bootstrap/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}
