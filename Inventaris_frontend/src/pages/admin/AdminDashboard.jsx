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

  const [latestBarang, setLatestBarang] = useState([]);

  useEffect(() => {
    const fetchStatsAndBarang = async () => {
      try {
        const [barangRes, mejaRes, laporanRes] = await Promise.all([
          api.get("/api/barang/"),
          api.get("/api/meja/"),
          api.get("/api/laporan/"),
        ]);

        setStats({
          barang: barangRes.data.length,
          meja: mejaRes.data.length,
          pending: laporanRes.data.filter((l) => l.status_laporan === "pending").length,
          selesai: laporanRes.data.filter((l) => l.status_laporan === "selesai").length,
        });

        // Sort barang berdasarkan waktu dibuat terbaru (pastikan backend mengirim created_at)
        const sortedBarang = barangRes.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        setLatestBarang(sortedBarang);
      } catch (err) {
        console.error("Gagal load dashboard:", err);
      }
    };

    fetchStatsAndBarang();
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

  // Modern card component with dynamic bg and border colors
  const Card = ({ label, value, color, icon }) => (
    <div
      className={`flex items-center gap-4 p-5 rounded-xl shadow-md bg-${color}-50 border-l-4 border-${color}-500 transition-transform hover:scale-105 cursor-default`}
    >
      <div className={`p-3 rounded-full bg-${color}-200/50 text-${color}-600`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-5 flex flex-col">
        <h1 className="text-2xl font-bold mb-10 text-center">Inventaris Lab</h1>

        <nav className="flex-1">
          {menu.map((m) => (
            <NavLink
              key={m.name}
              to={m.url}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg mb-2 transition-colors ${
                  isActive ? "bg-blue-600" : "hover:bg-slate-700"
                }`
              }
            >
              {m.icon} <span>{m.name}</span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-semibold mb-8">Dashboard Admin</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <Card label="Total Barang" value={stats.barang} color="blue" icon={<Boxes size={24} />} />
          <Card label="Total Meja" value={stats.meja} color="green" icon={<MonitorCog size={24} />} />
          <Card label="Laporan Pending" value={stats.pending} color="yellow" icon={<FileText size={24} />} />
          <Card label="Laporan Selesai" value={stats.selesai} color="purple" icon={<Tag size={24} />} />
        </div>

        {/* Daftar barang terbaru */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Barang Terbaru</h2>
          {latestBarang.length === 0 ? (
            <p className="text-gray-600">Tidak ada barang terbaru</p>
          ) : (
            <table className="w-full border-collapse shadow rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-3">Kode</th>
                  <th className="text-left p-3">Nama</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Meja</th>
                </tr>
              </thead>
              <tbody>
                {latestBarang.map((b) => (
                  <tr
                    key={b.id}
                    className="border-t hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/admin/barang/${b.id}`)}
                  >
                    <td className="p-3">{b.kode_barang}</td>
                    <td className="p-3">{b.nama_barang}</td>
                    <td className="p-3 capitalize">{b.status_barang}</td>
                    <td className="p-3">{b.meja_nama ?? b.meja}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Halaman child admin jika ada */}
        <Outlet />
      </main>
    </div>
  );
}
