export function getRoleBasedRedirect(role: string): string {
  switch (role) {
    case 'candidate':
      return '/candidate';
    case 'recruiter_admin':
    case 'recruiter':
      return '/recruiter';
    case 'super_admin':
      return '/admin';
    default:
      return '/login';
  }
}

export function hasRole(
  userRole: string,
  allowedRoles: string | string[]
): boolean {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(userRole);
}

export function isAdmin(role: string): boolean {
  return role === 'recruiter_admin';
}

export function isRecruiter(role: string): boolean {
  return role === 'recruiter' || role === 'recruiter_admin';
}

export function isCandidate(role: string): boolean {
  return role === 'candidate';
}
