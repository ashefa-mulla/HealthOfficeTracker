/**
 * Menu Constants for HO Tracker (Virtual Office Tracker)
 * Role-based and user-wise menu definitions modeled after Angular constants/menu.ts
 * and VirtualClinic-React VerticalLayout architecture.
 */

export interface MenuItem {
  id?: string;
  label: string;
  icon?: string;
  link?: string;
  subItems?: MenuItem[];
  isTitle?: boolean;
  badge?: {
    variant: string;
    text: string;
  };
  userTypes?: number[];
  parentId?: string;
  isCollapsed?: boolean;
}

export const USER_TYPES = {
  ADMIN: 1,
  MANAGER: 2,
  EMPLOYEE: 3,
  SUPER_ADMIN: 4,
  ORG_ADMIN: 12,
  SUB_ADMIN: 13,
} as const;

// 1. Admin / Employer / SuperAdmin Menu (utype: 1, 4, 12)
export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    isTitle: true,
    label: 'Main Navigation',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'mdi mdi-view-dashboard-outline',
    link: '/dashboard',
    userTypes: [USER_TYPES.ADMIN, USER_TYPES.SUPER_ADMIN, USER_TYPES.ORG_ADMIN],
  },
  {
    isTitle: true,
    label: 'Management',
  },
  {
    id: 'employees',
    label: 'Employees & Teams',
    icon: 'mdi mdi-account-group-outline',
    link: '/employees',
    userTypes: [USER_TYPES.ADMIN, USER_TYPES.SUPER_ADMIN, USER_TYPES.ORG_ADMIN],
    subItems: [
      {
        id: 'all-employees',
        label: 'All Employees',
        link: '/employees',
      },
      {
        id: 'teams',
        label: 'Teams & Departments',
        link: '/employees?tab=teams',
      },
    ],
  },
  {
    id: 'attendance',
    label: 'Time & Attendance',
    icon: 'mdi mdi-clock-check-outline',
    link: '/attendance',
    userTypes: [USER_TYPES.ADMIN, USER_TYPES.SUPER_ADMIN, USER_TYPES.ORG_ADMIN],
    subItems: [
      {
        id: 'timesheet',
        label: 'Timesheets',
        link: '/attendance',
      },
      {
        id: 'live-tracking',
        label: 'Live Tracking',
        link: '/attendance?tab=live',
      },
      {
        id: 'shift-logs',
        label: 'Shift Logs',
        link: '/attendance?tab=shifts',
      },
    ],
  },
  {
    id: 'tasks',
    label: 'Tasks & Projects',
    icon: 'mdi mdi-clipboard-text-outline',
    link: '/tasks',
    userTypes: [USER_TYPES.ADMIN, USER_TYPES.SUPER_ADMIN, USER_TYPES.ORG_ADMIN],
    subItems: [
      {
        id: 'all-tasks',
        label: 'All Tasks',
        link: '/tasks',
      },
      {
        id: 'projects',
        label: 'Active Projects',
        link: '/tasks?tab=projects',
      },
    ],
  },
  {
    id: 'locations',
    label: 'Office Locations',
    icon: 'mdi mdi-office-building-outline',
    link: '/locations',
    userTypes: [USER_TYPES.ADMIN, USER_TYPES.SUPER_ADMIN, USER_TYPES.ORG_ADMIN],
  },
  {
    isTitle: true,
    label: 'Analytics & Setup',
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: 'mdi mdi-chart-box-outline',
    link: '/reports',
    userTypes: [USER_TYPES.ADMIN, USER_TYPES.SUPER_ADMIN, USER_TYPES.ORG_ADMIN],
    subItems: [
      {
        id: 'attendance-report',
        label: 'Attendance Summary',
        link: '/reports',
      },
      {
        id: 'productivity-report',
        label: 'Productivity Logs',
        link: '/reports?tab=productivity',
      },
    ],
  },
  {
    id: 'settings',
    label: 'System Settings',
    icon: 'mdi mdi-cog-outline',
    link: '/settings',
    userTypes: [USER_TYPES.ADMIN, USER_TYPES.SUPER_ADMIN, USER_TYPES.ORG_ADMIN],
  },
];

