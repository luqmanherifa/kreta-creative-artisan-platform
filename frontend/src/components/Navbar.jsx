import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthRole } from "../hooks/useAuthRole";
import { logout } from "../utils/auth";

export default function Navbar() {
  const role = useAuthRole();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      admin: "Administrator",
      creator: "Artisan",
      client: "Client",
    };
    return roleLabels[role] || role;
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 font-['Inter']">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/kreta.png"
              alt="Kreta"
              className="h-8 w-8 transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Kreta
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {role ? (
              <>
                <div className="flex items-center space-x-3 mr-2">
                  {username && (
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {username}
                        </span>
                        <span className="text-xs text-indigo-600 font-medium">
                          {getRoleLabel(role)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-semibold"
                >
                  Join as Artisan
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {role ? (
              <div className="space-y-2">
                {username && (
                  <div className="flex items-center space-x-3 px-3 py-3 bg-gray-50 rounded-lg mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {username}
                      </span>
                      <span className="text-xs text-indigo-600 font-medium">
                        {getRoleLabel(role)}
                      </span>
                    </div>
                  </div>
                )}

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium text-center"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-semibold text-center"
                >
                  Join as Artisan
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
