import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const missing = [];
    if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning p-4 shadow-sm">
          <h4 className="alert-heading">⚠️ Chưa nhận được biến môi trường</h4>
          <p>
            Hệ thống đang thiếu biến: <strong>{missing.join(" và ")}</strong> trong file <code>frontend/.env.local</code>.
          </p>
          <p className="mt-2 text-muted">
            Vui lòng kiểm tra lại tên biến và đảm bảo đã nhấn <strong>Ctrl + S</strong> để lưu file <code>.env.local</code>.
          </p>
        </div>
      </div>
    );
  }

  let dienthoai = [];
  let laptop = [];

  try {
    const supabase = createClient();

    // Lấy sản phẩm thuộc danh mục "Điện thoại"
    const { data: dienthoaiData } = await supabase
      .from("products")
      .select("*, categories!inner(name)")
      .ilike("categories.name", "%Điện thoại%");

    // Lấy sản phẩm thuộc danh mục "Laptop"
    const { data: laptopData } = await supabase
      .from("products")
      .select("*, categories!inner(name)")
      .ilike("categories.name", "%Laptop%");

    dienthoai = dienthoaiData || [];
    laptop = laptopData || [];

    // Dự phòng nếu chưa gán đúng tên danh mục thì hiển thị danh sách sản phẩm chung
    if (dienthoai.length === 0 && laptop.length === 0) {
      const { data: allProducts } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      dienthoai = allProducts || [];
    }
  } catch (error) {
    console.error("Lỗi truy vấn Supabase:", error);
  }

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
