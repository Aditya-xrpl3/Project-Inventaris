**API Endpoints - Inventaris Lab**

Ringkasan singkat: base path API pada proyek ini memakai prefix `/api/`. Gunakan header Authorization Bearer untuk request yang memerlukan otentikasi.

- **Auth (JWT)**

  - POST `/api/token/` -- Ambil access & refresh token menggunakan username/password.
    - Request (application/json):
      {
      "username": "admin",
      "password": "hunter2"
      }
    - Response 200:
      {
      "access": "<jwt-access-token>",
      "refresh": "<jwt-refresh-token>"
      }
  - NOTE: ada juga endpoint `/auth/login/` yang disediakan project lama — prefer gunakan JWT `/api/token/` untuk konsistensi.

- **User**

  - GET `/api/user/me/` (auth required)
    - Response 200:
      {
      "id": 5,
      "username": "adi",
      "first_name": "Adi",
      "last_name": "Putra",
      "is_staff": true,
      "groups": [{"name": "Admin Inventaris"}]
      }
    - Catatan: `groups` membantu frontend menampilkan UI admin/regular.

- **Meja / Lokasi**

  - GET `/api/meja/` (public GET) — daftar meja.
    - Response: array meja (id, nama_meja, lokasi).
  - GET `/api/meja/<id>/` (public) — detail meja termasuk daftar barang di meja tersebut.
    - Response 200:
      {
      "id": 3,
      "nama_meja": "Meja Komputer 1",
      "lokasi": "Lab Jaringan - Lantai 2",
      "barang_set": [
      {"id": 12, "nama_barang": "Keyboard", "status_barang": "tersedia"},
      {"id": 13, "nama_barang": "Mouse", "status_barang": "rusak"}
      ]
      }
    - Catatan: endpoint ini cocok untuk fungsi scan QR — frontend hanya perlu `GET /api/meja/<id>/`.

- **Barang (Admin)**

  - GET `/api/barang/` (admin only) — daftar barang (format read).
  - POST `/api/barang/` (admin only) — buat barang baru.
    - Request body (application/json):
      {
      "kode_barang": "BRG-001",
      "nama_barang": "Proyektor",
      "jenis": 2, # id JenisBarang
      "meja": 3, # id Meja
      "status_barang": "tersedia"
      }
  - PATCH `/api/barang/<id>/` (admin only) — ubah fields (mis. pindah meja atau ubah status).
    - Jika `meja` berubah, sistem otomatis menyimpan `BarangLog`.

- **BarangLog (Admin)**

  - GET `/api/baranglog/` (admin only) — riwayat pemindahan barang.

- **Laporan Kerusakan**

  - POST `/api/lapor/` (public) — buat laporan kerusakan (anonymous allowed).

    - Request body (application/json):
      {
      "barang": 13, # id Barang
      "deskripsi": "LCD pecah",
      "foto_url": "https://.../img.jpg" # optional
      }
    - Response 201: object laporan.
    - Validasi penting: tidak boleh membuat laporan baru untuk barang yang sudah memiliki laporan dengan status `pending`.

  - GET `/api/laporan/` (admin only) — daftar semua laporan. Setiap item menyertakan dua field bantu:

    - `barang_detail`: {id, nama_barang}
    - `pelapor`: {id, username} atau `null` kalau anonymous

  - GET `/api/laporan/saya/` (auth required) — daftar laporan yang dibuat oleh user terautentikasi.

  - PATCH `/api/laporan/<id>/status/` (admin only)
    - Request body example:
      { "status_laporan": "diperbaiki" }
    - Valid values: `pending`, `diperbaiki`, `selesai`
    - Response: updated laporan object.

Authentication header

- Untuk endpoint yang memerlukan otentikasi sertakan header:

  Authorization: Bearer <access_token>

Contoh curl singkat

- Ambil token:

  curl -X POST -H "Content-Type: application/json" \
   -d '{"username":"admin","password":"pass"}' \
   http://localhost:8000/api/token/

- Scan meja (public):

  curl http://localhost:8000/api/meja/3/

- Buat laporan (public):

  curl -X POST -H "Content-Type: application/json" \
   -d '{"barang":13,"deskripsi":"Rusak","foto_url":""}' \
   http://localhost:8000/api/lapor/

- Ambil laporan saya (auth):

  curl -H "Authorization: Bearer <token>" http://localhost:8000/api/laporan/saya/

Notes / Catatan pengembang

- Endpoint yang wajib diketahui oleh frontend:
  - Public scan: `GET /api/meja/<id>/` (detail meja + barang)
  - Buat laporan: `POST /api/lapor/` (anonymous allowed)
  - Login/admin: gunakan JWT `POST /api/token/` lalu `GET /api/user/me/` untuk tahu role
  - Admin: manage laporan (`/api/laporan/`) dan ubah status (`/api/laporan/<id>/status/`)
