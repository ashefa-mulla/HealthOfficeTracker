import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuthStore } from '../../store/useAuthStore';
import './layout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, profileInfo } = useAuthStore();
  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');
  const userProfile = profileInfo || JSON.parse(localStorage.getItem('userProfile') || '{}');

  const toggleSidebar = () => {
    if (window.innerWidth <= 992) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        user={authUser}
        profileInfo={userProfile}
      />

      <div className={`app-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Header onToggleSidebar={toggleSidebar} user={authUser} profileInfo={userProfile} />

        <main className="page-body">{children}</main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
