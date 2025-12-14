import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function BarangDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barang, setBarang] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await api.get(`/api/barang/${id}/`);
        setBarang(res.data);
      } catch (err) {
        console.error("Gagal ambil detail barang:", err);
        alert("Barang tidak ditemukan");
        navigate("/"); // kembali ke scan page
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBarang();
  }, [id, navigate]);

  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case "tersedia":
        return "bg-green-100 text-green-800";
      case "dipakai":
        return "bg-yellow-100 text-yellow-800";
      case "rusak":
        return "bg-red-100 text-red-800";
      case "hilang":
        return "bg-gray-300 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );

  if (!barang) return null;

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800">{barang.nama_barang}</h2>

        <div className="flex flex-col gap-2 text-gray-700">
          <p>
            <strong>Kode:</strong> {barang.kode_barang}
          </p>
          <p>
            <strong>Jenis:</strong> {barang.jenis_nama ?? barang.jenis}
          </p>
          <p>
            <strong>Meja:</strong> {barang.meja_nama ?? barang.meja}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full font-semibold text-sm ${statusColor(
                barang.status_barang
              )}`}
            >
              {barang.status_barang}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={() => navigate(`/lapor/${barang.id}`)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Laporkan Kerusakan
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Kembali Scan
          </button>
        </div>
      </div>
    </div>
  );
}
