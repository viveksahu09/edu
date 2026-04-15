import { useState, useEffect } from "react";
import { MessageSquare, Search, Send, Reply, Trash2, Star, Archive, User, Clock } from "lucide-react";

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: string;
  senderEmail: string;
  timestamp: string;
  status: "unread" | "read" | "archived";
  priority: "low" | "medium" | "high";
  category: "inquiry" | "support" | "feedback" | "other";
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    // Load messages from localStorage or generate sample data
    const storedMessages = localStorage.getItem("adminMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Generate sample messages
      const sampleMessages: Message[] = [
        {
          id: "1",
          subject: "Course Enrollment Issue",
          content: "I'm having trouble enrolling in the Advanced Web Development course. Can you help me with this?",
          sender: "John Doe",
          senderEmail: "john.doe@example.com",
          timestamp: "2024-04-15 10:30 AM",
          status: "unread",
          priority: "high",
          category: "support"
        },
        {
          id: "2",
          subject: "Feedback on Platform",
          content: "The platform is great! I especially love the AI analysis feature for PDFs. Keep up the good work!",
          sender: "Jane Smith",
          senderEmail: "jane.smith@example.com",
          timestamp: "2024-04-15 09:15 AM",
          status: "read",
          priority: "medium",
          category: "feedback"
        },
        {
          id: "3",
          subject: "Question about Course Content",
          content: "Is there a prerequisite for the Data Science Fundamentals course? I'm interested in enrolling.",
          sender: "Bob Johnson",
          senderEmail: "bob.johnson@example.com",
          timestamp: "2024-04-14 03:45 PM",
          status: "read",
          priority: "low",
          category: "inquiry"
        },
        {
          id: "4",
          subject: "Technical Issue with Document Upload",
          content: "I'm unable to upload my PDF document. The system keeps showing an error message.",
          sender: "Alice Brown",
          senderEmail: "alice.brown@example.com",
          timestamp: "2024-04-14 11:20 AM",
          status: "archived",
          priority: "high",
          category: "support"
        }
      ];
      setMessages(sampleMessages);
      localStorage.setItem("adminMessages", JSON.stringify(sampleMessages));
    }
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || message.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || message.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleMessageAction = (action: string, messageId: string) => {
    const updatedMessages = messages.map(message => {
      if (message.id === messageId) {
        switch (action) {
          case "read":
            return { ...message, status: "read" as const };
          case "archive":
            return { ...message, status: "archived" as const };
          case "delete":
            return null;
          default:
            return message;
        }
      }
      return message;
    }).filter(Boolean) as Message[];

    setMessages(updatedMessages);
    localStorage.setItem("adminMessages", JSON.stringify(updatedMessages));
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "unread": return "bg-blue-100 text-blue-800";
      case "read": return "bg-gray-100 text-gray-800";
      case "archived": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === "unread").length,
    high: messages.filter(m => m.priority === "high").length,
    today: messages.filter(m => m.timestamp.startsWith(new Date().toISOString().split('T')[0])).length
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Message Center</h1>
        <p className="text-gray-600">Manage user inquiries and support requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.high}</p>
            </div>
            <Star className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.today}</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
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
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="inquiry">Inquiry</option>
            <option value="support">Support</option>
            <option value="feedback">Feedback</option>
            <option value="other">Other</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredMessages.map((message) => (
            <div key={message.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{message.sender}</span>
                      <span className="text-sm text-gray-500">({message.senderEmail})</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadgeColor(message.priority)}`}>
                      {message.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(message.status)}`}>
                      {message.status}
                    </span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{message.subject}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{message.content}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Category: {message.category}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedMessage(message)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  {message.status !== "read" && (
                    <button
                      onClick={() => handleMessageAction("read", message.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedMessage(message);
                      setShowReplyModal(true);
                    }}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Reply className="h-4 w-4" />
                  </button>
                  {message.status !== "archived" && (
                    <button
                      onClick={() => handleMessageAction("archive", message.id)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleMessageAction("delete", message.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No messages found matching your criteria
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadgeColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(selectedMessage.status)}`}>
                      {selectedMessage.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{selectedMessage.sender} ({selectedMessage.senderEmail})</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Clock className="h-4 w-4" />
                  <span>{selectedMessage.timestamp}</span>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-gray-700">{selectedMessage.content}</p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowReplyModal(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Reply className="h-4 w-4" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
