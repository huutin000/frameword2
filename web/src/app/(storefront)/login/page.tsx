import type { Metadata } from "next";
import { LoginView } from "@/features/auth/components/login-view";

export const metadata: Metadata = {
  title: "Đăng nhập — Small Living",
  description: "Đăng nhập tài khoản khách hàng hoặc quản trị viên hệ thống Small Living",
};

export default function LoginPage() {
  return <LoginView />;
}

