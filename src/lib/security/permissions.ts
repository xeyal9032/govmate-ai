import type { UserRole } from '@/types/database';

export function isAdmin(role: UserRole): boolean {
  return role === 'admin';
}

export function isSupport(role: UserRole): boolean {
  return role === 'support';
}

export function isStaff(role: UserRole): boolean {
  return role === 'admin' || role === 'support';
}

export function canAccessAdmin(role: UserRole): boolean {
  return isAdmin(role);
}

export function canAccessSupport(role: UserRole): boolean {
  return isStaff(role);
}

export function canManageTemplates(role: UserRole): boolean {
  return isAdmin(role);
}

export function canViewAllUsers(role: UserRole): boolean {
  return isAdmin(role);
}

export function canViewAuditLogs(role: UserRole): boolean {
  return isAdmin(role);
}

export function canEditAISettings(role: UserRole): boolean {
  return isAdmin(role);
}
