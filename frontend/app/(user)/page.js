import ProductCard from "./components/productcard";

export default async function Home() {
  const productdienthoai = await fetch("http://localhost:3000/product/productcate/65f2829efc13ae110c318c55");
  const dienthoai = await productdienthoai.json();
  console.log(dienthoai);

  const productlaptop = await fetch("http://localhost:3000/product/productcate/65f2829efc13ae110c318c56");
  const laptop = await productlaptop.json();
  console.log(laptop);

  return (
    <>
      <div className="box-danh-muc">
        <img src="/asset/image/logo-menu.png" alt="" />
        <ProductCard data={dienthoai} />
      </div>
      <div className="box-danh-muc">
        <img src="/asset/image/logo-menu2.png" alt="" />
        <ProductCard data={laptop} />
      </div>
      <div className="box-atm">
        <div className="atm">
          <div className="title">
            <img src="/asset/image/caythong.png" alt="" />
            <span>
              <b>GIẢM THÊM KHI THANH TOÁN ONLINE</b>
            </span>
          </div>
          <img src="/asset/image/bank1.jpeg" alt="" />
          <img src="/asset/image/bank2.webp" alt="" />
          <img src="/asset/image/bank3.webp" alt="" />
        </div>
      </div>
      <div className="box-khuyen-mai-noel">
        <div className="khuyen-mai-noel">
          <div className="title">
            <img src="/asset/image/noel.jpeg" alt="" />
            <span>
              <b>ƯU ĐÃI CHO SINH VIÊN</b>
            </span>
          </div>
          <img src="/asset/image/uu-dai-sv.png" alt="" />
          <img src="/asset/image/uu-dai-sv1.png" alt="" />
        </div>
      </div>
   
    </>
  );
}
