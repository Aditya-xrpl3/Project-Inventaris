import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import publicApi from "../../api/publicApi";

export default function LaporBarang() {
  const { id: barangId } = useParams();
  const navigate = useNavigate();

  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setFoto(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deskripsi.trim()) {
      alert("Deskripsi wajib diisi");
      return;
    }

    const formData = new FormData();
    formData.append("barang", barangId);
    formData.append("deskripsi", deskripsi);
    if (foto) formData.append("foto_url", foto);

    setLoading(true);
    try {
      await publicApi.post("/api/lapor/", formData);

      alert("Laporan berhasil dikirim");

      // RESET FORM
      setDeskripsi("");
      setFoto(null);
      setPreview(null);

      navigate("/", { replace: true });
    } catch (err) {
      console.error("[DEBUG] Gagal kirim laporan:", err.response?.data || err);
      alert(
        err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.detail ||
          "Gagal mengirim laporan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Laporkan Kerusakan</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="deskripsi" className="font-semibold text-gray-700">
              Deskripsi Kerusakan
            </label>
            <textarea
              id="deskripsi"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Jelaskan kerusakan secara detail..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="foto" className="font-semibold text-gray-700">
              Foto (opsional)
            </label>
            <input
              id="foto"
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {loading ? "Mengirim..." : "Kirim Laporan"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Batal
          </button>
        </form>
      </div>
    </div>
  );
}
