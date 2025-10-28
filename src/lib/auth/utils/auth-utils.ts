export function getRoleRedirectPath(role: string): string {
  const roleRedirects: Record<string, string> = {
    super_admin: '/admin',
    agency_admin: '/agency',
    agent: '/agency',
    employer_admin: '/employer',
    contact: '/employer',
    employee: '/employee',
    system: '/system',
  };

  return roleRedirects[role] || '/dashboard';
}
