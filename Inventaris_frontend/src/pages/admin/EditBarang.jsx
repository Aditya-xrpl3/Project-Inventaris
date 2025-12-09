import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../api/api";
import { Save, ArrowLeft } from "lucide-react";

export default function EditBarang() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const [kategori, setKategori] = useState([]);
  const [mejaList, setMejaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    kode_barang: "",
    nama_barang: "",
    jenis: "",
    meja: "",
    status_barang: "tersedia",
  });

  // Gunakan state di dependency array untuk menghindari warning
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const kategoriRes = await api.get("/api/kategori/");
        const mejaRes = await api.get("/api/meja/");
        setKategori(kategoriRes.data);
        setMejaList(mejaRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();

    if (state) {
      setForm({
        kode_barang: state.kode_barang,
        nama_barang: state.nama_barang,
        jenis: state.jenis,
        meja: state.meja,
        status_barang: state.status_barang,
      });
    }

    setLoading(false);
  }, [state]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/api/barang/${id}/`, form);
      navigate("/barang");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/barang")}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      <div className="bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Barang</h1>

        <form className="space-y-4" onSubmit={handleSave}>
          {/* Kode Barang */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Kode Barang</label>
            <input
              name="kode_barang"
              value={form.kode_barang}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          {/* Nama Barang */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Nama Barang</label>
            <input
              name="nama_barang"
              value={form.nama_barang}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          {/* Kategori / Jenis */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Kategori / Jenis</label>
            <select
              name="jenis"
              value={form.jenis}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            >
              <option value="">Pilih Kategori</option>
              {kategori.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama_kategori}
                </option>
              ))}
            </select>
          </div>

          {/* Meja */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Meja</label>
            <select
              name="meja"
              value={form.meja}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            >
              <option value="">Pilih Meja</option>
              {mejaList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama_meja}
                </option>
              ))}
            </select>
          </div>

          {/* Status Barang */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Status Barang</label>
            <select
              name="status_barang"
              value={form.status_barang}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="tersedia">Tersedia</option>
              <option value="rusak">Rusak</option>
            </select>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
          >
            <Save size={18} /> Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
