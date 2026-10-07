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



