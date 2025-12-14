import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // Sesuaikan path ini dengan struktur foldermu
import { PlusCircle, ArrowLeft, Loader2, Save } from "lucide-react";

export default function TambahBarang() {
  const navigate = useNavigate();

  // --- STATE ---
  const [jenisList, setJenisList] = useState([]);
  const [mejaList, setMejaList] = useState([]);
  
  // State untuk loading
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form
  const [form, setForm] = useState({
    kode_barang: "",
    nama_barang: "",
    jenis: "", // Wajib dipilih (ID integer)
    meja: "",  // Boleh kosong (nanti dikirim null)
    status_barang: "tersedia",
  });

  // --- 1. FETCH DATA DROPDOWN ---
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoadingData(true);
        
        // Parallel fetch biar lebih cepat
        const [jenisRes, mejaRes] = await Promise.all([
          // Sesuai urls.py kamu: router.register('jenisbarang', ...)
          api.get("/api/jenisbarang/"), 
          api.get("/api/meja/")
        ]);

        setJenisList(jenisRes.data);
        setMejaList(mejaRes.data);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        alert("Gagal memuat data opsi (Jenis/Meja). Cek koneksi server.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchOptions();
  }, []);

  // --- 2. HANDLE INPUT CHANGE ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- 3. SUBMIT DATA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validasi sederhana di Frontend
    if (!form.jenis) {
      alert("Harap pilih Jenis Barang!");
      setIsSubmitting(false);
      return;
    }

    // Persiapan Payload (Data yang akan dikirim)
    const payload = {
      kode_barang: form.kode_barang,
      nama_barang: form.nama_barang,
      status_barang: form.status_barang,
      
      // Konversi ke Integer karena Serializer butuh ID
      jenis: parseInt(form.jenis),
      
      // Logika Penting: Jika meja kosong (""), kirim null. Jika ada isi, kirim ID integer.
      meja: form.meja === "" ? null : parseInt(form.meja),
    };

    try {
      await api.post("/api/barang/", payload);
      alert("✅ Berhasil menambah barang!");
      navigate("/barang"); // Redirect ke halaman list barang
    } catch (err) {
      console.error("Error submit:", err);

      // Menampilkan pesan error detail dari Django
      if (err.response && err.response.data) {
        const data = err.response.data;
        let errorMessage = "";
        
        // Loop object error untuk dijadikan string pesan
        Object.keys(data).forEach((key) => {
          const pesan = Array.isArray(data[key]) ? data[key][0] : data[key];
          errorMessage += `- ${key.toUpperCase()}: ${pesan}\n`;
        });

        alert(`Gagal Menyimpan:\n${errorMessage}`);
      } else {
        alert("Terjadi kesalahan sistem. Cek konsol browser.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto min-h-screen bg-gray-50">
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate("/barang")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium"
      >
        <ArrowLeft size={20} /> Kembali ke List Barang
      </button>

      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-8 border-b pb-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <PlusCircle size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tambah Barang Baru</h1>
            <p className="text-gray-500 text-sm">Masukkan detail barang inventaris lab.</p>
          </div>
        </div>

        {isLoadingData ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 text-gray-500 animate-pulse">
            <Loader2 className="animate-spin" size={40} />
            <p>Sedang memuat data Kategori & Meja...</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KODE BARANG */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">
                  Kode Barang <span className="text-red-500">*</span>
                </label>
                <input
                  name="kode_barang"
                  value={form.kode_barang}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Contoh: KOM-01-001"
                  required
                />
              </div>

              {/* NAMA BARANG */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">
                  Nama Barang <span className="text-red-500">*</span>
                </label>
                <input
                  name="nama_barang"
                  value={form.nama_barang}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Contoh: Monitor LG 24 Inch"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* JENIS BARANG (Dropdown) */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">
                  Jenis / Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="jenis"
                  value={form.jenis}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
                  required
                >
                  <option value="">-- Pilih Jenis Barang --</option>
                  {jenisList.map((item) => (
                    // Di serializer: kategori adalah String (nama kategori)
                    <option key={item.id} value={item.id}>
                      {item.kategori} - {item.nama_jenis}
                    </option>
                  ))}
                </select>
              </div>

              {/* MEJA (Dropdown Optional) */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-semibold text-gray-700">
                  Lokasi Meja <span className="text-gray-400 font-normal">(Opsional)</span>
                </label>
                <select
                  name="meja"
                  value={form.meja}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
                >
                  <option value="">-- Tidak Ada / Gudang --</option>
                  {mejaList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama_meja} ({item.lokasi})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* STATUS */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-semibold text-gray-700">Status Awal</label>
              <select
                name="status_barang"
                value={form.status_barang}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
              >
                <option value="tersedia">✅ Tersedia</option>
                <option value="dipakai">🔄 Dipakai</option>
                <option value="rusak">❌ Rusak</option>
                <option value="hilang">❓ Hilang</option>
              </select>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/barang")}
                className="px-6 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition"
              >
                Batal
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-white font-bold shadow-lg transition transform active:scale-95 ${
                  isSubmitting 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={20} /> Simpan Barang
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}