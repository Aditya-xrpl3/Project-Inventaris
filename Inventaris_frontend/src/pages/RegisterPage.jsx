import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setErrorMsg("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    try {
      const res = await api.post("/auth/register/", {
        username,
        name: namaLengkap,
        password,
      });

      setSuccessMsg("Akun berhasil dibuat! Silakan login.");
      setErrorMsg("");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setErrorMsg("Gagal membuat akun. Username mungkin sudah digunakan.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-400 via-teal-400 to-blue-500">
      <div className="bg-white/30 backdrop-blur-xl w-[400px] p-8 rounded-2xl shadow-2xl border border-white/40">
        
        <h1 className="text-center text-3xl font-bold mb-6 text-white drop-shadow">
          Register Admin
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* NAMA */}
          <div>
            <label className="block text-sm text-white mb-1 font-semibold">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              className="w-full p-2 rounded-md bg-white/80 border border-gray-300 shadow focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Masukkan Nama Lengkap"
              required
            />
          </div>

          {/* USERNAME */}
          <div>
            <label className="block text-sm text-white mb-1 font-semibold">
              Username / ID Admin
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded-md bg-white/80 border border-gray-300 shadow focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Masukkan Username"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm text-white mb-1 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-md bg-white/80 border border-gray-300 shadow focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Masukkan Password"
              required
            />
          </div>

          {/* KONFIRMASI */}
          <div>
            <label className="block text-sm text-white mb-1 font-semibold">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full p-2 rounded-md bg-white/80 border border-gray-300 shadow focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Ulangi Password"
              required
            />
          </div>

          {/* ERROR / SUCCESS MESSAGE */}
          {errorMsg && (
            <p className="text-center text-red-100 font-bold text-sm">{errorMsg}</p>
          )}

          {successMsg && (
            <p className="text-center text-green-100 font-bold text-sm">{successMsg}</p>
          )}

          {/* BUTTONS */}
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="w-[48%] bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 transition"
            >
              Register
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-[48%] bg-gray-600 text-white py-2 rounded-md shadow hover:bg-gray-700 transition"
            >
              Kembali
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
