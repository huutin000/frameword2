import type { Metadata } from "next";
import { CustomerAccountView } from "@/features/auth/components/customer-account-view";

export const metadata: Metadata = {
  title: "Tài khoản của tôi — Small Living",
  description: "Quản lý hồ sơ cá nhân, sổ địa chỉ nhận hàng và lịch sử đơn hàng tại Small Living",
};

export default function AccountPage() {
  return <CustomerAccountView />;
}

