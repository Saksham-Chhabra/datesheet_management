import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/DashboardCard";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl">
        <DashboardCard title="Manage Departments" icon="🏢" />
        <DashboardCard title="Manage Degrees" icon="🎓" />
        <DashboardCard title="Manage Branches" icon="🌿" />
        <DashboardCard title="Generate Datesheet" icon="📅" variant="primary" />
      </div>
    </AdminLayout>
  );
}
