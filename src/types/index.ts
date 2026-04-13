import { LucideIcon } from "lucide-react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "student" | "researcher" | "teacher";
  institution: string;
  preferences: {
    subjects: string[];
    languages: string[];
  };
  progress: {
    savedNotes: number;
    completedTopics: number;
  };
  profilePicture?: string;
  isSuperAdmin?: boolean;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  role: "admin" | "student" | "researcher" | "teacher" | "educator";
  institution: string;
  preferences: {
    subjects: string[];
    languages: string[];
  };
  progress: {
    savedNotes: number;
    completedTopics: number;
  };
}

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  subItems?: Array<{
    title: string;
    href: string;
  }>;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  users: string[];
  roles: string[];
}
