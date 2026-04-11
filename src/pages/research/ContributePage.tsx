import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  BookOpen, 
  Code, 
  Target, 
  Send, 
  CheckCircle,
  AlertCircle,
  FileText,
  Edit3,
  Lightbulb
} from "lucide-react";

interface ContributionData {
  type: "topic" | "problem" | "task";
  title: string;
  description: string;
  subject: string;
  customSubject?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime?: string;
  hints?: string[];
  overview?: string;
  keyConcepts?: string[];
  relatedTopics?: string[];
  practiceProblems?: string[];
  projectTasks?: string[];
  resources?: Array<{
    title: string;
    type: "article" | "video" | "pdf" | "external";
    url: string;
    description: string;
  }>;
  notes?: string[];
  existingTopicId?: string;
}

const ContributePage = () => {
  const [contributionType, setContributionType] = useState<"topic" | "problem" | "task">("topic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState<ContributionData>({
    type: "topic",
    title: "",
    description: "",
    subject: "web-dev",
    difficulty: "Easy",
    estimatedTime: "",
    hints: [],
    overview: "",
    keyConcepts: [],
    relatedTopics: [],
    resources: [],
    notes: [],
    existingTopicId: ""
  });

  const subjects = [
    { id: "web-dev", name: "Web Development" },
    { id: "dsa", name: "Data Structures" },
    { id: "dbms", name: "DBMS" },
    { id: "os", name: "Operating System" }
  ];

  const existingTopics = {
    "web-dev": ["html", "css", "javascript", "react", "tailwind"],
    "dsa": ["arrays", "linked-lists", "trees", "graphs"],
    "dbms": ["sql-basics", "joins", "normalization"],
    "os": ["processes", "memory", "file-systems"]
  };

  const handleInputChange = (field: keyof ContributionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: "hints" | "keyConcepts" | "relatedTopics" | "notes", value: string) => {
    const items = value.split(",").map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call to submit contribution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store in localStorage for demo (in real app, this would be an API call)
      const contributions = JSON.parse(localStorage.getItem("researchContributions") || "[]");
      const newContribution = {
        ...formData,
        id: Date.now().toString(),
        status: "pending",
        submittedBy: "current-user", // In real app, get from auth context
        submittedAt: new Date().toISOString(),
        type: contributionType
      };
      
      localStorage.setItem("researchContributions", JSON.stringify([...contributions, newContribution]));
      
      setSubmitStatus("success");
      // Reset form
      setFormData({
        type: contributionType,
        title: "",
        description: "",
        subject: "web-dev",
        difficulty: "Easy",
        estimatedTime: "",
        hints: [],
        overview: "",
        keyConcepts: [],
        relatedTopics: [],
        resources: [],
        notes: [],
        existingTopicId: ""
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/research"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Research
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Contribute to Research Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Share your knowledge by adding new topics, problems, and tasks. Your contributions will be reviewed and approved by admins.
            </p>
          </div>
        </div>

        {/* Contribution Type Selector - Card Layout */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            What would you like to contribute?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => setContributionType("topic")}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group ${
                contributionType === "topic" ? "ring-2 ring-indigo-500 ring-offset-2" : ""
              }`}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  New Topic
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Add a complete topic with overview, problems, and tasks
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Comprehensive contribution
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    contributionType === "topic" ? "bg-indigo-500" : "bg-gray-300"
                  }`}></div>
                </div>
              </div>
            </div>

            <div
              onClick={() => setContributionType("problem")}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group ${
                contributionType === "problem" ? "ring-2 ring-indigo-500 ring-offset-2" : ""
              }`}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Practice Problem
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Add a coding problem to an existing topic
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Quick contribution
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    contributionType === "problem" ? "bg-indigo-500" : "bg-gray-300"
                  }`}></div>
                </div>
              </div>
            </div>

            <div
              onClick={() => setContributionType("task")}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group ${
                contributionType === "task" ? "ring-2 ring-indigo-500 ring-offset-2" : ""
              }`}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Project Task
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Add a hands-on project task to an existing topic
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Practical contribution
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    contributionType === "task" ? "bg-indigo-500" : "bg-gray-300"
                  }`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {contributionType && (
            <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  contributionType === "topic" ? "bg-blue-500" :
                  contributionType === "problem" ? "bg-green-500" : "bg-purple-500"
                }`}>
                  {contributionType === "topic" ? <BookOpen className="h-5 w-5 text-white" /> :
                   contributionType === "problem" ? <Code className="h-5 w-5 text-white" /> :
                   <Target className="h-5 w-5 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {contributionType === "topic" ? "New Topic" : 
                     contributionType === "problem" ? "Practice Problem" : "Project Task"} Contribution
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {contributionType === "topic" ? "Create a complete learning topic" :
                     contributionType === "problem" ? "Add a coding problem to existing topic" :
                     "Add a hands-on project task"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select existing subject or choose "Custom"</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                  <option value="custom">+ Add Custom Subject</option>
                </select>
              </div>
              
              {formData.subject === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Subject Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customSubject || ""}
                    onChange={(e) => handleInputChange("customSubject", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Machine Learning, Artificial Intelligence"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange("difficulty", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {contributionType === "topic" ? "Topic Title" : contributionType === "problem" ? "Problem Title" : "Task Title"} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder={contributionType === "topic" ? "e.g., Advanced React Patterns" : "e.g., Build a Todo App"}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder={contributionType === "topic" 
                  ? "Provide a comprehensive overview of this topic..." 
                  : "Describe what students should do or solve..."
                }
                required
              />
            </div>

            {/* Topic-specific fields */}
            {contributionType === "topic" && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Topic Overview *
                  </label>
                  <textarea
                    value={formData.overview}
                    onChange={(e) => handleInputChange("overview", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Provide detailed explanation of the topic..."
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Concepts (comma-separated)
                  </label>
                  <input
                    type="text"
                    onChange={(e) => handleArrayInput("keyConcepts", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Components, State, Props, Hooks"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Related Topics (comma-separated)
                  </label>
                  <input
                    type="text"
                    onChange={(e) => handleArrayInput("relatedTopics", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., JavaScript, HTML, CSS"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Practice Problems (one per line)
                  </label>
                  <textarea
                    value={formData.practiceProblems?.join('\n') || ''}
                    onChange={(e) => handleInputChange("practiceProblems", e.target.value.split('\n').filter(p => p.trim()))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="1. Implement linear regression from scratch&#10;2. Build a simple email spam classifier&#10;3. Create a basic recommendation system"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Tasks (one per line, include time estimate)
                  </label>
                  <textarea
                    value={formData.projectTasks?.join('\n') || ''}
                    onChange={(e) => handleInputChange("projectTasks", e.target.value.split('\n').filter(t => t.trim()))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="1. House Price Prediction (2 hours)&#10;2. Customer Churn Prediction (1.5 hours)&#10;3. Image Classification Basics (2 hours)"
                  />
                </div>
              </>
            )}

            {/* Problem-specific fields */}
            {contributionType === "problem" && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Topic *
                  </label>
                  <select
                    value={formData.existingTopicId}
                    onChange={(e) => handleInputChange("existingTopicId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a topic</option>
                    {existingTopics[formData.subject as keyof typeof existingTopics]?.map(topicId => (
                      <option key={topicId} value={topicId}>
                        {topicId.charAt(0).toUpperCase() + topicId.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hints (comma-separated)
                  </label>
                  <input
                    type="text"
                    onChange={(e) => handleArrayInput("hints", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Use recursion, Consider edge cases, Test with examples"
                  />
                </div>
              </>
            )}

            {/* Estimated Time for all contribution types */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Time *
              </label>
              <input
                type="text"
                value={formData.estimatedTime}
                onChange={(e) => handleInputChange("estimatedTime", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 3 hours, 2 hours 30 minutes"
                required
              />
            </div>

            {/* Task-specific fields */}
            {contributionType === "task" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Topic *
                </label>
                <select
                  value={formData.existingTopicId}
                  onChange={(e) => handleInputChange("existingTopicId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select a topic</option>
                  {existingTopics[formData.subject as keyof typeof existingTopics]?.map(topicId => (
                    <option key={topicId} value={topicId}>
                      {topicId.charAt(0).toUpperCase() + topicId.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Learning Resources field for topics */}
            {contributionType === "topic" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Learning Resources (one per line: title|type|url|description)
                </label>
                <textarea
                  value={formData.resources?.map(r => `${r.title}|${r.type}|${r.url}|${r.description}`).join('\n') || ''}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(line => line.trim());
                    const resources = lines.map(line => {
                      const [title, type, url, description] = line.split('|').map(part => part.trim());
                      return { title, type: type as any, url, description: description || '' };
                    }).filter(r => r.title && r.type && r.url);
                    handleInputChange("resources", resources);
                  }}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Machine Learning Basics|article|https://example.com/ml-basics|Introduction to ML concepts&#10;Python ML Tutorial|video|https://youtube.com/watch?v=...|Video tutorial&#10;ML Handbook|pdf|https://example.com/ml-handbook.pdf|Comprehensive guide"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Format: title|type|url|description (Types: article, video, pdf, external)
                </p>
              </div>
            )}

            {/* Notes field for all types */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes (comma-separated)
              </label>
              <input
                type="text"
                onChange={(e) => handleArrayInput("notes", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Best practices, Common mistakes, Tips"
              />
            </div>

            {/* Submit Status */}
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 dark:text-green-200">
                    Your contribution has been submitted successfully! It will be reviewed by admins soon.
                  </span>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 dark:text-red-200">
                    There was an error submitting your contribution. Please try again.
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit for Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Contribution Guidelines</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li> submissions are reviewed by admins within 24-48 hours</li>
                <li>Ensure content is educational and appropriate for college students</li>
                <li>Provide clear explanations and step-by-step instructions</li>
                <li>Include relevant hints and resources when possible</li>
                <li>Quality contributions help everyone learn better!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributePage;
