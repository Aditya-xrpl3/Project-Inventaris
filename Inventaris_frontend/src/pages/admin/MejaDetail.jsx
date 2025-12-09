import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { ArrowLeft, Pencil, Trash2, PackageSearch } from "lucide-react";

export default function MejaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meja, setMeja] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/api/meja/${id}/`);
      setMeja(res.data);
    } catch (err) {
      console.error("Gagal mengambil detail meja:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!meja) return <div className="p-6">Meja tidak ditemukan</div>;

  return (
    <div className="p-6">

      {/* Back Button */}
      <button
        onClick={() => navigate("/meja")}
        className="flex items-center gap-2 mb-4 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      {/* Header */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{meja.nama_meja}</h1>
        <p className="text-gray-600">Lokasi: {meja.lokasi}</p>
      </div>

      {/* Barang di meja */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PackageSearch className="text-blue-600" /> Barang di Meja Ini
        </h2>

        {meja.barang_set.length === 0 ? (
          <p className="text-gray-500 italic">Tidak ada barang di meja ini</p>
        ) : (
          <div className="overflow-hidden border rounded-xl">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">ID</th>
                  <th className="p-3 border">Nama Barang</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {meja.barang_set.map((item) => (
                  <tr key={item.id} className="text-center hover:bg-gray-50">
                    <td className="border p-3">{item.id}</td>
                    <td className="border p-3">{item.nama_barang}</td>
                    <td className="border p-3">
                      <span
                        className={`px-3 py-1 rounded text-white ${
                          item.status_barang === "tersedia"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {item.status_barang}
                      </span>
                    </td>
                    <td className="border p-3 flex justify-center gap-2">

                      <button
                        onClick={() =>
                          navigate(`/edit/${item.id}`, { state: item })
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                      >
                        <Pencil size={16} /> Edit
                      </button>

                      <button
                        onClick={() => navigate(`/hapus/${item.id}`)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Hapus
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
}
