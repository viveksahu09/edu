import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { BookOpen, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const { isDarkMode } = useTheme();

  return (
    <footer
      className={`${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } py-8`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                EduSolGrow
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Empowering education through technology
            </p>
          </div>

          <div>
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Resources
            </h3>
            <ul className="mt-4 space-y-4">
              {[
                "Study Materials",
                "Practice Tests",
                "Video Lectures",
                "Live Classes",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              {["Help Center", "Contact Us", "Community", "Feedback"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Connect
            </h3>
            <div className="flex space-x-6 mt-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-base text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} EduSolGrow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
