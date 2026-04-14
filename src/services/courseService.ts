interface CourseSubmission {
  id: string;
  name: string;
  pdfFile: File | null;
  pdfFileName?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
  universityId: string;
  degreeId: string;
  courseId: string;
}

const COURSE_STORAGE_KEY = 'courseSubmissions';

// Convert File to base64 for localStorage storage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

// Convert base64 back to File (for admin use)
const base64ToFile = (base64: string, fileName: string): File => {
  if (!base64 || typeof base64 !== 'string' || !base64.includes(',')) {
    // Return a dummy file if base64 data is invalid
    return new File([''], fileName, { type: 'application/pdf' });
  }
  
  try {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/pdf';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  } catch (error) {
    console.error('Error converting base64 to file:', error);
    return new File([''], fileName, { type: 'application/pdf' });
  }
};

export const submitCourseForApproval = async (
  courseData: Omit<CourseSubmission, 'id' | 'status' | 'submittedAt' | 'pdfFileName'>
): Promise<CourseSubmission> => {
  const submission: CourseSubmission = {
    ...courseData,
    id: Date.now().toString(),
    status: 'pending',
    submittedAt: new Date().toISOString(),
    pdfFileName: courseData.pdfFile?.name,
  };

  // Convert file to base64 for storage
  let base64File = null;
  if (courseData.pdfFile) {
    base64File = await fileToBase64(courseData.pdfFile);
  }

  // Get existing submissions
  const existingSubmissions = getCourseSubmissions();
  
  // Add new submission
  const updatedSubmissions = [
    ...existingSubmissions,
    { ...submission, pdfFile: base64File }
  ];

  // Save to localStorage
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(updatedSubmissions));

  return submission;
};

export const getCourseSubmissions = (): CourseSubmission[] => {
  try {
    const stored = localStorage.getItem(COURSE_STORAGE_KEY);
    if (!stored) return [];

    const submissions = JSON.parse(stored);
    
    // Validate that submissions is an array
    if (!Array.isArray(submissions)) {
      console.warn('Invalid course submissions data format');
      return [];
    }
    
    // Convert base64 back to File objects for admin use
    return submissions.map((sub: any) => {
      try {
        return {
          ...sub,
          pdfFile: sub.pdfFile ? base64ToFile(sub.pdfFile, sub.pdfFileName || 'document.pdf') : null
        };
      } catch (error) {
        console.error('Error processing course submission:', sub, error);
        return {
          ...sub,
          pdfFile: null
        };
      }
    }).filter(sub => sub && sub.id); // Filter out invalid submissions
  } catch (error) {
    console.error('Error loading course submissions:', error);
    return [];
  }
};

export const updateCourseStatus = (
  courseId: string, 
  status: 'approved' | 'rejected'
): void => {
  const submissions = getCourseSubmissions();
  const updatedSubmissions = submissions.map(course =>
    course.id === courseId ? { ...course, status } : course
  );
  
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(updatedSubmissions));
};

export const deleteCourseSubmission = (courseId: string): void => {
  const submissions = getCourseSubmissions();
  const updatedSubmissions = submissions.filter(course => course.id !== courseId);
  
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(updatedSubmissions));
};

// Fix existing course data to use correct subject IDs
export const fixCourseSubjectMappings = (): void => {
  const submissions = getCourseSubmissions();
  console.log('All submissions before fix:', submissions);
  
  const updatedSubmissions = submissions.map(course => {
    console.log('Processing course:', course);
    // If course has CS-101, map it to BT-205 (Basic Computer Engineering) for any university
    if (course.courseId === 'CS-101') {
      console.log('Found CS-101 course, updating to BT-205 and university to 3');
      return {
        ...course,
        courseId: 'BT-205',
        universityId: '3', // Force to RGPV
        name: course.name === 'Civil Engineering' ? 'Basic Computer Engineering Materials' : course.name
      };
    }
    return course;
  });
  
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(updatedSubmissions));
  console.log('Fixed course subject mappings. Updated submissions:', updatedSubmissions);
};

// Manual fix function - call this from browser console
export const manualFixCourse = (): void => {
  console.log('Starting comprehensive manual fix...');
  
  // Get current data
  const stored = localStorage.getItem('courseSubmissions');
  console.log('Raw localStorage data:', stored);
  
  if (!stored) {
    console.log('No course submissions found');
    return;
  }
  
  const submissions = JSON.parse(stored);
  console.log('Parsed submissions:', submissions);
  
  // Find and update the Civil Engineering course - more aggressive matching
  const updatedSubmissions = submissions.map((course: any) => {
    // Multiple conditions to catch the course
    const shouldUpdate = (
      course.name === 'Civil Engineering' || 
      course.courseId === 'CS-101' ||
      course.name === 'Basic Computer Engineering Materials' ||
      (course.name && course.name.toLowerCase().includes('civil')) ||
      (course.courseId && course.courseId.toLowerCase().includes('cs'))
    );
    
    if (shouldUpdate) {
      console.log('Found course to update:', course);
      return {
        ...course,
        courseId: 'BT-205',
        universityId: '3',
        name: 'Basic Computer Engineering Materials',
        status: 'approved' // Ensure it's approved
      };
    }
    return course;
  });
  
  // Save back to localStorage
  localStorage.setItem('courseSubmissions', JSON.stringify(updatedSubmissions));
  console.log('Updated course data:', updatedSubmissions);
  console.log('Comprehensive manual fix completed!');
  
  // Force page reload to refresh data
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).manualFixCourse = manualFixCourse;
}

// Direct replacement function - completely replace the problematic course
export const directReplaceCourse = (): void => {
  console.log('Starting direct replacement...');
  
  // Get current data
  const stored = localStorage.getItem('courseSubmissions');
  if (!stored) {
    console.log('No course submissions found');
    return;
  }
  
  const submissions = JSON.parse(stored);
  console.log('Current submissions:', submissions);
  
  // Create completely new data with correct course
  const newSubmissions = submissions.filter((course: any) => {
    // Keep all courses except the Civil Engineering one
    if (course.name === 'Civil Engineering' || course.courseId === 'CS-101') {
      console.log('Removing problematic course');
      return false;
    }
    return true;
  });
  
  // Add the corrected course
  const correctedCourse = {
    id: Date.now().toString(),
    name: 'Basic Computer Engineering Materials',
    courseId: 'BT-205',
    universityId: '3',
    degreeId: 'bt',
    submittedBy: 'admin@example.com',
    submittedAt: new Date().toISOString(),
    status: 'approved',
    pdfFileName: 'civil_engineering_notes.pdf',
    pdfFile: null
  };
  
  newSubmissions.push(correctedCourse);
  
  // Save the corrected data
  localStorage.setItem('courseSubmissions', JSON.stringify(newSubmissions));
  console.log('Direct replacement completed. New data:', newSubmissions);
  console.log('Added corrected course:', correctedCourse);
  
  // Force reload
  setTimeout(() => {
    window.location.reload();
  }, 500);
};

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).directReplaceCourse = directReplaceCourse;
}
