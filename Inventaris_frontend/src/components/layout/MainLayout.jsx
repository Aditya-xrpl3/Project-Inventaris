import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-50 font-sans text-surface-900 selection:bg-primary-100 selection:text-primary-900">
      <Sidebar />
      <main className="lg:pl-72 min-h-screen">
        <div className="container mx-auto p-4 lg:p-8 pt-20 lg:pt-8 bg-hero-pattern">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
