import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X, LogOut, User, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
  const { isDarkMode } = useTheme();
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  console.log('Navbar - Auth state:', { 
    isAuthenticated, 
    userName: user?.name, 
    userEmail: user?.email,
    userRole: user?.role,
    loading 
  });

  const handleLogout = () => {
    console.log('Navbar - Logout clicked');
    logout();
    navigate('/login');
  };

  // Don't render auth buttons while loading
  if (loading) {
    return (
      <nav
        className={`fixed w-full z-50 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white"
        } shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-md ${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <Link to="/" className="flex items-center ml-4">
                <BookOpen className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold">EduSolGrow</span>
              </Link>
            </div>
            <div className="animate-pulse">
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed w-full z-50 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white"
      } shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-md ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <Link to="/" className="flex items-center ml-4">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold">EduSolGrow</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/university"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600"
            >
              Universities
            </Link>
            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600"
            >
              Contact
            </Link>
            <Link
              to="/research"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600"
            >
              Research
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={() => {}}
              className={`p-2 rounded-full ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Auth buttons - Show based on authentication state */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block font-medium">{user.name}</span>
                </Link>
                {/* Admin Panel - Only show for SUPER_ADMIN */}
                {user.role === 'SUPER_ADMIN' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span className="hidden sm:block font-medium">Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 font-medium transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
