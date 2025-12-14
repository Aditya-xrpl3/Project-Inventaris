# 📖 Inventaris Lab - Sistem Manajemen Inventaris Berbasis QR Code

Proyek ini adalah sistem inventaris lab yang memungkinkan pengguna umum untuk scan QR code barang dan melaporkan kerusakan, serta admin untuk mengelola data barang, meja, kategori, dan laporan kerusakan. Dibangun dengan **Django REST Framework** (backend) dan **React + Vite** (frontend), menggunakan database MySQL dan JWT untuk autentikasi.

## 🏗️ Arsitektur Proyek

Proyek ini terdiri dari dua bagian utama:

- **Backend (Django)**: Mengelola API, database, dan logika bisnis.
- **Frontend (React)**: Interface pengguna untuk scan QR, laporan, dan dashboard admin.

### Struktur Folder

```
inventaris_backend/    # Kode sumber Django (Backend)
├── manage.py          # Skrip untuk menjalankan perintah Django
├── inventaris/        # Paket utama Django
│   ├── __init__.py    # Menandai direktori ini sebagai paket Python
│   ├── settings.py    # Pengaturan proyek Django
│   ├── urls.py        # Routing URL untuk proyek
│   └── wsgi.py        # Antarmuka untuk server web
└── db.sqlite3         # Database SQLite (digunakan untuk pengembangan)

inventaris_frontend/   # Kode sumber React (Frontend)
├── index.html         # Halaman HTML utama
├── package.json       # Daftar dependensi dan skrip npm
├── src/               # Kode sumber React
│   ├── App.jsx        # Komponen utama aplikasi
│   ├── main.jsx       # Titik masuk aplikasi React
│   └── ...             # Komponen dan file lainnya
└── vite.config.js     # Konfigurasi Vite
```

## 🚀 Cara Menjalankan Proyek

Ini adalah instruksi untuk **SETELAH** kamu `git clone` atau `git pull` proyek ini untuk pertama kalinya.

Kita punya 2 "server" yang harus berjalan **BERSAMAAN** di **2 TERMINAL** yang berbeda.

---

### 👨‍🍳 Untuk Tim Backend (Dapur)

Ini cara "menyalakan kompor" Dapur Django.

1.  **Buka Terminal 1.**
2.  Masuk ke folder backend:
    ```bash
    cd inventaris_backend
    ```
3.  Buat & aktifkan _virtual environment_ (jika ini pertama kalimu):

    ```bash
    # (Hanya lakukan ini SEKALI)
    python -m venv venv

    # Aktifkan (Windows)
    venv\Scripts\activate

    # Aktifkan (Mac/Linux)
    source venv/bin/activate
    ```

4.  Install semua "bahan" (library) yang dibutuhkan:
    ```bash
    pip install -r requirements.txt
    ```
5.  Siapkan "Gudang" (Database) - _Tugas Tim Database_:
    ```bash
    python manage.py migrate
    ```
6.  Nyalakan "Kompor" (Jalankan server):
    ```bash
    python manage.py runserver
    ```
    ✅ **Sukses!** Dapur (Backend) kamu sekarang buka di `http://127.0.0.1:8000`

---

### 🙋‍♂️ Untuk Tim Frontend (Ruang Makan)

Ini cara "membuka pintu" Ruang Makan React.

1.  **Buka Terminal 2 (TERMINAL BARU, JANGAN TUTUP TERMINAL 1).**
2.  Masuk ke folder frontend:
    ```bash
    cd inventaris_frontend
    ```
3.  Install semua "peralatan" (library) yang dibutuhkan:
    ```bash
    npm install
    ```
4.  Buka "Pintu Restoran" (Jalankan server):
    ```bash
    npm run dev
    ```
    ✅ **Sukses!** Ruang Makan (Frontend) kamu sekarang buka di `http://localhost:5173` (atau alamat lain yang diberikan).

---

### 🔥 PENTING: Restoran Buka!

Kamu sekarang punya **2 server yang jalan bersamaan**:

- **Backend** di `localhost:8000`
- **Frontend** di `localhost:5173`

Frontend akan otomatis "memesan" ke Backend. Kamu bisa buka `http://localhost:5173` di browser-mu untuk melihat aplikasinya.
