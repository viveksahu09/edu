import React from "react";
import { FileText, Image, Video, X } from "lucide-react";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  const getFilePreview = () => {
    const type = file.type.split("/")[0];

    if (type === "image") {
      return (
        <div className="relative w-32 h-32">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
      );
    }

    const icons = {
      application: <FileText className="w-12 h-12 text-gray-400" />,
      video: <Video className="w-12 h-12 text-gray-400" />,
      default: <FileText className="w-12 h-12 text-gray-400" />,
    };

    return icons[type as keyof typeof icons] || icons.default;
  };

  return (
    <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
      {getFilePreview()}
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {file.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
      <button
        onClick={onRemove}
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
      >
        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
}
