import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("login failed");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="p-6 max-w-sm">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}

      <input
        className="border p-2 w-full mb-2"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full mb-2"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="border px-4 py-2">Login</button>
    </form>
  );
}
