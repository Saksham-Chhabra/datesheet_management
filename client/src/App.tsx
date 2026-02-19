import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AcademicSetup from "./pages/admin/AcademicSetup2";
import Login from "./pages/Login";
import GenerateDatesheet from "./pages/admin/GenerateDatesheet";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/setup" element={<AcademicSetup />} />
      <Route path="/generate" element={<GenerateDatesheet />} />
    </Routes>
  );
}
