import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";

export default function DataModal({ title, mode, data, onClose, onSuccess }) {
  const isUser = title === "User";
  const isCreator = title === "Creator";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "client",
    user_id: "",
    bio: "",
    website: "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isCreator) {
      apiFetch("/users").then(setUsers).catch(console.error);
    }

    if ((mode === "edit" || mode === "view") && data) {
      if (isUser) {
        setForm({
          username: data.username || "",
          email: data.email || "",
          password: "",
          role: data.role || "client",
        });
      } else if (isCreator) {
        setForm({
          user_id: data.user_id || "",
          bio: data.bio || "",
          website: data.website || "",
        });
      }
    }

    if (mode === "create") {
      if (isUser) {
        setForm({
          username: "",
          email: "",
          password: "",
          role: "client",
        });
      } else if (isCreator) {
        setForm({
          user_id: "",
          bio: "",
          website: "",
        });
      }
    }
  }, [mode, data, isUser, isCreator]);

  if (!isUser && !isCreator) return null;

  const submit = async () => {
    try {
      if (isUser) {
        if (mode === "create") {
          await apiFetch("/users", {
            method: "POST",
            body: JSON.stringify({
              username: form.username,
              email: form.email,
              password: form.password,
              role: form.role,
            }),
          });
        }

        if (mode === "edit") {
          const userId = data.id || data.ID;
          const payload = {
            username: form.username,
            email: form.email,
            role: form.role,
          };

          if (form.password) {
            payload.password = form.password;
          }

          await apiFetch(`/users/update?id=${userId}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
        }
      } else if (isCreator) {
        if (mode === "create") {
          await apiFetch("/creators", {
            method: "POST",
            body: JSON.stringify({
              user_id: parseInt(form.user_id),
              bio: form.bio,
              website: form.website,
            }),
          });
        }

        if (mode === "edit") {
          const creatorId = data.id || data.ID;
          await apiFetch(`/creators/update?id=${creatorId}`, {
            method: "PUT",
            body: JSON.stringify({
              user_id: parseInt(form.user_id),
              bio: form.bio,
              website: form.website,
            }),
          });
        }
      }

      onSuccess();
      onClose();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete this ${title.toLowerCase()}?`)) return;

    try {
      if (isUser) {
        const userId = data.id || data.ID;
        await apiFetch(`/users/delete?id=${userId}`, {
          method: "DELETE",
        });
      } else if (isCreator) {
        const creatorId = data.id || data.ID;
        await apiFetch(`/creators/delete?id=${creatorId}`, {
          method: "DELETE",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const getTitle = () => {
    if (mode === "create") return `Add ${title}`;
    if (mode === "edit") return `Edit ${title}`;
    if (mode === "view") return `Detail ${title}`;
    return title;
  };

  const isReadOnly = mode === "view";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 w-96 space-y-3 rounded shadow max-h-[90vh] overflow-y-auto">
        <h2 className="font-bold text-lg">{getTitle()}</h2>

        {/* User Form */}
        {isUser && mode === "view" ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">ID</label>
              <p className="border p-2 bg-gray-50">{data?.id || data?.ID}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">
                Username
              </label>
              <p className="border p-2 bg-gray-50">{form.username}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Email</label>
              <p className="border p-2 bg-gray-50">{form.email}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Role</label>
              <p className="border p-2 bg-gray-50">{form.role}</p>
            </div>
            {data?.created_at && (
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Created At
                </label>
                <p className="border p-2 bg-gray-50">
                  {new Date(data.created_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ) : isUser ? (
          <>
            <input
              className="border p-2 w-full"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              disabled={isReadOnly}
            />

            <input
              className="border p-2 w-full"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={isReadOnly}
            />

            <input
              type="password"
              className="border p-2 w-full"
              placeholder={
                mode === "edit"
                  ? "Password (leave empty to keep current)"
                  : "Password"
              }
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={isReadOnly}
            />

            <select
              className="border p-2 w-full"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              disabled={isReadOnly}
            >
              <option value="admin">admin</option>
              <option value="creator">creator</option>
              <option value="client">client</option>
            </select>
          </>
        ) : null}

        {/* Creator Form */}
        {isCreator && mode === "view" ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">ID</label>
              <p className="border p-2 bg-gray-50">{data?.id || data?.ID}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">
                User ID
              </label>
              <p className="border p-2 bg-gray-50">{data?.user_id}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Bio</label>
              <p className="border p-2 bg-gray-50">{form.bio || "-"}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">
                Website
              </label>
              <p className="border p-2 bg-gray-50">{form.website || "-"}</p>
            </div>
            {data?.created_at && (
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Created At
                </label>
                <p className="border p-2 bg-gray-50">
                  {new Date(data.created_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ) : isCreator ? (
          <>
            <select
              className="border p-2 w-full"
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              disabled={isReadOnly}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>

            <textarea
              className="border p-2 w-full"
              placeholder="Bio"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              disabled={isReadOnly}
            />

            <input
              className="border p-2 w-full"
              placeholder="Website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              disabled={isReadOnly}
            />
          </>
        ) : null}

        <div className="flex justify-between pt-3">
          {mode === "edit" && (
            <button onClick={remove} className="text-red-600 text-sm">
              Delete
            </button>
          )}

          <div className="space-x-2 ml-auto">
            <button onClick={onClose} className="text-sm border px-3 py-1">
              {mode === "view" ? "Tutup" : "Cancel"}
            </button>
            {mode !== "view" && (
              <button
                onClick={submit}
                className="border px-3 py-1 text-sm bg-blue-500 text-white"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
