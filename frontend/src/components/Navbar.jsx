import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuthRole } from "../hooks/useAuthRole";
import { logout } from "../utils/auth";

export default function Navbar() {
  const role = useAuthRole();
  const navigate = useNavigate();

  const getUsername = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.username || payload.email;
    } catch {
      return null;
    }
  };

  const username = getUsername();

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "creator":
        return "bg-blue-100 text-blue-700";
      case "client":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Kreta
          </Link>

          <div className="flex items-center gap-4">
            {role ? (
              <>
                <div className="flex items-center gap-3">
                  {username && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {username}
                      </span>
                    </div>
                  )}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                      role,
                    )}`}
                  >
                    {role}
                  </span>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 px-4 py-2 rounded hover:bg-gray-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
