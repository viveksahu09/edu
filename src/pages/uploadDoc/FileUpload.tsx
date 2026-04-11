import React, { useCallback, useState } from "react";
import { Upload, X, FileText, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FileUploadProps {
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  onUpload: (files: File[]) => Promise<void>;
}

export default function FileUpload({
  acceptedTypes = [".pdf", ".doc", ".docx"],
  maxSize = 10 * 1024 * 1024, // 10MB
  onUpload,
}: FileUploadProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    if (!acceptedTypes.some((type) => file.name.toLowerCase().endsWith(type))) {
      setError(t("upload.invalidType"));
      return false;
    }
    if (file.size > maxSize) {
      setError(t("upload.fileTooBig"));
      return false;
    }
    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setError("");

      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(validateFile);
      setFiles((prev) => [...prev, ...validFiles]);
    },
    [maxSize]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(validateFile);
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      await onUpload(files);
      setFiles([]);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 2000);
    } catch (err) {
      setError(t("upload.error"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div
        className={`border-2 border-dashed rounded-lg p-8 ${
          isDragging
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
            : "border-gray-300 dark:border-gray-600"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            {t("upload.dragDrop")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {t("upload.or")}
          </p>
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
          >
            {t("upload.browse")}
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            {t("upload.selectedFiles")}
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            {isUploading ? (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            ) : (
              <button
                onClick={handleUpload}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
              >
                {uploadProgress === 100 ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    {t("upload.success")}
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    {t("upload.uploadFiles")}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
