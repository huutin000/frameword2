import RecentOrders from "./components/recentOrders";

export default function Dashboard() {
  return (
    <>
      <div className="d-flex justify-content-between">
        <h3 className="mb-4">Dashboard</h3>
      </div>
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card border-0 rounded-0 bg-primary-subtle text-primary">
            <div className="card-body text-end">
              <div className="display-6 d-flex justify-content-between">
                <i className="fal fa-file-invoice-dollar"></i>
                122
              </div>
              ORDERS
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card border-0 rounded-0 bg-warning-subtle text-warning">
            <div className="card-body text-end">
              <div className="display-6 d-flex justify-content-between">
                <i className="fal fa-boxes"></i>
                20
              </div>
              PRODUCTS
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card border-0 rounded-0 bg-danger-subtle text-danger">
            <div className="card-body text-end">
              <div className="display-6 d-flex justify-content-between">
                <i className="fal fa-users"></i>
                10,003
              </div>
              CUSTOMERS
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card border-0 rounded-0 bg-success-subtle text-success">
            <div className="card-body text-end">
              <div className="display-6 d-flex justify-content-between">
                <i className="fal fa-chart-line"></i>
                1.5 B
              </div>
              INCOMES
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card rounded-0 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex border-bottom pb-2 justify-content-between">
                <h6 className="mb-0">
                  <i className="fal fa-file-invoice-dollar fa-lg"></i>
                  Recent Orders
                </h6>
                <small>
                  <a href="#" className="text-decoration-none">
                    All Orders
                  </a>
                </small>
              </div>
              {/* Tạo components recentOrders*/}
              <RecentOrders />
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card rounded-0 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex border-bottom pb-2 justify-content-between">
                <h6 className="mb-0">
                  <i className="fal fa-stars fa-lg"></i>
                  Recent Ratings
                </h6>
                <small>
                  <a href="#" className="text-decoration-none">
                    All Ratings
                  </a>
                </small>
              </div>
              <div className="d-flex text-body-secondary pt-3">
                <i className="far fa-comment-alt-smile"></i>
                <a
                  href="#"
                  className="py-2 mb-0 small lh-sm border-bottom w-100 text-decoration-none text-body-secondary"
                >
                  <strong className="d-flex justify-content-between">
                    iPhone 15 Pro Max 256GB Gold Rose
                    <div className="text-warning">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </strong>
                  Sản phẩm xịn, giá tốt!
                </a>
              </div>
              {/* Tạo components recentOrders*/}
              <div className="d-flex text-body-secondary pt-3">
                <i className="far fa-comment-alt-smile"></i>
                <a
                  href="#"
                  className="py-2 mb-0 small lh-sm border-bottom w-100 text-decoration-none text-body-secondary"
                >
                  <strong className="d-flex justify-content-between">
                    Samsung Galaxy S23 Ultra
                    <div className="text-warning">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </strong>
                  Giá mắc, chất lượng tầm trung!
                </a>
              </div>
              <div className="d-flex text-body-secondary pt-3">
                <i className="far fa-comment-alt-smile"></i>
                <a
                  href="#"
                  className="py-2 mb-0 small lh-sm border-bottom w-100 text-decoration-none text-body-secondary"
                >
                  <strong className="d-flex justify-content-between">
                    Samsung Galaxy S23 Ultra
                    <div className="text-warning">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </strong>
                  Giá mắc, chất lượng tầm trung!
                </a>
              </div>
              <div className="d-flex text-body-secondary pt-3">
                <i className="far fa-comment-alt-smile"></i>
                <a
                  href="#"
                  className="py-2 mb-0 small lh-sm border-bottom w-100 text-decoration-none text-body-secondary"
                >
                  <strong className="d-flex justify-content-between">
                    Samsung Galaxy S23 Ultra
                    <div className="text-warning">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </strong>
                  Giá mắc, chất lượng tầm trung!
                </a>
              </div>
              <div className="d-flex text-body-secondary pt-3">
                <i className="far fa-comment-alt-smile"></i>
                <a
                  href="#"
                  className="py-2 mb-0 small lh-sm border-bottom w-100 text-decoration-none text-body-secondary"
                >
                  <strong className="d-flex justify-content-between">
                    Samsung Galaxy S23 Ultra
                    <div className="text-warning">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </strong>
                  Giá mắc, chất lượng tầm trung!
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card rounded-0 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex border-bottom pb-2 justify-content-between">
                <h6 className="mb-0">
                  <i className="fal fa-chart-pie fa-lg"></i>
                  Statistics
                </h6>
              </div>

              <div id="curve_chart" style={{ width: 100 + "%", height: 300 + "px" }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
