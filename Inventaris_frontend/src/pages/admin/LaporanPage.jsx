import { useEffect, useState } from "react";
import api from "../../api/api";
import { CheckCircle, Wrench } from "lucide-react";

export default function LaporanPage() {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchLaporan = async () => {
    try {
      const res = await api.get("/api/laporan/?status=PENDING");
      setLaporan(res.data);
    } catch (err) {
      console.error("Gagal ambil laporan:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 AUTO POLLING
  useEffect(() => {
    fetchLaporan();
    const interval = setInterval(fetchLaporan, 5000);
    return () => clearInterval(interval);
  }, []);

  const markSelesai = async (id) => {
    if (!window.confirm("Tandai laporan ini sebagai SELESAI?")) return;

    setUpdatingId(id);
    try {
      await api.patch(`/api/laporan/${id}/status/`, {
        status_laporan: "selesai",
      });
      fetchLaporan();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Gagal update status laporan");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Memuat laporan...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Laporan Kerusakan
        </h1>

        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-sm">
          {laporan.length} Pending
        </span>
      </div>

      {laporan.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <CheckCircle size={48} className="mx-auto mb-2 text-green-500" />
          <p>Tidak ada laporan pending 🎉</p>
        </div>
      )}

      <div className="grid gap-4">
        {laporan.map((l) => (
          <div
            key={l.id}
            className="bg-white rounded-xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h2 className="font-semibold text-lg">
                {l.barang_detail?.nama_barang}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {l.deskripsi}
              </p>

              <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                <Wrench size={14} />
                Pending
              </span>
            </div>

            <button
              onClick={() => markSelesai(l.id)}
              disabled={updatingId === l.id}
              className={`px-4 py-2 rounded-lg text-white transition
                ${
                  updatingId === l.id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }
              `}
            >
              {updatingId === l.id ? "Memproses..." : "Tandai Selesai"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
