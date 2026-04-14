import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { submitCourseForApproval, getCourseSubmissions } from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";

interface UserCourseUpload {
  id: string;
  name: string;
  pdfFile: File | null;
  universityId: string;
  degreeId: string;
  courseId: string;
  status: 'uploaded' | 'processing' | 'completed';
  uploadedAt: string;
}

export default function CourseUpload() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [uploadedCourses, setUploadedCourses] = useState<UserCourseUpload[]>([]);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    universityId: '',
    degreeId: '',
    courseId: '',
    pdfFile: null as File | null
  });

  const rgpvSubjects = [
    { id: 'BT-101', name: 'Engineering Chemistry' },
    { id: 'BT-102', name: 'Mathematics-I' },
    { id: 'BT-103', name: 'English for Communication' },
    { id: 'BT-104', name: 'Basic Electrical & Electronics Engineering' },
    { id: 'BT-105', name: 'Engineering Graphics' },
    { id: 'BT-106', name: 'Workshop Practice' },
    { id: 'BT-107', name: 'Internship-I' },
    { id: 'BT-108', name: 'Swachh Bharat Summer Internship' },
    { id: 'BT-201', name: 'Engineering Physics' },
    { id: 'BT-202', name: 'Mathematics-II' },
    { id: 'BT-203', name: 'Basic Mechanical Engineering' },
    { id: 'BT-204', name: 'Basic Civil Engineering & Mechanics' },
    { id: 'BT-205', name: 'Basic Computer Engineering' },
    { id: 'BT-206', name: 'Language Lab & Seminars' },
  ];

  // Load existing courses from shared storage
  useEffect(() => {
    const courses = getCourseSubmissions()
      .filter(course => course.submittedBy === user?.email)
      .map(course => ({
        id: course.id,
        name: course.name,
        pdfFile: course.pdfFile,
        universityId: course.universityId,
        degreeId: course.degreeId,
        courseId: course.courseId,
        status: course.status as 'uploaded' | 'processing' | 'completed',
        uploadedAt: course.submittedAt
      }));
    setUploadedCourses(courses);
  }, [user]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadForm(prev => ({ ...prev, pdfFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.pdfFile || !uploadForm.name.trim() || !user) return;

    try {
      // Submit course for approval using shared storage
      const submission = await submitCourseForApproval({
        name: uploadForm.name,
        pdfFile: uploadForm.pdfFile,
        submittedBy: user.email,
        universityId: uploadForm.universityId,
        degreeId: uploadForm.degreeId,
        courseId: uploadForm.courseId
      });

      // Update local state to show the uploaded course
      const newCourse: UserCourseUpload = {
        id: submission.id,
        name: submission.name,
        pdfFile: uploadForm.pdfFile,
        status: 'uploaded',
        uploadedAt: submission.submittedAt,
        universityId: submission.universityId,
        degreeId: submission.degreeId,
        courseId: submission.courseId
      };

      setUploadedCourses(prev => [...prev, newCourse]);
      setUploadForm({ name: '', universityId: '', degreeId: '', courseId: '', pdfFile: null });
      
      console.log('Course submitted for approval:', submission);
    } catch (error) {
      console.error('Failed to submit course:', error);
    }
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Upload Course
        </h1>

        {/* Upload Form */}
        <div className={`mb-8 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Upload New Course Material
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Course Name
              </label>
              <input
                type="text"
                value={uploadForm.name}
                onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter course name"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                University
              </label>
              <select
                value={uploadForm.universityId}
                onChange={(e) => setUploadForm(prev => ({ ...prev, universityId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                <option value="">Select University</option>
                <option value="3">Rajiv Gandhi Proudyogiki Vishwavidyalaya</option>
                <option value="1">Stanford University</option>
                <option value="2">MIT</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Degree
              </label>
              <select
                value={uploadForm.degreeId}
                onChange={(e) => setUploadForm(prev => ({ ...prev, degreeId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                <option value="">Select Degree</option>
                <option value="bt">Bachelor of Technology</option>
                <option value="ms">Masters of Technology</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Subject (Course ID)
              </label>
              <select
                value={uploadForm.courseId}
                onChange={(e) => setUploadForm(prev => ({ ...prev, courseId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                <option value="">Select Subject</option>
                {rgpvSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                PDF File
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
                {uploadForm.pdfFile && (
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {uploadForm.pdfFile.name}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Course Material
            </button>
          </form>
        </div>

        {/* Uploaded Courses */}
        <div className="space-y-4">
          <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Uploaded Courses
          </h2>
          
          {uploadedCourses.length === 0 ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No courses uploaded yet
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedCourses.map((course) => (
                <div key={course.id} className={`p-4 rounded-lg border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {course.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        University: {course.universityId} | Degree: {course.degreeId} | Course: {course.courseId}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Uploaded: {new Date(course.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        course.status === 'uploaded' 
                          ? 'bg-green-100 text-green-800' 
                          : course.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
