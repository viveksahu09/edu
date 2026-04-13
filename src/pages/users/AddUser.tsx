import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, UserRound, Building2, Shield } from "lucide-react";
import InputField from "../auth/InputField";
import { useTheme } from "../../context/ThemeContext";
import { INPUT_STYLES } from "../../constants/styles";
import { useAuth } from "../../context/AuthContext";

export default function AddUser() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { token } = useAuth();
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

  const roles = ["student", "teacher", "researcher", "admin"];

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
    <div className={`p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-2xl mx-auto">
        <div
          className={`flex items-center mb-6 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <UserPlus className="h-6 w-6 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-bold">Add New User</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">Error: {error}</p>
          </div>
        )}

        {formData.role === "admin" && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Only one admin account is allowed. If an admin already exists, this creation will fail.
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
                    {role.charAt(0).toUpperCase() + role.slice(1)}
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
      </div>
    </div>
  );
}
