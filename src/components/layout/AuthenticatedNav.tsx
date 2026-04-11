import React from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AuthenticatedNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        <User className="h-5 w-5" />
        <span>{user?.name}</span>
      </button>
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
      >
        <LogOut className="h-5 w-5" />
        <span>{t("nav.logout")}</span>
      </button>
    </div>
  );
}
