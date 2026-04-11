import React from "react";
import { Link } from "react-router-dom";
import { FileText, Download, Trash2, Upload } from "lucide-react";
import Breadcrumbs from "../../components/admin/Breadcrumbs";

export default function DocumentList() {
  const documents = [
    {
      id: 1,
      name: "Course Material.pdf",
      size: "2.5 MB",
      uploadedAt: "2024-03-15",
    },
    {
      id: 2,
      name: "Study Guide.docx",
      size: "1.8 MB",
      uploadedAt: "2024-03-14",
    },
  ];

  return (
    <div>
      <Breadcrumbs />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Document Management</h1>
          <Link
            to="/admin/documents/upload"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Documents
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      {doc.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{doc.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doc.uploadedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
