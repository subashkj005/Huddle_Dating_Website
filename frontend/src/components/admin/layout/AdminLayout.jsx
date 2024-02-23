import React from "react";
import { Outlet } from 'react-router-dom'
import AdminSidebar from "../sidebar/AdminSidebar";
import AdminHeader from "../main/header/AdminHeader";

function AdminLayout() {
  return (
    <>
      <AdminSidebar />
      <main className="w-[calc(100% -256px)] ml-64 bg-gray-50 min-h-screen">
        <AdminHeader />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default AdminLayout;
