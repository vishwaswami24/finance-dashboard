import { PERMISSIONS, ROLES } from "./constants.js";

export const permissionsByRole = {
  [ROLES.VIEWER]: [PERMISSIONS.DASHBOARD_VIEW],
  [ROLES.ANALYST]: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.RECORDS_VIEW],
  [ROLES.ADMIN]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.RECORDS_VIEW,
    PERMISSIONS.RECORDS_WRITE,
    PERMISSIONS.USERS_MANAGE
  ]
};

export function hasPermission(role, permission) {
  return permissionsByRole[role]?.includes(permission) ?? false;
}

export function getRoleCapabilities(role) {
  return permissionsByRole[role] ?? [];
}

