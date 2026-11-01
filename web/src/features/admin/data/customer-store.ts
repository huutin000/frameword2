export interface AdminCustomerSummary {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  lastActive: string;
  status: "active" | "inactive";
  spacePreset: string;
}

const SEED_CUSTOMERS: AdminCustomerSummary[] = [
  {
    id: "usr-demo-001",
    fullName: "Lê Minh Tuấn",
    email: "demo.customer@smallliving.vn",
    phone: "0912 345 678",
    orderCount: 3,
    totalSpent: 4840000,
    lastActive: "2026-02-15T09:30:00Z",
    status: "active",
    spacePreset: "Phòng trọ 15m² gác xép",
  },
  {
    id: "usr-demo-002",
    fullName: "Trần Phương Thảo",
    email: "thao.tran@example.com",
    phone: "0987 654 321",
    orderCount: 2,
    totalSpent: 2650000,
    lastActive: "2026-02-12T14:20:00Z",
    status: "active",
    spacePreset: "Studio 12m²",
  },
  {
    id: "usr-demo-003",
    fullName: "Vũ Hải Yến",
    email: "haiyen.vu@example.com",
    phone: "0912 888 999",
    orderCount: 1,
    totalSpent: 390000,
    lastActive: "2026-02-08T11:00:00Z",
    status: "active",
    spacePreset: "Góc bếp mini 120cm",
  },
  {
    id: "usr-demo-004",
    fullName: "Nguyễn Hải Đăng",
    email: "dang.nguyen@example.com",
    phone: "0945 111 222",
    orderCount: 1,
    totalSpent: 1250000,
    lastActive: "2026-01-29T16:45:00Z",
    status: "active",
    spacePreset: "Góc làm việc mini 0.8m²",
  },
];

export function getAllAdminCustomers(): AdminCustomerSummary[] {
  return [...SEED_CUSTOMERS];
}

