# 📖 Buku Proyek: Inventaris Lab

Selamat datang di proyek kita! Dokumen ini adalah **sumber kebenaran tunggal** (Single Source of Truth) untuk semua tim.

## 🏛️ Arsitektur Kita: Analogi Restoran

Agar mudah dipahami, anggap proyek ini adalah **Restoran** besar:

* **`inventaris_backend/` (Django)** ➔ **DAPUR (Kitchen)**
    * Tugas: Memasak makanan (mengolah data), mengelola gudang (database), dan mengikuti resep.
    * Penghuni: **Seluruh Tim Backend**.

* **`inventaris_frontend/` (React)** ➔ **RUANG MAKAN (Dining Hall)**
    * Tugas: Melayani pelanggan (UI/UX), mencatat pesanan, dan menyajikan makanan.
    * Penghuni: **Seluruh Tim Frontend**.

Dokumen ini adalah **BUKU MENU & BUKU RESEP** (Kontrak API) kita.
* **Frontend** membacanya sebagai **Buku Menu** (Melihat apa yang bisa dipesan).
* **Backend** membacanya sebagai **Buku Resep** (Melihat cara membuat pesanan).

---

## 🧐 Cara Membaca Dokumen Ini (Peran Tim)

* **🙋‍♂️ Untuk Tim Frontend (Ruang Makan):**
    Kalian adalah **Pelayan**. Tugas kalian adalah membaca **Buku Menu** (di bawah). Kalian harus tahu:
    1.  **Alamat Pesanan (URL)**: Ke loket mana kalian harus memesan?
    2.  **Cara Menulis Pesanan (Request)**: Format 'kertas pesanan' (JSON) apa yang harus kalian kirim ke Dapur?

* **👨‍🍳 Untuk Tim Backend (Dapur):**
    Kalian adalah **Koki**. Tugas kalian adalah membaca **Buku Resep** (di bawah). Kalian harus:
    1.  Menyiapkan "bahan baku" di **Gudang** (Tim **Database** membuat `models.py`).
    2.  Memasak "hidangan" (data JSON) **PERSIS** seperti yang tertulis di resep (Tim **Reporting** & **Auth** membuat `views.py`).

* **🔎 Untuk Tim QA (Food Critic):**
    Kalian adalah **Kritikus Makanan**. Pegang buku ini, gunakan alat (Postman), dan uji **Dapur** (Backend). Apakah "hidangan" (Response JSON) yang mereka masak sesuai dengan "pesanan" (Request JSON) di buku resep ini?

---

## 📜 KONTRAK API (MENU & RESEP)

**Alamat Dapur (Base URL):** `http://127.0.0.1:8000/api`

---

### BAGIAN A: Pintu Masuk & Keamanan 🔐
* **Penanggung Jawab:** Tim Backend (Auth) & Semua Tim Frontend.
* **Tujuan:** Mengurus siapa yang boleh masuk dan apa "kartu identitas" mereka.

| Tugas | Alamat Pesanan (URL) | Aturan | 📝 Kertas Pesanan (Request) |
| :--- | :--- | :--- | :--- |
| **Login** (Minta Token) | `POST /token/` | Publik | `{"username": "...", "password": "..."}` |
| **Cek Kartu Identitas** | `GET /user/me/` | Butuh Token | *(Tidak ada)* |

> **WAJIB UNTUK FRONTEND:**
> Saat `GET /user/me/`, "Dapur" akan memberi "Hidangan" (Response) seperti ini.
> Gunakan info `groups` untuk tahu apakah user ini **Admin** atau bukan.
>
> ```json
> {
>   "id": 5,
>   "username": "admin_lab01",
>   "first_name": "Adit",
>   "groups": [
>     { "name": "Admin Inventaris" }
>   ]
> }
> ```

---

### BAGIAN B: Aplikasi User (Pelanggan Umum) 📱
* **Penanggung Jawab:** Tim Frontend (Public User) & Tim Backend (Reporting).
* **Tujuan:** Alur utama pengguna: Scan, Lihat, Lapor.

| Tugas | Alamat Pesanan (URL) | Aturan | 📝 Kertas Pesanan (Request) |
| :--- | :--- | :--- | :--- |
| **Scan QR** (Lihat 1 Meja) | `GET /lokasi/<id>/` | Butuh Token | *(ID ada di URL)* |
| **Kirim Laporan Rusak** | `POST /lapor/` | Butuh Token | `{"barang": 1, "deskripsi": "Mouse rusak"}` |
| **Lihat Laporanku Saja** | `GET /laporan/saya/` | Butuh Token | *(Tidak ada)* |

> **PENTING (Hasil Scan):**
> Saat `GET /lokasi/<id>/`, "Dapur" akan memberi "Hidangan" (Response) seperti ini.
> Tim Frontend **harus** menampilkan daftar `barang_set` ini.
>
> ```json
> {
>   "id": 1,
>   "nama_lokasi": "Meja Komputer 01",
>   "barang_set": [
>     { "id": 10, "nama_barang": "Monitor", "status": "Baik" },
>     { "id": 11, "nama_barang": "PC", "status": "Baik" },
>     { "id": 12, "nama_barang": "Mouse", "status": "Rusak" }
>   ]
> }
> ```

---

### BAGIAN C: Dashboard Admin (Manajer Resto) ⚙️
* **Penanggung Jawab:** Tim Frontend (Admin Dashboard) & Tim Backend (Reporting).
* **Tujuan:** Alur khusus Admin: Melihat semua laporan dan mengurusnya.

| Tugas | Alamat Pesanan (URL) | Aturan | 📝 Kertas Pesanan (Request) |
| :--- | :--- | :--- | :--- |
| **Lihat SEMUA Laporan** | `GET /admin/laporan/` | **Hanya Admin** | *(Tidak ada)* |
| **Selesaikan Laporan** | `PATCH /admin/laporan/<id>/` | **Hanya Admin** | `{"status_laporan": "Selesai"}` |

> **PENTING (Dashboard Admin):**
> Saat `GET /admin/laporan/`, "Dapur" akan memberi "Hidangan" (Response) berupa *list* (array) seperti ini.
> Tim Frontend Admin **harus** menampilkannya dalam bentuk tabel.
>
> ```json
> [
>   {
>     "id": 1,
>     "barang": { "nama_barang": "Mouse" },
>     "pelapor": { "username": "yulina" },
>     "deskripsi": "Mouse rusak",
>     "status_laporan": "Baru",
>     "created_at": "2025-11-12T10:30:00Z"
>   },
>   {
>     "id": 2,
>     "barang": { "nama_barang": "Router" },
>     "pelapor": { "username": "hasna" },
>     "deskripsi": "Port 3 mati",
>     "status_laporan": "Diproses",
>     "created_at": "2025-11-12T11:00:00Z"
>   }
> ]
> ```
>
> ## 🚀 Cara Menjalankan Proyek (Setup Awal)

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
3.  Buat & aktifkan *virtual environment* (jika ini pertama kalimu):
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
5.  Siapkan "Gudang" (Database) - *Tugas Tim Database*:
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
* **Backend** di `localhost:8000`
* **Frontend** di `localhost:5173`

Frontend akan otomatis "memesan" ke Backend. Kamu bisa buka `http://localhost:5173` di browser-mu untuk melihat aplikasinya.
