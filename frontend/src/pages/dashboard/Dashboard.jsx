import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DataModal from "../../components/DataModal/DataModal";
import { useAuthRole } from "../../hooks/useAuthRole";
import { dashboardRoutes } from "./routes";

export default function Dashboard() {
  const role = useAuthRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [modal, setModal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const menus = [
    { key: "users", label: "Users", roles: ["admin"] },
    { key: "creators", label: "Artisans", roles: ["admin", "creator"] },
    { key: "artworks", label: "Artworks", roles: ["admin", "creator"] },
    {
      key: "requests",
      label: "Requests",
      roles: ["admin", "creator", "client"],
    },
  ].filter((m) => m.roles.includes(role));

  const openModal = (type, mode, data) => setModal({ type, mode, data });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-['Inter']">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar
          menus={menus}
          active={location.pathname.split("/")[2]}
          onSelect={(key) => navigate(`/dashboard/${key}`)}
        />

        <main className="flex-1 overflow-x-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {dashboardRoutes(openModal, refreshKey).map((r) => (
                <Route key={r.path} {...r} />
              ))}
            </Routes>
          </div>
        </main>
      </div>

      {modal && (
        <DataModal
          {...modal}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setRefreshKey((k) => k + 1);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
