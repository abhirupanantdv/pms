// Authentication & Role Management Utility
// Implements role permission checks:
// user = frappe.session.user
// roles = frappe.get_roles(user)

import { ERPNEXT_CONFIG } from '../config';

/**
 * Checks whether user has Admin role or Operation role.
 * Rule:
 * - Admin role user: definitely allowed to create booking (canCreateBooking = true).
 * - Operation role user: does not have role permission to create booking (canCreateBooking = false).
 */
export const checkRoles = (roles = [], user = '') => {
  const roleList = (Array.isArray(roles) ? roles : []).map(r => String(r || '').trim().toLowerCase());
  const u = String(user || '').trim().toLowerCase();
  const selectedPortal = (typeof window !== 'undefined' ? localStorage.getItem('pms_selected_portal') : null) || '';

  // Check Admin role
  const isAdminRole =
    roleList.some(r =>
      r === 'system manager' ||
      r === 'administrator' ||
      r === 'admin' ||
      r.includes('admin') ||
      r.includes('system manager')
    ) ||
    u === 'administrator' ||
    u === 'admin' ||
    selectedPortal === 'admin';

  // Check Operation role
  const isOperationRole =
    roleList.some(r =>
      r === 'operation role' ||
      r === 'operation user' ||
      r === 'operation' ||
      r === 'operations' ||
      r.includes('operation') ||
      r.includes('operator')
    ) ||
    selectedPortal === 'operation';

  // Admin role user DEFINITELY has permission
  // Operation role user (without Admin role) does NOT have role permission to create booking
  const canCreateBooking = isAdminRole && !(isOperationRole && !isAdminRole);

  return {
    isAdminRole: Boolean(isAdminRole),
    isOperationRole: Boolean(!isAdminRole && isOperationRole),
    canCreateBooking: Boolean(canCreateBooking),
    roleType: isAdminRole ? 'admin' : (isOperationRole ? 'operation' : 'other')
  };
};

/**
 * Resolves current user and roles using:
 * user = frappe.session.user
 * roles = frappe.get_roles(user)
 */
export const fetchUserRoles = async (customUser = null) => {
  let user = customUser;
  if (!user && typeof window !== 'undefined') {
    user =
      window.frappe?.session?.user ||
      window.frappe_user ||
      localStorage.getItem('pms_user') ||
      '';
  }

  let roles = [];

  // 1. Try window.frappe.get_roles(user)
  if (typeof window !== 'undefined' && typeof window.frappe?.get_roles === 'function') {
    try {
      const r = window.frappe.get_roles(user);
      if (Array.isArray(r) && r.length > 0) roles = r;
    } catch { }
  }

  // 2. Check window.frappe.user_roles
  if (roles.length === 0 && typeof window !== 'undefined' && Array.isArray(window.frappe?.user_roles) && window.frappe.user_roles.length > 0) {
    roles = window.frappe.user_roles;
  }

  // 3. Query backend whitelisted endpoint: /api/method/pms.api.get_user_roles
  if (roles.length === 0 && ERPNEXT_CONFIG?.url && user && user !== 'Guest') {
    try {
      const res = await fetch(`${ERPNEXT_CONFIG.url}/api/method/pms.api.get_user_roles?user=${encodeURIComponent(user)}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const data = json.message || json;
        if (Array.isArray(data.roles)) {
          roles = data.roles;
        }
      }
    } catch { }
  }

  // 4. Query /api/resource/User/{user}
  if (roles.length === 0 && ERPNEXT_CONFIG?.url && user && user !== 'Guest') {
    try {
      const res = await fetch(`${ERPNEXT_CONFIG.url}/api/resource/User/${encodeURIComponent(user)}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const uDoc = json.data || json;
        if (Array.isArray(uDoc.roles)) {
          roles = uDoc.roles.map(r => r.role || r);
        }
      }
    } catch { }
  }

  // 5. Fallback from localStorage or user inference
  if (roles.length === 0 && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('pms_roles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) roles = parsed;
      }
    } catch { }
  }

  if (roles.length === 0) {
    const savedPortal = typeof window !== 'undefined' ? localStorage.getItem('pms_selected_portal') : null;
    const uLower = String(user || '').trim().toLowerCase();
    if (['admin', 'administrator', 'system manager'].includes(uLower) || savedPortal === 'admin') {
      roles = ['Administrator', 'System Manager'];
    } else if (savedPortal === 'operation') {
      roles = ['Operation Role'];
    }
  }

  // Expose on window.frappe to fulfill:
  // user = frappe.session.user
  // roles = frappe.get_roles(user)
  if (typeof window !== 'undefined') {
    window.frappe = window.frappe || {};
    window.frappe.session = window.frappe.session || {};
    if (user) window.frappe.session.user = user;
    window.frappe.user_roles = roles;
    window.frappe.get_roles = function(u) {
      return roles;
    };
    try {
      localStorage.setItem('pms_roles', JSON.stringify(roles));
    } catch { }
  }

  const roleCheck = checkRoles(roles, user);

  return {
    user,
    roles,
    ...roleCheck
  };
};
