import React from "react";
import { Link } from "react-router-dom";
import type { University } from "../../types/university";
import { useTheme } from "../../context/ThemeContext";

interface UniversityCardProps {
  university: University;
}

export default function UniversityCard({ university }: UniversityCardProps) {
  const { isDarkMode } = useTheme();

  return (
    <Link
      to={`/university/${university.slug}`}
      className={`relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform hover:scale-105 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className="h-64 relative mb-8"
        // style={{ backgroundImage: `url(${university.image})` }}
      >
        {" "}
        <img
          src={university.image}
          alt={university.name}
          className="w-full h-full object-cover "
        />
        <div className="p-6 absolute inset-0  bg-gradient-to-b from-black/90 to-transparent mb-2 to-transparent">
          <div className="absolute bottom-4 left-4 text-white text-2xl font-bold" />
          <h3
            className={`text-xl font-semibold   ${
              isDarkMode ? "text-white" : "text-white"
            }`}
          >
            {university.name}
          </h3>
          {/* <div className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {university.degree?.length || 0} Degrees Available
        </div> */}
          <div className={`${isDarkMode ? "text-white" : "text-white"}`}>
            {university.degree?.[0]?.courses?.length || 0} Courses Available
          </div>
        </div>
      </div>
    </Link>
  );
}
