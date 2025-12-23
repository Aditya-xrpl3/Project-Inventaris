import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';

// Existing Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ScanPage from './pages/user/ScanPage.jsx';
import BarangDetail from './pages/user/BarangDetail.jsx';
import LaporBarang from './pages/user/LaporBarang.jsx';
import BarangList from './pages/admin/BarangList.jsx';
import TambahBarang from './pages/admin/TambahBarang.jsx';
import EditBarang from './pages/admin/EditBarang.jsx';
import HapusBarang from './pages/admin/HapusBarang.jsx';
import MejaPage from './pages/admin/MejaPage.jsx';
import MejaDetail from './pages/admin/MejaDetail.jsx';
import KategoriPage from './pages/admin/KategoriPage.jsx';
import LaporanPage from './pages/admin/LaporanPage.jsx';

import { ProtectedRoute } from './components/auth/ProtectedRoute';

const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: "/",
    element: <ScanPage />, // Default is Scan Page
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  
  // PUBLIC OR PROTECTED? Lapor Barang probably needs token if logic requires it, 
  // but if it's from ScanPage (public), maybe it should be public?
  // Let's assume Public for now based on context, or Protected if it saves User.
  // For now let's keep it parallel.
  {
    path: "/lapor/:id",
    element: <LaporBarang/>
  },
  {
    path: "/detail/:id",
    element: <BarangDetail/>
  },

  // PROTECTED ADMIN ROUTES
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "barang",
        element: <BarangList/>
      },
      {
        path: "edit/:id",
        element: <EditBarang/>
      },
      {
        path: "hapus/:id",
        element: <HapusBarang/>
      },
      {
        path: "tambah",
        element: <TambahBarang/>
      },
      {
        path: "kategori",
        element: <KategoriPage/>
      },
      {
        path: "meja",
        element: <MejaPage/>
      },
      {
        path: "meja/:id",
        element: <MejaDetail/>
      },
      {
        path: "laporan",
        element: <LaporanPage/>
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);