import { useEffect, useState } from "react";
import { Home, Boxes, FileText, Tag, MonitorCog, LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    barang: 0,
    meja: 0,
    pending: 0,
    selesai: 0,
  });

  // Fetch stats dashboard
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const barangRes = await api.get("/api/barang/");
        const mejaRes = await api.get("/api/meja/");
        const laporanRes = await api.get("/api/laporan/");

        setStats({
          barang: barangRes.data.length,
          meja: mejaRes.data.length,
          pending: laporanRes.data.filter((l) => l.status_laporan === "pending").length,
          selesai: laporanRes.data.filter((l) => l.status_laporan === "selesai").length,
        });
      } catch (err) {
        console.error("Gagal load dashboard:", err);
      }
    };

    fetchStats();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", icon: <Home size={18} />, url: "/admin" },
    { name: "Data Barang", icon: <Boxes size={18} />, url: "/barang" },
    { name: "Laporan", icon: <FileText size={18} />, url: "/laporan" },
    { name: "Kategori", icon: <Tag size={18} />, url: "/kategori" },
    { name: "Meja", icon: <MonitorCog size={18} />, url: "/meja" },
  ];

  const Card = ({ label, value, color }) => (
    <div className={`p-5 rounded-lg shadow bg-${color}-100 border-l-4 border-${color}-500`}>
      <p className="text-gray-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-slate-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6 text-center">Inventaris Lab</h1>
        <ul>
          {menu.map((m, i) => (
            <li key={i} className="mb-2">
              <NavLink
                to={m.url}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-blue-600" : "hover:bg-slate-700"}`
                }
              >
                {m.icon} {m.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          onClick={logout}
          className="flex items-center gap-2 p-2 w-full mt-10 bg-red-600 hover:bg-red-700 rounded-md"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Konten utama */}
      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card label="Total Barang" value={stats.barang} color="blue" />
          <Card label="Total Meja" value={stats.meja} color="green" />
          <Card label="Laporan Pending" value={stats.pending} color="yellow" />
          <Card label="Laporan Selesai" value={stats.selesai} color="purple" />
        </div>

        {/* Halaman child admin (barang, laporan, meja, kategori) */}
        <Outlet />
      </div>
    </div>
  );
}
