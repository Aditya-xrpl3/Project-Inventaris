// src/pages/admin/BarangList.jsx
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function BarangList() {
  const navigate = useNavigate();

  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [currentQrUrl, setCurrentQrUrl] = useState("");
  const [currentBarang, setCurrentBarang] = useState(null);

  // Check token sebelum fetch
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda belum login sebagai admin. Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }
    fetchBarang();
  }, [navigate]);

  // Ambil data barang (admin-only)
  const fetchBarang = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/barang/"); // Pastikan token dikirim via interceptor
      setBarang(res.data);
    } catch (err) {
      console.error("Gagal ambil data barang:", err);
      if (err.response?.status === 401) {
        alert("Token expired atau tidak valid. Silakan login ulang.");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      } else {
        alert("Gagal ambil data barang. Pastikan Anda login sebagai admin.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  // Delete barang
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus barang?")) return;

    try {
      await api.delete(`/api/barang/${id}/`);
      setBarang((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Gagal hapus barang:", err);
      alert("Gagal hapus barang. Pastikan Anda login sebagai admin.");
    }
  };

  // Generate QR (admin-only)
  const handleQrGenerate = async (item) => {
    try {
      const res = await api.post(`/api/barang/${item.id}/regenerate_qr/`);
      setCurrentQrUrl(res.data.qr_image);
      setCurrentBarang(item);
      setQrModalOpen(true);
    } catch (err) {
      console.error("Gagal generate QR:", err);
      alert("Gagal generate QR. Pastikan Anda login sebagai admin.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Data Barang</h1>
        <button
          onClick={() => navigate("/tambah")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Tambah Barang
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Kode Barang</th>
              <th className="p-3 text-left">Nama Barang</th>
              <th className="p-3 text-left">Jenis</th>
              <th className="p-3 text-left">Meja</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center w-40">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {barang.length > 0 ? (
              barang.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 border">{item.id}</td>
                  <td className="p-3 border font-medium">{item.kode_barang}</td>
                  <td className="p-3 border">{item.nama_barang}</td>
                  <td className="p-3 border">
                    {item.jenis_nama ?? item.jenis}
                  </td>
                  <td className="p-3 border">{item.meja_nama ?? item.meja}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                        item.status_barang === "tersedia"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {item.status_barang}
                    </span>
                  </td>
                  <td className="p-3 border flex justify-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/edit/${item.id}`, { state: item })
                      }
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      <Trash2 size={16} />
                    </button>

                    <button
                      onClick={() => handleQrGenerate(item)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      QR
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-5 text-center text-gray-500">
                  Data barang kosong.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* QR Modal */}
      {qrModalOpen && currentBarang && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">
              QR: {currentBarang.nama_barang}
            </h2>
            <img src={currentQrUrl} alt="QR Code" className="w-48 h-48" />
            <div className="flex gap-3 mt-2">
              <a
                href={currentQrUrl}
                download={`QR-${currentBarang.nama_barang}.png`}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download
              </a>
              <button
                onClick={() => setQrModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
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
