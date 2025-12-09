import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Monitor } from "lucide-react";
import api from "../../api/api";

export default function MejaPage() {
  const [meja, setMeja] = useState([]);
  const [namaMeja, setNamaMeja] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMeja = async () => {
    try {
      const res = await api.get("/api/meja/");
      setMeja(res.data);
    } catch (err) {
      console.error("Gagal ambil data meja:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeja();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { nama_meja: namaMeja, lokasi };

    try {
      if (editId) {
        await api.put(`/api/meja/${editId}/`, payload);
      } else {
        await api.post("/api/meja/", payload);
      }

      setNamaMeja("");
      setLokasi("");
      setEditId(null);
      fetchMeja();
    } catch (err) {
      console.error("Gagal simpan meja:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus meja ini?")) return;
    try {
      await api.delete(`/api/meja/${id}/`);
      fetchMeja();
    } catch (err) {
      console.error("Gagal hapus meja:", err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Monitor className="text-blue-600" /> Data Meja
      </h1>

      {/* Form Tambah / Edit */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        <input
          type="text"
          value={namaMeja}
          onChange={(e) => setNamaMeja(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Nama meja..."
          required
        />
        <input
          type="text"
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Lokasi..."
          required
        />
        <button className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 flex items-center justify-center gap-2">
          <Plus size={18} />
          {editId ? "Update" : "Tambah"}
        </button>
      </form>

      {/* Tabel Meja */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">ID</th>
              <th className="border p-3">Nama Meja</th>
              <th className="border p-3">Lokasi</th>
              <th className="border p-3">Jumlah Barang</th>
              <th className="border p-3 w-36">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {meja.map((m) => (
              <tr key={m.id} className="text-center hover:bg-gray-50">
                <td className="border p-2">{m.id}</td>
                <td className="border p-2">{m.nama_meja}</td>
                <td className="border p-2">{m.lokasi}</td>
                <td className="border p-2">{m.barang_set ? m.barang_set.length : 0}</td>
                <td className="border p-2 flex justify-center gap-2">

                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditId(m.id);
                      setNamaMeja(m.nama_meja);
                      setLokasi(m.lokasi);
                    }}
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                  >
                    <Pencil size={16} />
                  </button>

                  {/* Hapus */}
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
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
