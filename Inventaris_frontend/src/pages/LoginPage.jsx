import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // axios dengan interceptor (auto token)

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("auth/login/", {
      username,
      password,
    });

    // Simpan access & refresh token
    localStorage.setItem("token", res.data.access);         // access token dipakai untuk header Authorization
    localStorage.setItem("refresh_token", res.data.refresh); // refresh token bisa pakai untuk auto-refresh nanti

    navigate("/admin");
  } catch (err) {
    setErrorMsg("Login Gagal! ID atau Password salah.");
  }
};


  const handleCancel = () => {
    setIdAdmin("");
    setPassword("");
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1596495578065-9a3f1ff1718e?q=80&w=1200')",
      }}
    >
      <div className="bg-white/90 w-[380px] p-7 rounded-xl shadow-2xl border border-green-200 backdrop-blur">
        <h1 className="text-center text-2xl font-bold mb-6 text-gray-800">
          Login Admin
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-blue-700 mb-1">ID Admin</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Masukkan ID Admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Masukkan Password"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-center text-red-600 text-sm font-medium">
              {errorMsg}
            </p>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
            >
              X Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
