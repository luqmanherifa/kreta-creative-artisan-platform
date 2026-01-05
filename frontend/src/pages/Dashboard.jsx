import { useEffect, useState } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { apiFetch } from "../api/api";
import Section from "../components/Section";
import DataTable from "../components/DataTable";
import DataModal from "../components/DataModal";
import { logout } from "../utils/auth";

function getRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
}

function Welcome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
      <p className="text-gray-600">
        Select a menu from the sidebar to get started.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const role = getRoleFromToken();
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    { key: "users", label: "Users", roles: ["admin"] },
    { key: "creators", label: "Creators", roles: ["admin", "creator"] },
    { key: "artworks", label: "Artworks", roles: ["admin", "creator"] },
    {
      key: "requests",
      label: "Requests",
      roles: ["admin", "creator", "client"],
    },
  ];

  const allowedMenus = menus.filter((m) => m.roles.includes(role));

  const [modal, setModal] = useState(null);
  const [users, setUsers] = useState([]);
  const [creators, setCreators] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const load = async () => {
      const results = await Promise.allSettled([
        apiFetch("/users"),
        apiFetch("/creators"),
        apiFetch("/artworks"),
        apiFetch("/requests"),
      ]);

      if (results[0].status === "fulfilled") setUsers(results[0].value);
      if (results[1].status === "fulfilled") setCreators(results[1].value);
      if (results[2].status === "fulfilled") setArtworks(results[2].value);
      if (results[3].status === "fulfilled") setRequests(results[3].value);
    };

    load();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleMenuClick = (menuKey) => {
    navigate(`/dashboard/${menuKey}`);
  };

  const isMenuActive = (menuKey) => {
    return location.pathname === `/dashboard/${menuKey}`;
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-48 border-r p-4 space-y-2">
        <h2 className="font-bold mb-4">Dashboard</h2>

        {allowedMenus.map((menu) => (
          <button
            key={menu.key}
            onClick={() => handleMenuClick(menu.key)}
            className={`block w-full text-left px-2 py-1 text-sm border ${
              isMenuActive(menu.key) ? "bg-gray-200" : ""
            }`}
          >
            {menu.label}
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="mt-6 text-sm text-red-600 underline"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Welcome />} />

          <Route
            path="/users"
            element={
              <div className="p-6">
                <Section
                  title="Users"
                  action={
                    <button
                      className="border px-3 py-1 text-sm"
                      onClick={() => setModal({ type: "User", mode: "create" })}
                    >
                      + Add User
                    </button>
                  }
                >
                  <DataTable
                    data={users}
                    onSelect={(u) =>
                      setModal({ type: "User", mode: "edit", data: u })
                    }
                  />
                </Section>
              </div>
            }
          />

          <Route
            path="/creators"
            element={
              <div className="p-6">
                <Section title="Creators">
                  <DataTable data={creators} />
                </Section>
              </div>
            }
          />

          <Route
            path="/artworks"
            element={
              <div className="p-6">
                <Section title="Artworks">
                  <DataTable data={artworks} />
                </Section>
              </div>
            }
          />

          <Route
            path="/requests"
            element={
              <div className="p-6">
                <Section title="Requests">
                  <DataTable data={requests} />
                </Section>
              </div>
            }
          />
        </Routes>
      </main>

      <DataModal
        title={modal?.type}
        mode={modal?.mode}
        data={modal?.data}
        onClose={() => setModal(null)}
        onSuccess={async () => {
          const users = await apiFetch("/users");
          setUsers(users);
        }}
      />
    </div>
  );
}
