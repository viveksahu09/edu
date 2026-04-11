import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  BookOpen,
  Users,
  Calendar,
  Upload,
  User,
  BookMarked,
  Globe,
  Shield,
  Sun,
  Moon,
  MessageSquare,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import type { NavItem } from "../../types";

const navigation: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "My Courses", href: "/courses", icon: BookOpen },
  { title: "Study Groups", href: "/groups", icon: Users },
  { title: "Schedule", href: "/schedule", icon: Calendar },
  { title: "Resources", href: "/resources", icon: BookMarked },
  { title: "Profile", href: "/profile", icon: User },
  {
    title: "Admin",
    href: "/admin",
    icon: Shield,
    subItems: [
      { title: "User Management", href: "/admin/users" },
      { title: "Role Management", href: "/admin/roles" },
      { title: "Document Management", href: "/admin/documents" },
    ],
  },
  { title: "Upload", href: "/upload", icon: Upload },
  { title: "Language", href: "/language", icon: Globe },
  { title: "AI Study Assistant", href: "/chat", icon: MessageSquare },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${
        isOpen ? "w-64" : "w-0"
      } ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white"
      } border-r transition-all duration-300 ease-in-out overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 py-6 px-4">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5 mr-3 text-gray-500" />
                  {item.title}
                </Link>
                {item.subItems && (
                  <ul className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.title}>
                        <Link
                          to={subItem.href}
                          className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                            isDarkMode
                              ? "text-gray-300 hover:bg-gray-800"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={onClose}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg ${
              isDarkMode
                ? "text-gray-100 hover:bg-gray-800"
                : "text-gray-900 hover:bg-gray-100"
            }`}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 mr-3" />
            ) : (
              <Moon className="h-5 w-5 mr-3" />
            )}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </aside>
  );
}
