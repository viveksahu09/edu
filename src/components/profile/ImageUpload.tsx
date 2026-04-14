import React, { useRef, useState } from "react";
import { Upload, User } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string;
  onImageUpload: (file: File) => void;
}

export default function ImageUpload({
  currentImage,
  onImageUpload,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      onImageUpload(file);
    }
  };

  const displayImage = preview || currentImage;

  return (
    <div className="relative">
      {displayImage ? (
        <img
          src={displayImage}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white object-cover"
        />
      ) : (
        <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
          <User className="w-16 h-16 text-gray-400 dark:text-gray-300" />
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        title="Upload profile picture"
      >
        <Upload className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
