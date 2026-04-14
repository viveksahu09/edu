/**
 * University Templates System
 * Pre-built templates for common university types
 */

export interface UniversityTemplate {
  name: string;
  type: 'IIT' | 'CENTRAL_UNIVERSITY' | 'STATE_UNIVERSITY' | 'PRIVATE_UNIVERSITY';
  degrees: DegreeTemplate[];
}

export interface DegreeTemplate {
  id: string;
  slug: string;
  name: string;
  courses: CourseTemplate[];
}

export interface CourseTemplate {
  id: string;
  name: string;
  semesters: SemesterTemplate[];
}

export interface SemesterTemplate {
  number: number;
  subjects: SubjectTemplate[];
}

export interface SubjectTemplate {
  id: string;
  name: string;
  notes: string;
  units?: UnitTemplate[];
}

export interface UnitTemplate {
  id: string;
  number: number;
  title: string;
  overview: string;
  pdf?: string[];
}

// IIT Template (8 semesters, engineering focus)
export const IIT_TEMPLATE: UniversityTemplate = {
  name: "IIT Template",
  type: 'IIT',
  degrees: [
    {
      id: "bt",
      slug: "B.Tech",
      name: "Bachelor of Technology",
      courses: [
        {
          id: "cse",
          name: "Computer Science & Engineering",
          semesters: [
            {
              number: 1,
              subjects: [
                {
                  id: "ma101",
                  name: "Mathematics I",
                  notes: "Calculus, Linear Algebra, Differential Equations",
                  units: [
                    {
                      id: "u1",
                      number: 1,
                      title: "Calculus Fundamentals",
                      overview: "Limits, derivatives, integrals",
                      pdf: ["pdf1", "pdf2"]
                    },
                    {
                      id: "u2",
                      number: 2,
                      title: "Linear Algebra",
                      overview: "Matrices, vectors, eigenvalues",
                      pdf: ["pdf1", "pdf2"]
                    }
                  ]
                },
                {
                  id: "ph101",
                  name: "Physics I",
                  notes: "Mechanics, Thermodynamics, Waves",
                  units: [
                    {
                      id: "u1",
                      number: 1,
                      title: "Classical Mechanics",
                      overview: "Newton's laws, motion, energy",
                      pdf: ["pdf1", "pdf2"]
                    }
                  ]
                },
                {
                  id: "cs101",
                  name: "Introduction to Computing",
                  notes: "Programming fundamentals, algorithms, data structures",
                  units: [
                    {
                      id: "u1",
                      number: 1,
                      title: "Programming Basics",
                      overview: "Variables, control structures, functions",
                      pdf: ["pdf1", "pdf2", "pdf3"]
                    }
                  ]
                }
              ]
            },
            {
              number: 2,
              subjects: [
                {
                  id: "ma102",
                  name: "Mathematics II",
                  notes: "Advanced calculus, probability, statistics"
                },
                {
                  id: "ph102",
                  name: "Physics II",
                  notes: "Electromagnetism, optics, modern physics"
                },
                {
                  id: "cs102",
                  name: "Data Structures",
                  notes: "Arrays, linked lists, trees, graphs"
                }
              ]
            }
            // Continue for all 8 semesters...
          ]
        }
      ]
    },
    {
      id: "mt",
      slug: "M.Tech",
      name: "Master of Technology",
      courses: [
        {
          id: "cse",
          name: "Computer Science & Engineering",
          semesters: [
            {
              number: 1,
              subjects: [
                {
                  id: "cs501",
                  name: "Advanced Algorithms",
                  notes: "Complex algorithms, optimization techniques"
                },
                {
                  id: "cs502",
                  name: "Machine Learning",
                  notes: "Supervised learning, neural networks, deep learning"
                }
              ]
            }
            // Continue for all semesters...
          ]
        }
      ]
    }
  ]
};

// Central University Template (6 semesters, diverse programs)
export const CENTRAL_UNIVERSITY_TEMPLATE: UniversityTemplate = {
  name: "Central University Template",
  type: 'CENTRAL_UNIVERSITY',
  degrees: [
    {
      id: "bsc",
      slug: "B.Sc.",
      name: "Bachelor of Science",
      courses: [
        {
          id: "cs",
          name: "Computer Science",
          semesters: [
            {
              number: 1,
              subjects: [
                {
                  id: "cs101",
                  name: "Programming in C",
                  notes: "C programming fundamentals, problem solving"
                },
                {
                  id: "ma101",
                  name: "Mathematics I",
                  notes: "Discrete mathematics, algebra"
                }
              ]
            },
            {
              number: 2,
              subjects: [
                {
                  id: "cs102",
                  name: "Data Structures",
                  notes: "Arrays, stacks, queues, trees"
                }
              ]
            }
            // Continue for all 6 semesters...
          ]
        }
      ]
    },
    {
      id: "bahons",
      slug: "B.A. (Hons)",
      name: "Bachelor of Arts (Honours)",
      courses: [
        {
          id: "cs",
          name: "Computer Science",
          semesters: [
            {
              number: 1,
              subjects: [
                {
                  id: "cs101",
                  name: "Introduction to Programming",
                  notes: "Python programming basics"
                }
              ]
            }
            // Continue for all semesters...
          ]
        }
      ]
    }
  ]
};

// State University Template (Engineering focus)
export const STATE_UNIVERSITY_TEMPLATE: UniversityTemplate = {
  name: "State University Template",
  type: 'STATE_UNIVERSITY',
  degrees: [
    {
      id: "be",
      slug: "B.E.",
      name: "Bachelor of Engineering",
      courses: [
        {
          id: "cse",
          name: "Computer Science and Engineering",
          semesters: [
            {
              number: 1,
              subjects: [
                {
                  id: "cs1715",
                  name: "Problem Solving and Python Programming",
                  notes: "Python fundamentals, problem solving techniques"
                }
              ]
            }
            // Continue for all 8 semesters...
          ]
        }
      ]
    }
  ]
};

export function getTemplateByType(type: UniversityTemplate['type']): UniversityTemplate {
  switch (type) {
    case 'IIT':
      return IIT_TEMPLATE;
    case 'CENTRAL_UNIVERSITY':
      return CENTRAL_UNIVERSITY_TEMPLATE;
    case 'STATE_UNIVERSITY':
      return STATE_UNIVERSITY_TEMPLATE;
    default:
      return STATE_UNIVERSITY_TEMPLATE;
  }
}

export function detectUniversityType(name: string): UniversityTemplate['type'] {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('indian institute of technology') || lowerName.includes('iit')) {
    return 'IIT';
  }
  
  if (lowerName.includes('central university') || 
      lowerName.includes('delhi university') ||
      lowerName.includes('jawaharlal nehru university')) {
    return 'CENTRAL_UNIVERSITY';
  }
  
  if (lowerName.includes('university') || lowerName.includes('college')) {
    return 'STATE_UNIVERSITY';
  }
  
  return 'PRIVATE_UNIVERSITY';
}
