import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface MenuProps {
  t?: (key: string) => string;
  collapsed?: boolean;
  onItemClick?: () => void;
}

const EmployeeMenu: React.FC<MenuProps> = ({
  t = (s: string) => s,
  collapsed = false,
  onItemClick,
}) => {
  const location = useLocation();

  const menuItems = [
    {
      to: '/dashboard',
      icon: 'bx bx-home-circle',
      label: 'Dashboard',
      isActive: location.pathname === '/dashboard',
    },
    {
      to: '/timer',
      icon: 'bx bx-time-five',
      label: 'Clock In / Out',
      isActive: location.pathname.startsWith('/timer'),
    },
    {
      to: '/area/top10task/list',
      icon: 'mdi mdi-clipboard-text-outline',
      label: 'My Tracker Task',
      isActive: location.pathname.startsWith('/area/top10task'),
    },
    {
      to: '/area/taskactivity',
      icon: 'mdi mdi-history',
      label: 'My Activities',
      isActive: location.pathname.startsWith('/area/taskactivity'),
    },
    {
      to: '/area/dailytodo',
      icon: 'mdi mdi-checkbox-marked-circle-outline',
      label: 'Daily To-do',
      isActive: location.pathname.startsWith('/area/dailytodo'),
    },
    {
      to: '/area/leavetransaction/list',
      icon: 'mdi mdi-calendar-account-outline',
      label: 'Apply Leave',
      isActive: location.pathname.startsWith('/area/leavetransaction'),
    },
    {
      to: '/area/evaluation/list',
      icon: 'mdi mdi-clipboard-check-outline',
      label: 'Evaluation',
      isActive: location.pathname.startsWith('/area/evaluation'),
    },
  ];

  return (
    <>
      {!collapsed && <li className="menu-title">{t('Menu')}</li>}
      {menuItems.map((item) => (
        <li className="menu-item" key={item.to}>
          <NavLink
            to={item.to}
            className={`menu-link ${item.isActive ? 'active' : ''}`}
            onClick={onItemClick}
          >
            <i className={item.icon}></i>
            <span>{t(item.label)}</span>
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default EmployeeMenu;
