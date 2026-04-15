import { aiPdfChecker, AIAnalysisResult } from './aiPdfChecker';

interface CourseSubmission {
  id: string;
  name: string;
  pdfFile: File | null | string; // Can be File object (for upload) or base64 string (for storage)
  pdfFileName?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
  universityId: string;
  degreeId: string;
  courseId: string;
  updatedAt?: string; // Added for tracking PDF updates
  aiAnalysis?: AIAnalysisResult; // AI analysis results
  aiChecked?: boolean; // Whether AI analysis has been performed
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
    pdfFileName: courseData.pdfFile instanceof File ? courseData.pdfFile.name : undefined,
  };

  // Convert file to base64 for storage
  let base64File = null;
  if (courseData.pdfFile instanceof File) {
    base64File = await fileToBase64(courseData.pdfFile);
  } else if (typeof courseData.pdfFile === 'string') {
    // If it's already a base64 string, use it directly
    base64File = courseData.pdfFile;
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

export const updateCoursePdf = (courseId: string, newPdfFile: File): boolean => {
  const submissions = getCourseSubmissions();
  const courseIndex = submissions.findIndex(course => course.id === courseId);
  
  if (courseIndex === -1) {
    console.error('Course not found:', courseId);
    return false;
  }
  
  // Convert new PDF to base64
  const reader = new FileReader();
  reader.onload = (event) => {
    const base64String = event.target?.result as string;
    
    // Update the course with new PDF (store as base64 string in localStorage)
    submissions[courseIndex] = {
      ...submissions[courseIndex],
      pdfFile: base64String, // Store as base64 string
      pdfFileName: newPdfFile.name,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated submissions
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(submissions));
    console.log('Course PDF updated successfully');
  };
  
  reader.readAsDataURL(newPdfFile);
  return true;
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

// AI Analysis Functions
export const analyzeCourseWithAI = async (courseId: string): Promise<AIAnalysisResult | null> => {
  try {
    const submissions = getCourseSubmissions();
    const course = submissions.find(c => c.id === courseId);
    
    if (!course || !course.pdfFile || typeof course.pdfFile !== 'string') {
      throw new Error('Course not found or no PDF file available');
    }

    // Extract text from PDF (simplified - in real implementation, use PDF parsing library)
    const pdfContent = await extractPdfText(course.pdfFile);
    
    // Get course metadata
    const metadata = {
      courseName: course.name,
      courseId: course.courseId,
      universityId: course.universityId,
      degreeId: course.degreeId,
      submittedBy: course.submittedBy
    };

    // Run AI analysis
    const analysisResult = await aiPdfChecker.analyzePdf(
      courseId,
      course.pdfFileName || 'document.pdf',
      pdfContent,
      metadata
    );

    // Update course with AI results
    const updatedSubmissions = submissions.map(submission => 
      submission.id === courseId 
        ? {
            ...submission,
            aiAnalysis: analysisResult,
            aiChecked: true,
            status: analysisResult.status === 'approved' ? 'approved' : 
                   analysisResult.status === 'rejected' ? 'rejected' : 'pending'
          }
        : submission
    );

    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(updatedSubmissions));
    
    return analysisResult;
  } catch (error) {
    console.error('Error analyzing course with AI:', error);
    return null;
  }
};

export const batchAnalyzeCourses = async (courseIds: string[]): Promise<AIAnalysisResult[]> => {
  try {
    const submissions = getCourseSubmissions();
    const coursesToAnalyze = courseIds
      .map(id => submissions.find(c => c.id === id))
      .filter(course => course && course.pdfFile && typeof course.pdfFile === 'string')
      .map(course => ({
        courseId: course!.id,
        fileName: course!.pdfFileName || 'document.pdf',
        content: '', // Will be extracted
        metadata: {
          courseName: course!.name,
          courseId: course!.courseId,
          universityId: course!.universityId,
          degreeId: course!.degreeId,
          submittedBy: course!.submittedBy
        }
      }));

    // Extract PDF content for each course
    for (const course of coursesToAnalyze) {
      const submission = submissions.find(c => c.id === course.courseId);
      if (submission && typeof submission.pdfFile === 'string') {
        course.content = await extractPdfText(submission.pdfFile);
      }
    }

    // Run batch analysis
    const results = await aiPdfChecker.batchAnalyze(coursesToAnalyze);

    // Update all courses with AI results
    const updatedSubmissions = submissions.map(submission => {
      const result = results.find(r => r.courseId === submission.id);
      if (result) {
        return {
          ...submission,
          aiAnalysis: result,
          aiChecked: true,
          status: result.status === 'approved' ? 'approved' : 
                 result.status === 'rejected' ? 'rejected' : 'pending'
        };
      }
      return submission;
    });

    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(updatedSubmissions));
    
    return results;
  } catch (error) {
    console.error('Error in batch AI analysis:', error);
    return [];
  }
};

