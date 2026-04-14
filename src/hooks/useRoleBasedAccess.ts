import { useAuth } from '../context/AuthContext';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUEST';

export interface RolePermissions {
  canAddUniversity: boolean;
  canAddDegree: boolean;
  canAddCourse: boolean;
  canAddSubject: boolean;
  canAddNotes: boolean;
  canEditUniversity: boolean;
  canDeleteUniversity: boolean;
  canViewAdminPanel: boolean;
}

export function getRolePermissions(role: UserRole): RolePermissions {
  switch (role) {
    case 'SUPER_ADMIN':
      return {
        canAddUniversity: true,
        canAddDegree: true,
        canAddCourse: true,
        canAddSubject: true,
        canAddNotes: true,
        canEditUniversity: true,
        canDeleteUniversity: true,
        canViewAdminPanel: true,
      };
    
    case 'ADMIN':
      return {
        canAddUniversity: false,
        canAddDegree: true,
        canAddCourse: true,
        canAddSubject: true,
        canAddNotes: true,
        canEditUniversity: true,
        canDeleteUniversity: false,
        canViewAdminPanel: true,
      };
    
    case 'TEACHER':
      return {
        canAddUniversity: false,
        canAddDegree: false,
        canAddCourse: false,
        canAddSubject: true,
        canAddNotes: true,
        canEditUniversity: false,
        canDeleteUniversity: false,
        canViewAdminPanel: false,
      };
    
    case 'STUDENT':
      return {
        canAddUniversity: false,
        canAddDegree: false,
        canAddCourse: false,
        canAddSubject: false,
        canAddNotes: false,
        canEditUniversity: false,
        canDeleteUniversity: false,
        canViewAdminPanel: false,
      };
    
    case 'GUEST':
    default:
      return {
        canAddUniversity: false,
        canAddDegree: false,
        canAddCourse: false,
        canAddSubject: false,
        canAddNotes: false,
        canEditUniversity: false,
        canDeleteUniversity: false,
        canViewAdminPanel: false,
      };
  }
}

export function useRoleBasedAccess() {
  const { user } = useAuth();
  
  const userRole: UserRole = (user as any)?.role || 'GUEST';
  const permissions = getRolePermissions(userRole);
  
  return {
    role: userRole,
    permissions,
    hasPermission: (permission: keyof RolePermissions) => permissions[permission],
  };
}
