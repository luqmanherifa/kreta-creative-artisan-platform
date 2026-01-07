import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";

export default function DataModal({ title, mode, data, onClose, onSuccess }) {
  const isUser = title === "User";
  const isCreator = title === "Creator";
  const isArtwork = title === "Artwork";
  const isRequest = title === "Request";

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "client",
    user_id: "",
    bio: "",
    website: "",
    creator_id: "",
    title: "",
    description: "",
    media_url: "",
    client_id: "",
    request_creator_id: "",
    request_title: "",
    details: "",
    status: "pending",
  });

  const [users, setUsers] = useState([]);
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    if (isCreator) {
      apiFetch("/users").then(setUsers).catch(console.error);
    }

    if (isArtwork || isRequest) {
      apiFetch("/creators").then(setCreators).catch(console.error);
    }

    if (isRequest) {
      apiFetch("/users").then(setUsers).catch(console.error);
    }

    if ((mode === "edit" || mode === "view") && data) {
      if (isUser) {
        setForm({
          username: data.username || "",
          email: data.email || "",
          password: "",
          role: data.role || "client",
          user_id: "",
          bio: "",
          website: "",
          creator_id: "",
          title: "",
          description: "",
          media_url: "",
          client_id: "",
          request_creator_id: "",
          request_title: "",
          details: "",
          status: "pending",
        });
      } else if (isCreator) {
        setForm({
          user_id: String(data.user_id || ""),
          bio: data.bio || "",
          website: data.website || "",
          username: "",
          email: "",
          password: "",
          role: "client",
          creator_id: "",
          title: "",
          description: "",
          media_url: "",
          client_id: "",
          request_creator_id: "",
          request_title: "",
          details: "",
          status: "pending",
        });
      } else if (isArtwork) {
        setForm({
          creator_id: String(data.creator_id || ""),
          title: data.title || "",
          description: data.description || "",
          media_url: data.media_url || "",
          username: "",
          email: "",
          password: "",
          role: "client",
          user_id: "",
          bio: "",
          website: "",
          client_id: "",
          request_creator_id: "",
          request_title: "",
          details: "",
          status: "pending",
        });
      } else if (isRequest) {
        setForm({
          client_id: String(data.client_id || ""),
          request_creator_id: String(data.creator_id || ""),
          request_title: data.title || "",
          details: data.details || "",
          status: data.status || "pending",
          username: "",
          email: "",
          password: "",
          role: "client",
          user_id: "",
          bio: "",
          website: "",
          creator_id: "",
          title: "",
          description: "",
          media_url: "",
        });
      }
    }

    if (mode === "create") {
      setForm({
        username: "",
        email: "",
        password: "",
        role: "client",
        user_id: "",
        bio: "",
        website: "",
        creator_id: "",
        title: "",
        description: "",
        media_url: "",
        client_id: "",
        request_creator_id: "",
        request_title: "",
        details: "",
        status: "pending",
      });
    }
  }, [mode, data, isUser, isCreator, isArtwork, isRequest]);

  if (!isUser && !isCreator && !isArtwork && !isRequest) return null;

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
      } else if (isArtwork) {
        if (mode === "create") {
          await apiFetch("/artworks", {
            method: "POST",
            body: JSON.stringify({
              creator_id: parseInt(form.creator_id),
              title: form.title,
              description: form.description,
              media_url: form.media_url,
            }),
          });
        }

        if (mode === "edit") {
          const artworkId = data.id || data.ID;
          await apiFetch(`/artworks/update?id=${artworkId}`, {
            method: "PUT",
            body: JSON.stringify({
              creator_id: parseInt(form.creator_id),
              title: form.title,
              description: form.description,
              media_url: form.media_url,
            }),
          });
        }
      } else if (isRequest) {
        if (mode === "create") {
          await apiFetch("/requests", {
            method: "POST",
            body: JSON.stringify({
              client_id: parseInt(form.client_id),
              creator_id: parseInt(form.request_creator_id),
              title: form.request_title,
              details: form.details,
            }),
          });
        }

        if (mode === "edit") {
          const requestId = data.id || data.ID;
          await apiFetch(`/requests/update?id=${requestId}`, {
            method: "PUT",
            body: JSON.stringify({
              client_id: parseInt(form.client_id),
              creator_id: parseInt(form.request_creator_id),
              title: form.request_title,
              details: form.details,
              status: form.status,
            }),
          });
        }
      }

      onClose();
      await onSuccess();
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
      } else if (isArtwork) {
        const artworkId = data.id || data.ID;
        await apiFetch(`/artworks/delete?id=${artworkId}`, {
          method: "DELETE",
        });
      } else if (isRequest) {
        const requestId = data.id || data.ID;
        await apiFetch(`/requests/delete?id=${requestId}`, {
          method: "DELETE",
        });
      }

      onClose();
      await onSuccess();
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
                <option key={u.id || u.ID} value={u.id || u.ID}>
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

        {/* Artwork Form */}
        {isArtwork && mode === "view" ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">ID</label>
              <p className="border p-2 bg-gray-50">{data?.id || data?.ID}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">
                Creator ID
              </label>
              <p className="border p-2 bg-gray-50">{data?.creator_id}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Title</label>
              <p className="border p-2 bg-gray-50">{form.title}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">
                Description
              </label>
              <p className="border p-2 bg-gray-50">{form.description || "-"}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">
                Media URL
              </label>
              <p className="border p-2 bg-gray-50">{form.media_url || "-"}</p>
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
        ) : isArtwork ? (
          <>
            <select
              className="border p-2 w-full"
              value={form.creator_id}
              onChange={(e) => setForm({ ...form, creator_id: e.target.value })}
              disabled={isReadOnly}
            >
              <option value="">Select Creator</option>
              {creators.map((c) => (
                <option key={c.id || c.ID} value={c.id || c.ID}>
                  Creator #{c.id || c.ID} (User ID: {c.user_id || c.UserID})
                </option>
              ))}
            </select>

            <input
              className="border p-2 w-full"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              disabled={isReadOnly}
            />

            <textarea
              className="border p-2 w-full"
              placeholder="Description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              disabled={isReadOnly}
            />

            <input
              className="border p-2 w-full"
              placeholder="Media URL"
              value={form.media_url}
              onChange={(e) => setForm({ ...form, media_url: e.target.value })}
              disabled={isReadOnly}
            />
          </>
        ) : null}

        {/* Request Form */}
        {isRequest && mode === "view" ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">ID</label>
              <p className="border p-2 bg-gray-50">{data?.id || data?.ID}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">
                Client ID
              </label>
              <p className="border p-2 bg-gray-50">{data?.client_id}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">
                Creator ID
              </label>
              <p className="border p-2 bg-gray-50">{data?.creator_id}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Title</label>
              <p className="border p-2 bg-gray-50">{form.request_title}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">
                Details
              </label>
              <p className="border p-2 bg-gray-50">{form.details || "-"}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Status</label>
              <p className="border p-2 bg-gray-50">{form.status}</p>
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
        ) : isRequest ? (
          <>
            <select
              className="border p-2 w-full"
              value={form.client_id}
              onChange={(e) => setForm({ ...form, client_id: e.target.value })}
              disabled={isReadOnly}
            >
              <option value="">Select Client (User)</option>
              {users.map((u) => (
                <option key={u.id || u.ID} value={u.id || u.ID}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>

            <select
              className="border p-2 w-full"
              value={form.request_creator_id}
              onChange={(e) =>
                setForm({ ...form, request_creator_id: e.target.value })
              }
              disabled={isReadOnly}
            >
              <option value="">Select Creator</option>
              {creators.map((c) => (
                <option key={c.id || c.ID} value={c.id || c.ID}>
                  Creator #{c.id || c.ID} (User ID: {c.user_id || c.UserID})
                </option>
              ))}
            </select>

            <input
              className="border p-2 w-full"
              placeholder="Request Title"
              value={form.request_title}
              onChange={(e) =>
                setForm({ ...form, request_title: e.target.value })
              }
              disabled={isReadOnly}
            />

            <textarea
              className="border p-2 w-full"
              placeholder="Details"
              rows={3}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              disabled={isReadOnly}
            />

            <select
              className="border p-2 w-full"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              disabled={isReadOnly}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
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
