import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function HapusBarang() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDelete = async () => {
    try {
      await api.delete(`/api/barang/${id}/`); // <- pastikan prefix /api/ sesuai API docs
      navigate("/barang"); // kembali ke daftar barang
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Hapus Barang</h1>
      <p className="mb-4">Yakin ingin menghapus barang ini?</p>

      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Ya, Hapus
        </button>
        <button
          onClick={() => navigate("/barang")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
