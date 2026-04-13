import { useTheme } from '../context/ThemeContext';

interface RolePermissionsTableProps {
  currentUserRole?: string;
}

export default function RolePermissionsTable({ currentUserRole }: RolePermissionsTableProps) {
  const { isDarkMode } = useTheme();

  const roles = [
    {
      name: 'SUPER_ADMIN',
      displayName: 'Super Admin',
      permissions: 'all system access',
      actions: ['Create', 'Edit', 'Delete', 'Manage Admins', 'System Settings'],
      color: 'purple',
      description: 'Complete control over everything'
    },
    {
      name: 'ADMIN',
      displayName: 'Admin',
      permissions: 'create, edit, delete',
      actions: ['Create Users', 'Edit Users', 'Delete Users'],
      color: 'red',
      description: 'Can manage normal users'
    },
    {
      name: 'student',
      displayName: 'Viewer',
      permissions: 'view',
      actions: ['View Content'],
      color: 'blue',
      description: 'View-only access'
    },
    {
      name: 'teacher',
      displayName: 'Editor',
      permissions: 'view',
      actions: ['View Content', 'Manage Classes'],
      color: 'green',
      description: 'Editor access'
    },
    {
      name: 'researcher',
      displayName: 'Editor',
      permissions: 'view',
      actions: ['View Content', 'Conduct Research'],
      color: 'orange',
      description: 'Editor access'
    }
  ];

  return (
    <div className={`mt-6 p-4 rounded-lg border ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-sm font-semibold mb-3 ${
        isDarkMode ? 'text-gray-200' : 'text-gray-700'
      }`}>
        Role Permissions
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${
              isDarkMode ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <th className={`text-left py-2 px-3 font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Name</th>
              <th className={`text-left py-2 px-3 font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Permissions</th>
              <th className={`text-left py-2 px-3 font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr 
                key={role.name}
                className={`border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-100'
                } ${currentUserRole === role.name ? 'bg-opacity-20 bg-blue-500' : ''}`}
              >
                <td className="py-3 px-3">
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      role.color === 'purple' ? 'bg-purple-500' :
                      role.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></span>
                    <span className={`font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {role.displayName}
                    </span>
                    {currentUserRole === role.name && (
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                        isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                      }`}>
                        You
                      </span>
                    )}
                  </div>
                  <div className={`text-xs mt-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {role.description}
                  </div>
                </td>
                <td className={`py-3 px-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {role.permissions}
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-1">
                    {role.actions.map((action) => (
                      <span
                        key={action}
                        className={`px-2 py-1 rounded text-xs ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
