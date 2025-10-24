// Client auth utilities
export {
  getUserFromCookie,
  isAuthenticated,
  getUserRole,
  hasRole as clientHasRole,
} from './client-auth';

// Role utilities
export {
  getRoleBasedRedirect,
  hasRole,
  isAgencyAdmin,
  isEmployerAdmin,
  isSuperAdmin,
  isContact,
  isAgent,
  canManageShifts,
  canApproveTimesheets,
} from './roles';
