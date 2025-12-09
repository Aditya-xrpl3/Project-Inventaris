import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function LaporanNotification() {
  const [newCount, setNewCount] = useState(0);
  const navigate = useNavigate();

  const fetchNewLaporan = async () => {
    try {
      const res = await api.get("/api/laporan/?status=pending"); // hanya pending
      setNewCount(res.data.length);
    } catch (err) {
      console.error("Gagal ambil laporan baru:", err);
    }
  };

  useEffect(() => {
    fetchNewLaporan();
    const interval = setInterval(fetchNewLaporan, 10000); // cek tiap 10 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative cursor-pointer" onClick={() => navigate("/laporan")}>
      <Bell size={24} />
      {newCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {newCount}
        </span>
      )}
    </div>
  );
}
