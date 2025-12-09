import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../api/api";

export default function KategoriPage() {
  const [kategori, setKategori] = useState([]);
  const [namaKategori, setNamaKategori] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchKategori = async () => {
    try {
      const res = await api.get("/api/kategori/");
      setKategori(res.data);
    } catch (e) {
      console.log("Error kategori:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/api/kategori/${editId}/`, { nama: namaKategori });
      } else {
        await api.post("/api/kategori/", { nama: namaKategori });
      }
      setNamaKategori("");
      setEditId(null);
      fetchKategori();
    } catch (e) {
      console.log("Error submit kategori:", e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus kategori?")) return;
    await api.delete(`/api/kategori/${id}/`);
    fetchKategori();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kategori Barang</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded-xl mb-6 flex gap-3">
        <input
          type="text"
          value={namaKategori}
          onChange={(e) => setNamaKategori(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="Nama kategori..."
          required
        />
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          {editId ? "Update" : "Tambah"}
        </button>
      </form>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nama Kategori</th>
              <th className="p-2 border w-32">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {kategori.map((k) => (
              <tr key={k.id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{k.id}</td>
                <td className="p-2 border">{k.nama}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditId(k.id);
                      setNamaKategori(k.nama);
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(k.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
