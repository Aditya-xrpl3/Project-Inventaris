import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { PlusCircle, ArrowLeft } from "lucide-react";

export default function TambahBarang() {
  const navigate = useNavigate();

  const [kategori, setKategori] = useState([]);
  const [mejaList, setMejaList] = useState([]);

  const [form, setForm] = useState({
    kode_barang: "",
    nama_barang: "",
    jenis: "",
    meja: "",
    status_barang: "tersedia",
  });

  const fetchOptions = async () => {
    const kategoriRes = await api.get("/api/kategori/");
    const mejaRes = await api.get("/api/meja/");

    setKategori(kategoriRes.data);
    setMejaList(mejaRes.data);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/barang/", form);
      navigate("/barang");
    } catch (err) {
      console.error("Gagal tambah barang:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">

      <button
        onClick={() => navigate("/barang")}
        className="mb-4 flex items-center gap-2 bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      <h1 className="text-2xl font-bold mb-4">Tambah Barang</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 shadow rounded-xl"
      >
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

        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
          <PlusCircle size={18} /> Tambah Barang
        </button>
      </form>
    </div>
  );
}
