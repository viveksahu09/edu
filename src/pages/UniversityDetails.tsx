import { useState, useEffect } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { universities } from "../data/universities";
import SubjectBrowser from "../components/subjects/SubjectBrowser";
import type { Course, Degree, Subject } from "../types/university";
import Layout from "../components/layout/Layout";
import { useTheme } from "../context/ThemeContext";
import { getCourseSubmissions, fixCourseSubjectMappings } from "../services/courseService";
import { Download, BookOpen } from "lucide-react";

export default function UniversityDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedDegrees, setSelectedDegrees] = useState<Degree[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const [approvedCourses, setApprovedCourses] = useState<any[]>([]);

  const university = universities.find((u) => u.slug === slug);

  useEffect(() => {
    // Fix existing course mappings (one-time fix)
    fixCourseSubjectMappings();
    
    // Load approved courses
    const courses = getCourseSubmissions().filter(course => course.status === 'approved');
    setApprovedCourses(courses);
  }, []);

  if (!university) {
    return <div>University not found</div>;
  }

  const degreeOptions =
    university?.degree.map((deg) => ({
      value: deg,
      label: deg.name,
    })) || [];

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubjects((prev) => {
      if (prev.some((s) => s.id === subject.id)) {
        return prev;
      }
      return [...prev, subject];
    });
    setIsBrowserOpen(true);
  };

  const getApprovedCoursesForSubject = (subject: Subject) => {
    // Debug logging
    console.log('Filtering courses for subject:', {
      subjectId: subject.id,
      subjectName: subject.name,
      universityId: university.id,
      universityName: university.name,
      totalApprovedCourses: approvedCourses.length
    });
    
    const filteredCourses = approvedCourses.filter(course => {
      // Handle multiple possible course IDs for the same course
      const matches = (course.courseId === subject.id || 
                     // Handle case where CS-101 should map to BT-205
                     (course.courseId === 'CS-101' && subject.id === 'BT-205') ||
                     // Handle case where course name matches
                     (course.name === 'Basic Computer Engineering Materials' && subject.id === 'BT-205')) &&
                     course.universityId === university.id.toString();
      
      if (matches) {
        console.log('Found matching course:', course);
      }
      
      return matches;
    });
    
    console.log('Filtered courses count:', filteredCourses.length);
    return filteredCourses;
  };

  return (
    <Layout>
      <div
        className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div
          className="h-80 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${university.image})` }}
        >
          <div
            className={`absolute inset-0 ${
              isDarkMode ? "bg-black/75" : "bg-black/60"
            } flex flex-col items-center justify-center`}
          >
            <h1 className="text-4xl font-bold text-white">{university.name}</h1>
            <div className="flex items-center justify-center space-x-4 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center">
                <div className="w-96">
                  <Select
                    isMulti={false}
                    options={degreeOptions}
                    value={
                      degreeOptions.find((option) =>
                        selectedDegrees.some(
                          (deg) => deg.id === option.value.id
                        )
                      ) || null
                    }
                    onChange={(selected) => {
                      setSelectedDegrees(selected ? [selected.value] : []);
                      setSelectedCourse(null);
                    }}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {/* Display All Degrees */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              Available Degrees
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {university.degree.map((degree) => (
                <div 
                  key={degree.id} 
                  onClick={() => {
                    setSelectedDegrees([degree]);
                    setSelectedCourse(null);
                  }}
                  className={`p-6 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                    selectedDegrees.some(selected => selected.id === degree.id)
                      ? "bg-indigo-600 text-white shadow-lg"
                      : isDarkMode 
                        ? "bg-gray-800 text-white hover:bg-gray-700 shadow-md" 
                        : "bg-white text-gray-900 hover:bg-gray-50 shadow-md"
                  }`}>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    selectedDegrees.some(selected => selected.id === degree.id)
                      ? "text-white"
                      : isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    {degree.name}
                  </h3>
                  <p className={`text-sm ${
                    selectedDegrees.some(selected => selected.id === degree.id)
                      ? "text-indigo-100"
                      : isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {degree.courses?.length || 0} courses available
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Course Selection */}
          <div className="flex flex-wrap gap-4 mb-8">
            {selectedDegrees.flatMap((degree) =>
              degree.courses.map((course) => (
                <button
                  key={`${degree.id}-${course.id}`}
                  onClick={() => {
                    setSelectedCourse(course);
                    setSelectedSemester(null);
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedCourse?.id === course.id
                      ? "bg-indigo-600 text-white"
                      : isDarkMode
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {course.name}
                </button>
              ))
            )}
          </div>

          {/* Semester and Subject Display */}
          {selectedCourse && (
            <div className="space-y-8">
              <div className="flex flex-wrap gap-4">
                {selectedCourse.semesters.map((semester) => (
                  <button
                    key={semester.number}
                    onClick={() => setSelectedSemester(semester.number)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      selectedSemester === semester.number
                        ? "bg-indigo-600 text-white"
                        : isDarkMode
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Semester {semester.number}
                  </button>
                ))}
              </div>

              {selectedSemester && (
                <div className="grid grid-cols-2 gap-6">
                  {selectedCourse.semesters
                    .find((sem) => sem.number === selectedSemester)
                    ?.subjects.map((subject) => (
                      <div
                        key={subject.id}
                        onClick={() => handleSubjectClick(subject)}
                        className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                          isDarkMode
                            ? "bg-gray-800 text-white hover:bg-gray-700"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <h3 className="text-xl font-semibold mb-4">
                          {subject.name}
                        </h3>
                        <p
                          className={`text-gray-600 mb-4 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {subject.notes}
                        </p>

                        {/* Approved Courses Section */}
                        {(() => {
                          const subjectCourses = getApprovedCoursesForSubject(subject);
                          if (subjectCourses.length > 0) {
                            return (
                              <div className={`mt-4 pt-4 border-t ${
                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                              }`}>
                                <div className="flex items-center gap-2 mb-3">
                                  <BookOpen className="h-4 w-4 text-indigo-600" />
                                  <h4 className="font-semibold text-sm">
                                    Approved Course Materials ({subjectCourses.length})
                                  </h4>
                                </div>
                                <div className="space-y-2">
                                  {subjectCourses.map((course) => (
                                    <div
                                      key={course.id}
                                      className={`p-3 rounded-lg text-sm ${
                                        isDarkMode 
                                          ? 'bg-gray-700 text-gray-300' 
                                          : 'bg-gray-50 text-gray-700'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="font-medium text-xs mb-1">
                                            {course.name}
                                          </div>
                                          <div className="text-xs opacity-75">
                                            by {course.submittedBy} on {new Date(course.submittedAt).toLocaleDateString()}
                                          </div>
                                          {course.pdfFileName && (
                                            <div className="text-xs opacity-75 mt-1">
                                              File: {course.pdfFileName}
                                            </div>
                                          )}
                                        </div>
                                        <button
                                          onClick={() => {
                                            alert(`Downloading ${course.pdfFileName || 'course material'} for ${course.name}`);
                                          }}
                                          className="flex items-center gap-1 px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition-colors"
                                        >
                                          <Download className="h-3 w-3" />
                                          Download
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subject Browser */}
        <SubjectBrowser
          isOpen={isBrowserOpen}
          onClose={() => {
            setIsBrowserOpen(false);
            setSelectedSubjects([]);
          }}
          subjects={selectedSubjects}
          universityName={university.name}
        />
      </div>
    </Layout>
  );
}
