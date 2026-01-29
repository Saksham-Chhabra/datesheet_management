import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-blue-700 text-white flex flex-col">
      {/* Title */}
      <div className="h-16 flex items-center px-6 text-xl font-semibold border-b border-blue-600">
        Admin Dashboard
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md transition ${
              isActive ? "bg-blue-800" : "hover:bg-blue-600"
            }`
          }
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/setup"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md transition ${
              isActive ? "bg-blue-800" : "hover:bg-blue-600"
            }`
          }
        >
          📚 Academic Setup
        </NavLink>

        <NavLink
          to="/generate"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md transition ${
              isActive ? "bg-blue-800" : "hover:bg-blue-600"
            }`
          }
        >
          📅 Generate Datesheet
        </NavLink>
      </nav>
    </aside>
  );
}
