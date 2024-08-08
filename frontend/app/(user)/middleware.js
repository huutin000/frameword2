import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("./login/dangnhap", request.url));
  }

  // Gọi đến API xác thực token
  const res = await fetch("http://localhost:3000/user/checktoken", {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("./login/dangnhap", request.url));
  }

  // Nếu token hợp lệ, cho phép yêu cầu tiếp tục
  return NextResponse.next();
}

export const config = {
  matcher: "./info",
};