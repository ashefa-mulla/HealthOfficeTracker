import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface MenuProps {
  t?: (key: string) => string;
  collapsed?: boolean;
  onItemClick?: () => void;
}

const AdminMenu: React.FC<MenuProps> = ({ t = (s: string) => s, collapsed = false, onItemClick }) => {
  const location = useLocation();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({
    clients: location.pathname.startsWith('/area/client') || location.pathname.startsWith('/area/project') || location.pathname.startsWith('/area/category'),
    accounts: location.pathname.startsWith('/area/accountcategory') || location.pathname.startsWith('/area/vendoraccount') || location.pathname.startsWith('/area/bankmaster') || location.pathname.startsWith('/area/purchaseorder') || location.pathname.startsWith('/area/chequerequest'),
    attendance: location.pathname.startsWith('/attendance'),
    hr: location.pathname.startsWith('/area/leavemanagement') || location.pathname.startsWith('/area/leavetransaction') || location.pathname.startsWith('/area/employeeattendance') || location.pathname.startsWith('/area/allowancemaster'),
    tasks: location.pathname.startsWith('/tasks'),
    reports: location.pathname.startsWith('/reports'),
  });

  const toggleSubMenu = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <li className="menu-title">{t('Main Navigation')}</li>
      <li className="menu-item">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          onClick={onItemClick}
        >
          <i className="mdi mdi-view-dashboard-outline"></i>
          <span>{t('Dashboard')}</span>
        </NavLink>
      </li>

      <li className="menu-title">{t('Management')}</li>

      {/* Users */}
      <li className="menu-item">
        <NavLink
          to="/area/employee/list"
          className={({ isActive }) => `menu-link ${isActive || location.pathname === '/area/employee' || location.pathname.startsWith('/area/employee/') ? 'active' : ''}`}
          onClick={onItemClick}
        >
          <i className="mdi mdi-account-group-outline"></i>
          <span>{t('Users')}</span>
        </NavLink>
      </li>

      {/* Client Menu with Submenu */}
      <li className={`menu-item has-submenu ${openSubMenus.clients ? 'mm-active' : ''}`}>
        <a
          href="#clients"
          className={`menu-link has-arrow ${location.pathname.startsWith('/area/client') || location.pathname.startsWith('/area/project') || location.pathname.startsWith('/area/category') ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('clients', e)}
          title={collapsed ? t('Client') : undefined}
        >
          <i className="mdi mdi-domain"></i>
          {!collapsed && (
            <>
              <span>{t('Client')}</span>
              <i className={`mdi ${openSubMenus.clients ? 'mdi-chevron-down' : 'mdi-chevron-right'} menu-arrow`}></i>
            </>
          )}
        </a>
        {(openSubMenus.clients || collapsed) && (
          <ul className="sub-menu">
            <li className="sub-menu-title">{t('Client')}</li>
            <li>
              <NavLink
                to="/area/client/list"
                className={() => `sub-menu-link ${location.pathname.startsWith('/area/client') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Client')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/area/project/list"
                className={() => `sub-menu-link ${location.pathname.startsWith('/area/project') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Project')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/area/category/list"
                className={() => `sub-menu-link ${location.pathname.startsWith('/area/category') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Category')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* Accounts Menu with Submenu */}
      <li className={`menu-item has-submenu ${openSubMenus.accounts ? 'mm-active' : ''}`}>
        <a
          href="#accounts"
          className={`menu-link has-arrow ${location.pathname.startsWith('/area/accountcategory') || location.pathname.startsWith('/area/vendoraccount') || location.pathname.startsWith('/area/bankmaster') || location.pathname.startsWith('/area/purchaseorder') || location.pathname.startsWith('/area/chequerequest') ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('accounts', e)}
          title={collapsed ? t('Accounts') : undefined}
        >
          <i className="mdi mdi-calculator-variant-outline"></i>
          {!collapsed && (
            <>
              <span>{t('Accounts')}</span>
              <i className={`mdi ${openSubMenus.accounts ? 'mdi-chevron-down' : 'mdi-chevron-right'} menu-arrow`}></i>
            </>
          )}
        </a>
        {(openSubMenus.accounts || collapsed) && (
          <ul className="sub-menu">
            <li className="sub-menu-title">{t('Accounts')}</li>
            <li>
              <NavLink
                to="/area/accountcategory/list"
                className={() => `sub-menu-link ${location.pathname.startsWith('/area/accountcategory') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Account Category')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/area/vendoraccount/list"
                className={() => `sub-menu-link ${location.pathname.startsWith('/area/vendoraccount') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Vendor Account')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/area/bankmaster/list"
                className={() => `sub-menu-link ${location.pathname.startsWith('/area/bankmaster') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Bank Master')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/area/purchaseorder/list"
                className={() => `sub-menu-link ${location.pathname.startsWith('/area/purchaseorder') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Purchase Order')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/area/chequerequest/list"
                className={() => `sub-menu-link ${location.pathname.startsWith('/area/chequerequest') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Cheque Request')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* User Activities (admin: all users, add/edit/delete) */}
      <li className="menu-item">
        <NavLink
          to="/area/taskactivity"
          className={({ isActive }) => `menu-link ${isActive || location.pathname.startsWith('/area/taskactivity') ? 'active' : ''}`}
          onClick={onItemClick}
        >
          <i className="mdi mdi-history"></i>
          <span>{t('User Activities')}</span>
        </NavLink>
      </li>

      {/* Tasks (admin) */}
      <li className="menu-item">
        <NavLink
          to="/tasks"
          className={({ isActive }) => `menu-link ${isActive || location.pathname.startsWith('/tasks') ? 'active' : ''}`}
          onClick={onItemClick}
        >
          <i className="mdi mdi-clipboard-text-outline"></i>
          <span>{t('Tracker Tasks')}</span>
        </NavLink>
      </li>

      {/* Evaluation (admin) */}
      <li className="menu-item">
        <NavLink
          to="/area/evaluation/list"
          className={({ isActive }) => `menu-link ${isActive || location.pathname.startsWith('/area/evaluation') ? 'active' : ''}`}
          onClick={onItemClick}
        >
          <i className="mdi mdi-clipboard-check-outline"></i>
          <span>{t('Evaluation')}</span>
        </NavLink>
      </li>

      {/* HR Management with Submenu */}
      <li className={`menu-item has-submenu ${openSubMenus.hr ? 'mm-active' : ''}`}>
        <a
          href="#hr-management"
          className={`menu-link has-arrow ${openSubMenus.hr ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('hr', e)}
          title={collapsed ? t('HR Management') : undefined}
        >
          <i className="mdi mdi-account-tie-outline"></i>
          {!collapsed && (
            <>
              <span>{t('HR Management')}</span>
              <i className={`mdi ${openSubMenus.hr ? 'mdi-chevron-down' : 'mdi-chevron-right'} menu-arrow`}></i>
            </>
          )}
        </a>
        {(openSubMenus.hr || collapsed) && (
          <ul className="sub-menu">
            <li className="sub-menu-title">{t('HR Management')}</li>
            <li>
              <NavLink
                to="/area/leavemanagement"
                className={() => `sub-menu-link ${location.pathname.startsWith('/area/leavemanagement') || location.pathname.startsWith('/area/leavetransaction') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Leave Management')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/area/employeeattendance/list"
                className={() => `sub-menu-link ${location.pathname.startsWith('/area/employeeattendance') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Employee Attendance')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/area/allowancemaster/list"
                className={() => `sub-menu-link ${location.pathname.startsWith('/area/allowancemaster') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Allowance Master')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>
  


      <li className="menu-title">{t('Analytics & Setup')}</li>
  {/* Reports & Analytics with Submenu */}
 <li className="menu-item">
        <NavLink
          to="/reports"
          className={({ isActive }) => `menu-link ${isActive || location.pathname.startsWith('/area/reports') ? 'active' : ''}`}
          onClick={onItemClick}
        >
          <i className="mdi mdi-chart-box-outline"></i>
          <span>{t('Reports & Analytics')}</span>
        </NavLink>
      </li>
  
     

      {/* System Settings */}
      {/* <li className="menu-item">
        <NavLink
          to="/settings"
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          onClick={onItemClick}
        >
          <i className="mdi mdi-cog-outline"></i>
          <span>{t('System Settings')}</span>
        </NavLink>
      </li> */}
    </>
  );
};

export default AdminMenu;
