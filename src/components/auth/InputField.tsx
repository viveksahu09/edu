import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: React.ReactNode;
}

export default function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  required,
  icon,
}: InputFieldProps) {
  const { isDarkMode } = useTheme();

  return (
    <div>
      <label
        className={`block text-sm font-medium mb-1 ${
          isDarkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${
            icon ? "pl-10" : "pl-3"
          } w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
        />
      </div>
    </div>
  );
}
