export default function Contact({ chirldren }) {
  return (
    <div className="contact-content">
      <section className="contact-us">
        <h1>Liên hệ với chúng tôi</h1>
        <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các thông tin sau:</p>
        <div className="contact-info">
          <div className="info-item">
            <h2>Địa chỉ</h2>
            <p>CellphoneS, 17 Phan Văn Hớn, Tân Thới Nhất, Quận 12, Thành phố Hồ Chí Minh 700000, Việt Nam</p>
          </div>
          <div className="info-item">
            <h2>Số điện thoại</h2>
            <p>Gọi mua hàng 1800.2097 (7h30 - 22h00)</p>
            <p>Gọi khiếu nại 1800.2063 (8h00 - 21h30)</p>
            <p>Gọi bảo hành 1800.2064 (8h00 - 21h00)</p>
          </div>
          <div className="info-item">
            <h2>Email</h2>
            <p>contact@cellphones.vn</p>
          </div>
          <div className="info-item">
            <h2>Thời gian làm việc</h2>
            <p>Thứ 2 - Thứ 6: 8:00 - 22:00</p>
            <p>Thứ 7: 8:00 - 21:30</p>
            <p>Chủ nhật: Nghỉ</p>
          </div>
        </div>
        <h2>Gửi tin nhắn cho chúng tôi</h2>
        <form action="#" method="post" className="contact-form">
          <label htmlFor="name">Họ và tên</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="phone">Số điện thoại</label>
          <input type="tel" id="phone" name="phone" required />

          <label htmlFor="message">Tin nhắn</label>
          <textarea id="message" name="message" rows="5" required></textarea>

          <button type="submit">Gửi</button>
        </form>
      </section>
      {chirldren}
    </div>
  );
}
