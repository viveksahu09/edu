import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Breadcrumbs() {
  const location = useLocation();
  const { t } = useTranslation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {t("nav.home")}
          </Link>
        </li>
        {paths.map((path, index) => (
          <React.Fragment key={path}>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <li>
              <Link
                to={`/${paths.slice(0, index + 1).join("/")}`}
                className={`${
                  index === paths.length - 1
                    ? "text-indigo-600 dark:text-indigo-400 font-medium"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {t(`nav.${path}`, {
                  defaultValue: path.charAt(0).toUpperCase() + path.slice(1),
                })}
              </Link>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
