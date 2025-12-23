import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import publicApi from "../../api/publicApi"; 
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function ScanPage() {
  const navigate = useNavigate();
  const qrCodeRegionId = "qr-reader";
  const html5QrCodeRef = useRef(null);

  const [initializing, setInitializing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [barang, setBarang] = useState(null);
  const [loadingBarang, setLoadingBarang] = useState(false);

  const startScanner = () => {
    console.log("Start button clicked!");
    setError(null);
    setBarang(null);
    setScanning(true);
    setInitializing(true); // Show "Preparing..." UI
  };

  const stopScanner = async () => {
    console.log("Stopping scanner...");
    if (html5QrCodeRef.current && html5QrCodeRef.current.getState() === 2) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear(); 
      } catch (err) {
        console.warn("Failed to stop scanner:", err);
      }
    }
    setScanning(false);
    setInitializing(false);
  };

  // ... fetchBarang ...

  useEffect(() => {
    if (!scanning) return;

    console.log("Initializing Html5Qrcode...");
    const scanner = new Html5Qrcode(qrCodeRegionId);
    html5QrCodeRef.current = scanner;

    const config = { fps: 10, qrbox: 250, aspectRatio: 1.0 };
    
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
        scanner.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
               // ... success callback ...
               console.log("QR Code detected:", decodedText);
               // ... existing logic ...
                 try {
                if (decodedText.includes("barang-public")) {
                  const cleanText = decodedText.endsWith("/") ? decodedText.slice(0, -1) : decodedText;
                  const parts = cleanText.split("/");
                  const id = parts[parts.length - 1];

                  if (id && !isNaN(id)) {
                    stopScanner();
                    navigate(`/detail/${id}`); // Redirect to detail page
                  } else {
                    setError("ID Barang tidak valid dalam QR Code ini.");
                    setScanning(false); 
                  }
                } else {
                  setError("QR Code ini bukan untuk Barang Inventaris Lab");
                  setScanning(false);
                }
              } catch (e) {
                setError("Format QR Code rusak atau tidak valid.");
                setScanning(false);
              }
            },
            (err) => {
                // Ignore frame errors
            }
        ).then(() => {
            console.log("Scanner started successfully.");
            setInitializing(false); // Scanner is running, hide loading
        }).catch((err) => {
            console.error("Failed to start scanner:", err);
            setScanning(false);
            setInitializing(false);
            setError(`Gagal akses kamera: ${err.message || "Unknown error"}`);
        });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scanner.getState() === 2) scanner.stop().catch(() => {});
    };
  }, [scanning]);

  return (
    <div className="min-h-screen bg-surface-900 text-white flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary-900/50 to-transparent"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-heading font-bold">Scanner</h1>
            <p className="text-surface-400 text-sm">Scan QR untuk detail barang</p>
        </div>
        <button onClick={() => navigate("/login")} className="text-sm font-medium text-surface-300 hover:text-white transition-colors">
            Login Admin
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        
        {/* --- STATE: IDLE (Start Button) --- */}
        {!scanning && !barang && !error && !loadingBarang && (
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
             >
                <div className="relative w-64 h-64 mx-auto">
                    <div className="absolute inset-0 border-2 border-primary-500/30 rounded-3xl animate-pulse"></div>
                    <div className="absolute inset-4 border-2 border-primary-500/60 rounded-2xl"></div>
                    <div className="flex flex-col items-center justify-center w-full h-full relative z-10">
                         <Button onClick={startScanner} size="lg" className="rounded-full w-20 h-20 p-0 flex items-center justify-center shadow-2xl shadow-primary-500/50 hover:scale-110 active:scale-95 transition-transform duration-200">
                            <Camera size={36} />
                         </Button>
                         <span className="mt-3 text-sm font-semibold text-primary-200 animate-pulse">Klik Kamera</span>
                    </div>
                </div>
                <div>
                     <h2 className="text-xl font-bold">Siap Memindai</h2>
                     <p className="text-surface-400 mt-2 max-w-xs mx-auto">Arahkan kamera ke QR Code yang tertempel pada barang.</p>
                </div>
             </motion.div>
        )}

        {/* --- STATE: INITIALIZING (Requesting Camera) --- */}
        {initializing && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 text-white rounded-3xl">
                 <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="font-semibold">Membuka Kamera...</p>
             </div>
        )}

        {/* --- STATE: SCANNING (Camera View) --- */}
        {scanning && (
             <div className="w-full max-w-md aspect-square relative rounded-3xl overflow-hidden border-2 border-surface-700 shadow-2xl bg-black">
                {/* --- RENDER SCANNER HERE --- */}
                <div id={qrCodeRegionId} className="w-full h-full object-cover"/>
                
                {/* Overlay UI */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-primary-500 rounded-tl-3xl m-4"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-primary-500 rounded-tr-3xl m-4"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-primary-500 rounded-bl-3xl m-4"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-primary-500 rounded-br-3xl m-4"></div>
                    
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-scan-line"></div>
                </div>

                <button 
                  onClick={stopScanner}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/60 backdrop-blur-md rounded-full text-white font-medium hover:bg-black/80 transition"
                >
                  Batal
                </button>
             </div>
        )}

        {/* --- STATE: LOADING --- */}
        {loadingBarang && (
             <div className="text-center space-y-4">
                 <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                 <p className="text-lg font-medium">Sedang mengambil data...</p>
             </div>
        )}

        {/* --- STATE: SUCCESS (Detail Barang) --- */}
        <AnimatePresence>
            {barang && (
                <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    className="fixed bottom-0 left-0 w-full bg-white text-surface-900 rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50"
                >
                    <div className="w-12 h-1.5 bg-surface-200 rounded-full mx-auto mb-6"></div>
                    
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <span className="text-xs font-bold bg-primary-100 text-primary-700 px-2 py-1 rounded-md uppercase tracking-wider">{barang.kode_barang}</span>
                            <h2 className="text-2xl font-bold mt-2">{barang.nama_barang}</h2>
                        </div>
                        <div className={`p-2 rounded-full ${barang.status_barang === 'tersedia' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {barang.status_barang === 'tersedia' ? <CheckCircle size={28}/> : <AlertCircle size={28}/>}
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between py-3 border-b border-surface-100">
                            <span className="text-surface-500">Jenis Barang</span>
                            <span className="font-medium">{typeof barang.jenis === 'object' ? barang.jenis.nama_jenis : barang.jenis_nama || barang.jenis}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-surface-100">
                            <span className="text-surface-500">Lokasi</span>
                            <span className="font-medium">{typeof barang.meja === 'object' ? barang.meja.nama_meja : barang.meja_nama || barang.meja || "Gudang"}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <Button variant="secondary" onClick={() => { setBarang(null); setScanning(true); }}>
                            Scan Lagi
                         </Button>
                         <Button onClick={() => navigate(`/lapor/${barang.id}`)} variant="danger">
                            Lapor Rusak
                         </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- STATE: ERROR --- */}
        <AnimatePresence>
            {error && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500 text-white p-6 rounded-2xl max-w-sm w-full text-center shadow-xl"
                >
                    <AlertCircle size={48} className="mx-auto mb-4 opacity-80" />
                    <h3 className="text-xl font-bold mb-2">Oops!</h3>
                    <p className="mb-6 opacity-90">{error}</p>
                    <Button variant="secondary" className="w-full justify-center bg-white text-red-600 hover:bg-red-50 border-0" onClick={startScanner}>
                        Coba Lagi
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}