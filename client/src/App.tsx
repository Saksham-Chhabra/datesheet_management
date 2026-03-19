import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AcademicSetup from "./pages/admin/AcademicSetup2";
import GenerateDatesheet from "./pages/admin/GenerateDatesheet";
import LoginChoice from "./pages/LoginChoice";
import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login-choice" element={<LoginChoice />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/register" element={<Register />} />

      {/* Main dashboard - redirects based on role */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setup"
        element={
          <ProtectedRoute>
            <AcademicSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate"
        element={
          <ProtectedRoute>
            <GenerateDatesheet />
          </ProtectedRoute>
        }
      />

      {/* Protected Student Routes */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/datesheet"
        element={
          <ProtectedRoute>
            <div className="p-8">
              <h1 className="text-2xl font-bold">My Datesheet</h1>
              <p>Datesheet details coming soon...</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/schedule"
        element={
          <ProtectedRoute>
            <div className="p-8">
              <h1 className="text-2xl font-bold">My Schedule</h1>
              <p>Schedule details coming soon...</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute>
            <div className="p-8">
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p>Profile details coming soon...</p>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
