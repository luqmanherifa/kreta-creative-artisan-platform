import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import Section from "../components/Section";
import DataTable from "../components/DataTable";
import DataModal from "../components/DataModal";

export default function Dashboard({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [creators, setCreators] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const load = async () => {
      const results = await Promise.allSettled([
        apiFetch("/users"),
        apiFetch("/creators"),
        apiFetch("/artworks"),
        apiFetch("/requests"),
      ]);

      const [usersRes, creatorsRes, artworksRes, requestsRes] = results;

      if (usersRes.status === "fulfilled") setUsers(usersRes.value);
      if (creatorsRes.status === "fulfilled") setCreators(creatorsRes.value);
      if (artworksRes.status === "fulfilled") setArtworks(artworksRes.value);
      if (requestsRes.status === "fulfilled") setRequests(requestsRes.value);
    };

    load();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">API Dashboard</h1>

      <button onClick={onLogout} className="border px-3 py-1 text-sm">
        Logout
      </button>

      <Section title="Users">
        <DataTable
          data={users}
          onSelect={(u) => setModal({ type: "User", u })}
        />
      </Section>

      <Section title="Creators">
        <DataTable
          data={creators}
          onSelect={(c) => setModal({ type: "Creator", c })}
        />
      </Section>

      <Section title="Artworks">
        <DataTable
          data={artworks}
          onSelect={(a) => setModal({ type: "Artwork", a })}
        />
      </Section>

      <Section title="Requests">
        <DataTable
          data={requests}
          onSelect={(r) => setModal({ type: "Request", r })}
        />
      </Section>

      <DataModal
        title={modal?.type}
        data={modal?.u || modal?.c || modal?.a || modal?.r}
        onClose={() => setModal(null)}
      />
    </div>
  );
}
