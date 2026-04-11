export interface Subject {
  id: string;
  name: string;
  notes: string;
  units?: Array<{
    id: string;
    number: number;
    title: string;
    overview: string;
    pdf?: string[];
  }>;
}

export interface Semester {
  number: number;
  subjects: Subject[];
}

export interface Course {
  id: string;
  name: string;
  semesters: Semester[];
}

export interface Degree {
  id: string;
  slug: string;
  name: string;
  courses: Course[];
}

export interface University {
  id: string;
  name: string;
  slug: string;
  image: string;
  degree: Degree[];
}
