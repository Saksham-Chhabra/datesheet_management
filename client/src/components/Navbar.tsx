export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-700">Welcome, Admin!</h1>

      {/* Profile */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
          A
        </div>
        <span className="text-sm text-gray-600">Admin</span>
      </div>
    </header>
  );
}
