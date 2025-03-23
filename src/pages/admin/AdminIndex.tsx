
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import UsersManagement from '@/pages/admin/UsersManagement';
import AnnouncementsManagement from '@/pages/admin/AnnouncementsManagement';

const AdminIndex: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="announcements" element={<AnnouncementsManagement />} />
        {/* ستضاف المزيد من الصفحات الإدارية لاحقاً */}
      </Route>
    </Routes>
  );
};

export default AdminIndex;
