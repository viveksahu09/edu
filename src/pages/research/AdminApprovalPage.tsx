import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  BookOpen, 
  Code, 
  Target,
  Filter,
  Search,
  AlertCircle,
  User,
  Calendar
} from "lucide-react";

interface Contribution {
  id: string;
  type: "topic" | "problem" | "task";
  title: string;
  description: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "pending" | "approved" | "rejected";
  submittedBy: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  estimatedTime?: string;
  hints?: string[];
  overview?: string;
  keyConcepts?: string[];
  relatedTopics?: string[];
  notes?: string[];
  existingTopicId?: string;
}

const AdminApprovalPage = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load contributions from localStorage
    const storedContributions = JSON.parse(localStorage.getItem("researchContributions") || "[]");
    setContributions(storedContributions);
  }, []);

  const handleApprove = async (contributionId: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update contribution status
      const updatedContributions = contributions.map(contribution => 
        contribution.id === contributionId 
          ? {
              ...contribution,
              status: "approved" as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: "admin-user" // In real app, get from auth context
            }
          : contribution
      );
      
      setContributions(updatedContributions);
      localStorage.setItem("researchContributions", JSON.stringify(updatedContributions));
      
      // In a real app, this would also add the content to the main research data
      console.log("Content approved and would be added to research data");
      
    } catch (error) {
      console.error("Error approving contribution:", error);
    } finally {
      setIsProcessing(false);
      setSelectedContribution(null);
    }
  };

  const handleReject = async (contributionId: string, reason: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedContributions = contributions.map(contribution => 
        contribution.id === contributionId 
          ? {
              ...contribution,
              status: "rejected" as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: "admin-user",
              rejectionReason: reason
            }
          : contribution
      );
      
      setContributions(updatedContributions);
      localStorage.setItem("researchContributions", JSON.stringify(updatedContributions));
      
    } catch (error) {
      console.error("Error rejecting contribution:", error);
    } finally {
      setIsProcessing(false);
      setSelectedContribution(null);
    }
  };

  const filteredContributions = contributions.filter(contribution => {
    const matchesFilter = filter === "all" || contribution.status === filter;
    const matchesSearch = contribution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contribution.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "topic": return <BookOpen className="h-4 w-4" />;
      case "problem": return <Code className="h-4 w-4" />;
      case "task": return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/research"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Research
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Approval Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Review and manage user-submitted content
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {contributions.filter(c => c.status === "pending").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {contributions.filter(c => c.status === "approved").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Approved</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {contributions.filter(c => c.status === "rejected").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Rejected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contributions..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {(["all", "pending", "approved", "rejected"] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === status
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contributions List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {filteredContributions.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No contributions found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {filter === "pending" 
                  ? "No pending contributions to review."
                  : `No ${filter} contributions found.`
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredContributions.map((contribution) => (
                    <tr key={contribution.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(contribution.type)}
                          <span className="ml-2 text-sm text-gray-900 dark:text-white capitalize">
                            {contribution.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {contribution.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {contribution.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {contribution.subject.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(contribution.difficulty)}`}>
                          {contribution.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-400" />
                          {contribution.submittedBy}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(contribution.submittedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contribution.status)}`}>
                          {contribution.status}
                        </span>
                        {contribution.rejectionReason && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {contribution.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedContribution(contribution)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {contribution.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(contribution.id)}
                                disabled={isProcessing}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt("Rejection reason (optional):");
                                  if (reason !== null) {
                                    handleReject(contribution.id, reason);
                                  }
                                }}
                                disabled={isProcessing}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedContribution && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(selectedContribution.type)}
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedContribution.title}
                      </h2>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedContribution.status)}`}>
                        {selectedContribution.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className={`px-2 py-1 rounded-full ${getDifficultyColor(selectedContribution.difficulty)}`}>
                        {selectedContribution.difficulty}
                      </span>
                      <span>{selectedContribution.subject.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedContribution(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedContribution.description}</p>
                  </div>

                  {selectedContribution.overview && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Overview</h3>
                      <p className="text-gray-700 dark:text-gray-300">{selectedContribution.overview}</p>
                    </div>
                  )}

                  {selectedContribution.keyConcepts && selectedContribution.keyConcepts.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Key Concepts</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedContribution.keyConcepts.map((concept, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedContribution.hints && selectedContribution.hints.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Hints</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedContribution.hints.map((hint, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">{hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedContribution.estimatedTime && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Estimated Time</h3>
                      <p className="text-gray-700 dark:text-gray-300">{selectedContribution.estimatedTime}</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>Submitted by: {selectedContribution.submittedBy}</span>
                      <span>{formatDate(selectedContribution.submittedAt)}</span>
                    </div>
                  </div>
                </div>

                {selectedContribution.status === "pending" && (
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setSelectedContribution(null)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt("Rejection reason (optional):");
                        if (reason !== null) {
                          handleReject(selectedContribution.id, reason);
                        }
                      }}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedContribution.id)}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalPage;
