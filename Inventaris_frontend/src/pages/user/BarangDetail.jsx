import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import publicApi from "../../api/publicApi";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, CheckCircle, MapPin, Box, Info } from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function BarangDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barang, setBarang] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        // Use Public API for scanning result
        const res = await publicApi.get(`/api/barang-public/${id}/`);
        setBarang(res.data);
      } catch (err) {
        console.error("Gagal ambil detail barang:", err);
        alert("Barang tidak ditemukan atau QR Invalid");
        navigate("/"); 
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBarang();
  }, [id, navigate]);

  if (loading) {
    return (
        <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-4">
             <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-surface-500 font-medium">Memuat data barang...</p>
        </div>
    );
  }

  if (!barang) return null;

  return (
    <div className="min-h-screen bg-surface-50 relative overflow-hidden">
       {/* Ornament */}
       <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-br from-primary-600 to-blue-600 rounded-b-[3rem] shadow-2xl z-0"></div>

       <div className="relative z-10 p-6 max-w-md mx-auto flex flex-col min-h-screen">
          
          {/* Header */}
          <div className="flex items-center text-white mb-8">
              <button onClick={() => navigate("/")} className="p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors">
                  <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-bold ml-4">Detail Barang</h1>
          </div>

          {/* Card Detail */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6 border border-surface-100 flex-1 flex flex-col"
          >
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <span className="inline-block px-3 py-1 bg-surface-100 text-surface-600 text-xs font-bold rounded-lg uppercase tracking-wider mb-2">
                          {barang.kode_barang}
                      </span>
                      <h2 className="text-2xl font-heading font-bold text-surface-900 leading-tight">
                          {barang.nama_barang}
                      </h2>
                  </div>
                  <div className={`p-3 rounded-full ${barang.status_barang === 'tersedia' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                       {barang.status_barang === 'tersedia' ? <CheckCircle size={32}/> : <AlertCircle size={32}/>}
                  </div>
              </div>

              <div className="space-y-6 flex-1">
                  <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-2xl border border-surface-100">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                          <Box size={24} />
                      </div>
                      <div>
                          <p className="text-sm text-surface-500 font-medium">Jenis Barang</p>
                          <p className="text-lg font-bold text-surface-900">
                             {typeof barang.jenis === 'object' ? barang.jenis.nama_jenis : barang.jenis_nama || barang.jenis}
                          </p>
                      </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-2xl border border-surface-100">
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                          <MapPin size={24} />
                      </div>
                      <div>
                          <p className="text-sm text-surface-500 font-medium">Lokasi / Meja</p>
                          <p className="text-lg font-bold text-surface-900">
                             {typeof barang.meja === 'object' ? barang.meja.nama_meja : barang.meja_nama || barang.meja || "-"}
                          </p>
                      </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-surface-50 rounded-2xl border border-surface-100">
                      <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                          <Info size={24} />
                      </div>
                      <div>
                          <p className="text-sm text-surface-500 font-medium">Status Saat Ini</p>
                          <p className={`text-lg font-bold capitalize ${
                              barang.status_barang === 'tersedia' ? 'text-green-600' : 'text-red-500'
                          }`}>
                             {barang.status_barang}
                          </p>
                      </div>
                  </div>
              </div>

              {/* Actions */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                  <Button variant="secondary" onClick={() => navigate("/")} className="justify-center py-4">
                      Scan Lagi
                  </Button>
                  <Button variant="danger" onClick={() => navigate(`/lapor/${barang.id}`)} className="justify-center py-4">
                      Lapor Rusak
                  </Button>
              </div>

          </motion.div>
       </div>
    </div>
  );
}
