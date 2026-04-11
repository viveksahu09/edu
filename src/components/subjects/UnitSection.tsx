import React from "react";
import { Download, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface UnitSectionProps {
  unitNumber: number;
  title: string;
  overview: string;
  isDarkMode: boolean;
}

export default function UnitSection({
  unitNumber,
  title,
  overview,
  isDarkMode,
}: UnitSectionProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = () => {
    try {
      navigate("/pdfviewer", {
        state: { url: "https://example.com/path/to/your.pdf" },
      });
    } catch (err) {
      setError("Failed to navigate to PDFViewer. Please try again.");
      console.error(err);
    }
  };

  return (
    <div
      className={` rounded-lg shadow-md p-6${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-6 rounded-lg shadow-md`}>
          <h3
            className={`text-xl font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {overview}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleButtonClick}
            className={`flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <Eye
              className={`h-4 w-4 mr-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            />
            Preview
          </button>
          {error && <div className="text-red-500">{error}</div>}
          <button className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
