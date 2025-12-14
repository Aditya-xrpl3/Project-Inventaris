import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      } catch (err) {
        console.warn("Gagal stop scanner:", err);
      }
    }
    setScanning(false);
  };

  const fetchBarang = async (id) => {
    setLoadingBarang(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/barang-public/${id}/`);
      setBarang(res.data);
    } catch (err) {
      console.error("Gagal ambil detail barang:", err);
      setError(err.response?.data?.detail || "Barang tidak ditemukan");
    } finally {
      setLoadingBarang(false);
    }
  };

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5Qrcode(qrCodeRegionId);
    html5QrCodeRef.current = scanner;

    const config = { fps: 10, qrbox: 250 };

    scanner
      .start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          try {
            const url = new URL(decodedText);
            if (url.pathname.startsWith("/barang-public/")) {
              const id = url.pathname.split("/")[2];
              fetchBarang(id);
              stopScanner();
            } else {
              setError("QR code tidak valid (harus arah ke barang)");
            }
          } catch (e) {
            setError("QR code tidak valid");
          }
        },
        (err) => console.warn("QR scan error:", err)
      )
      .catch((err) => setError(err.message || "Gagal memulai scanner"));

    return () => {
      if (scanner.getState() === 2) scanner.stop().catch(() => {});
    };
  }, [scanning]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Inventaris Lab</h1>

      {!scanning && !barang && !error && (
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-6 w-[360px]">
          <div className="text-7xl animate-pulse">📷</div>
          <p className="text-gray-700 text-center">Scan QR code barang untuk melihat detail</p>
          <button
            onClick={startScanner}
            className="mt-4 w-full px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Mulai Scan
          </button>
        </div>
      )}

      {scanning && (
        <div className="w-[360px] h-[360px] rounded-lg overflow-hidden shadow-lg border-4 border-blue-500">
          <div id={qrCodeRegionId} className="w-full h-full bg-black flex items-center justify-center" />
        </div>
      )}

      {loadingBarang && (
        <p className="mt-4 text-gray-600">Memuat data barang...</p>
      )}

      {barang && (
        <div className="mt-6 w-[360px] bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800">{barang.nama_barang}</h2>
          <div className="text-gray-700 space-y-1">
            <p><strong>Kode:</strong> {barang.kode_barang}</p>
            <p><strong>Jenis:</strong> {barang.jenis}</p>
            <p><strong>Meja:</strong> {barang.meja}</p>
            <p><strong>Status:</strong> <span className="capitalize">{barang.status_barang}</span></p>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => navigate(`/lapor/${barang.id}`)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Laporkan Kerusakan
            </button>
            <button
              onClick={() => setBarang(null)}
              className="w-full px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
            >
              Scan Lagi
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 w-[360px] bg-red-100 text-red-700 rounded-xl shadow-lg p-4 flex flex-col gap-2">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setBarang(null);
              setScanning(false);
            }}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Coba Lagi
          </button>
        </div>
      )}
    </div>
  );
}
