import { useState, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import ProgressiveDataBuilder from './ProgressiveDataBuilder';
import { useRoleBasedAccess } from '../../hooks/useRoleBasedAccess';
import { universities } from '../../data/universities';

interface SmartAddContentButtonProps {
  university?: any;
  degree?: any;
  course?: any;
  semester?: number;
  onContentAdded?: (data: any) => void;
}

export default function SmartAddContentButton({ 
  university, 
  degree, 
  course, 
  semester,
  onContentAdded 
}: SmartAddContentButtonProps) {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(university || null);
  const [dynamicUniversities, setDynamicUniversities] = useState<any[]>(() => {
    // Load dynamic universities from localStorage on mount
    const saved = localStorage.getItem('dynamicUniversities');
    const parsed = saved ? JSON.parse(saved) : [];
    console.log('SmartAddContentButton - Initial dynamic universities:', parsed);
    return parsed;
  });
  const { permissions } = useRoleBasedAccess();

  // Combine static and dynamic universities
  const allUniversities = [...universities, ...dynamicUniversities];
  console.log('SmartAddContentButton - All universities:', allUniversities.length, allUniversities.map(u => u.name));

  // Listen for localStorage changes to update dynamic universities
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('dynamicUniversities');
      setDynamicUniversities(saved ? JSON.parse(saved) : []);
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for same-tab updates
    const interval = setInterval(() => {
      const saved = localStorage.getItem('dynamicUniversities');
      const current = saved ? JSON.parse(saved) : [];
      if (JSON.stringify(current) !== JSON.stringify(dynamicUniversities)) {
        console.log('SmartAddContentButton - Updating dynamic universities:', current);
        setDynamicUniversities(current);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [dynamicUniversities]);

  // Log when allUniversities changes
  useEffect(() => {
    console.log('SmartAddContentButton - All universities updated:', allUniversities.length, allUniversities.map(u => u.name));
  }, [allUniversities]);

  // Determine what content can be added based on current context
  const getAddButtonConfig = () => {
    // For Add Degree, always show university selection regardless of context
    if (!degree && (!university.degree || university.degree.length === 0)) {
      return {
        text: 'Add Degree',
        color: 'green',
        requiresPermission: 'canAddDegree'
      };
    }
    
    // Check if degree has courses
    if (!course && degree && (!degree.courses || degree.courses.length === 0)) {
      return {
        text: 'Add Course',
        color: 'blue',
        requiresPermission: 'canAddCourse'
      };
    }
    
    // Check if course has semesters
    if (semester === null && course && (!course.semesters || course.semesters.length === 0)) {
      return {
        text: 'Add Semester',
        color: 'purple',
        requiresPermission: 'canAddSemester'
      };
    }
    
    // Don't show Add Subject button - removed as requested
    return null;
  };

  const config = getAddButtonConfig();

  console.log('SmartAddContentButton - Config:', config);
  console.log('SmartAddContentButton - University prop:', university);
  console.log('SmartAddContentButton - Selected university:', selectedUniversity);

  // Don't show button if config is null (Add Subject removed)
  if (!config) {
    return null;
  }

  const canAdd = permissions[config.requiresPermission as keyof typeof permissions];

  console.log('SmartAddContentButton - Can add:', canAdd);

  if (!canAdd) {
    return null;
  }

  const handleComplete = (data: any) => {
    console.log('Progressive data builder completed:', data);
    onContentAdded?.(data);
    setIsBuilderOpen(false);
  };

  return (
    <>
      {config && config.text === 'Add Degree' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select University (required)
          </label>
          <select
            value={selectedUniversity?.id || ''}
            onChange={(e) => {
              console.log('SmartAddContentButton - Selected value:', e.target.value);
              const uni = allUniversities.find(u => u.id === e.target.value);
              console.log('SmartAddContentButton - Found university:', uni);
              setSelectedUniversity(uni);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a university...</option>
            {allUniversities.map((uni) => {
              console.log('SmartAddContentButton - Rendering option:', uni.id, uni.name);
              return (
                <option key={uni.id} value={uni.id}>
                  {uni.name}
                </option>
              );
            })}
          </select>
        </div>
      )}
      
      {config && (
        <button
          onClick={() => setIsBuilderOpen(true)}
          className={`inline-flex items-center px-4 py-2 bg-${config.color}-600 text-white rounded-md hover:bg-${config.color}-700 transition-colors`}
          disabled={!selectedUniversity && !university}
        >
          <Plus className="h-4 w-4 mr-2" />
          {config.text}
          <ChevronDown className="h-4 w-4 ml-2" />
        </button>
      )}
      
      {config && (
        <ProgressiveDataBuilder
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          onComplete={handleComplete}
          initialData={{
            university: selectedUniversity || university
          }}
        />
      )}
    </>
  );
}
