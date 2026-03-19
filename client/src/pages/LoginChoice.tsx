import { useNavigate } from "react-router-dom";

export default function LoginChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Datesheet Management System
          </h1>
          <p className="text-blue-100">Select your login role</p>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Admin Login Card */}
          <div
            onClick={() => navigate("/admin-login")}
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition duration-300"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Administrator
              </h2>
              <p className="text-gray-600 mb-4">
                Login as an admin to manage academic setup and view reports
              </p>
              <div className="bg-red-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-red-700 font-medium">
                  Admin credentials required
                </p>
              </div>
              <button className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition">
                Admin Login
              </button>
            </div>
          </div>

          {/* Student Login Card */}
          <div
            onClick={() => navigate("/student-login")}
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition duration-300"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-8v4m4-4v4m4-4v4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Student</h2>
              <p className="text-gray-600 mb-4">
                Login as a student to view your datesheet and schedule
              </p>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-700 font-medium">
                  College email required
                </p>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Student Login
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-100">
          <p className="mb-2">Don't have an account?</p>
          <button
            onClick={() => navigate("/register")}
            className="text-white underline hover:text-blue-200 transition"
          >
            Create a student account
          </button>
        </div>
      </div>
    </div>
  );
}
