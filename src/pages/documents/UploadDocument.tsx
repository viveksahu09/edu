import React from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import Breadcrumbs from "../../components/admin/Breadcrumbs";
import FileUpload from "../../components/admin/FileUpload";

export default function UploadDocument() {
  const navigate = useNavigate();

  const handleUpload = async (files: FileList) => {
    // Handle file upload logic here
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        navigate("/admin/documents");
      }, 2000);
    });
  };

  return (
    <div>
      <Breadcrumbs />
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Upload className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold">Upload Documents</h1>
          </div>

          <FileUpload onUpload={handleUpload} />

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/admin/documents")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
