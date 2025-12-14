import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ScanPage from './pages/user/ScanPage.jsx';
// import NotFound from './pages/user/NotFound.jsx';
import BarangDetail from './pages/user/BarangDetail.jsx';
import LaporBarang from './pages/user/LaporBarang.jsx';
import './index.css'
import BarangList from './pages/admin/BarangList.jsx';
import TambahBarang from './pages/admin/TambahBarang.jsx';
import EditBarang from './pages/admin/EditBarang.jsx';
import HapusBarang from './pages/admin/HapusBarang.jsx';
import MejaPage from './pages/admin/MejaPage.jsx';
import MejaDetail from './pages/admin/MejaDetail.jsx';
import KategoriPage from './pages/admin/KategoriPage.jsx';
import LaporanPage from './pages/admin/LaporanPage.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <NotFound />,
    children: [
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/register",
        element: <RegisterPage />
      },
      {
        path: "/",
        element: <ScanPage />
      },
      {
        path: "/dashboard",
        element: <AdminDashboard />
      },
      {
        path: "/barang",
        element: <BarangList/>
      },
      {
        path: "/edit/:id",
        element: <EditBarang/>
      },
      {
        path: "/hapus/:id",
        element: <HapusBarang/>
      },
      {
        path: "/tambah",
        element: <TambahBarang/>
      },
      {
        path: "/kategori",
        element: <KategoriPage/>
      },
      {
        path: "/meja",
        element: <MejaPage/>
      },
      {
        path: "/meja/:id",
        element: <MejaDetail/>
      },
      {
        path: "/laporan",
        element: <LaporanPage/>
      },
      {
        path: "/lapor/:id",
        element: <LaporBarang/>
      },
      {
        path: "/detail/:id",
        element: <BarangDetail/>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);