// 2. Employee / Team Member Menu (utype: 3)
export const EMPLOYEE_MENU_ITEMS: MenuItem[] = [
  {
    isTitle: true,
    label: 'Main Navigation',
  },
  {
    id: 'emp-dashboard',
    label: 'My Dashboard',
    icon: 'mdi mdi-view-dashboard-outline',
    link: '/dashboard',
    userTypes: [USER_TYPES.EMPLOYEE],
  },
  {
    isTitle: true,
    label: 'My Work & Tracking',
  },
  {
    id: 'emp-attendance',
    label: 'Time & Attendance',
    icon: 'mdi mdi-clock-check-outline',
    link: '/attendance',
    userTypes: [USER_TYPES.EMPLOYEE],
    subItems: [
      {
        id: 'emp-timesheet',
        label: 'My Timesheet',
        link: '/attendance',
      },
      {
        id: 'emp-clock',
        label: 'Clock In / Out',
        link: '/attendance?tab=clock',
      },
    ],
  },
  {
    id: 'emp-tasks',
    label: 'My Tasks',
    icon: 'mdi mdi-clipboard-text-outline',
    link: '/tasks',
    userTypes: [USER_TYPES.EMPLOYEE],
    subItems: [
      {
        id: 'emp-tasks-assigned',
        label: 'Assigned Tasks',
        link: '/tasks',
      },
      {
        id: 'emp-tasks-completed',
        label: 'Completed Tasks',
        link: '/tasks?tab=completed',
      },
    ],
  },
  {
    isTitle: true,
    label: 'Reports & Account',
  },
  {
    id: 'emp-reports',
    label: 'My Activity Logs',
    icon: 'mdi mdi-chart-box-outline',
    link: '/reports',
    userTypes: [USER_TYPES.EMPLOYEE],
  },
  {
    id: 'emp-settings',
    label: 'Profile & Settings',
    icon: 'mdi mdi-account-cog-outline',
    link: '/settings',
    userTypes: [USER_TYPES.EMPLOYEE],
  },
];

// 3. Manager / Team Lead / SubAdmin Menu (utype: 2, 13)
export const MANAGER_MENU_ITEMS: MenuItem[] = [
  {
    isTitle: true,
    label: 'Main Navigation',
  },
  {
    id: 'mgr-dashboard',
    label: 'Dashboard',
    icon: 'mdi mdi-view-dashboard-outline',
    link: '/dashboard',
    userTypes: [USER_TYPES.MANAGER, USER_TYPES.SUB_ADMIN],
  },
  {
    isTitle: true,
    label: 'Team Management',
  },
  {
    id: 'mgr-employees',
    label: 'My Team',
    icon: 'mdi mdi-account-group-outline',
    link: '/employees',
    userTypes: [USER_TYPES.MANAGER, USER_TYPES.SUB_ADMIN],
  },
  {
    id: 'mgr-attendance',
    label: 'Team Attendance',
    icon: 'mdi mdi-clock-check-outline',
    link: '/attendance',
    userTypes: [USER_TYPES.MANAGER, USER_TYPES.SUB_ADMIN],
    subItems: [
      {
        id: 'mgr-timesheets',
        label: 'Team Timesheets',
        link: '/attendance',
      },
      {
        id: 'mgr-live',
        label: 'Live Team Tracking',
        link: '/attendance?tab=live',
      },
    ],
  },
  {
    id: 'mgr-tasks',
    label: 'Task Assignments',
    icon: 'mdi mdi-clipboard-text-outline',
    link: '/tasks',
    userTypes: [USER_TYPES.MANAGER, USER_TYPES.SUB_ADMIN],
  },
  {
    isTitle: true,
    label: 'Analytics & Settings',
  },
  {
    id: 'mgr-reports',
    label: 'Team Reports',
    icon: 'mdi mdi-chart-box-outline',
    link: '/reports',
    userTypes: [USER_TYPES.MANAGER, USER_TYPES.SUB_ADMIN],
  },
  {
    id: 'mgr-settings',
    label: 'Settings',
    icon: 'mdi mdi-cog-outline',
    link: '/settings',
    userTypes: [USER_TYPES.MANAGER, USER_TYPES.SUB_ADMIN],
  },
];

/**
 * Returns menu items list according to user's utype / usertype
 */
export const getMenuByUserType = (userType?: number | null): MenuItem[] => {
  switch (userType) {
    case USER_TYPES.EMPLOYEE:
      return EMPLOYEE_MENU_ITEMS;
    case USER_TYPES.MANAGER:
    case USER_TYPES.SUB_ADMIN:
      return MANAGER_MENU_ITEMS;
    case USER_TYPES.ADMIN:
    case USER_TYPES.SUPER_ADMIN:
    case USER_TYPES.ORG_ADMIN:
    default:
      return ADMIN_MENU_ITEMS;
  }
};
