import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "register failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="p-6 max-w-sm">
      <h1 className="text-xl font-bold mb-4">Register</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {success && (
        <p className="text-green-600 text-sm mb-2">
          Registration successful. Redirecting to login...
        </p>
      )}

      <input
        className="border p-2 w-full mb-2"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        className="border p-2 w-full mb-2"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className="border px-4 py-2 w-full mb-2">Register</button>

      <Link to="/login" className="text-sm underline">
        Already have an account? Login
      </Link>
    </form>
  );
}
