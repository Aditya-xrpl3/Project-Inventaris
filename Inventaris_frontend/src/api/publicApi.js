import axios from "axios";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const baseURL = isLocal || window.location.hostname.includes("192.168")
  ? `${window.location.protocol}//${window.location.hostname}:8000`
  : "/";

const publicApi = axios.create({
  baseURL: baseURL,
  // Hapus header Content-Type manual agar tidak bug saat upload foto nanti
});

export default publicApi;