export interface CustomerAddress {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  isDefault: boolean;
  notes?: string;
}

export interface CustomerUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  role: "customer" | "admin";
  createdAt: string;
  addresses: CustomerAddress[];
}

