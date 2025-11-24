import { useState } from "react";
import api from "../api"; // axios instance dengan interceptor
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/login/", form);
      const token = res.data.token;

      // Simpan token
      localStorage.setItem("token", token);

      // Decode token
      const user = jwtDecode(token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect ke dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Username atau password salah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>Login Admin</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
