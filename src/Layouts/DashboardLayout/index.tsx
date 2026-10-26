import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuthStore } from '../../store/useAuthStore';
import { getJwtFullName } from '../../helpers/tokenHelper';
import employeeService from '../../services/employeeService';
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

  // Automatically enrich userProfile with full name from JWT claim and employee record
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    const jwtFullName = getJwtFullName(token);

    if (jwtFullName && (!userProfile?.firstName || !userProfile?.fullName)) {
      const parts = jwtFullName.trim().split(/\s+/);
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';
      const updatedProfile = {
        ...(userProfile || {}),
        fullName: jwtFullName.trim(),
        firstName,
        lastName,
      };
      useAuthStore.getState().setProfileInfo(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      localStorage.setItem('fullName', jwtFullName.trim());
      localStorage.setItem('displayName', jwtFullName.trim());
    }

    // Also fetch full employee profile to get official photo & details if employeeId exists
    const employeeId =
      userProfile?.employeeId ??
      userProfile?.EmployeeId ??
      Number(localStorage.getItem('employeeid') || 0);

    if (employeeId > 0 && (!userProfile?.firstName || !userProfile?.lastName)) {
      employeeService
        .getEmployee(employeeId)
        .then((emp) => {
          if (emp) {
            const empFirstName = emp.firstname || emp.firstName || '';
            const empLastName = emp.lastname || emp.lastName || '';
            const empFullName =
              `${empFirstName} ${empLastName}`.trim() || jwtFullName || '';
            const empProfileImage =
              emp.profileimage || emp.profileImage || userProfile?.profileImage;

            const enriched = {
              ...(userProfile || {}),
              firstName: empFirstName || userProfile?.firstName,
              lastName: empLastName || userProfile?.lastName,
              fullName: empFullName || userProfile?.fullName,
              profileImage: empProfileImage,
            };
            useAuthStore.getState().setProfileInfo(enriched);
            localStorage.setItem('userProfile', JSON.stringify(enriched));
            if (empFullName) {
              localStorage.setItem('fullName', empFullName);
              localStorage.setItem('displayName', empFullName);
            }
            if (empProfileImage) {
              localStorage.setItem('Profileimage', empProfileImage);
            }
          }
        })
        .catch((err) => {
          console.warn('[DashboardLayout] Could not enrich profile from employee service:', err);
        });
    }
  }, []);

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
