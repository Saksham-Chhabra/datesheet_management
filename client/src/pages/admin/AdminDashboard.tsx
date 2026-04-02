import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/DashboardCard";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl">
        <DashboardCard 
          title="Manage Departments" 
          icon="🏢" 
          onClick={() => navigate("/setup")} 
        />
        <DashboardCard 
          title="Manage Degrees" 
          icon="🎓" 
          onClick={() => navigate("/admin/degrees")} 
        />
        <DashboardCard 
          title="Manage Branches" 
          icon="🌿" 
          onClick={() => navigate("/admin/branches")} 
        />
        <DashboardCard 
          title="Generate Datesheet" 
          icon="📅" 
          variant="primary" 
          onClick={() => navigate("/admin/generate-datesheet")} 
        />
      </div>
    </AdminLayout>
  );
}
