import { useState, useEffect, useRef } from "react";
import { 
  Users, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  BookOpen, 
  Code, 
  Target, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search, 
  Upload,
  Home,
  Settings,
  Menu,
  X,
  Bell,
  User,
  Shield,
  BarChart3,
  MessageSquare
} from "lucide-react";
import { getCourseSubmissions, updateCourseStatus, analyzeCourseWithAI, batchAnalyzeCourses, getCoursesNeedingAIAnalysis, getAIAnalysisStats } from "../../services/courseService";
import { AIAnalysisResult } from "../../services/aiPdfChecker";

// Import admin page components
import UsersPage from "../admin/Users";
import CoursesPage from "../admin/Courses";
import DocumentsPage from "../admin/Documents";
import AnalyticsPage from "../admin/Analytics";
import MessagesPage from "../admin/Messages";
import SettingsPage from "../admin/Settings";
import SecurityPage from "../admin/Security";

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
  const [courseSubmissions, setCourseSubmissions] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New course submission pending", time: "5 min ago", read: false },
    { id: 2, message: "User registration completed", time: "1 hour ago", read: false },
    { id: 3, message: "System update available", time: "2 hours ago", read: true },
  ]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [aiAnalysisInProgress, setAiAnalysisInProgress] = useState<string[]>([]);
  const [selectedAIResult, setSelectedAIResult] = useState<AIAnalysisResult | null>(null);
  const [showAIResults, setShowAIResults] = useState(false);
  const [aiStats, setAiStats] = useState(getAIAnalysisStats());

  useEffect(() => {
    // Load contributions from localStorage
    const storedContributions = JSON.parse(localStorage.getItem("researchContributions") || "[]");
    setContributions(storedContributions);
    
    // Load course submissions
    const courses = getCourseSubmissions();
    setCourseSubmissions(courses);
    
    // Load AI stats
    setAiStats(getAIAnalysisStats());
  }, []);

  // Auto-save contributions when they change
  useEffect(() => {
    if (contributions.length > 0) {
      localStorage.setItem("researchContributions", JSON.stringify(contributions));
    }
  }, [contributions]);

  // Update AI stats when course submissions change
  useEffect(() => {
    setAiStats(getAIAnalysisStats());
  }, [courseSubmissions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showAIResults) {
          setShowAIResults(false);
          setSelectedAIResult(null);
        }
        if (selectedContribution) {
          setSelectedContribution(null);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showAIResults, selectedContribution]);

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

  const handleApproveCourse = (courseId: string) => {
    updateCourseStatus(courseId, 'approved');
    const updatedCourses = courseSubmissions.map(course =>
      course.id === courseId ? { ...course, status: 'approved' } : course
    );
    setCourseSubmissions(updatedCourses);
    setAiStats(getAIAnalysisStats()); // Update AI stats
  };

  const handleRejectCourse = (courseId: string) => {
    const reason = prompt("Rejection reason (optional):");
    if (reason !== null) {
      updateCourseStatus(courseId, 'rejected');
      const updatedCourses = courseSubmissions.map(course =>
        course.id === courseId ? { ...course, status: 'rejected' } : course
      );
      setCourseSubmissions(updatedCourses);
      setAiStats(getAIAnalysisStats()); // Update AI stats
    }
  };

  const handleAnalyzeWithAI = async (courseId: string) => {
    setAiAnalysisInProgress(prev => [...prev, courseId]);
    
    try {
      const result = await analyzeCourseWithAI(courseId);
      if (result) {
        // Update the course submissions with the new analysis
        const updatedCourses = getCourseSubmissions();
        setCourseSubmissions(updatedCourses);
        setAiStats(getAIAnalysisStats()); // Update AI stats
        setSelectedAIResult(result);
        setShowAIResults(true);
      } else {
        alert('AI analysis failed - no results returned');
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      alert('AI analysis failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setAiAnalysisInProgress(prev => prev.filter(id => id !== courseId));
    }
  };

  const handleBatchAnalyze = async () => {
    const coursesNeedingAnalysis = getCoursesNeedingAIAnalysis();
    const courseIds = coursesNeedingAnalysis.map(course => course.id);
    
    if (courseIds.length === 0) {
      alert('No courses need AI analysis');
      return;
    }

    setAiAnalysisInProgress(courseIds);
    
    try {
      await batchAnalyzeCourses(courseIds);
      // Update the course submissions with the new analysis
      const updatedCourses = getCourseSubmissions();
      setCourseSubmissions(updatedCourses);
      setAiStats(getAIAnalysisStats()); // Update AI stats
      alert(`Successfully analyzed ${courseIds.length} courses with AI`);
    } catch (error) {
      console.error('Batch AI analysis failed:', error);
      alert('AI analysis failed for some courses');
    } finally {
      setAiAnalysisInProgress([]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'needs_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notificationId: number) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, change: "+12%" },
    { title: "Documents", value: "856", icon: FileText, change: "+8%" },
    { title: "Revenue", value: "$12,345", icon: CreditCard, change: "+23%" },
    { title: "Downloads", value: "3,456", icon: TrendingUp, change: "+15%" },
  ];

  const pendingContributions = contributions.filter(c => c.status === "pending");
  
  // Filter functions for search
  const filteredContributions = contributions.filter(contribution =>
    contribution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contribution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contribution.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contribution.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCourseSubmissions = courseSubmissions.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.pdfFileName && course.pdfFileName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "topic": return <Target className="h-4 w-4" />;
      case "problem": return <Code className="h-4 w-4" />;
      case "task": return <BookOpen className="h-4 w-4" />;
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  // Render appropriate content based on active menu
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {stats.map((stat) => (
                <div key={stat.title} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>
              ))}
            </div>

            {/* Research Contributions Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
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

              {filteredContributions.filter(c => c.status === 'pending').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending contributions to review
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContributions
                    .filter(c => c.status === 'pending')
                    .slice(0, 5)
                    .map((contribution) => (
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
                </div>
              )}
            </div>

            {/* AI Analysis Statistics */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  AI Analysis Statistics
                </h2>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {aiStats.analyzed}
                    </div>
                    <div className="text-sm text-gray-600">Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {aiStats.averageScore}
                    </div>
                    <div className="text-sm text-gray-600">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {aiStats.confidenceAverage}%
                    </div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Total Courses</div>
                  <div className="text-xl font-bold text-gray-900">{aiStats.total}</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-sm text-gray-600">Pending Analysis</div>
                  <div className="text-xl font-bold text-yellow-600">{aiStats.total - aiStats.analyzed}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600">AI Approved</div>
                  <div className="text-xl font-bold text-green-600">{aiStats.approved}</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-sm text-gray-600">AI Rejected</div>
                  <div className="text-xl font-bold text-red-600">{aiStats.rejected}</div>
                </div>
              </div>
            </div>

            {/* Course Management Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5 text-indigo-600" />
                  Course Submissions
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBatchAnalyze}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                    disabled={aiAnalysisInProgress.length > 0}
                  >
                    <BarChart3 className="h-4 w-4" />
                    {aiAnalysisInProgress.length > 0 ? 'Analyzing...' : 'AI Batch Check'}
                  </button>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {courseSubmissions.filter(c => c.status === 'pending').length}
                      </div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {courseSubmissions.filter(c => c.status === 'approved').length}
                      </div>
                      <div className="text-sm text-gray-600">Approved</div>
                    </div>
                  </div>
                </div>
              </div>

              {courseSubmissions.filter(c => c.status === 'pending').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending course submissions to review
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCourseSubmissions
                    .filter(c => c.status === 'pending')
                    .slice(0, 5)
                    .map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Upload className="h-4 w-4 text-indigo-600" />
                            <h3 className="font-medium text-gray-900">{course.name}</h3>
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              {course.status}
                            </span>
                            {course.aiChecked && course.aiAnalysis && (
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(course.aiAnalysis.status)}`}>
                                AI: {course.aiAnalysis.status}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            University: {course.universityId} | Degree: {course.degreeId} | Course: {course.courseId}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>by {course.submittedBy}</span>
                            <span>{new Date(course.submittedAt).toLocaleDateString()}</span>
                            {course.pdfFileName && <span>File: {course.pdfFileName}</span>}
                          </div>
                          {course.aiAnalysis && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">AI Analysis Score:</span>
                                <span className={`text-sm font-bold ${getScoreColor(course.aiAnalysis.overallScore)}`}>
                                  {course.aiAnalysis.overallScore}/100
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                Confidence: {course.aiAnalysis.confidence}% | 
                                Processing: {course.aiAnalysis.processingTime}ms
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleAnalyzeWithAI(course.id)}
                            disabled={aiAnalysisInProgress.includes(course.id)}
                            className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                            title="Analyze with AI"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </button>
                          {course.aiAnalysis && (
                            <button
                              onClick={() => {
                                setSelectedAIResult(course.aiAnalysis);
                                setShowAIResults(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View AI Results"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleApproveCourse(course.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve Course"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectCourse(course.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject Course"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'users':
        return <UsersPage />;
      case 'courses':
        return <CoursesPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'security':
        return <SecurityPage />;
      default:
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {menuItems.find(item => item.id === activeMenu)?.label || 'Page'}
              </h2>
              <p className="text-gray-600">This page is under construction.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              {sidebarOpen && <span className="ml-3 text-xl font-bold text-gray-800">Admin</span>}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4" role="navigation">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center ${!sidebarOpen ? 'justify-center' : 'justify-start'} p-3 rounded-lg transition-colors ${
                      activeMenu === item.id
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    aria-label={item.label}
                    aria-current={activeMenu === item.id ? 'page' : undefined}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    {sidebarOpen && <span className="ml-3">{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className={`flex items-center ${!sidebarOpen ? 'justify-center' : 'justify-start'}`}>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              {sidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id)}
                          className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t">
                      <button 
                        onClick={handleMarkAllNotificationsRead}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
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

      {/* AI Results Modal */}
      {selectedAIResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Analysis Results</h2>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedAIResult.status)}`}>
                      {selectedAIResult.status.toUpperCase()}
                    </span>
                    <span className={`text-lg font-bold ${getScoreColor(selectedAIResult.overallScore)}`}>
                      Score: {selectedAIResult.overallScore}/100
                    </span>
                    <span className="text-sm text-gray-600">
                      Confidence: {selectedAIResult.confidence}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAIResult(null);
                    setShowAIResults(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Extracted Content */}
              {selectedAIResult.extractedContent && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Extracted Content</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Title:</span>
                      <p className="font-medium">{selectedAIResult.extractedContent.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Pages:</span>
                      <p className="font-medium">{selectedAIResult.extractedContent.pages}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Words:</span>
                      <p className="font-medium">{selectedAIResult.extractedContent.wordCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Author:</span>
                      <p className="font-medium">{selectedAIResult.extractedContent.author}</p>
                    </div>
                  </div>
                  {selectedAIResult.extractedContent.keyTopics.length > 0 && (
                    <div className="mt-3">
                      <span className="text-gray-600">Key Topics:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedAIResult.extractedContent.keyTopics.map((topic, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Analysis Breakdown */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Analysis Breakdown</h3>
                
                {Object.entries(selectedAIResult.analysis).map(([key, analysis]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <span className={`font-bold ${getScoreColor(analysis.score)}`}>
                        {analysis.score}/100
                      </span>
                    </div>
                    
                    {analysis.feedback.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-green-700">Positive Feedback:</span>
                        <ul className="text-sm text-gray-600 mt-1 space-y-1">
                          {analysis.feedback.map((feedback, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500">+</span>
                              {feedback}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysis.issues.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-red-700">Issues Found:</span>
                        <ul className="text-sm text-gray-600 mt-1 space-y-1">
                          {analysis.issues.map((issue, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-500">!</span>
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {selectedAIResult.recommendations.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {selectedAIResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                        <span className="text-blue-600">»</span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Processing Info */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Processing Time: {selectedAIResult.processingTime}ms</span>
                  <span>Analysis ID: {selectedAIResult.id}</span>
                  <span>File: {selectedAIResult.fileName}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedAIResult(null);
                    setShowAIResults(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
