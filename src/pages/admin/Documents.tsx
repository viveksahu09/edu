import { useState, useEffect } from "react";
import { FileText, Search, Filter, Plus, Download, Edit, Trash2, Eye, Upload, Calendar, User } from "lucide-react";

interface Document {
  id: string;
  title: string;
  type: "pdf" | "doc" | "excel" | "presentation" | "other";
  category: string;
  author: string;
  size: string;
  downloads: number;
  uploadDate: string;
  lastModified: string;
  status: "published" | "draft" | "archived";
  description: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    // Load documents from localStorage or generate sample data
    const storedDocuments = localStorage.getItem("adminDocuments");
    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments));
    } else {
      // Generate sample documents
      const sampleDocuments: Document[] = [
        {
          id: "1",
          title: "Computer Science Fundamentals",
          type: "pdf",
          category: "Academic",
          author: "Dr. John Smith",
          size: "2.5 MB",
          downloads: 145,
          uploadDate: "2024-01-15",
          lastModified: "2024-04-10",
          status: "published",
          description: "Comprehensive guide to computer science basics"
        },
        {
          id: "2",
          title: "Web Development Course Outline",
          type: "doc",
          category: "Course Material",
          author: "Prof. Jane Doe",
          size: "1.2 MB",
          downloads: 89,
          uploadDate: "2024-02-20",
          lastModified: "2024-04-12",
          status: "published",
          description: "Detailed syllabus for web development course"
        },
        {
          id: "3",
          title: "Data Analysis Report",
          type: "excel",
          category: "Research",
          author: "Robert Johnson",
          size: "3.8 MB",
          downloads: 67,
          uploadDate: "2024-03-10",
          lastModified: "2024-04-14",
          status: "draft",
          description: "Q1 2024 data analysis and insights"
        },
        {
          id: "4",
          title: "Mobile App Presentation",
          type: "presentation",
          category: "Project",
          author: "Sarah Wilson",
          size: "5.1 MB",
          downloads: 234,
          uploadDate: "2024-01-25",
          lastModified: "2024-03-15",
          status: "published",
          description: "Final presentation for mobile app development project"
        }
      ];
      setDocuments(sampleDocuments);
      localStorage.setItem("adminDocuments", JSON.stringify(sampleDocuments));
    }
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || doc.type === selectedType;
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const handleDocumentAction = (action: string, docId: string) => {
    const updatedDocuments = documents.map(doc => {
      if (doc.id === docId) {
        switch (action) {
          case "publish":
            return { ...doc, status: "published" as const };
          case "archive":
            return { ...doc, status: "archived" as const };
          case "delete":
            return null;
          default:
            return doc;
        }
      }
      return doc;
    }).filter(Boolean) as Document[];

    setDocuments(updatedDocuments);
    localStorage.setItem("adminDocuments", JSON.stringify(updatedDocuments));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf": return "bg-red-100 text-red-600";
      case "doc": return "bg-blue-100 text-blue-600";
      case "excel": return "bg-green-100 text-green-600";
      case "presentation": return "bg-orange-100 text-orange-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: documents.length,
    published: documents.filter(d => d.status === "published").length,
    totalDownloads: documents.reduce((sum, d) => sum + d.downloads, 0),
    totalSize: documents.reduce((sum, d) => sum + parseFloat(d.size), 0).toFixed(1)
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Management</h1>
        <p className="text-gray-600">Manage documents, files, and educational resources</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <Upload className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalDownloads}</p>
            </div>
            <Download className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalSize} MB</p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="doc">Document</option>
            <option value="excel">Excel</option>
            <option value="presentation">Presentation</option>
            <option value="other">Other</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Course Material">Course Material</option>
            <option value="Research">Research</option>
            <option value="Project">Project</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={() => setShowDocumentModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTypeIcon(doc.type)}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doc.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Author:</span>
                  <span className="text-gray-900">{doc.author}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-gray-900">{doc.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="text-gray-900 uppercase">{doc.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Size:</span>
                  <span className="text-gray-900">{doc.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Downloads:</span>
                  <span className="text-gray-900">{doc.downloads}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Uploaded:</span>
                  <span className="text-gray-900">{doc.uploadDate}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDocument(doc);
                      setShowDocumentModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Eye className="h-4 w-4" />
                  </button>
                  {doc.status !== "published" && (
                    <button
                      onClick={() => handleDocumentAction("publish", doc.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Upload className="h-4 w-4" />
                    </button>
                  )}
                  {doc.status === "published" && (
                    <button
                      onClick={() => handleDocumentAction("archive", doc.id)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDocumentAction("delete", doc.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No documents found matching your criteria
        </div>
      )}
    </div>
  );
}
