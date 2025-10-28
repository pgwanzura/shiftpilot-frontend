import { User } from '@/types';

interface PermissionCheck {
  user: User | null;
  action: string;
  resource?: string;
}

export function usePermissions() {
  const checkPermission = ({
    user,
    action,
    resource,
  }: PermissionCheck): boolean => {
    if (!user) return false;

    const rolePermissions: Record<string, string[]> = {
      super_admin: ['*'],
      agency_admin: [
        'employee:*',
        'agent:*',
        'placement:*',
        'shift:*',
        'timesheet:*',
        'invoice:view,create',
        'payroll:create,view',
        'payout:view',
        'webhook:manage',
        'subscription:view',
        'availability:view,manage',
        'time_off:approve',
      ],
      agent: [
        'shift:create,view,update',
        'placement:create,view',
        'timesheet:view',
        'invoice:view',
        'availability:view',
        'employee:view',
      ],
      employer_admin: [
        'shift:create,view,update',
        'contact:manage',
        'timesheet:approve,view',
        'invoice:view,create,pay',
        'shift_template:manage',
      ],
      contact: ['timesheet:approve', 'shift:approve'],
      employee: [
        'shift:view:own',
        'timesheet:create:own',
        'timesheet:view:own',
        'availability:manage:own',
        'time_off:request',
      ],
    };

    const permissions = rolePermissions[user.role] || [];

    if (permissions.includes('*')) return true;

    const requiredPermission = resource ? `${resource}:${action}` : action;

    return permissions.some((permission) => {
      if (permission.includes(':')) {
        const [permResource, actions] = permission.split(':');
        if (resource && permResource !== resource && permResource !== '*') {
          return false;
        }
        return actions.split(',').includes(action);
      }
      return permission === requiredPermission;
    });
  };

  return { checkPermission };
}
