import { useState, useEffect } from "react";
import { BookOpen, Search, Filter, Plus, Edit, Trash2, Eye, Users, FileText, TrendingUp } from "lucide-react";

interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  instructor: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "active" | "inactive" | "draft";
  enrolledCount: number;
  rating: number;
  duration: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    // Load courses from localStorage or generate sample data
    const storedCourses = localStorage.getItem("adminCourses");
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    } else {
      // Generate sample courses
      const sampleCourses: Course[] = [
        {
          id: "1",
          title: "Introduction to Computer Science",
          code: "CS101",
          description: "Fundamentals of programming and computer science concepts",
          instructor: "Dr. John Smith",
          category: "Computer Science",
          level: "beginner",
          status: "active",
          enrolledCount: 245,
          rating: 4.5,
          duration: "12 weeks",
          price: 99.99,
          createdAt: "2024-01-15",
          updatedAt: "2024-04-10"
        },
        {
          id: "2",
          title: "Advanced Web Development",
          code: "WD301",
          description: "Modern web development with React and Node.js",
          instructor: "Prof. Jane Doe",
          category: "Web Development",
          level: "advanced",
          status: "active",
          enrolledCount: 128,
          rating: 4.8,
          duration: "8 weeks",
          price: 149.99,
          createdAt: "2024-02-20",
          updatedAt: "2024-04-12"
        },
        {
          id: "3",
          title: "Data Science Fundamentals",
          code: "DS201",
          description: "Introduction to data analysis and machine learning",
          instructor: "Dr. Robert Johnson",
          category: "Data Science",
          level: "intermediate",
          status: "draft",
          enrolledCount: 0,
          rating: 0,
          duration: "10 weeks",
          price: 129.99,
          createdAt: "2024-03-10",
          updatedAt: "2024-04-14"
        },
        {
          id: "4",
          title: "Mobile App Development",
          code: "MA202",
          description: "Build native mobile applications with React Native",
          instructor: "Sarah Wilson",
          category: "Mobile Development",
          level: "intermediate",
          status: "inactive",
          enrolledCount: 67,
          rating: 4.2,
          duration: "6 weeks",
          price: 119.99,
          createdAt: "2024-01-25",
          updatedAt: "2024-03-15"
        }
      ];
      setCourses(sampleCourses);
      localStorage.setItem("adminCourses", JSON.stringify(sampleCourses));
    }
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    const matchesStatus = selectedStatus === "all" || course.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  const handleCourseAction = (action: string, courseId: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        switch (action) {
          case "activate":
            return { ...course, status: "active" as const };
          case "deactivate":
            return { ...course, status: "inactive" as const };
          case "delete":
            return null;
          default:
            return course;
        }
      }
      return course;
    }).filter(Boolean) as Course[];

    setCourses(updatedCourses);
    localStorage.setItem("adminCourses", JSON.stringify(updatedCourses));
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "draft": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    total: courses.length,
    active: courses.filter(c => c.status === "active").length,
    totalEnrolled: courses.reduce((sum, c) => sum + c.enrolledCount, 0),
    avgRating: courses.filter(c => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) / courses.filter(c => c.rating > 0).length || 0
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Management</h1>
        <p className="text-gray-600">Manage courses, content, and enrollment</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Enrolled</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalEnrolled}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)}</p>
            </div>
            <FileText className="h-8 w-8 text-yellow-600" />
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
                placeholder="Search courses..."
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
            <option value="Computer Science">Computer Science</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Mobile Development">Mobile Development</option>
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
          <button
            onClick={() => setShowCourseModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Course
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.code}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(course.status)}`}>
                  {course.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Instructor:</span>
                  <span className="text-gray-900">{course.instructor}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-gray-900">{course.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Level:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getLevelBadgeColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="text-gray-900">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="text-gray-900 font-semibold">${course.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Enrolled:</span>
                  <span className="text-gray-900">{course.enrolledCount} students</span>
                </div>
                {course.rating > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Rating:</span>
                    <span className="text-gray-900">{"\u2605".repeat(Math.floor(course.rating))}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowCourseModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="h-4 w-4" />
                  </button>
                  {course.status !== "active" && (
                    <button
                      onClick={() => handleCourseAction("activate", course.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <TrendingUp className="h-4 w-4" />
                    </button>
                  )}
                  {course.status === "active" && (
                    <button
                      onClick={() => handleCourseAction("deactivate", course.id)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <BookOpen className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleCourseAction("delete", course.id)}
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

      {filteredCourses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No courses found matching your criteria
        </div>
      )}
    </div>
  );
}
