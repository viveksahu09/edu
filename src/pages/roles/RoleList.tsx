import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import Breadcrumbs from "../../components/admin/Breadcrumbs";

export default function RoleList() {
  const roles = [
    {
      displayName: "Super Admin",
      permissions: "all system access",
      actions: "Create, Edit, Delete, Manage Admins, System Settings",
      color: "Purple"
    },
    {
      displayName: "Admin",
      permissions: "create, edit, delete",
      actions: "Create Users, Edit Users, Delete Users",
      color: "Red"
    },
    {
      displayName: "Student",
      permissions: "view",
      actions: "View Content",
      color: "Blue"
    },
    {
      displayName: "Teacher",
      permissions: "view",
      actions: "View Content, Manage Classes",
      color: "Green"
    },
    {
      displayName: "Researcher",
      permissions: "view",
      actions: "View Content, Conduct Research",
      color: "Orange"
    }
  ];

  return (
    <div>
      <Breadcrumbs />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Role Management</h1>
          <Link
            to="/admin/roles/add"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Shield className="h-5 w-5 mr-2" />
            Add Role
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Display Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Color
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roles.map((role, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {role.displayName}
                  </td>
                  <td className="px-6 py-4">
                    {role.permissions}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {role.actions.split(', ').map((action, actionIndex) => (
                        <span
                          key={actionIndex}
                          className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          role.color === 'Purple' ? 'bg-purple-500' :
                          role.color === 'Red' ? 'bg-red-500' :
                          role.color === 'Blue' ? 'bg-blue-500' :
                          role.color === 'Green' ? 'bg-green-500' :
                          role.color === 'Orange' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}
                      ></div>
                      {role.color}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
