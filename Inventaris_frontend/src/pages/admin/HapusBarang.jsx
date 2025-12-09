import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function HapusBarang() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDelete = async () => {
    try {
      await api.delete(`/api/barang/${id}/`);
      navigate("/barang");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-bold text-gray-800">Hapus Barang</h1>
        <p className="text-gray-700">Yakin ingin menghapus barang ini?</p>

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Ya, Hapus
          </button>
          <button
            onClick={() => navigate("/barang")}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg shadow"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
