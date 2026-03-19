import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn) {
      navigate("/login-choice", { replace: true });
      return;
    }

    // Redirect based on role
    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else if (role === "student") {
      navigate("/student-dashboard", { replace: true });
    }
  }, [isLoggedIn, role, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
