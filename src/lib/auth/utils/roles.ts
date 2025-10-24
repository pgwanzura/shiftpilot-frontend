import { UserRole } from '../types';

export function getRoleBasedRedirect(role: UserRole): string {
  switch (role) {
    case 'agency_admin':
    case 'agent':
      return '/agency/dashboard';
    case 'employer_admin':
    case 'contact':
      return '/employer/dashboard';
    case 'super_admin':
      return '/admin/dashboard';
    case 'employee':
      return '/employee/dashboard';
    default:
      return '/login';
  }
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole | UserRole[]): boolean {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(userRole);
}

export function isAgencyAdmin(role: UserRole): boolean {
  return role === 'agency_admin';
}

export function isEmployerAdmin(role: UserRole): boolean {
  return role === 'employer_admin';
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === 'super_admin';
}

export function isContact(role: UserRole): boolean {
  return role === 'contact';
}

export function isAgent(role: UserRole): boolean {
  return role === 'agent';
}

export function canManageShifts(role: UserRole): boolean {
  return ['agency_admin', 'agent', 'employer_admin', 'super_admin'].includes(role);
}

export function canApproveTimesheets(role: UserRole): boolean {
  return ['agency_admin', 'employer_admin', 'contact', 'super_admin'].includes(role);
}