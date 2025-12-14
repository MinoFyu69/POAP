import AdminLayout from '@/components/admin/AdminLayout';

export const metadata = {
  title: "Admin Panel - Perpustakaan",
};

export default function AdminLayoutWrapper({ children }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
