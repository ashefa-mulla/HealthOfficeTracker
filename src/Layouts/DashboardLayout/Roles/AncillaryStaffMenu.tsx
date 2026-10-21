// import React from "react";
// import { Link } from "react-router-dom";

// const AncillaryStaffMenu = (props: any) => {
//   return (
//     <>
//       <li className="menu-title">{props.t ? props.t("Menu") : "Menu"} </li>
//       <li>
//         <Link to="/dashboard" onClick={props.onItemClick}>
//           <i className="bx bx-home-circle"></i>
//           <span>{props.t ? props.t("Dashboard") : "Dashboard"}</span>
//         </Link>
//       </li>
//       <li>
//         <Link to="/timer" onClick={props.onItemClick}>
//           <i className="bx bx-time-five"></i>
//           <span>{props.t ? props.t("Clock In / Out") : "Clock In / Out"}</span>
//         </Link>
//       </li>
//       <li>
//         <Link to="/area/top10task/list" onClick={props.onItemClick}>
//           <i className="mdi mdi-clipboard-text-outline"></i>
//           <span>{props.t ? props.t("My Tracker Task") : "My Tracker Task"}</span>
//         </Link>
//       </li>
//       <li>
//         <Link to="/area/taskactivity" onClick={props.onItemClick}>
//           <i className="mdi mdi-history"></i>
//           <span>{props.t ? props.t("My Activities") : "My Activities"}</span>
//         </Link>
//       </li>
//       <li>
//         <Link to="/area/dailytodo" onClick={props.onItemClick}>
//           <i className="mdi mdi-checkbox-marked-circle-outline"></i>
//           <span>{props.t ? props.t("Daily To-do") : "Daily To-do"}</span>
//         </Link>
//       </li>
//       <li>
//         <Link to="/area/leavetransaction/list" onClick={props.onItemClick}>
//           <i className="mdi mdi-calendar-account-outline"></i>
//           <span>{props.t ? props.t("Apply Leave") : "Apply Leave"}</span>
//         </Link>
//       </li>
//       <li>
//         <Link to="/area/evaluation-submission" onClick={props.onItemClick}>
//           <i className="mdi mdi-clipboard-check-outline"></i>
//           <span>{props.t ? props.t("Evaluation") : "Evaluation"}</span>
//         </Link>
//       </li>
//     </>
//   );
// };

// export default AncillaryStaffMenu;
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface MenuProps {
  t?: (key: string) => string;
  collapsed?: boolean;
  onItemClick?: () => void;
}

const ANALYTICS_PATHS = ['/reports', '/area/leavetransaction'];
const ACCOUNTS_PATHS = [
  '/area/accountcategory',
  '/area/vendoraccount',
  '/area/bankmaster',
  '/area/purchaseorder',
  '/area/chequerequest',
];

const startsWithAny = (pathname: string, paths: string[]) =>
  paths.some((p) => pathname.startsWith(p));

/**
 * Menu for Ancillary Staff (user type 7), following the old Angular menu:
 * Dashboard, Clock In/Out, Analytics, My Tracker Task, Accounts, Daily To-do, Evaluation.
 */
const AncillaryMenu: React.FC<MenuProps> = ({ t = (s: string) => s, collapsed = false, onItemClick }) => {
  const location = useLocation();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({
    analytics: startsWithAny(location.pathname, ANALYTICS_PATHS),
    accounts: startsWithAny(location.pathname, ACCOUNTS_PATHS),
  });

  const toggleSubMenu = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenSubMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /** Single menu link */
  const link = (to: string, icon: string, label: string, matchPrefix?: string) => (
    <li className="menu-item">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `menu-link ${isActive || (matchPrefix && location.pathname.startsWith(matchPrefix)) ? 'active' : ''}`
        }
        onClick={onItemClick}
        title={collapsed ? t(label) : undefined}
      >
        <i className={`mdi ${icon}`}></i>
        {!collapsed && <span>{t(label)}</span>}
      </NavLink>
    </li>
  );

  /** Sub menu link */
  const subLink = (to: string, label: string, matchPrefix: string) => (
    <li>
      <NavLink
        to={to}
        className={() => `sub-menu-link ${location.pathname.startsWith(matchPrefix) ? 'active' : ''}`}
        onClick={onItemClick}
      >
        {t(label)}
      </NavLink>
    </li>
  );

  /** Parent item with a collapsible sub menu */
  const group = (
    key: string,
    icon: string,
    label: string,
    paths: string[],
    children: React.ReactNode
  ) => (
    <li className={`menu-item has-submenu ${openSubMenus[key] ? 'mm-active' : ''}`}>
      <a
        href={`#${key}`}
        className={`menu-link has-arrow ${startsWithAny(location.pathname, paths) ? 'active' : ''}`}
        onClick={(e) => toggleSubMenu(key, e)}
        title={collapsed ? t(label) : undefined}
      >
        <i className={`mdi ${icon}`}></i>
        {!collapsed && (
          <>
            <span>{t(label)}</span>
            <i className={`mdi ${openSubMenus[key] ? 'mdi-chevron-down' : 'mdi-chevron-right'} menu-arrow`}></i>
          </>
        )}
      </a>
      {openSubMenus[key] && <ul className="sub-menu">{children}</ul>}
    </li>
  );

  return (
    <>
      <li className="menu-title">{t('Main Navigation')}</li>
      {link('/dashboard', 'mdi-view-dashboard-outline', 'Dashboard')}

      <li className="menu-title">{t('My Work')}</li>
      {link('/timer', 'mdi-clock-outline', 'Clock In / Out')}

      {link('/area/top10task/list', 'mdi-clipboard-text-outline', 'My Tracker Task', '/area/top10task')}
      {link('/area/taskactivity', 'mdi-history', 'My Activities', '/area/taskactivity')}

      {group(
        'accounts',
        'mdi-calculator-variant-outline',
        'Accounts',
        ACCOUNTS_PATHS,
        <>
          {subLink('/area/accountcategory/list', 'Account Category', '/area/accountcategory')}
          {subLink('/area/vendoraccount/list', 'Vendor Account', '/area/vendoraccount')}
          {subLink('/area/bankmaster/list', 'Bank Master', '/area/bankmaster')}
          {subLink('/area/purchaseorder/list', 'Purchase Order', '/area/purchaseorder')}
          {subLink('/area/chequerequest/list', 'Cheque Request', '/area/chequerequest')}
        </>
      )}

      {link('/area/dailytodo', 'mdi-checkbox-marked-circle-outline', 'Daily To-do', '/area/dailytodo')}
      {link('/area/evaluation/list', 'mdi-clipboard-check-outline', 'Evaluation', '/area/evaluation')}

      {group(
        'analytics',
        'mdi-chart-box-outline',
        'Analytics',
        ANALYTICS_PATHS,
        <>
          {subLink('/reports', 'Reports', '/reports')}
          {subLink('/area/leavetransaction/list', 'Apply Leave', '/area/leavetransaction')}
        </>
      )}
    </>
  );
};

export default AncillaryMenu;