// Simplified PDF text extraction (in real implementation, use PDF.js or similar)
const extractPdfText = async (pdfBase64: string): Promise<string> => {
  // This is a simplified simulation of PDF text extraction
  // In a real implementation, you would use a library like PDF.js
  
  console.log('Extracting text from PDF with base64 length:', pdfBase64.length); // Use parameter
  
  // Generate sample content based on the file size/type
  const sampleContents = [
    `Introduction to Computer Science
This document provides a comprehensive overview of fundamental concepts in computer science and programming.

Abstract
The field of computer science encompasses the study of computation, information processing, and the design of computer systems. This document explores key concepts including algorithms, data structures, and programming paradigms.

1. Fundamental Concepts
Computer science is built upon several fundamental concepts that form the basis of modern computing systems. These include:

1.1 Algorithms and Data Structures
Algorithms are step-by-step procedures for solving problems and performing computations. Data structures are ways of organizing and storing data to enable efficient access and modification.

1.2 Programming Languages
Programming languages are formal languages designed to communicate instructions to computers. They range from low-level machine code to high-level abstract languages.

2. Applications in Modern Technology
Computer science principles are applied in various domains including artificial intelligence, machine learning, database systems, and network security.

Conclusion
The study of computer science provides essential skills for understanding and shaping the digital world. As technology continues to evolve, the importance of computer science education grows exponentially.`,

    `Engineering Mathematics Fundamentals
A comprehensive guide to mathematical concepts essential for engineering studies.

Chapter 1: Calculus
Calculus forms the foundation of engineering mathematics, providing tools for analyzing rates of change and accumulation.

1.1 Differential Calculus
Differential calculus deals with the study of rates of change and slopes of curves. Key concepts include derivatives, limits, and continuity.

1.2 Integral Calculus
Integral calculus focuses on accumulation and area under curves. It provides methods for calculating quantities that vary continuously.

Chapter 2: Linear Algebra
Linear algebra is fundamental to many engineering applications, particularly in systems analysis and optimization.

2.1 Matrices and Determinants
Matrices are rectangular arrays of numbers that represent linear transformations. Determinants provide scalar values that indicate properties of these transformations.

2.2 Vector Spaces
Vector spaces are mathematical structures that generalize the notion of vectors and their operations.

Applications
Engineering mathematics finds applications in:
- Signal processing
- Control systems
- Structural analysis
- Fluid dynamics
- Electrical circuits

Summary
Mathematical proficiency is crucial for engineering success. The concepts covered in this document provide the necessary foundation for advanced engineering studies.`,

    `Digital Electronics and Microprocessors
Understanding the fundamentals of digital systems and computer architecture.

Overview
Digital electronics form the backbone of modern computing systems. This document covers essential concepts in digital logic design and microprocessor architecture.

1. Number Systems and Codes
Digital systems use various number systems including binary, octal, and hexadecimal. Understanding these systems is crucial for digital design.

1.1 Binary System
The binary system uses only two digits: 0 and 1. All digital computations are performed using binary arithmetic.

1.2 Logic Gates
Logic gates are the basic building blocks of digital circuits. Common gates include AND, OR, NOT, NAND, NOR, XOR, and XNOR.

2. Combinational Logic
Combinational logic circuits produce outputs based solely on current inputs, without memory elements.

2.1 Adders and Subtractors
These circuits perform arithmetic operations on binary numbers.

2.2 Multiplexers and Demultiplexers
These circuits select and route signals in digital systems.

3. Sequential Logic
Sequential logic circuits incorporate memory elements and depend on both current inputs and previous states.

3.1 Flip-Flops
Flip-flops are basic memory elements that store binary information.

3.2 Counters and Registers
These circuits are used for counting and storing digital information.

Microprocessor Architecture
Modern microprocessors integrate millions of transistors to perform complex computations. Understanding their architecture is essential for system design.

Conclusion
Digital electronics and microprocessors are fundamental to modern technology. Mastery of these concepts enables the design of sophisticated digital systems.`
  ];

  // Return a random sample content
  return sampleContents[Math.floor(Math.random() * sampleContents.length)];
};

// Get courses that need AI analysis
export const getCoursesNeedingAIAnalysis = (): CourseSubmission[] => {
  const submissions = getCourseSubmissions();
  return submissions.filter(course => 
    course.status === 'pending' && 
    (!course.aiChecked || !course.aiAnalysis)
  );
};

// Get AI analysis statistics
export const getAIAnalysisStats = () => {
  const submissions = getCourseSubmissions();
  const analyzedCourses = submissions.filter(course => course.aiChecked);
  
  const stats = {
    total: submissions.length,
    analyzed: analyzedCourses.length,
    pending: submissions.filter(c => c.status === 'pending').length,
    approved: submissions.filter(c => c.status === 'approved').length,
    rejected: submissions.filter(c => c.status === 'rejected').length,
    averageScore: 0,
    confidenceAverage: 0
  };

  if (analyzedCourses.length > 0) {
    const totalScore = analyzedCourses.reduce((sum, course) => 
      sum + (course.aiAnalysis?.overallScore || 0), 0
    );
    const totalConfidence = analyzedCourses.reduce((sum, course) => 
      sum + (course.aiAnalysis?.confidence || 0), 0
    );
    
    stats.averageScore = Math.round(totalScore / analyzedCourses.length);
    stats.confidenceAverage = Math.round(totalConfidence / analyzedCourses.length);
  }

  return stats;
};

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).directReplaceCourse = directReplaceCourse;
  (window as any).analyzeCourseWithAI = analyzeCourseWithAI;
  (window as any).batchAnalyzeCourses = batchAnalyzeCourses;
}
