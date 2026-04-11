import React, { useRef } from "react";
import { Camera } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string;
  onImageUpload: (file: File) => void;
}

export default function ImageUpload({
  currentImage,
  onImageUpload,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="relative">
      <img
        src={
          currentImage ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
        alt="Profile"
        className="w-32 h-32 rounded-full border-4 border-white object-cover"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
      >
        <Camera className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}
