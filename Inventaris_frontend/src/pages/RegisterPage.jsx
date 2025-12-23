import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Mail, ArrowLeft, ArrowRight } from "lucide-react";
import api from "../api/api";
import { Button } from "../components/ui/Button";

export default function Register() {
  const [username, setUsername] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== password2) {
        setErrorMsg("Password konfirmasi tidak cocok!");
        return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await api.post("/auth/register/", {
        username,
        name: namaLengkap,
        password,
      });

      setSuccessMsg("Akun berhasil dibuat! Mengalihkan...");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setErrorMsg("Gagal membuat akun. Username mungkin sudah ada.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4 relative overflow-hidden">
       {/* Background Ornaments */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary-200/30 blur-3xl"></div>
          <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-blue-200/30 blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-surface-200 rounded-3xl shadow-2xl p-8 relative z-10"
      >
        <button 
            onClick={() => navigate("/login")}
            className="absolute top-6 left-6 text-surface-400 hover:text-surface-900 transition-colors"
        >
            <ArrowLeft size={24} />
        </button>

        <div className="text-center mb-8 mt-4">
            <h1 className="text-2xl font-heading font-bold text-surface-900">Buat Akun Baru</h1>
            <p className="text-surface-500 mt-2">Daftar untuk akses admin</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
            {errorMsg && <div className="text-red-600 text-sm text-center font-medium bg-red-50 p-3 rounded-lg border border-red-100">{errorMsg}</div>}
            {successMsg && <div className="text-green-600 text-sm text-center font-medium bg-green-50 p-3 rounded-lg border border-green-100">{successMsg}</div>}

            <div className="space-y-4">
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input 
                        type="text"
                        placeholder="Nama Lengkap"
                        className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-surface-900 placeholder:text-surface-400"
                        value={namaLengkap}
                        onChange={(e) => setNamaLengkap(e.target.value)}
                        required
                    />
                </div>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input 
                        type="text"
                        placeholder="Username / ID"
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
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input 
                        type="password"
                        placeholder="Ulangi Password"
                        className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-surface-900 placeholder:text-surface-400"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                </div>
            </div>

            <Button 
                type="submit" 
                className="w-full justify-center py-3 text-lg mt-6" 
                disabled={loading}
            >
                {loading ? "Mendaftar..." : "Buat Akun"}
                {!loading && <ArrowRight size={20} />}
            </Button>
        </form>
      </motion.div>
    </div>
  );
}
