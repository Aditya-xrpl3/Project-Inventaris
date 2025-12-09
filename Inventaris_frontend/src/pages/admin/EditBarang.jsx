import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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

  // Ambil kategori & meja
  const fetchOptions = async () => {
    try {
      const kategoriRes = await api.get("/api/kategori/");
      const mejaRes = await api.get("/api/meja/");
      setKategori(kategoriRes.data);
      setMejaList(mejaRes.data);
    } catch (err) {
      console.error("Gagal load opsi:", err);
    }
  };

  useEffect(() => {
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
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/api/barang/${id}/`, form);
      navigate("/barang");
    } catch (err) {
      console.error("Gagal update barang:", err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">

      {/* Back Button */}
      <button
        onClick={() => navigate("/barang")}
        className="mb-4 flex items-center gap-2 bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      <h1 className="text-2xl font-bold mb-4">Edit Barang</h1>

      <form onSubmit={handleSave} className="space-y-4 bg-white p-6 shadow rounded-xl">

        <div>
          <label className="block mb-1 font-semibold">Kode Barang</label>
          <input
            name="kode_barang"
            className="border p-2 w-full rounded"
            value={form.kode_barang}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Nama Barang</label>
          <input
            name="nama_barang"
            className="border p-2 w-full rounded"
            value={form.nama_barang}
            onChange={handleChange}
            required
          />
        </div>

        {/* Dropdown Jenis */}
        <div>
          <label className="block mb-1 font-semibold">Kategori / Jenis</label>
          <select
            name="jenis"
            className="border p-2 w-full rounded"
            value={form.jenis}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Kategori</option>
            {kategori.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Meja */}
        <div>
          <label className="block mb-1 font-semibold">Meja</label>
          <select
            name="meja"
            className="border p-2 w-full rounded"
            value={form.meja}
            onChange={handleChange}
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

        {/* Status */}
        <div>
          <label className="block mb-1 font-semibold">Status Barang</label>
          <select
            name="status_barang"
            className="border p-2 w-full rounded"
            value={form.status_barang}
            onChange={handleChange}
          >
            <option value="tersedia">Tersedia</option>
            <option value="rusak">Rusak</option>
          </select>
        </div>

        <button
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          <Save size={18} /> Simpan Perubahan
        </button>

      </form>
    </div>
  );
}
