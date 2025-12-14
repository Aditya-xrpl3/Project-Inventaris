import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Download, X } from "lucide-react"; // Tambah icon Download & X
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

// Definisi URL Backend
const BASE_URL = "http://localhost:8000";

export default function BarangList() {
  const navigate = useNavigate();

  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal QR
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [currentQrUrl, setCurrentQrUrl] = useState("");
  const [currentBarang, setCurrentBarang] = useState(null);

  // --- HELPER: Fix URL Gambar ---
  const getImageUrl = (url) => {
    if (!url) return null;
    // Jika URL sudah ada http/https, pakai langsung. Jika belum, tempel BASE_URL
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
      console.error("Gagal ambil data barang:", err);
      // Handle error auth sederhana
      if (err.response?.status === 401) {
        navigate("/login");
      }
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
    // 1. Cek apakah barang sudah punya gambar QR dari list
    if (item.qr_image) {
      setCurrentQrUrl(getImageUrl(item.qr_image));
      setCurrentBarang(item);
      setQrModalOpen(true);
      return;
    }

    // 2. Jika belum, atau user klik tombol generate ulang (bisa dibuat tombol terpisah nanti)
    try {
      // Kita panggil endpoint regenerate
      const res = await api.post(`/api/barang/${item.id}/regenerate_qr/`);
      
      // Response biasanya: { message: "...", qr_image: "url...", ... }
      // Pastikan ambil properti yang benar dari response backend kamu
      const urlDariBackend = res.data.qr_image || res.data.url; 
      
      setCurrentQrUrl(getImageUrl(urlDariBackend));
      setCurrentBarang(item);
      setQrModalOpen(true);
      
      // Refresh list biar data di tabel juga update
      fetchBarang(); 
    } catch (err) {
      console.error("Gagal generate QR:", err);
      alert("Gagal membuat QR Code.");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Memuat data...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Inventaris</h1>
          <p className="text-sm text-gray-500">Kelola data barang dan QR Code</p>
        </div>
        <button
          onClick={() => navigate("/tambah")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-blue-700 transition transform active:scale-95"
        >
          <Plus size={18} /> Tambah Barang
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b">Kode</th>
                <th className="p-4 border-b">Nama Barang</th>
                <th className="p-4 border-b">Jenis</th>
                <th className="p-4 border-b">Lokasi</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {barang.length > 0 ? (
                barang.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/50 transition duration-150">
                    <td className="p-4 font-medium text-gray-900">{item.kode_barang}</td>
                    <td className="p-4 text-gray-700">{item.nama_barang}</td>
                    <td className="p-4 text-gray-600">
                      {/* Handle jika fieldnya objek atau string */}
                      {typeof item.jenis === 'object' && item.jenis ? item.jenis.nama_jenis : item.jenis_nama || item.jenis} 
                    </td>
                    <td className="p-4 text-gray-600">
                       {/* Handle jika fieldnya objek atau string */}
                      {typeof item.meja === 'object' && item.meja ? item.meja.nama_meja : item.meja_nama || item.meja || "-"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                          item.status_barang === "tersedia"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {item.status_barang.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="Lihat QR"
                          onClick={() => handleQrGenerate(item)}
                          className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3"/><rect width="5" height="5" x="16" y="3"/><rect width="5" height="5" x="3" y="16"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                        </button>
                        <button
                          title="Edit"
                          onClick={() => navigate(`/edit/${item.id}`, { state: item })}
                          className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title="Hapus"
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 italic">
                    Belum ada data barang.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL POPUP QR CODE --- */}
      {qrModalOpen && currentBarang && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            
            {/* Modal Header */}
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800 truncate pr-4">
                {currentBarang.nama_barang}
              </h3>
              <button 
                onClick={() => setQrModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Gambar QR) */}
            <div className="p-8 flex flex-col items-center justify-center bg-white">
              <div className="border-4 border-gray-100 p-2 rounded-xl">
                <img 
                  src={currentQrUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 object-contain"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://via.placeholder.com/200?text=Error+Loading"; 
                  }}
                />
              </div>
              <p className="mt-4 text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded">
                {currentBarang.kode_barang}
              </p>
            </div>

            {/* Modal Footer (Actions) */}
            <div className="p-4 border-t bg-gray-50 flex gap-3">
              <a
                href={currentQrUrl} // Pastikan href juga pakai URL lengkap
                download={`QR-${currentBarang.kode_barang}.png`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition"
              >
                <Download size={18} /> Download
              </a>
              <button
                onClick={() => setQrModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}