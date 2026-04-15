import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { getCourseSubmissions, updateCourseStatus, updateCoursePdf } from "../../services/courseService";

interface PendingCourse {
  id: string;
  name: string;
  pdfFile: File | null | string;
  pdfFileName?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
  universityId: string;
  degreeId: string;
  courseId: string;
  updatedAt?: string;
}

export default function CourseManagement() {
  const { isDarkMode } = useTheme();
  const [pendingCourses, setPendingCourses] = useState<PendingCourse[]>([]);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    universityId: '',
    degreeId: '',
    courseId: '',
    pdfFile: null as File | null
  });

  // Load courses from shared storage
  useEffect(() => {
    const courses = getCourseSubmissions();
    setPendingCourses(courses);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadForm(prev => ({ ...prev, pdfFile: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.pdfFile || !uploadForm.name.trim()) return;

    const newCourse: PendingCourse = {
      id: Date.now().toString(),
      name: uploadForm.name,
      pdfFile: uploadForm.pdfFile,
      status: 'pending',
      submittedBy: 'Admin User',
      submittedAt: new Date().toISOString(),
      universityId: uploadForm.universityId,
      degreeId: uploadForm.degreeId,
      courseId: uploadForm.courseId
    };

    setPendingCourses(prev => [...prev, newCourse]);
    setUploadForm({ name: '', universityId: '', degreeId: '', courseId: '', pdfFile: null });
    
    console.log('Course submitted for approval:', newCourse);
  };

  const handleApprove = (courseId: string) => {
    updateCourseStatus(courseId, 'approved');
    setPendingCourses(prev => 
      prev.map(course => 
        course.id === courseId 
          ? { ...course, status: 'approved' as const }
          : course
      )
    );
  };

  const handleReject = (courseId: string) => {
    updateCourseStatus(courseId, 'rejected');
    setPendingCourses(prev => 
      prev.map(course => 
        course.id === courseId 
          ? { ...course, status: 'rejected' as const }
          : course
      )
    );
  };

  const handlePdfChange = (courseId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const success = updateCoursePdf(courseId, file);
      if (success) {
        // Refresh the courses list
        const updatedCourses = getCourseSubmissions();
        setPendingCourses(updatedCourses);
        alert('PDF updated successfully!');
      }
    }
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Course Management
        </h1>

        {/* Upload Form */}
        <div className={`mb-8 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Add New Course
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
                <option value="1">Rajiv Gandhi Proudyogiki Vishwavidyalaya</option>
                <option value="2">Stanford University</option>
                <option value="3">MIT</option>
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
                Course ID
              </label>
              <input
                type="text"
                value={uploadForm.courseId}
                onChange={(e) => setUploadForm(prev => ({ ...prev, courseId: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter course ID"
                required
              />
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
              Submit for Approval
            </button>
          </form>
        </div>

        {/* Pending Courses */}
        <div className="space-y-4">
          <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Pending Courses
          </h2>
          
          {pendingCourses.length === 0 ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No pending courses
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCourses.map((course) => (
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
                        Submitted: {new Date(course.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : course.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.status}
                      </span>
                      
                      {course.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApprove(course.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                            title="Approve"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleReject(course.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                            title="Reject"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          {/* PDF Change Button */}
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handlePdfChange(course.id, e)}
                              className="hidden"
                              id={`admin-pdf-change-${course.id}`}
                            />
                            <label
                              htmlFor={`admin-pdf-change-${course.id}`}
                              className="cursor-pointer inline-flex items-center p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                              title="Change PDF"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </label>
                          </div>
                        </div>
                      )}
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
