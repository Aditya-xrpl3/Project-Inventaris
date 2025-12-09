import { useEffect, useState } from "react";
import api from "../../api/api";
import { FileText, CheckCircle, Wrench, Clock } from "lucide-react";

export default function LaporanPage() {
  const [laporan, setLaporan] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchLaporan = async () => {
    try {
      const res = await api.get("/api/laporan/");
      setLaporan(res.data);
    } catch (err) {
      console.error("Gagal ambil laporan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/api/laporan/${id}/status/`, {
        status_laporan: newStatus,
      });
      fetchLaporan();
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  const filtered = laporan.filter((l) =>
    statusFilter === "all" ? true : l.status_laporan === statusFilter
  );

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText className="text-blue-600" /> Laporan Kerusakan
      </h1>

      {/* Filter */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded ${
            statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`px-4 py-2 rounded ${
            statusFilter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setStatusFilter("diperbaiki")}
          className={`px-4 py-2 rounded ${
            statusFilter === "diperbaiki" ? "bg-orange-500 text-white" : "bg-gray-200"
          }`}
        >
          Diperbaiki
        </button>
        <button
          onClick={() => setStatusFilter("selesai")}
          className={`px-4 py-2 rounded ${
            statusFilter === "selesai" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Selesai
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Barang</th>
              <th className="p-3 border">Deskripsi</th>
              <th className="p-3 border">Pelapor</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border w-44">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((lap) => (
              <tr key={lap.id} className="text-center hover:bg-gray-100">

                <td className="border p-3">{lap.id}</td>

                <td className="border p-3">
                  {lap.barang_detail?.nama_barang ?? "Tidak diketahui"}
                </td>

                <td className="border p-3">{lap.deskripsi}</td>

                <td className="border p-3">
                  {lap.pelapor ? lap.pelapor.username : "Anonymous"}
                </td>

                <td className="border p-3">
                  <span
                    className={`px-3 py-1 rounded text-white ${
                      lap.status_laporan === "pending"
                        ? "bg-yellow-500"
                        : lap.status_laporan === "diperbaiki"
                        ? "bg-orange-500"
                        : "bg-green-600"
                    }`}
                  >
                    {lap.status_laporan}
                  </span>
                </td>

                <td className="border p-3">

                  <div className="flex gap-2 justify-center">

                    <button
                      onClick={() => updateStatus(lap.id, "pending")}
                      className="bg-yellow-500 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-yellow-600"
                    >
                      <Clock size={16} /> Pending
                    </button>

                    <button
                      onClick={() => updateStatus(lap.id, "diperbaiki")}
                      className="bg-orange-500 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-orange-600"
                    >
                      <Wrench size={16} /> Perbaiki
                    </button>

                    <button
                      onClick={() => updateStatus(lap.id, "selesai")}
                      className="bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-green-700"
                    >
                      <CheckCircle size={16} /> Selesai
                    </button>

                  </div>

                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
