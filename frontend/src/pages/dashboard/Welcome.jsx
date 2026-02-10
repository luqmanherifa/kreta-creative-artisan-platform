import { useAuthRole } from "../../hooks/useAuthRole";
import { Palette, Sparkles, TrendingUp, Users } from "lucide-react";

export default function Welcome() {
  const role = useAuthRole();

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

  const getRoleLabel = (role) => {
    const roleLabels = {
      admin: "Administrator",
      creator: "Artisan",
      client: "Client",
    };
    return roleLabels[role] || role;
  };

  const stats = [
    {
      label: "Active Artisans",
      value: "150+",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Custom Artworks",
      value: "1,200+",
      icon: Palette,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Client Satisfaction",
      value: "98%",
      icon: Sparkles,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Growth Rate",
      value: "+24%",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{username ? `, ${username}` : ""}!
        </h1>
        <p className="text-gray-600">
          {role === "admin" && "Manage your platform and monitor activities"}
          {role === "creator" && "Manage your artworks and client requests"}
          {role === "client" &&
            "Browse artisans and track your project requests"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
            <p className="text-indigo-100 mb-6">
              Use the sidebar menu to manage your{" "}
              {getRoleLabel(role).toLowerCase()} dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
