import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Box, AlertTriangle, CheckCircle, ArrowUpRight, Loader2, Calendar } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    total_barang: 0,
    barang_rusak: 0,
    barang_tersedia: 0,
    recent_laporan: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("api/dashboard-stats/");
      setData(res.data);
    } catch (err) {
      console.error("Gagal load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Total Asset", value: data.total_barang, icon: Box, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Barang Rusak", value: data.barang_rusak, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Barang Tersedia", value: data.barang_tersedia, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  ];

  if (loading) {
      return (
          <div className="flex justify-center items-center h-full min-h-[400px]">
              <Loader2 className="animate-spin text-primary-500" size={40} />
          </div>
      );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-heading font-bold text-surface-900"
          >
            Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500"
          >
            Selamat datang kembali, Admin!
          </motion.p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" size="md">Download Report</Button>
            <Button variant="primary" size="md" onClick={() => navigate("/tambah")}>+ Tambah Barang</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-surface-900">{stat.value}</h3>
            </div>
            {/* <div className="ml-auto text-green-500 text-sm font-medium flex items-center">
                <ArrowUpRight size={16} /> 12%
            </div> */}
          </Card>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="min-h-[300px]">
            <h3 className="text-lg font-bold mb-4">Statistik Barang Masuk</h3>
            <div className="h-64 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400 border-2 border-dashed border-surface-200">
                <p>Grafik akan tersedia segera</p>
            </div>
        </Card>
        <Card className="min-h-[300px]">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Laporan Terbaru</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate("/laporan")}>Lihat Semua</Button>
             </div>
             <div className="space-y-4">
                {data.recent_laporan.length > 0 ? (
                    data.recent_laporan.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-surface-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-surface-100">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                item.status === 'pending' ? 'bg-red-100 text-red-600' : 
                                item.status === 'diperbaiki' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                            }`}>
                                <AlertTriangle size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-surface-900">{item.barang_nama}</p>
                                <div className="flex items-center gap-2 text-xs text-surface-500 mt-0.5">
                                    <span>{item.lokasi}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Calendar size={10}/> {new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-surface-600 mt-1 line-clamp-1">{item.deskripsi}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                                item.status === 'pending' ? 'bg-red-100 text-red-700' : 
                                item.status === 'diperbaiki' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {item.status}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-surface-400">
                        <CheckCircle size={48} className="mx-auto mb-2 opacity-20"/>
                        <p>Tidak ada laporan terbaru</p>
                    </div>
                )}
             </div>
        </Card>
      </div>
    </div>
  );
}
