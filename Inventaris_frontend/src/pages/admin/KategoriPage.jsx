import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../api/api";

export default function KategoriPage() {
  const [kategori, setKategori] = useState([]);
  const [namaKategori, setNamaKategori] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch semua kategori
  const fetchKategori = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/kategori/");
      setKategori(res.data);
    } catch (err) {
      console.error("Error fetch kategori:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  // Tambah / Update kategori
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!namaKategori.trim()) return;

    try {
      setSaving(true);
      if (editId) {
        await api.put(`/api/kategori/${editId}/`, { nama_kategori: namaKategori });
        setEditId(null);
      } else {
        await api.post("/api/kategori/", { nama_kategori: namaKategori });
      }
      setNamaKategori("");
      // Update state lokal agar tidak perlu fetch ulang semua
      fetchKategori();
    } catch (err) {
      console.error("Error submit kategori:", err);
    } finally {
      setSaving(false);
    }
  };

  // Hapus kategori
  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus kategori?")) return;
    try {
      await api.delete(`/api/kategori/${id}/`);
      setKategori((prev) => prev.filter((k) => k.id !== id));
    } catch (err) {
      console.error("Error hapus kategori:", err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kategori Barang</h1>

      {/* Form Tambah / Edit */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-4 rounded-xl mb-6 flex gap-3 items-center"
      >
        <input
          type="text"
          value={namaKategori}
          onChange={(e) => setNamaKategori(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="Nama kategori..."
          required
        />
        <button
          type="submit"
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
            editId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <Plus size={18} />
          {editId ? "Update" : "Tambah"}
        </button>
      </form>

      {/* Table Kategori */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nama Kategori</th>
              <th className="p-2 border w-36">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kategori.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-gray-500">
                  Belum ada kategori.
                </td>
              </tr>
            )}
            {kategori.map((k) => (
              <tr key={k.id} className="hover:bg-gray-50">
                <td className="p-2 border">{k.id}</td>
                <td className="p-2 border">{k.nama_kategori}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditId(k.id);
                      setNamaKategori(k.nama_kategori);
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(k.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
