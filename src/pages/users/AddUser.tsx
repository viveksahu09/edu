import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, UserRound, Building2, Shield } from "lucide-react";
import InputField from "../auth/InputField";
import { useTheme } from "../../context/ThemeContext";
import { INPUT_STYLES } from "../../constants/styles";

export default function AddUser() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    institution: "",
    password: "",
  });

  const roles = ["user", "admin", "moderator"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Creating user:", formData);
      navigate("/admin/users");
    } catch (error) {
      console.error("Error creating user:", error);
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
            placeholder="••••••••"
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
