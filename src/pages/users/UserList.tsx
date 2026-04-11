import React from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function UserList() {
  const { user } = useAuth();
  
  // Mock users from original data with updated roles
  const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Student" },
    { id: 3, name: "Dr. Robert Johnson", email: "robert@university.edu", role: "Teacher" },
    { id: 4, name: "Sarah Wilson", email: "sarah@research.org", role: "Researcher" },
  ];

  // Combine real users with mock users
  const allUsers = [
    // Add current logged-in user if they exist and aren't already in mock data
    ...(user && !mockUsers.some(mockUser => mockUser.email === user.email) ? [{
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.charAt(0).toUpperCase() + user.role.slice(1)
    }] : []),
    // Add mock users (avoid duplicates)
    ...mockUsers
  ];

  // Count admin users
  const adminCount = allUsers.filter(u => u.role.toLowerCase() === "admin").length;
  const canCreateAdmin = adminCount < 5;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total Users: {allUsers.length} | Admins: {adminCount}/5
          </p>
        </div>
        <div className="flex gap-2">
          {user?.role === "admin" && canCreateAdmin && (
            <Link
              to="/admin/register"
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Admin
            </Link>
          )}
          <Link
            to="/admin/users/add"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add User
          </Link>
        </div>
      </div>

      {adminCount >= 5 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Admin Limit Reached:</strong> Maximum of 5 admin accounts created.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allUsers.map((user) => {
              const roleColor = user.role.toLowerCase() === "admin" ? "bg-red-100 text-red-800" :
                              user.role.toLowerCase() === "teacher" ? "bg-blue-100 text-blue-800" :
                              user.role.toLowerCase() === "researcher" ? "bg-purple-100 text-purple-800" :
                              "bg-green-100 text-green-800";
              
              return (
              <tr key={user.id} className={user.role.toLowerCase() === "admin" ? "bg-red-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.name}
                    {user.role.toLowerCase() === "admin" && (
                      <span className="ml-2 text-xs text-red-600 font-semibold">ADMIN</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColor}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
