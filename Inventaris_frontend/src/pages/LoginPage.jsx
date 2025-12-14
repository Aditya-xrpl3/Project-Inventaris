import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("api/token/", { username, password });

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh); // Pastikan disimpan

      navigate("/dashboard");
    } catch (err) {
      setErrorMsg("Login Gagal! ID atau Password salah.");
    }
  };

  const handleCancel = () => {
    setUsername("");
    setPassword("");
    setErrorMsg("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url(/public/image/bg1.png)",
      }}
    >
      {/* Overlay gelap semi transparan */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Form card */}
      <div className="relative bg-white rounded-2xl shadow-xl w-[400px] p-8 z-10 border border-green-300">
        <h1 className="text-center text-3xl font-semibold text-gray-900 mb-6">
          Login Admin
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-green-700 mb-1"
            >
              ID Admin
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan ID Admin"
              required
              className="w-full px-4 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-green-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password"
              required
              className="w-full px-4 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {errorMsg && (
            <p className="text-center text-sm text-red-600 font-medium">
              {errorMsg}
            </p>
          )}

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="flex-grow mr-2 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex-grow ml-2 bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
