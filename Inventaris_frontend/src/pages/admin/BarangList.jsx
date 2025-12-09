// src/pages/admin/BarangList.jsx
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function BarangList() {
  const navigate = useNavigate();
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data barang
  const fetchBarang = async () => {
    try {
      const res = await api.get("/api/barang/");
      setBarang(res.data);
    } catch (err) {
      console.error("Gagal ambil data barang:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  // Hapus barang
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus barang?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/barang/${id}/`);
      setBarang(barang.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Gagal hapus barang:", err);
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
              <th className="p-3 text-center w-32">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {barang.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 border">{item.id}</td>
                <td className="p-3 border font-medium">{item.kode_barang}</td>
                <td className="p-3 border">{item.nama_barang}</td>

                {/* Jenis */}
                <td className="p-3 border">
                  {item.jenis_nama ?? item.jenis}
                </td>

                {/* Meja */}
                <td className="p-3 border">{item.meja_nama ?? item.meja}</td>

                {/* Status */}
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

                {/* Aksi */}
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
                </td>
              </tr>
            ))}

            {barang.length === 0 && (
              <tr>
                <td colSpan={7} className="p-5 text-center text-gray-500">
                  Data barang kosong.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
