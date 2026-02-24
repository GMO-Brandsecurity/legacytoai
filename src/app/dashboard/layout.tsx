import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 pt-14 lg:pt-0">{children}</main>
      </div>
    </AuthGuard>
  );
}
