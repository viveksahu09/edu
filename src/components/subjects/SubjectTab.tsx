import React from "react";
import { X } from "lucide-react";
import { Subject } from "../../types/university";

interface SubjectTabProps {
  subject: Subject;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
  isMinimized?: boolean;
  textClassName?: string;
  isDarkMode: boolean;
}

export default function SubjectTab({
  subject,
  isActive,
  onClick,
  onClose,
  isMinimized,
  textClassName = "",
  isDarkMode,
}: SubjectTabProps) {
  return (
    <div
      onClick={onClick}
      title={subject.name}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
        ${isMinimized ? "max-w-[80px]" : "max-w-[200px]"}
        transition-all duration-100
        ${
          isDarkMode
            ? isActive
              ? "bg-gray-700 text-white"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            : isActive
            ? "bg-purple-400 text-white"
            : "bg-white hover:bg-purple-200 text-gray-600"
        }
      `}
    >
      <span className={`truncate text-sm font-medium ${textClassName}`}>
        {subject.name}
      </span>
      {!isMinimized && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={`p-1 rounded-full ${
            isDarkMode
              ? "hover:bg-gray-600 text-gray-400 hover:text-white"
              : "hover:bg-purple-300 text-gray-500 hover:text-gray-700"
          }`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
