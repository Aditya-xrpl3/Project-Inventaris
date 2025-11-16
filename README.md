# 📖 KONTRAK API: Proyek Inventaris Lab

Selamat datang, tim! Ini adalah **sumber kebenaran tunggal** kita.

Proyek ini adalah **Restoran**:
* **`inventaris_backend/` (Django)**: Ini adalah **Dapur (Kitchen)**.
* **`inventaris_frontend/` (React)**: Ini adalah **Ruang Makan (Dining Hall)**.

Dokumen ini adalah **"Kertas Pesanan"** (Kontrak API) yang kita pakai untuk berkomunikasi.

**Alamat Dapur (Base URL):** `http://127.0.0.1:8000/api`

---

## 🔐 (BAGIAN A) Endpoint Keamanan & Login
**Penanggung Jawab:** Tim Backend (Auth) & Semua Tim Frontend.

| Tugas | Method | URL Endpoint | Izin | Contoh Request (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| **Login** | `POST` | `/token/` | Publik | `{"username": "user", "password": "123"}` |
| **Refresh Token** | `POST` | `/token/refresh/` | Publik | `{"refresh": "token_lama..."}` |
| **Cek User Login** | `GET` | `/user/me/` | **Butuh Token** | (Tidak ada) |

**Contoh Response `GET /user/me/` (PENTING UNTUK FRONTEND):**
```json
{
  "id": 5,
  "username": "admin_lab01",
  "groups": [
    { "name": "Admin Inventaris" }
  ]
}
```

---

## 📱 (BAGIAN B) Endpoint Public User
**Penanggung Jawab:** Tim Backend (Reporting) & Tim Frontend (Public User App).

| Tugas | Method | URL Endpoint | Izin | Contoh Request (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| **Scan QR** | `GET` | `/lokasi/<id>/` | **Butuh Token** | (Tidak ada, ID ada di URL) |
| **Kirim Laporan** | `POST` | `/lapor/` | **Butuh Token** | `{"barang": 1, "deskripsi": "Mouse rusak"}` |
| **Lihat Laporanku** | `GET` | `/laporan/saya/` | **Butuh Token** | (Tidak ada) |

**Contoh Response `GET /lokasi/1/` (Hasil Scan):**
```json
{
  "id": 1,
  "nama_lokasi": "Meja Komputer 01",
  "deskripsi": "Lab Jaringan",
  "barang_set": [
    { "id": 10, "nama_barang": "Monitor", "status": "Baik" },
    { "id": 11, "nama_barang": "PC", "status": "Baik" },
    { "id": 12, "nama_barang": "Mouse", "status": "Rusak" }
  ]
}
```

---

## ⚙️ (BAGIAN C) Endpoint Admin
**Penanggung Jawab:** Tim Backend (Reporting) & Tim Frontend (Admin Dashboard).

| Tugas | Method | URL Endpoint | Izin | Contoh Request (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| **Lihat Semua Laporan** | `GET` | `/admin/laporan/` | **Hanya Admin** | (Tidak ada) |
| **Selesaikan Laporan**| `PATCH`| `/admin/laporan/<id>/` | **Hanya Admin**| `{"status_laporan": "Selesai"}` |

**Contoh Response `GET /admin/laporan/` (Daftar Laporan):**
```json
[
  {
    "id": 1,
    "barang": { "nama_barang": "Mouse" },
    "pelapor": { "username": "yulina" },
    "deskripsi": "Mouse rusak",
    "status_laporan": "Baru",
    "created_at": "2025-11-12T10:30:00Z"
  },
  {
    "id": 2,
    "barang": { "nama_barang": "Router" },
    "pelapor": { "username": "hasna" },
    "deskripsi": "Port 3 mati",
    "status_laporan": "Diproses",
    "created_at": "2025-11-12T11:00:00Z"
  }
]
```