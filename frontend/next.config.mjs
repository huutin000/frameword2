/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/gioithieu", destination: "/about" },
      { source: "/Search", destination: "/search" },
      { source: "/login/dangnhap", destination: "/login" },
      { source: "/login/dangky", destination: "/register" },
      { source: "/admin/category/addcate", destination: "/admin/category/add" },
      { source: "/admin/category/updatecate/:id*", destination: "/admin/category/update/:id*" },
      { source: "/admin/login/dangnhap", destination: "/admin/login" },
      { source: "/admin/login/dangky", destination: "/admin/register" },
    ];
  },
};

export default nextConfig;
