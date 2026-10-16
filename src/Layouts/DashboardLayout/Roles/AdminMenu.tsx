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
          title={collapsed ? t('Dashboard') : undefined}
        >
          <i className="mdi mdi-view-dashboard-outline"></i>
          {!collapsed && <span>{t('Dashboard')}</span>}
        </NavLink>
      </li>

      <li className="menu-title">{t('Management')}</li>

      {/* Users */}
      <li className="menu-item">
        <NavLink
          to="/area/employee/list"
          className={({ isActive }) => `menu-link ${isActive || location.pathname.startsWith('/area/employee') ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('Users') : undefined}
        >
          <i className="mdi mdi-account-group-outline"></i>
          {!collapsed && <span>{t('Users')}</span>}
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
        {!collapsed && openSubMenus.clients && (
          <ul className="sub-menu">
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
        {!collapsed && openSubMenus.accounts && (
          <ul className="sub-menu">
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

      {/* Time & Attendance Menu with Submenu */}
      <li className={`menu-item has-submenu ${openSubMenus.attendance ? 'mm-active' : ''}`}>
        <a
          href="#attendance"
          className={`menu-link has-arrow ${location.pathname.startsWith('/attendance') ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('attendance', e)}
          title={collapsed ? t('Time & Attendance') : undefined}
        >
          <i className="mdi mdi-clock-check-outline"></i>
          {!collapsed && (
            <>
              <span>{t('Time & Attendance')}</span>
              <i className={`mdi ${openSubMenus.attendance ? 'mdi-chevron-down' : 'mdi-chevron-right'} menu-arrow`}></i>
            </>
          )}
        </a>
        {!collapsed && openSubMenus.attendance && (
          <ul className="sub-menu">
            <li>
              <NavLink
                to="/attendance"
                end
                className={({ isActive }) => `sub-menu-link ${isActive && !location.search ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Daily Timesheets')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/timer"
                className={({ isActive }) => `sub-menu-link ${isActive || location.pathname === '/timer' || location.search.includes('clock') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Time Clock (Timer)')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/attendance?tab=live"
                className={() => `sub-menu-link ${location.search.includes('live') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Live Tracking')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* Tasks & Projects with Submenu */}
      <li className={`menu-item has-submenu ${openSubMenus.tasks ? 'mm-active' : ''}`}>
        <a
          href="#tasks"
          className={`menu-link has-arrow ${location.pathname.startsWith('/tasks') ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('tasks', e)}
          title={collapsed ? t('Tasks & Projects') : undefined}
        >
          <i className="mdi mdi-clipboard-text-outline"></i>
          {!collapsed && (
            <>
              <span>{t('Tasks & Projects')}</span>
              <i className={`mdi ${openSubMenus.tasks ? 'mdi-chevron-down' : 'mdi-chevron-right'} menu-arrow`}></i>
            </>
          )}
        </a>
        {!collapsed && openSubMenus.tasks && (
          <ul className="sub-menu">
            <li>
              <NavLink
                to="/tasks"
                end
                className={({ isActive }) => `sub-menu-link ${isActive && !location.search ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('All Tasks')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tasks?tab=projects"
                className={() => `sub-menu-link ${location.search.includes('projects') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Active Projects')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* Apply Leave (admin: all employees, add/edit/delete) */}
      <li className="menu-item">
        <NavLink
          to="/area/leavetransaction/list"
          className={({ isActive }) => `menu-link ${isActive || location.pathname.startsWith('/area/leavetransaction') ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('Apply Leave') : undefined}
        >
          <i className="mdi mdi-calendar-account-outline"></i>
          {!collapsed && <span>{t('Apply Leave')}</span>}
        </NavLink>
      </li>

      {/* Evaluation (admin) */}
      <li className="menu-item">
        <NavLink
          to="/area/evaluation/list"
          className={({ isActive }) => `menu-link ${isActive || location.pathname.startsWith('/area/evaluation') ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('Evaluation') : undefined}
        >
          <i className="mdi mdi-clipboard-check-outline"></i>
          {!collapsed && <span>{t('Evaluation')}</span>}
        </NavLink>
      </li>

      {/* Office Locations */}
      <li className="menu-item">
        <NavLink
          to="/locations"
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('Office Locations') : undefined}
        >
          <i className="mdi mdi-office-building-outline"></i>
          {!collapsed && <span>{t('Office Locations')}</span>}
        </NavLink>
      </li>

      <li className="menu-title">{t('Analytics & Setup')}</li>

      {/* Reports & Analytics with Submenu */}
      <li className={`menu-item has-submenu ${openSubMenus.reports ? 'mm-active' : ''}`}>
        <a
          href="#reports"
          className={`menu-link has-arrow ${location.pathname.startsWith('/reports') ? 'active' : ''}`}
          onClick={(e) => toggleSubMenu('reports', e)}
          title={collapsed ? t('Reports & Analytics') : undefined}
        >
          <i className="mdi mdi-chart-box-outline"></i>
          {!collapsed && (
            <>
              <span>{t('Reports & Analytics')}</span>
              <i className={`mdi ${openSubMenus.reports ? 'mdi-chevron-down' : 'mdi-chevron-right'} menu-arrow`}></i>
            </>
          )}
        </a>
        {!collapsed && openSubMenus.reports && (
          <ul className="sub-menu">
            <li>
              <NavLink
                to="/reports"
                end
                className={({ isActive }) => `sub-menu-link ${isActive && !location.search ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Attendance Summary')}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reports?tab=productivity"
                className={() => `sub-menu-link ${location.search.includes('productivity') ? 'active' : ''}`}
                onClick={onItemClick}
              >
                {t('Productivity Analytics')}
              </NavLink>
            </li>
          </ul>
        )}
      </li>

      {/* System Settings */}
      <li className="menu-item">
        <NavLink
          to="/settings"
          className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
          onClick={onItemClick}
          title={collapsed ? t('System Settings') : undefined}
        >
          <i className="mdi mdi-cog-outline"></i>
          {!collapsed && <span>{t('System Settings')}</span>}
        </NavLink>
      </li>
    </>
  );
};

export default AdminMenu;
