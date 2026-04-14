import { useState } from 'react';
import { Search, Plus, X, ChevronRight } from 'lucide-react';
import { universities } from '../../data/universities';

interface ProgressiveDataBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  initialData?: {
    university?: any;
  };
}

export default function ProgressiveDataBuilder({ 
  isOpen, 
  onClose, 
  onComplete,
  initialData
}: ProgressiveDataBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<any>(initialData?.university || null);
  const [selectedDegree, setSelectedDegree] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formData, setFormData] = useState({
    universityName: '',
    degreeName: '',
    courseName: '',
    subjectName: '',
    notes: '',
    semesterNumber: '',
    fileName: '',
    fileType: ''
  });

  // Search universities
  const searchResults = universities.filter(uni => 
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUniversitySelect = (university: any) => {
    setSelectedUniversity(university);
    setCurrentStep(2);
  };

  const handleAddNewUniversity = () => {
    setIsCreatingNew(true);
    setCurrentStep(1);
  };

  const handleDegreeSelect = (degree: any) => {
    setSelectedDegree(degree);
    setCurrentStep(3);
  };

  const handleCourseSelect = (course: any) => {
    setSelectedCourse(course);
    setCurrentStep(4);
  };

  const handleSemesterSelect = (semester: number) => {
    setSelectedSemester(semester);
    setCurrentStep(5);
  };

  const handleComplete = () => {
    const data = {
      university: selectedUniversity || { name: formData.universityName, isNew: true },
      degree: selectedDegree || (formData.degreeName ? { name: formData.degreeName, isNew: true } : null),
      course: selectedCourse || (formData.courseName ? { name: formData.courseName, isNew: true } : null),
      semester: selectedSemester || (selectedSemester ? { number: selectedSemester, isNew: true } : null),
      subject: { name: formData.subjectName, isNew: true },
      notes: formData.notes,
      customDegree: formData.degreeName || null,
      customCourse: formData.courseName || null,
      customSemester: selectedSemester || null
    };
    onComplete(data);
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedUniversity || formData.universityName.trim();
      case 2: return selectedDegree || formData.degreeName.trim();
      case 3: return selectedCourse || formData.courseName.trim();
      case 4: return selectedSemester !== null;
      case 5: return formData.subjectName.trim() || formData.degreeName.trim() || formData.courseName.trim() || selectedSemester !== null;
      case 6: return formData.notes.trim();
      default: return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Select University';
      case 2: return 'Select Degree';
      case 3: return 'Select Course';
      case 4: return 'Select Semester';
      case 5: return 'Add Subject';
      case 6: return 'Upload Notes';
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search University..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {searchResults.map((university) => (
                  <button
                    key={university.id}
                    onClick={() => handleUniversitySelect(university)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span>{university.name}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {searchTerm && searchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No university found</p>
                <button
                  onClick={handleAddNewUniversity}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add "{searchTerm}"
                </button>
              </div>
            )}
            
            {isCreatingNew && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="University Name"
                  value={formData.universityName}
                  onChange={(e) => setFormData(prev => ({ ...prev, universityName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Degree Options</h3>
            
            {/* Existing Degrees */}
            {selectedUniversity?.degree?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-2">Select existing degree:</p>
                {selectedUniversity.degree.map((degree: any) => (
                  <button
                    key={degree.id}
                    onClick={() => handleDegreeSelect(degree)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span>{degree.name}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Custom Degree Creation */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-2">Or create custom degree:</p>
              <input
                type="text"
                placeholder="Degree Name (e.g., B.Tech, M.Sc, B.A)"
                value={formData.degreeName}
                onChange={(e) => setFormData(prev => ({ ...prev, degreeName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              {formData.degreeName.trim() && (
                <button
                  onClick={() => {
                    setSelectedDegree({ name: formData.degreeName, isNew: true });
                    setCurrentStep(3);
                  }}
                  className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Create "{formData.degreeName}" Degree
                </button>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Course Options</h3>
            
            {/* Existing Courses */}
            {selectedDegree?.courses?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-2">Select existing course:</p>
                {selectedDegree.courses.map((course: any) => (
                  <button
                    key={course.id}
                    onClick={() => handleCourseSelect(course)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span>{course.name}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Custom Course Creation */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-2">Or create custom course:</p>
              <input
                type="text"
                placeholder="Course Name (e.g., Computer Science, Mechanical Engineering)"
                value={formData.courseName}
                onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {formData.courseName.trim() && (
                <button
                  onClick={() => {
                    setSelectedCourse({ name: formData.courseName, isNew: true });
                    setCurrentStep(4);
                  }}
                  className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create "{formData.courseName}" Course
                </button>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            {isCreatingNew ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Create New Semester</h3>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    placeholder="Enter semester number (1-8)"
                    value={formData.semesterNumber || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, semesterNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.semesterNumber && (
                    <button
                      onClick={() => {
                        setSelectedSemester(parseInt(formData.semesterNumber));
                        setCurrentStep(5);
                        setIsCreatingNew(false);
                        setFormData(prev => ({ ...prev, semesterNumber: '' }));
                      }}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Create Semester {formData.semesterNumber}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsCreatingNew(false);
                      setFormData(prev => ({ ...prev, semesterNumber: '' }));
                    }}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : selectedCourse?.semesters?.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {selectedCourse.semesters.map((semester: any) => (
                  <button
                    key={semester.number}
                    onClick={() => handleSemesterSelect(semester.number)}
                    className="px-4 py-3 hover:bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    Semester {semester.number}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No Semester Found</p>
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Semester
                </button>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Add Content Options</h3>
            
            {/* Subject Creation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Name
              </label>
              <input
                type="text"
                placeholder="Enter subject name"
                value={formData.subjectName}
                onChange={(e) => setFormData(prev => ({ ...prev, subjectName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Custom Degree Creation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Create Custom Degree
              </label>
              <input
                type="text"
                placeholder="Degree name (e.g., B.Tech, M.Sc)"
                value={formData.degreeName}
                onChange={(e) => setFormData(prev => ({ ...prev, degreeName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Custom Course Creation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Create Custom Course
              </label>
              <input
                type="text"
                placeholder="Course name (e.g., Computer Science)"
                value={formData.courseName}
                onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Custom Semester Creation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Create Custom Semester
              </label>
              <input
                type="number"
                placeholder="Semester number (e.g., 1, 2, 3)"
                min="1"
                max="10"
                value={selectedSemester || ''}
                onChange={(e) => setSelectedSemester(parseInt(e.target.value) || null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Upload Notes</h3>
            
            {/* PDF Upload Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF Notes
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type === 'application/pdf') {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData(prev => ({ 
                          ...prev, 
                          notes: reader.result as string,
                          fileName: file.name,
                          fileType: 'pdf'
                        }));
                      };
                      reader.readAsDataURL(file);
                    } else if (file) {
                      alert('Please select a PDF file only');
                    }
                  }}
                  className="hidden"
                  id="pdf-upload"
                />
                <label 
                  htmlFor="pdf-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Choose PDF File
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Select a PDF file to upload as notes
                </p>
              </div>
            </div>

            {/* OR Separator */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-xs text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Text Notes Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Text Notes
              </label>
              <textarea
                placeholder="Enter notes content here..."
                value={formData.fileType === 'pdf' ? '' : formData.notes}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  notes: e.target.value,
                  fileType: 'text',
                  fileName: ''
                }))}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                disabled={formData.fileType === 'pdf'}
              />
            </div>

            {/* File Preview */}
            {formData.fileType === 'pdf' && formData.fileName && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-medium">PDF</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {formData.fileName}
                    </p>
                    <p className="text-xs text-green-600">
                      PDF uploaded successfully
                    </p>
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      notes: '',
                      fileName: '',
                      fileType: ''
                    }))}
                    className="ml-auto text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{getStepTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < 6 && (
                  <div
                    className={`w-8 h-1 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={currentStep === 6 ? handleComplete : () => setCurrentStep(Math.min(6, currentStep + 1))}
            disabled={!canProceed()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 6 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
