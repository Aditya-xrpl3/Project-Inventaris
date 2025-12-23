import axios from "axios";

const publicApi = axios.create({
  // Gunakan hostname yang sama dengan frontend (agar bisa diakses dari HP via IP)
  // Asumsi backend jalan di port 8000
  baseURL: `${window.location.protocol}//${window.location.hostname}:8000`,
  // Hapus header Content-Type manual agar tidak bug saat upload foto nanti
});

export default publicApi;