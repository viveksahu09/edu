import React, { useState } from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import AuthLayout from "./AuthLayout";
import { INPUT_STYLES } from "../../constants/styles";
import { useTheme } from "../../context/ThemeContext";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { isDarkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Handle password reset
      console.log("Password reset with:", password);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`max-w-md w-full mx-4 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-lg p-8`}
      >
        <h2
          className={`text-2xl font-bold mb-6 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="New Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
