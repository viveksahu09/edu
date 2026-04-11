import React, { useState } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { universities } from "../data/universities";
import SubjectBrowser from "../components/subjects/SubjectBrowser";
import type { Course, Degree, Subject } from "../types/university";
import Layout from "../components/layout/Layout";
import { useTheme } from "../context/ThemeContext";

export default function UniversityDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedDegrees, setSelectedDegrees] = useState<Degree[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const university = universities.find((u) => u.slug === slug);

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
                          className={`text-gray-600 mb4 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {subject.notes}
                        </p>
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
