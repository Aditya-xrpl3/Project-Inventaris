import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Download, X, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/api";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const BASE_URL = `${window.location.protocol}//${window.location.hostname}:8000`;

export default function BarangList() {
  const navigate = useNavigate();
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State Modal QR
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [currentQrUrl, setCurrentQrUrl] = useState("");
  const [currentBarang, setCurrentBarang] = useState(null);

  const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/barang/");
      setBarang(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus barang?")) return;
    try {
      await api.delete(`/api/barang/${id}/`);
      setBarang((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert("Gagal hapus barang.");
    }
  };

  const handleQrGenerate = async (item) => {
    if (item.qr_image) {
      setCurrentQrUrl(getImageUrl(item.qr_image));
      setCurrentBarang(item);
      setQrModalOpen(true);
      return;
    }
    try {
      const res = await api.post(`/api/barang/${item.id}/regenerate_qr/`);
      const urlDariBackend = res.data.qr_image || res.data.url; 
      setCurrentQrUrl(getImageUrl(urlDariBackend));
      setCurrentBarang(item);
      setQrModalOpen(true);
      fetchBarang(); 
    } catch (err) {
      alert("Gagal membuat QR Code.");
    }
  };

  // Filter logic
  const filteredBarang = barang.filter(item => 
    item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kode_barang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">Daftar Inventaris</h1>
          <p className="text-surface-500 mt-1">Kelola {barang.length} item aset perusahaan</p>
        </div>
        <Button onClick={() => navigate("/tambah")}>
          <Plus size={20} /> Tambah Barang
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
            <input 
                type="text" 
                placeholder="Cari nama atau kode barang..." 
                className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="ml-auto flex gap-2 w-full md:w-auto">
            <Button variant="ghost" size="sm" className="w-full md:w-auto justify-center md:justify-start">
                <Filter size={18} className="mr-2" /> Filter
            </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden p-0 border-0 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-50 text-surface-500 font-semibold text-sm uppercase tracking-wider border-b border-surface-200">
              <tr>
                <th className="p-5">Kode</th>
                <th className="p-5">Nama Barang</th>
                <th className="p-5">Jenis</th>
                <th className="p-5">Lokasi</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 bg-white">
              {loading ? (
                 [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                        <td className="p-5"><div className="h-4 bg-surface-100 rounded w-16"></div></td>
                        <td className="p-5"><div className="h-4 bg-surface-100 rounded w-32"></div></td>
                        <td className="p-5"><div className="h-4 bg-surface-100 rounded w-24"></div></td>
                        <td className="p-5"><div className="h-4 bg-surface-100 rounded w-20"></div></td>
                        <td className="p-5"><div className="h-6 bg-surface-100 rounded-full w-20"></div></td>
                        <td className="p-5 text-center"><div className="h-8 bg-surface-100 rounded w-24 mx-auto"></div></td>
                    </tr>
                 ))
              ) : filteredBarang.length > 0 ? (
                filteredBarang.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.id} 
                    className="hover:bg-surface-50 transition-colors group"
                  >
                    <td className="p-5 font-mono text-surface-600 font-medium text-sm">{item.kode_barang}</td>
                    <td className="p-5 font-semibold text-surface-900">{item.nama_barang}</td>
                    <td className="p-5 text-surface-600 text-sm">
                      {typeof item.jenis === 'object' ? item.jenis?.nama_jenis : item.jenis_nama}
                    </td>
                    <td className="p-5 text-surface-600 text-sm">
                       {typeof item.meja === 'object' ? item.meja?.nama_meja : item.meja_nama || "-"}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1.5 ${
                          item.status_barang === "tersedia" ? "bg-green-100 text-green-700" : 
                          item.status_barang === "rusak" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                             item.status_barang === "tersedia" ? "bg-green-500" : 
                             item.status_barang === "rusak" ? "bg-red-500" : "bg-yellow-500"
                        }`}></span>
                        {item.status_barang}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleQrGenerate(item)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Lihat QR">
                            <Download size={18} />
                        </button>
                        <button onClick={() => navigate(`/edit/${item.id}`, { state: item })} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Edit">
                            <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                            <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-surface-400">
                    Tidak ada barang ditemukan untuk "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* QR MODAL */}
      <AnimatePresence>
        {qrModalOpen && currentBarang && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setQrModalOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm relative z-10"
                >
                    <button onClick={() => setQrModalOpen(false)} className="absolute top-4 right-4 text-surface-400 hover:text-surface-900"><X size={24}/></button>
                    <div className="text-center pt-2">
                        <h3 className="text-xl font-bold text-surface-900">{currentBarang.nama_barang}</h3>
                        <p className="font-mono text-sm text-surface-500 mt-1">{currentBarang.kode_barang}</p>
                    </div>
                    
                    <div className="my-8 mx-auto w-64 h-64 bg-surface-50 rounded-2xl p-4 border border-surface-200">
                        <img src={currentQrUrl} className="w-full h-full object-contain mix-blend-multiply" alt="QR Code" />
                    </div>

                    <div className="flex gap-3">
                         <a href={currentQrUrl} download={`QR-${currentBarang.kode_barang}.png`} target="_blank" rel="noreferrer" className="flex-1">
                            <Button className="w-full justify-center">Download PNG</Button>
                         </a>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}