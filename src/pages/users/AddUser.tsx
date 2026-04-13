import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, UserRound, Building2, Shield } from "lucide-react";
import InputField from "../auth/InputField";
import { useTheme } from "../../context/ThemeContext";
import { INPUT_STYLES } from "../../constants/styles";
import { useAuth } from "../../context/AuthContext";
import RolePermissionsTable from "../../components/RolePermissionsTable";

export default function AddUser() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    institution: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{name?: string; email?: string; password?: string}>({});

  // Role-based dropdown options
  const getRoleOptions = () => {
    if (!user) return ["student", "teacher", "researcher"];
    
    switch (user.role) {
      case "SUPER_ADMIN":
        return ["student", "teacher", "researcher", "ADMIN"];
      case "ADMIN":
        return ["student", "teacher", "researcher"];
      default:
        return ["student", "teacher", "researcher"];
    }
  };

  const roles = getRoleOptions();

  // Display name mapping for friendly names
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Admin";
      case "ADMIN":
        return "Admin";
      case "student":
        return "Viewer";
      case "teacher":
        return "Editor";
      case "researcher":
        return "Editor";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const validateForm = () => {
    const errors: {name?: string; email?: string; password?: string} = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!formData.email || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Please provide a valid email address';
    }
    
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      console.log("Creating user:", formData);
      
      if (!token) {
        setError("Authentication required");
        return;
      }

      const requestBody = JSON.stringify(formData);
      console.log("Request body being sent:", requestBody);

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: requestBody
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Backend validation errors:', errorData);
        if (errorData.errors && errorData.errors.length > 0) {
          const errorMessages = errorData.errors.map((err: any) => err.msg || err.message).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        throw new Error(errorData.message || 'Failed to create user');
      }

      const data = await response.json();
      console.log("User created successfully:", data);
      
      // Navigate back to user list on success
      navigate("/admin/users");
    } catch (error: any) {
      console.error("Error creating user:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <div className={`p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-2xl mx-auto">
          <div
            className={`mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <div className="flex items-center mb-4">
              <UserPlus className="h-6 w-6 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold">Add New User</h1>
            </div>

            {user && (
              <div className={`mb-6 p-4 rounded-lg border shadow-sm ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Logged in as: <span className="font-normal">{user.name}</span>
                    </p>
                    <p className={`text-xs mt-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {user.role === 'SUPER_ADMIN' 
                      ? 'You have all system access. Can create Admin, Student, Teacher, and Researcher accounts.'
                      : user.role === 'ADMIN'
                      ? 'You can create, edit, and delete Student, Teacher, and Researcher accounts.'
                      : 'You have view-only access.'
                    }
                  </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'SUPER_ADMIN' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === 'ADMIN'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'ADMIN' ? 'Admin' : user.role}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {error && (
            <div className={`mb-4 p-3 rounded-lg border ${
              isDarkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm ${
                isDarkMode ? 'text-red-200' : 'text-red-800'
              }`}>
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={`rounded-lg shadow-lg p-6 space-y-6 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <InputField
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={
                <UserRound
                  className={`h-5 w-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              }
              value={formData.name}
              onChange={(e) =>
                handleChange({ ...e, target: { ...e.target, name: "name" } })
              }
              required
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
            )}

            <InputField
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={
                <Mail
                  className={`h-5 w-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              }
              value={formData.email}
              onChange={(e) =>
                handleChange({ ...e, target: { ...e.target, name: "email" } })
              }
              required
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}

            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Role
              </label>
              <div className="relative">
                <Shield
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`${INPUT_STYLES.base} ${
                    isDarkMode ? INPUT_STYLES.dark : INPUT_STYLES.light
                  }`}
                  required
                >
                  {roles.map((role) => (
                    <option
                      key={role}
                      value={role}
                      className={isDarkMode ? "bg-gray-700" : "bg-white"}
                    >
                      {getRoleDisplayName(role)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <InputField
              label="Institution"
              type="text"
              placeholder="University/Organization"
              icon={
                <Building2
                  className={`h-5 w-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              }
              value={formData.institution}
              onChange={(e) =>
                handleChange({
                  ...e,
                  target: { ...e.target, name: "institution" },
                })
              }
              required
            />

            <InputField
              label="Password"
              type="password"
              placeholder="â¢â¢â¢â¢â¢â¢â¢â¢"
              icon={
                <Shield
                  className={`h-5 w-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              }
              value={formData.password}
              onChange={(e) =>
                handleChange({ ...e, target: { ...e.target, name: "password" } })
              }
              required
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Creating User..." : "Create User"}
              </button>
            </div>
          </form>
        
        <RolePermissionsTable currentUserRole={user?.role} />
        </div>
      </div>
    </>
  );
}
