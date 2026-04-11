import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import Breadcrumbs from "../../components/admin/Breadcrumbs";
import { INPUT_STYLES } from "../../constants/styles";
import { useTheme } from "../../context/ThemeContext";

export default function AddRole() {
  const navigate = useNavigate();
  const [role, setRole] = useState({
    name: "",
    permissions: [] as string[],
  });
  const { isDarkMode } = useTheme();

  const availablePermissions = [
    "view_users",
    "edit_users",
    "delete_users",
    "manage_documents",
    "manage_navigation",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle role creation logic here
    navigate("/admin/roles");
  };

  const togglePermission = (permission: string) => {
    setRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <div className={`p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-2xl mx-auto">
        <form
          className={`rounded-lg shadow-lg p-6 space-y-6 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Role Name
            </label>
            <div className="relative">
              <Shield
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                name="name"
                value={role.name}
                onChange={(e) => setRole({ ...role, name: e.target.value })}
                className={`${INPUT_STYLES.base} ${
                  isDarkMode ? INPUT_STYLES.dark : INPUT_STYLES.light
                }`}
                placeholder="Enter role name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            <div className="space-y-2">
              {availablePermissions.map((permission) => (
                <label key={permission} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={role.permissions.includes(permission)}
                    onChange={() => togglePermission(permission)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {permission
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/roles")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
