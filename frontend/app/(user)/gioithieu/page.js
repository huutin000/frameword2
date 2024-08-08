export default function Cellphones({ children }) {
  return (
    <div className="content">
      <section className="about-us">
        <h1>Giới thiệu về chúng tôi</h1>
        <p>
          Chào mừng bạn đến với CellPhoneS. Chúng tôi là một cửa hàng điện thoại di động uy tín, chuyên cung cấp các sản
          phẩm chính hãng, chất lượng cao với giá cả cạnh tranh. Đội ngũ nhân viên chuyên nghiệp và tận tâm của chúng
          tôi luôn sẵn sàng tư vấn và hỗ trợ bạn lựa chọn được chiếc điện thoại phù hợp nhất với nhu cầu của mình.
        </p>

        <div className="video-container">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/NNerzOwb8ew?si=djxhGuFDDqcAV4aJ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        <h2 style={{ paddingBottom: "15px" }}>Tầm nhìn</h2>
        <p>
          Tầm nhìn của CellPhoneS là trở thành cửa hàng điện thoại di động uy tín hàng đầu tại Việt Nam, cung cấp cho
          khách hàng những sản phẩm và dịch vụ tốt nhất với giá cả cạnh tranh.
        </p>
        <ul>
          <li>
            Mở rộng thị phần: Chúng tôi sẽ không ngừng mở rộng mạng lưới cửa hàng trên toàn quốc để tiếp cận được nhiều
            khách hàng hơn.
          </li>
          <li>
            Nâng cao chất lượng sản phẩm và dịch vụ: Chúng tôi luôn cam kết cung cấp cho khách hàng những sản phẩm chính
            hãng, chất lượng cao với giá cả cạnh tranh. Đồng thời, chúng tôi cũng sẽ không ngừng nâng cao chất lượng
            dịch vụ khách hàng để mang đến cho khách hàng trải nghiệm mua sắm tốt nhất.
          </li>
          <li>
            Đa dạng hóa sản phẩm và dịch vụ: Chúng tôi sẽ không ngừng đa dạng hóa sản phẩm và dịch vụ để đáp ứng mọi nhu
            cầu của khách hàng. Ngoài điện thoại di động, chúng tôi còn cung cấp các phụ kiện điện thoại, dịch vụ sửa
            chữa điện thoại, dịch vụ viễn thông,...
          </li>
          <li>
            Phát triển đội ngũ nhân viên chuyên nghiệp: Chúng tôi sẽ đào tạo đội ngũ nhân viên chuyên nghiệp, có kiến
            thức chuyên môn sâu về điện thoại di động để có thể tư vấn và hỗ trợ khách hàng tốt nhất.
          </li>
          <li>
            Ứng dụng công nghệ: Chúng tôi sẽ ứng dụng công nghệ vào hoạt động kinh doanh để nâng cao hiệu quả và chất
            lượng dịch vụ.
          </li>
        </ul>
        <h2 style={{ paddingBottom: "15px" }}>Sứ mệnh</h2>
        <p>
          Sứ mệnh của CellPhoneS là mang đến cho khách hàng những sản phẩm điện thoại di động chính hãng, chất lượng cao
          với giá cả cạnh tranh và dịch vụ khách hàng chu đáo, tận tâm.
        </p>
        <h2 style={{ paddingBottom: "15px" }}>Giá trị cốt lõi</h2>
        <p>
          Giá trị cốt lõi là những nguyên tắc cơ bản mà cửa hàng điện thoại di động của bạn sẽ luôn tuân thủ trong mọi
          hoạt động kinh doanh. Giá trị cốt lõi giúp định hướng văn hóa doanh nghiệp và tạo dựng niềm tin với khách
          hàng.
        </p>
        <ul>
          <li>
            Khách hàng: Chúng tôi luôn đặt khách hàng lên hàng đầu, luôn lắng nghe và đáp ứng mọi nhu cầu của khách
            hàng.
          </li>
          <li>
            Trung thực: Chúng tôi luôn trung thực trong mọi hoạt động kinh doanh, cam kết cung cấp cho khách hàng những
            sản phẩm và dịch vụ chất lượng cao với giá cả cạnh tranh.
          </li>
          <li>
            Trách nhiệm: Chúng tôi luôn chịu trách nhiệm cho mọi hành động của mình, cam kết hoàn thành mọi cam kết với
            khách hàng.
          </li>
          <li>Chuyên nghiệp: Chúng tôi luôn cung cấp cho khách hàng những sản phẩm và dịch vụ chuyên nghiệp nhất.</li>
          <li>
            Đổi mới: Chúng tôi luôn không ngừng đổi mới để mang đến cho khách hàng những sản phẩm và dịch vụ tốt nhất.
          </li>
          <li>
            Làm việc nhóm: Chúng tôi luôn đề cao tinh thần làm việc nhóm, khuyến khích sự hợp tác và hỗ trợ lẫn nhau
            giữa các nhân viên.
          </li>
          <li>
            Cống hiến: Chúng tôi luôn cống hiến hết mình cho công việc, luôn nỗ lực để đạt được mục tiêu chung của công
            ty.
          </li>
        </ul>
      </section>
      {children}
    </div>
  );
}
