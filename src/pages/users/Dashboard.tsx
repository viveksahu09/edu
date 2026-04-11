import React, { useState, useEffect } from "react";
import { Users, FileText, CreditCard, TrendingUp, BookOpen, Code, Target, CheckCircle, XCircle, Eye, Search, Filter } from "lucide-react";

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
}

export default function Dashboard() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

  useEffect(() => {
    // Load contributions from localStorage
    const storedContributions = JSON.parse(localStorage.getItem("researchContributions") || "[]");
    setContributions(storedContributions);
  }, []);

  const handleApprove = async (contributionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedContributions = contributions.map(contribution => 
        contribution.id === contributionId 
          ? {
              ...contribution,
              status: "approved" as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: "admin-user"
            }
          : contribution
      );
      
      setContributions(updatedContributions);
      localStorage.setItem("researchContributions", JSON.stringify(updatedContributions));
      setSelectedContribution(null);
    } catch (error) {
      console.error("Error approving contribution:", error);
    }
  };

  const handleReject = async (contributionId: string, reason: string) => {
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
      setSelectedContribution(null);
    } catch (error) {
      console.error("Error rejecting contribution:", error);
    }
  };

  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, change: "+12%" },
    { title: "Documents", value: "856", icon: FileText, change: "+8%" },
    { title: "Revenue", value: "$12,345", icon: CreditCard, change: "+23%" },
    { title: "Downloads", value: "3,456", icon: TrendingUp, change: "+15%" },
  ];

  const pendingContributions = contributions.filter(c => c.status === "pending");
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "topic": return <BookOpen className="h-4 w-4" />;
      case "problem": return <Code className="h-4 w-4" />;
      case "task": return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="mt-4">
              <span className="text-green-500 text-sm">
                {stat.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Research Contributions Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Research Contributions</h2>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingContributions.length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {contributions.filter(c => c.status === "approved").length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
          </div>
        </div>

        {pendingContributions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending contributions to review
          </div>
        ) : (
          <div className="space-y-4">
            {pendingContributions.slice(0, 5).map((contribution) => (
              <div key={contribution.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(contribution.type)}
                      <h3 className="font-medium text-gray-900">{contribution.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contribution.status)}`}>
                        {contribution.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {contribution.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{contribution.subject.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      <span>{contribution.difficulty}</span>
                      <span>by {contribution.submittedBy}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setSelectedContribution(contribution)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleApprove(contribution.id)}
                      className="text-green-600 hover:text-green-900"
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
                      className="text-red-600 hover:text-red-900"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {pendingContributions.length > 5 && (
              <div className="text-center pt-4">
                <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                  View all {pendingContributions.length} pending contributions
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(selectedContribution.type)}
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedContribution.title}
                    </h2>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedContribution.status)}`}>
                      {selectedContribution.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{selectedContribution.difficulty}</span>
                    <span>{selectedContribution.subject.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContribution(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedContribution.description}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Submitted by: {selectedContribution.submittedBy}</span>
                    <span>{new Date(selectedContribution.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedContribution(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedContribution.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
