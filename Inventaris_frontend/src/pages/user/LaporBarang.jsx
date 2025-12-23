import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import publicApi from "../../api/publicApi";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Upload, Send, AlertCircle, X, Image as ImageIcon } from "lucide-react";
import { Button } from "../../components/ui/Button";

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

  const handleRemoveFoto = () => {
      setFoto(null);
      setPreview(null);
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

      // Show success animation or alert?
      // For now simple alert then redirect
      alert("Laporan berhasil dikirim! Terima kasih.");

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
    <div className="min-h-screen bg-surface-50 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-bl from-red-600 to-red-400 rounded-bl-[4rem] z-0 shadow-2xl opacity-90"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-lg mx-auto p-4 md:p-6 flex flex-col min-h-screen">
            
            {/* Header */}
            <div className="flex items-center text-white mb-8 pt-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-3 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all active:scale-95"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="ml-5">
                    <h1 className="text-2xl font-heading font-bold">Lapor Kerusakan</h1>
                    <p className="text-red-100 text-sm mt-1">Bantu kami memperbaiki fasilitas</p>
                </div>
            </div>

            {/* Form Card */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl p-6 md:p-8 flex-1 flex flex-col"
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    
                    <div className="flex-1 space-y-6">
                        {/* Deskripsi Input */}
                        <div className="space-y-2">
                             <label htmlFor="deskripsi" className="font-bold text-surface-900 flex items-center gap-2">
                                <AlertCircle size={18} className="text-red-500"/>
                                Deskripsi Masalah
                             </label>
                             <textarea
                                id="deskripsi"
                                className="w-full min-h-[150px] p-4 bg-surface-50 border border-surface-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-surface-700 placeholder:text-surface-400 font-medium resize-none transition-all"
                                placeholder="Ceritakan detail kerusakan, misal: 'Kaki meja patah' atau 'Layar monitor berkedip'..."
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                required
                             />
                        </div>

                        {/* Foto Upload */}
                        <div className="space-y-2">
                             <label className="font-bold text-surface-900 flex items-center gap-2">
                                <Camera size={18} className="text-red-500"/>
                                Bukti Foto (Opsional)
                             </label>

                             {!preview ? (
                                 <div className="relative">
                                     <input
                                        id="foto"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFotoChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                     />
                                     <div className="border-2 border-dashed border-surface-300 rounded-2xl p-8 flex flex-col items-center justify-center text-surface-400 bg-surface-50 hover:bg-surface-100 transition-colors">
                                         <div className="w-12 h-12 bg-surface-200 rounded-full flex items-center justify-center mb-3">
                                             <Upload size={24} className="text-surface-500"/>
                                         </div>
                                         <p className="font-medium text-sm">Ketuk untuk upload foto</p>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="relative rounded-2xl overflow-hidden shadow-md group">
                                     <img src={preview} alt="Evidence Preview" className="w-full h-64 object-cover" />
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <button 
                                            type="button" 
                                            onClick={handleRemoveFoto}
                                            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform active:scale-95"
                                          >
                                              <X size={24} />
                                          </button>
                                     </div>
                                     <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                                         <ImageIcon size={12} className="inline mr-1"/> Foto Terlampir
                                     </div>
                                 </div>
                             )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8">
                        <Button 
                            type="submit" 
                            disabled={loading} 
                            variant="danger" 
                            size="lg"
                            className="w-full justify-center py-4 shadow-red-500/25"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Send size={20} /> Kirim Laporan
                                </>
                            )}
                        </Button>
                        <button 
                            type="button" 
                            onClick={() => navigate("/")} 
                            className="w-full mt-4 text-surface-400 text-sm font-medium hover:text-surface-600 transition-colors"
                        >
                            Batalkan
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    </div>
  );
}
