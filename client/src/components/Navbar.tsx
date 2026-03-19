import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getInitial = () => {
    return email?.charAt(0).toUpperCase() || "A";
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-700">
        Welcome, {email || "Admin"}!
      </h1>

      {/* Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {getInitial()}
          </div>
          <span className="text-sm text-gray-600">{email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
