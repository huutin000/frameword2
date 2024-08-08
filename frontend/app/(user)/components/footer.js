export default function Footer() {
  return (
    <>
      <div className="footer-footer">
        <div className="row-footer">
          <div className="column-footer">
            <p>
              <b>CellPhoneS </b>
            </p>
            <p>
              <b>Tổng đài hỗ trợ </b>(Miễn phí gọi)
            </p>
            <p>
              Gọi mua: <b>1800.1061</b> (7:30 - 22:00)
            </p>
            <p>
              Kỹ thuật: <b>1800.1764</b> (7:30 - 22:00)
            </p>
            <p>
              Khiếu nại: <b>1800.1063</b> (8:00 - 21:30)
            </p>
            <p>
              Bảo hành: <b>1800.1065</b> (8:00 - 21:00)
            </p>
          </div>
          <div className="column-footer">
            <div className="form-sale-footer">
              <p>
                <b> Tặng mã giảm giá</b>
              </p>
              <input type="text" name="" id="" placeholder="Nhập email" />
              <br />
              <input type="text" name="" id="" placeholder="Nhập SĐT" />
              <br />
              <button>Nhận mã</button>
              <p>
                <i>*Áp dụng cho khách mua lần đầu</i>
              </p>
            </div>
          </div>
          <div className="column-footer">
            <img src="/asset/image/social-removebg.png" alt="" width="250px" />
          </div>
          <div className="column-footer">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.791632755016!2d106.6215927745178!3d10.827251858255234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b75210eda15%3A0xac317fcf3df50227!2sCellphoneS!5e0!3m2!1svi!2s!4v1705677108101!5m2!1svi!2s"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
