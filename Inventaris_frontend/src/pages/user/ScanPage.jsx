import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import publicApi from "../../api/publicApi"; 

export default function ScanPage() {
  const navigate = useNavigate();
  const qrCodeRegionId = "qr-reader";
  const html5QrCodeRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [barang, setBarang] = useState(null);
  const [loadingBarang, setLoadingBarang] = useState(false);

  const startScanner = () => {
    setError(null);
    setBarang(null);
    setScanning(true);
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.getState() === 2) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear(); // Bersihkan UI scanner
      } catch (err) {
        console.warn("Gagal stop scanner:", err);
      }
    }
    setScanning(false);
  };

  const fetchBarang = async (id) => {
    setLoadingBarang(true);
    try {
      // Panggil endpoint API Backend
      const res = await publicApi.get(`/api/barang-public/${id}/`);
      setBarang(res.data);
    } catch (err) {
      console.error("Gagal ambil detail barang:", err);
      setError(err.response?.data?.detail || "Barang tidak ditemukan di sistem.");
    } finally {
      setLoadingBarang(false);
    }
  };

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5Qrcode(qrCodeRegionId);
    html5QrCodeRef.current = scanner;

    const config = { 
      fps: 10, 
      qrbox: 250,
      aspectRatio: 1.0 
    };

    scanner.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // --- LOGIKA BARU YANG DIPERBAIKI ---
          try {
            console.log("QR Terbaca:", decodedText); // Debugging di Console

            // 1. Cek apakah URL mengandung kata kunci 'barang-public'
            // Ini menangani baik URL '/api/barang-public/' maupun '/barang-public/'
            if (decodedText.includes("barang-public")) {
              
              // 2. Bersihkan trailing slash (garis miring di akhir) agar split rapi
              // Contoh: .../5/ menjadi .../5
              const cleanText = decodedText.endsWith("/") 
                ? decodedText.slice(0, -1) 
                : decodedText;

              // 3. Ambil bagian terakhir dari URL (ID Barang)
              const parts = cleanText.split("/");
              const id = parts[parts.length - 1];

              // 4. Pastikan ID yang didapat adalah Angka
              if (id && !isNaN(id)) {
                stopScanner(); // Stop kamera
                fetchBarang(id); // Ambil data
              } else {
                setError("ID Barang tidak valid dalam QR Code ini.");
              }

            } else {
              // Jika scan QR Code Indomaret/LinkAja/dll
              setError("QR Code ini bukan untuk Barang Inventaris Lab");
            }
          } catch (e) {
            console.error(e);
            setError("Format QR Code rusak atau tidak valid.");
          }
        },
        (err) => {
           // Abaikan error frame-by-frame (kamera goyang, blur, dll)
        }
      )
      .catch((err) => {
        setScanning(false);
        setError("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
      });

    return () => {
      if (scanner.getState() === 2) {
          scanner.stop().catch(() => {});
      }
    };
  }, [scanning]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Inventaris Lab</h1>

      {/* TAMPILAN AWAL (Tombol Start) */}
      {!scanning && !barang && !error && (
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-6 w-full max-w-sm">
          <div className="text-7xl animate-bounce">📷</div>
          <p className="text-gray-700 text-center font-medium">
            Arahkan kamera ke QR Code barang
          </p>
          <button
            onClick={startScanner}
            className="mt-2 w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition transform active:scale-95"
          >
            Mulai Scan
          </button>
        </div>
      )}

      {/* AREA KAMERA */}
      {scanning && (
        <div className="w-full max-w-sm bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-500 relative">
          <div id={qrCodeRegionId} className="w-full" />
          <button 
            onClick={stopScanner}
            className="absolute top-4 right-4 bg-red-600/80 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-bold shadow-sm"
          >
            BATAL
          </button>
          <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">
            Mencari QR Code...
          </div>
        </div>
      )}

      {/* LOADING INDICATOR */}
      {loadingBarang && (
        <div className="mt-8 flex flex-col items-center gap-2 animate-pulse">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-semibold">Sedang mengambil data barang...</p>
        </div>
      )}

      {/* HASIL DATA BARANG */}
      {barang && (
        <div className="mt-6 w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-blue-600 p-4 text-center">
            <h2 className="text-xl font-bold text-white">{barang.nama_barang}</h2>
            <p className="text-blue-100 text-sm">{barang.kode_barang}</p>
          </div>
          
          <div className="p-6 flex flex-col gap-3 text-sm text-gray-700">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="font-semibold text-gray-500">Jenis</span>
              {/* Handle struktur data object atau string */}
              <span>{typeof barang.jenis === 'object' ? barang.jenis.nama_jenis : barang.jenis_nama || barang.jenis}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="font-semibold text-gray-500">Lokasi</span>
              <span>{typeof barang.meja === 'object' ? barang.meja.nama_meja : barang.meja_nama || barang.meja || "Gudang"}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="font-semibold text-gray-500">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  barang.status_barang === 'tersedia' ? 'bg-green-100 text-green-700' : 
                  barang.status_barang === 'rusak' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {barang.status_barang}
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 flex gap-3">
            <button
              onClick={() => navigate(`/lapor/${barang.id}`)} // Pastikan route ini ada
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition shadow-sm"
            >
              Lapor Rusak
            </button>
            <button
              onClick={() => { setBarang(null); setScanning(true); }}
              className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition shadow-sm"
            >
              Scan Lagi
            </button>
          </div>
        </div>
      )}

      {/* PESAN ERROR */}
      {error && (
        <div className="mt-6 w-full max-w-sm bg-red-50 text-red-800 rounded-xl shadow-md p-4 flex flex-col gap-3 border border-red-200 animate-in shake">
          <div className="flex items-center gap-3">
             <div className="bg-red-200 p-2 rounded-full">⚠️</div>
             <div>
               <h3 className="font-bold text-sm">Gagal Membaca QR</h3>
               <p className="text-xs text-red-600">{error}</p>
             </div>
          </div>
          <button
            onClick={() => {
              setError(null);
              setBarang(null);
              setScanning(true);
            }}
            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-bold"
          >
            Coba Scan Lagi
          </button>
        </div>
      )}
    </div>
  );
}