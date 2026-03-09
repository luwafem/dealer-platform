import React, { useEffect } from 'react';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <AdminDashboard />;
};

export default AdminPage;