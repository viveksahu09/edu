import React, { useState, useEffect } from "react";
import { BookOpen, Download, Calendar, User, Filter, Search } from "lucide-react";
import { getCourseSubmissions } from "../services/courseService";
import { useTheme } from "../context/ThemeContext";

interface Course {
  id: string;
  name: string;
  universityId: string;
  degreeId: string;
  courseId: string;
  submittedBy: string;
  submittedAt: string;
  pdfFileName?: string;
}

export default function ApprovedCourses() {
  const { isDarkMode } = useTheme();
  const [approvedCourses, setApprovedCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedDegree, setSelectedDegree] = useState("all");

  useEffect(() => {
    // Load approved courses
    const courses = getCourseSubmissions()
      .filter(course => course.status === 'approved')
      .map(course => ({
        id: course.id,
        name: course.name,
        universityId: course.universityId,
        degreeId: course.degreeId,
        courseId: course.courseId,
        submittedBy: course.submittedBy,
        submittedAt: course.submittedAt,
        pdfFileName: course.pdfFileName
      }));
    
    setApprovedCourses(courses);
    setFilteredCourses(courses);
  }, []);

  useEffect(() => {
    // Filter courses based on search and filters
    let filtered = approvedCourses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedUniversity !== "all") {
      filtered = filtered.filter(course => course.universityId === selectedUniversity);
    }

    if (selectedDegree !== "all") {
      filtered = filtered.filter(course => course.degreeId === selectedDegree);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedUniversity, selectedDegree, approvedCourses]);

  const getUniversityName = (id: string) => {
    const universities: { [key: string]: string } = {
      "1": "Rajiv Gandhi Proudyogiki Vishwavidyalaya",
      "2": "Stanford University", 
      "3": "MIT"
    };
    return universities[id] || `University ${id}`;
  };

  const getDegreeName = (id: string) => {
    const degrees: { [key: string]: string } = {
      "bt": "Bachelor of Technology",
      "ms": "Masters of Technology"
    };
    return degrees[id] || id;
  };

  const handleDownload = (course: Course) => {
    // In a real application, this would download the actual PDF
    // For now, we'll show a message
    alert(`Downloading ${course.pdfFileName || 'course material'} for ${course.name}`);
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Approved Courses
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Browse and download course materials approved by our admin team
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Courses
                </p>
                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {approvedCourses.length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Universities
                </p>
                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {[...new Set(approvedCourses.map(c => c.universityId))].length}
                </p>
              </div>
              <div className="h-8 w-8 text-indigo-600">U</div>
            </div>
          </div>
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Contributors
                </p>
                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {[...new Set(approvedCourses.map(c => c.submittedBy))].length}
                </p>
              </div>
              <User className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="all">All Universities</option>
              <option value="1">Rajiv Gandhi Proudyogiki Vishwavidyalaya</option>
              <option value="2">Stanford University</option>
              <option value="3">MIT</option>
            </select>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="all">All Degrees</option>
              <option value="bt">Bachelor of Technology</option>
              <option value="ms">Masters of Technology</option>
            </select>
          </div>
        </div>

        {/* Course List */}
        {filteredCourses.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              No approved courses found
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {approvedCourses.length === 0 
                ? "No courses have been approved yet. Check back later!"
                : "Try adjusting your search or filters."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {course.name}
                    </h3>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                      <p>Course ID: {course.courseId}</p>
                      <p>{getUniversityName(course.universityId)}</p>
                      <p>{getDegreeName(course.degreeId)}</p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Approved
                  </div>
                </div>
                
                <div className={`flex items-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mb-4`}>
                  <User className="h-3 w-3 mr-1" />
                  <span className="mr-3">{course.submittedBy}</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{new Date(course.submittedAt).toLocaleDateString()}</span>
                </div>

                {course.pdfFileName && (
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    <span className="font-medium">File:</span> {course.pdfFileName}
                  </div>
                )}

                <button
                  onClick={() => handleDownload(course)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Course Material
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
