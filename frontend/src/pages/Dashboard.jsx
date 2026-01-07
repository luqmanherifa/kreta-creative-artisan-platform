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

  const handleCreateCreator = async () => {
    const userId = prompt("Enter User ID for the creator:");
    const bio = prompt("Enter bio:");
    const website = prompt("Enter website URL:");

    if (!userId) return alert("User ID diperlukan");

    try {
      const newCreator = await apiFetch("/creators", {
        method: "POST",
        body: JSON.stringify({ user_id: Number(userId), bio, website }),
      });

      setCreators((prev) => [...prev, newCreator]);
      alert("Creator berhasil ditambahkan!");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan creator: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="flex min-h-screen">
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
                      setModal({ type: "User", mode: "view", data: u })
                    }
                    onEdit={(u) =>
                      setModal({ type: "User", mode: "edit", data: u })
                    }
                    onDelete={async (u) => {
                      const userId = u.id || u.ID;
                      if (!userId) {
                        alert("User ID tidak ditemukan");
                        return;
                      }

                      if (confirm(`Hapus user ${u.username}?`)) {
                        try {
                          await apiFetch(`/users/delete?id=${userId}`, {
                            method: "DELETE",
                          });

                          const updatedUsers = await apiFetch("/users");
                          setUsers(updatedUsers);

                          alert("User berhasil dihapus");
                        } catch (error) {
                          console.error("Error deleting user:", error);
                          alert(
                            "Gagal menghapus user: " +
                              (error.message || "Unknown error")
                          );
                        }
                      }
                    }}
                  />
                </Section>
              </div>
            }
          />
          <Route
            path="/creators"
            element={
              <div className="p-6">
                <Section
                  title="Creators"
                  action={
                    <button
                      className="border px-3 py-1 text-sm"
                      onClick={() =>
                        setModal({ type: "Creator", mode: "create" })
                      }
                    >
                      + Add Creator
                    </button>
                  }
                >
                  <DataTable
                    data={creators}
                    onSelect={(c) =>
                      setModal({ type: "Creator", mode: "view", data: c })
                    }
                    onEdit={(c) =>
                      setModal({ type: "Creator", mode: "edit", data: c })
                    }
                    onDelete={async (c) => {
                      const creatorId = c.id || c.ID;
                      if (!creatorId) {
                        alert("Creator ID tidak ditemukan");
                        return;
                      }

                      if (confirm(`Hapus creator?`)) {
                        try {
                          await apiFetch(`/creators/delete?id=${creatorId}`, {
                            method: "DELETE",
                          });

                          const updatedCreators = await apiFetch("/creators");
                          setCreators(updatedCreators);

                          alert("Creator berhasil dihapus");
                        } catch (error) {
                          console.error("Error deleting creator:", error);
                          alert(
                            "Gagal menghapus creator: " +
                              (error.message || "Unknown error")
                          );
                        }
                      }
                    }}
                  />
                </Section>
              </div>
            }
          />
          <Route
            path="/artworks"
            element={
              <div className="p-6">
                <Section
                  title="Artworks"
                  action={
                    <button
                      className="border px-3 py-1 text-sm"
                      onClick={() =>
                        setModal({ type: "Artwork", mode: "create" })
                      }
                    >
                      + Add Artwork
                    </button>
                  }
                >
                  <DataTable
                    data={artworks}
                    onSelect={(a) =>
                      setModal({ type: "Artwork", mode: "view", data: a })
                    }
                    onEdit={(a) =>
                      setModal({ type: "Artwork", mode: "edit", data: a })
                    }
                    onDelete={async (a) => {
                      const artworkId = a.id || a.ID;
                      if (!artworkId) {
                        alert("Artwork ID tidak ditemukan");
                        return;
                      }

                      if (confirm(`Hapus artwork "${a.title}"?`)) {
                        try {
                          await apiFetch(`/artworks/delete?id=${artworkId}`, {
                            method: "DELETE",
                          });

                          const updatedArtworks = await apiFetch("/artworks");
                          setArtworks(updatedArtworks);

                          alert("Artwork berhasil dihapus");
                        } catch (error) {
                          console.error("Error deleting artwork:", error);
                          alert(
                            "Gagal menghapus artwork: " +
                              (error.message || "Unknown error")
                          );
                        }
                      }
                    }}
                  />
                </Section>
              </div>
            }
          />
          <Route
            path="/requests"
            element={
              <div className="p-6">
                <Section
                  title="Requests"
                  action={
                    <button
                      className="border px-3 py-1 text-sm"
                      onClick={() =>
                        setModal({ type: "Request", mode: "create" })
                      }
                    >
                      + Add Request
                    </button>
                  }
                >
                  <DataTable
                    data={requests}
                    onSelect={(req) =>
                      setModal({ type: "Request", mode: "view", data: req })
                    }
                    onEdit={(req) =>
                      setModal({ type: "Request", mode: "edit", data: req })
                    }
                    onDelete={async (req) => {
                      const requestId = req.id || req.ID;
                      if (!requestId) {
                        alert("Request ID tidak ditemukan");
                        return;
                      }

                      if (confirm(`Hapus request "${req.title}"?`)) {
                        try {
                          await apiFetch(`/requests/delete?id=${requestId}`, {
                            method: "DELETE",
                          });

                          const updatedRequests = await apiFetch("/requests");
                          setRequests(updatedRequests);

                          alert("Request berhasil dihapus");
                        } catch (error) {
                          console.error("Error deleting request:", error);
                          alert(
                            "Gagal menghapus request: " +
                              (error.message || "Unknown error")
                          );
                        }
                      }
                    }}
                  />
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
          if (modal?.type === "User") {
            const updatedUsers = await apiFetch("/users");
            setUsers(updatedUsers);
          } else if (modal?.type === "Creator") {
            const updatedCreators = await apiFetch("/creators");
            setCreators(updatedCreators);
          } else if (modal?.type === "Artwork") {
            const updatedArtworks = await apiFetch("/artworks");
            setArtworks(updatedArtworks);
          } else if (modal?.type === "Request") {
            const updatedRequests = await apiFetch("/requests");
            setRequests(updatedRequests);
          }
        }}
      />
    </div>
  );
}
