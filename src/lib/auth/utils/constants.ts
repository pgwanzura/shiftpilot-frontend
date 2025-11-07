// @/lib/auth/constants.ts
export const AUTH_COOKIES = {
  USER: 'auth_user',
  TOKEN: 'auth_token',
  SESSION: 'auth_session',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  AGENCY: '/agency',
  EMPLOYER: '/employer',
  EMPLOYEE: '/employee',
  SYSTEM: '/system',
} as const;

export const ROLE_REDIRECTS: Record<string, string> = {
  super_admin: ROUTES.ADMIN,
  agency_admin: ROUTES.AGENCY,
  agent: ROUTES.AGENCY,
  employer_admin: ROUTES.EMPLOYER,
  contact: ROUTES.EMPLOYER,
  employee: ROUTES.EMPLOYEE,
  system: ROUTES.SYSTEM,
} as const;

export const ALLOWED_ROLES = {
  AGENCY: ['agency_admin', 'agent'] as const,
  EMPLOYER: ['employer_admin', 'contact'] as const,
  ADMIN: ['super_admin'] as const,
  EMPLOYEE: ['employee'] as const,
  SYSTEM: ['system'] as const,
} as const;

export type AgencyRole = (typeof ALLOWED_ROLES.AGENCY)[number];
export type EmployerRole = (typeof ALLOWED_ROLES.EMPLOYER)[number];
export type AdminRole = (typeof ALLOWED_ROLES.ADMIN)[number];
export type EmployeeRole = (typeof ALLOWED_ROLES.EMPLOYEE)[number];
export type SystemRole = (typeof ALLOWED_ROLES.SYSTEM)[number];
export type UserRole =
  | AgencyRole
  | EmployerRole
  | AdminRole
  | EmployeeRole
  | SystemRole;
