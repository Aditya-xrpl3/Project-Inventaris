import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight } from "lucide-react";
import api from "../api/api";
import { Button } from "../components/ui/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Bersihkan token lama saat masuk halaman login
  // agar tidak mengganggu request dengan Authorization header yang kadaluarsa
  useState(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("api/token/", { username, password });

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg("ID atau Password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-200/30 blur-3xl"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-surface-200 rounded-3xl shadow-2xl p-8 relative z-10"
      >
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg shadow-primary-500/30">
                I
            </div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">Selamat Datang</h1>
            <p className="text-surface-500 mt-2">Masuk untuk mengelola inventaris</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            {errorMsg && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-red-50 text-red-600 text-sm p-3 rounded-lg font-medium text-center border border-red-100"
                >
                    {errorMsg}
                </motion.div>
            )}

            <div className="space-y-4">
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input 
                        type="text"
                        placeholder="ID Admin"
                        className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-surface-900 placeholder:text-surface-400"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input 
                        type="password"
                        placeholder="Password"
                        className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-surface-900 placeholder:text-surface-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
            </div>

            <Button 
                type="submit" 
                className="w-full justify-center py-3 text-lg" 
                disabled={loading}
            >
                {loading ? "Memproses..." : "Masuk ke Dashboard"}
                {!loading && <ArrowRight size={20} />}
            </Button>

            <div className="text-center text-sm text-surface-500">
                Belum punya akun? {" "}
                <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                    Daftar Sekarang
                </Link>
            </div>
        </form>
      </motion.div>
    </div>
  );
}
