import axios from "axios";

const publicApi = axios.create({
  // Pastikan backend jalan di port 8000
  baseURL: "http://localhost:8000", 
  // Hapus header Content-Type manual agar tidak bug saat upload foto nanti
});

export default publicApi;