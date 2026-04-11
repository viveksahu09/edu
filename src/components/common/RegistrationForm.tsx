import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";
import InputField from "../auth/InputField";
import { Mail, Lock, User, Building2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    institution: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register({
        ...formData,
        role: "user",
        preferences: {
          subjects: [],
          languages: [],
        },
        progress: {
          savedNotes: 0,
          completedTopics: 0,
        },
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
          className={`text-3xl font-bold text-center mb-8 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            icon={<User className="h-5 w-5" />}
            required
          />

          <InputField
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            icon={<Mail className="h-5 w-5" />}
            required
          />

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            icon={<Lock className="h-5 w-5" />}
            required
          />

          <InputField
            label="Institution"
            type="text"
            placeholder="University/Organization"
            value={formData.institution}
            onChange={(e) =>
              setFormData({ ...formData, institution: e.target.value })
            }
            icon={<Building2 className="h-5 w-5" />}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p
          className={`mt-4 text-center ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
