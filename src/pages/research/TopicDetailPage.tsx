import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  CheckCircle, 
  Circle, 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink,
  Play,
  Code,
  Target,
  Bookmark,
  BookmarkCheck
} from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
  hints: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
  estimatedTime: string;
}

interface Resource {
  id: string;
  title: string;
  type: "article" | "video" | "pdf" | "external";
  url: string;
  description: string;
}

interface TopicData {
  [key: string]: {
    subject: string;
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    estimatedTime: string;
    overview: string;
    keyConcepts: string[];
    relatedTopics: string[];
    problems: Problem[];
    tasks: Task[];
    resources: Resource[];
    notes: string[];
  };
}

const TopicDetailPage = () => {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const [bookmarked, setBookmarked] = useState(false);
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const topicsData: TopicData = {
    html: {
      subject: "Web Development",
      title: "HTML",
      description: "Learn the fundamentals of HTML5, semantic markup, and document structure",
      difficulty: "Easy",
      estimatedTime: "4 hours",
      overview: "HTML (HyperText Markup Language) is the foundation of web development. It provides the structure and content of web pages using elements and tags. This topic covers HTML5 features, semantic markup, forms, multimedia, and best practices for creating accessible, well-structured web documents.",
      keyConcepts: [
        "HTML Elements and Tags",
        "Semantic HTML5",
        "Forms and Input Types",
        "Multimedia Elements",
        "Accessibility (ARIA)",
        "Document Structure"
      ],
      relatedTopics: ["CSS", "JavaScript", "Accessibility", "SEO"],
      problems: [
        {
          id: "p1",
          title: "Create a Basic HTML Page",
          description: "Create an HTML page with proper DOCTYPE, head, and body sections. Include a title, meta tags, and basic content structure.",
          difficulty: "Easy",
          completed: false,
          hints: ["Start with <!DOCTYPE html>", "Use semantic tags like <header>, <main>", "Don't forget <html> and <body> tags"]
        },
        {
          id: "p2",
          title: "Build a Contact Form",
          description: "Create a contact form with various input types including text, email, phone, textarea, and submit button.",
          difficulty: "Easy",
          completed: false,
          hints: ["Use <form> tag", "Include proper label elements", "Add validation attributes"]
        },
        {
          id: "p3",
          title: "Create a Navigation Menu",
          description: "Build a semantic navigation menu using <nav> and <ul> elements with proper accessibility attributes.",
          difficulty: "Medium",
          completed: false,
          hints: ["Use <nav> for navigation", "Structure with <ul> and <li>", "Add aria-label for accessibility"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Build a Personal Resume Page",
          description: "Create a complete resume page with sections for education, experience, skills, and contact information.",
          difficulty: "Easy",
          completed: false,
          estimatedTime: "2 hours"
        },
        {
          id: "t2",
          title: "Create a Recipe Blog Layout",
          description: "Design and structure a recipe blog page with ingredients list, instructions, and nutritional information.",
          difficulty: "Medium",
          completed: false,
          estimatedTime: "3 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "MDN HTML Guide",
          type: "article",
          url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
          description: "Comprehensive HTML documentation from Mozilla Developer Network"
        },
        {
          id: "r2",
          title: "HTML5 Crash Course",
          type: "video",
          url: "#",
          description: "Video tutorial covering HTML5 fundamentals and new features"
        },
        {
          id: "r3",
          title: "HTML Cheat Sheet",
          type: "pdf",
          url: "#",
          description: "Quick reference guide for HTML tags and attributes"
        }
      ],
      notes: [
        "Always use semantic HTML5 elements for better accessibility and SEO",
        "Validate your HTML using W3C validator",
        "Use proper heading hierarchy (h1, h2, h3...)",
        "Include alt text for all images",
        "Forms should have proper labels and validation"
      ]
    },
    css: {
      subject: "Web Development",
      title: "CSS",
      description: "Master CSS3, layouts, animations, and responsive design",
      difficulty: "Easy",
      estimatedTime: "6 hours",
      overview: "CSS (Cascading Style Sheets) is used to style and layout web pages. This topic covers CSS3 features, selectors, Box Model, Flexbox, Grid, animations, transitions, and responsive design techniques using media queries.",
      keyConcepts: [
        "CSS Selectors and Specificity",
        "Box Model and Layout",
        "Flexbox and Grid",
        "Responsive Design",
        "Animations and Transitions",
        "CSS Variables"
      ],
      relatedTopics: ["HTML", "JavaScript", "Responsive Design", "UI/UX"],
      problems: [
        {
          id: "p1",
          title: "Style a Card Component",
          description: "Create a visually appealing card with shadow, border radius, and hover effects using CSS.",
          difficulty: "Easy",
          completed: false,
          hints: ["Use box-shadow for depth", "Add transition for smooth hover", "Consider responsive design"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Build a Responsive Navigation",
          description: "Create a responsive navigation bar that adapts to mobile and desktop screens.",
          difficulty: "Medium",
          completed: false,
          estimatedTime: "2 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "CSS Tricks Guide",
          type: "article",
          url: "https://css-tricks.com/",
          description: "Comprehensive CSS tutorials and examples"
        }
      ],
      notes: [
        "Use CSS Grid for complex layouts",
        "Flexbox is great for component layouts",
        "Always test responsive design",
        "Use CSS custom properties for theming"
      ]
    },
    javascript: {
      subject: "Web Development",
      title: "JavaScript",
      description: "Learn JavaScript from basics to advanced concepts including ES6+",
      difficulty: "Medium",
      estimatedTime: "12 hours",
      overview: "JavaScript is the programming language of the web. This topic covers variables, functions, objects, arrays, DOM manipulation, events, async programming, ES6+ features, and modern JavaScript development practices.",
      keyConcepts: [
        "Variables and Data Types",
        "Functions and Scope",
        "Objects and Arrays",
        "DOM Manipulation",
        "Async Programming",
        "ES6+ Features"
      ],
      relatedTopics: ["HTML", "CSS", "React", "Node.js"],
      problems: [
        {
          id: "p1",
          title: "Create a Counter",
          description: "Build a simple counter application with increment and decrement functionality.",
          difficulty: "Easy",
          completed: false,
          hints: ["Use DOM elements", "Handle click events", "Update display dynamically"]
        },
        {
          id: "p2",
          title: "Array Manipulation",
          description: "Implement common array operations like map, filter, and reduce.",
          difficulty: "Medium",
          completed: false,
          hints: ["Use array methods", "Practice functional programming", "Handle edge cases"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Build a Todo App",
          description: "Create a complete todo application with add, delete, and complete functionality.",
          difficulty: "Medium",
          completed: false,
          estimatedTime: "4 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "JavaScript MDN Guide",
          type: "article",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          description: "Comprehensive JavaScript documentation"
        }
      ],
      notes: [
        "Practice async/await for promises",
        "Understand closure and scope",
        "Use modern ES6+ syntax",
        "Debug with browser dev tools"
      ]
    },
    react: {
      subject: "Web Development",
      title: "React",
      description: "Build modern web applications with React, hooks, and state management",
      difficulty: "Hard",
      estimatedTime: "16 hours",
      overview: "React is a popular JavaScript library for building user interfaces. This topic covers components, props, state, hooks, context, routing, and modern React development patterns including functional components and hooks-based architecture.",
      keyConcepts: [
        "Components and Props",
        "State and Hooks",
        "Context API",
        "React Router",
        "Lifecycle Methods",
        "Performance Optimization"
      ],
      relatedTopics: ["JavaScript", "HTML", "CSS", "Redux"],
      problems: [
        {
          id: "p1",
          title: "Create a Component",
          description: "Build a reusable React component with props and state.",
          difficulty: "Medium",
          completed: false,
          hints: ["Use functional components", "Implement hooks", "Handle props correctly"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Build a React App",
          description: "Create a complete React application with multiple components and routing.",
          difficulty: "Hard",
          completed: false,
          estimatedTime: "6 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "React Documentation",
          type: "article",
          url: "https://react.dev/",
          description: "Official React documentation and tutorials"
        }
      ],
      notes: [
        "Use functional components with hooks",
        "Understand component lifecycle",
        "Practice state management",
        "Learn React Router for navigation"
      ]
    },
    tailwind: {
      subject: "Web Development",
      title: "Tailwind CSS",
      description: "Learn utility-first CSS framework for rapid UI development",
      difficulty: "Medium",
      estimatedTime: "8 hours",
      overview: "Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs. This topic covers Tailwind's utility classes, responsive design, customization, and integration with modern web development workflows.",
      keyConcepts: [
        "Utility Classes",
        "Responsive Design",
        "Custom Configuration",
        "Component Extraction",
        "Dark Mode",
        "Animation Utilities"
      ],
      relatedTopics: ["CSS", "HTML", "JavaScript", "React"],
      problems: [
        {
          id: "p1",
          title: "Style with Tailwind",
          description: "Create a responsive layout using only Tailwind utility classes.",
          difficulty: "Easy",
          completed: false,
          hints: ["Use responsive prefixes", "Combine utilities effectively", "Follow spacing system"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Build a Dashboard",
          description: "Create a complete dashboard layout using Tailwind CSS.",
          difficulty: "Medium",
          completed: false,
          estimatedTime: "3 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "Tailwind CSS Documentation",
          type: "article",
          url: "https://tailwindcss.com/docs",
          description: "Official Tailwind CSS documentation"
        }
      ],
      notes: [
        "Use utility classes for rapid development",
        "Configure custom themes",
        "Practice responsive design patterns",
        "Extract components when needed"
      ]
    },
    arrays: {
      subject: "Data Structures",
      title: "Arrays",
      description: "Learn array operations, multi-dimensional arrays, and common algorithms",
      difficulty: "Easy",
      estimatedTime: "6 hours",
      overview: "Arrays are fundamental data structures that store elements of the same type. This topic covers array operations, traversal, searching, sorting, multi-dimensional arrays, and common algorithmic patterns used with arrays.",
      keyConcepts: [
        "Array Basics",
        "Traversal and Access",
        "Searching Algorithms",
        "Sorting Algorithms",
        "Multi-dimensional Arrays",
        "Time Complexity"
      ],
      relatedTopics: ["Linked Lists", "Trees", "Algorithms"],
      problems: [
        {
          id: "p1",
          title: "Array Sum",
          description: "Calculate the sum of all elements in an array.",
          difficulty: "Easy",
          completed: false,
          hints: ["Iterate through array", "Accumulate sum", "Handle empty arrays"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Implement Array Operations",
          description: "Create custom functions for common array operations.",
          difficulty: "Easy",
          completed: false,
          estimatedTime: "2 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "Array Algorithms Guide",
          type: "article",
          url: "#",
          description: "Comprehensive guide to array algorithms"
        }
      ],
      notes: [
        "Understand time complexity",
        "Practice common patterns",
        "Master searching and sorting",
        "Handle edge cases properly"
      ]
    },
    "linked-lists": {
      subject: "Data Structures",
      title: "Linked Lists",
      description: "Master singly, doubly, and circular linked lists with operations",
      difficulty: "Medium",
      estimatedTime: "8 hours",
      overview: "Linked lists are linear data structures where elements are not stored at contiguous memory locations. This topic covers singly linked lists, doubly linked lists, circular linked lists, and various operations like insertion, deletion, and traversal.",
      keyConcepts: [
        "Node Structure",
        "Singly Linked Lists",
        "Doubly Linked Lists",
        "Circular Linked Lists",
        "Insertion Operations",
        "Deletion Operations"
      ],
      relatedTopics: ["Arrays", "Trees", "Stacks"],
      problems: [
        {
          id: "p1",
          title: "Reverse a Linked List",
          description: "Implement a function to reverse a singly linked list.",
          difficulty: "Medium",
          completed: false,
          hints: ["Use three pointers", "Handle edge cases", "Update next pointers"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Build Linked List Class",
          description: "Create a complete linked list implementation with all operations.",
          difficulty: "Medium",
          completed: false,
          estimatedTime: "3 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "Linked List Tutorial",
          type: "article",
          url: "#",
          description: "Step-by-step guide to linked lists"
        }
      ],
      notes: [
        "Understand pointer manipulation",
        "Practice memory management",
        "Master traversal patterns",
        "Handle null references carefully"
      ]
    },
    trees: {
      subject: "Data Structures",
      title: "Trees",
      description: "Learn binary trees, BST, AVL trees, and tree traversal algorithms",
      difficulty: "Hard",
      estimatedTime: "12 hours",
      overview: "Trees are hierarchical data structures with a root element and child elements. This topic covers binary trees, binary search trees, AVL trees, tree traversal algorithms (inorder, preorder, postorder), and tree operations.",
      keyConcepts: [
        "Tree Terminology",
        "Binary Trees",
        "Binary Search Trees",
        "Balanced Trees",
        "Tree Traversal",
        "Tree Operations"
      ],
      relatedTopics: ["Linked Lists", "Graphs", "Algorithms"],
      problems: [
        {
          id: "p1",
          title: "Tree Traversal",
          description: "Implement inorder, preorder, and postorder traversal of a binary tree.",
          difficulty: "Hard",
          completed: false,
          hints: ["Use recursion", "Understand visitation order", "Handle base cases"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Build BST Implementation",
          description: "Create a binary search tree with insertion, deletion, and search.",
          difficulty: "Hard",
          completed: false,
          estimatedTime: "4 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "Tree Data Structures",
          type: "article",
          url: "#",
          description: "Comprehensive tree algorithms guide"
        }
      ],
      notes: [
        "Master recursive thinking",
        "Understand tree properties",
        "Practice traversal methods",
        "Learn balancing techniques"
      ]
    },
    graphs: {
      subject: "Data Structures",
      title: "Graphs",
      description: "Understand graph representations, BFS, DFS, and graph algorithms",
      difficulty: "Hard",
      estimatedTime: "14 hours",
      overview: "Graphs are non-linear data structures consisting of vertices and edges. This topic covers graph representations (adjacency matrix, adjacency list), graph traversal algorithms (BFS, DFS), shortest path algorithms, and other graph algorithms.",
      keyConcepts: [
        "Graph Representations",
        "Breadth-First Search",
        "Depth-First Search",
        "Shortest Path",
        "Minimum Spanning Tree",
        "Graph Properties"
      ],
      relatedTopics: ["Trees", "Algorithms", "Networks"],
      problems: [
        {
          id: "p1",
          title: "Graph Traversal",
          description: "Implement BFS and DFS for graph traversal.",
          difficulty: "Hard",
          completed: false,
          hints: ["Use queue for BFS", "Use stack for DFS", "Track visited nodes"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Build Graph Class",
          description: "Create a graph implementation with traversal algorithms.",
          difficulty: "Hard",
          completed: false,
          estimatedTime: "5 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "Graph Algorithms",
          type: "article",
          url: "#",
          description: "Complete guide to graph algorithms"
        }
      ],
      notes: [
        "Understand graph theory basics",
        "Master traversal algorithms",
        "Practice pathfinding",
        "Learn graph optimization"
      ]
    },
    "sql-basics": {
      subject: "DBMS",
      title: "SQL Basics",
      description: "Learn fundamental SQL queries, tables, and basic operations",
      difficulty: "Easy",
      estimatedTime: "5 hours",
      overview: "SQL (Structured Query Language) is the standard language for managing relational databases. This topic covers basic SQL syntax, SELECT statements, WHERE clauses, ORDER BY, GROUP BY, and fundamental database operations.",
      keyConcepts: [
        "SQL Syntax",
        "SELECT Statements",
        "WHERE Clauses",
        "ORDER BY and GROUP BY",
        "INSERT, UPDATE, DELETE",
        "Table Operations"
      ],
      relatedTopics: ["Database Design", "Joins", "Normalization"],
      problems: [
        {
          id: "p1",
          title: "Basic Queries",
          description: "Write SQL queries to select, filter, and sort data.",
          difficulty: "Easy",
          completed: false,
          hints: ["Use SELECT *", "Apply WHERE conditions", "Order results"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Create Database Schema",
          description: "Design and implement a simple database with tables.",
          difficulty: "Easy",
          completed: false,
          estimatedTime: "2 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "SQL Tutorial",
          type: "article",
          url: "#",
          description: "Beginner-friendly SQL guide"
        }
      ],
      notes: [
        "Practice query writing",
        "Understand table relationships",
        "Master basic operations",
        "Learn SQL best practices"
      ]
    },
    joins: {
      subject: "DBMS",
      title: "SQL Joins",
      description: "Master different types of joins and complex query operations",
      difficulty: "Medium",
      estimatedTime: "7 hours",
      overview: "SQL joins are used to combine rows from two or more tables based on related columns. This topic covers INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, and complex join operations with multiple tables.",
      keyConcepts: [
        "Join Types",
        "INNER JOIN",
        "OUTER JOINs",
        "Self Joins",
        "Multiple Table Joins",
        "Join Performance"
      ],
      relatedTopics: ["SQL Basics", "Database Design", "Query Optimization"],
      problems: [
        {
          id: "p1",
          title: "Join Queries",
          description: "Write queries using different join types to combine data.",
          difficulty: "Medium",
          completed: false,
          hints: ["Understand join conditions", "Choose correct join type", "Handle null values"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Complex Report Queries",
          description: "Create complex reports using multiple table joins.",
          difficulty: "Medium",
          completed: false,
          estimatedTime: "3 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "SQL Joins Guide",
          type: "article",
          url: "#",
          description: "Visual guide to SQL joins"
        }
      ],
      notes: [
        "Understand join logic",
        "Practice different join types",
        "Optimize join performance",
        "Handle complex relationships"
      ]
    },
    normalization: {
      subject: "DBMS",
      title: "Database Normalization",
      description: "Understand normalization forms and database design principles",
      difficulty: "Medium",
      estimatedTime: "8 hours",
      overview: "Database normalization is the process of organizing data in a database to reduce data redundancy and improve data integrity. This topic covers normalization forms (1NF, 2NF, 3NF, BCNF), functional dependencies, and database design principles.",
      keyConcepts: [
        "Normalization Forms",
        "Functional Dependencies",
        "1NF, 2NF, 3NF",
        "BCNF",
        "Database Design",
        "Data Integrity"
      ],
      relatedTopics: ["SQL Basics", "Database Design", "Data Modeling"],
      problems: [
        {
          id: "p1",
          title: "Normalize Tables",
          description: "Convert unnormalized tables to normalized forms.",
          difficulty: "Medium",
          completed: false,
          hints: ["Identify dependencies", "Apply normalization rules", "Eliminate redundancy"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Design Normalized Database",
          description: "Create a fully normalized database schema from requirements.",
          difficulty: "Medium",
          completed: false,
          estimatedTime: "3 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "Database Normalization",
          type: "article",
          url: "#",
          description: "Complete normalization guide"
        }
      ],
      notes: [
        "Master normalization theory",
        "Practice identifying dependencies",
        "Understand design trade-offs",
        "Learn database principles"
      ]
    },
    processes: {
      subject: "Operating System",
      title: "Process Management",
      description: "Learn about processes, threads, scheduling, and synchronization",
      difficulty: "Medium",
      estimatedTime: "10 hours",
      overview: "Process management is a core function of operating systems that handles the creation, scheduling, and termination of processes. This topic covers process states, scheduling algorithms, threads, inter-process communication, and synchronization.",
      keyConcepts: [
        "Process States",
        "Scheduling Algorithms",
        "Threads",
        "Process Synchronization",
        "Deadlock Handling",
        "IPC Mechanisms"
      ],
      relatedTopics: ["Memory Management", "File Systems", "Concurrency"],
      problems: [
        {
          id: "p1",
          title: "Scheduling Analysis",
          description: "Analyze and compare different CPU scheduling algorithms.",
          difficulty: "Medium",
          completed: false,
          hints: ["Calculate waiting time", "Compare algorithms", "Consider context switching"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Implement Scheduler",
          description: "Create a simple process scheduler simulation.",
          difficulty: "Medium",
          completed: false,
          estimatedTime: "4 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "Operating System Concepts",
          type: "article",
          url: "#",
          description: "Process management fundamentals"
        }
      ],
      notes: [
        "Understand process lifecycle",
        "Master scheduling algorithms",
        "Learn synchronization techniques",
        "Practice deadlock prevention"
      ]
    },
    memory: {
      subject: "Operating System",
      title: "Memory Management",
      description: "Understand memory allocation, paging, segmentation, and virtual memory",
      difficulty: "Hard",
      estimatedTime: "12 hours",
      overview: "Memory management handles allocation and deallocation of memory space to processes. This topic covers memory allocation techniques, paging, segmentation, virtual memory, page replacement algorithms, and memory optimization strategies.",
      keyConcepts: [
        "Memory Allocation",
        "Paging",
        "Segmentation",
        "Virtual Memory",
        "Page Replacement",
        "Memory Optimization"
      ],
      relatedTopics: ["Process Management", "Computer Architecture", "Algorithms"],
      problems: [
        {
          id: "p1",
          title: "Page Replacement",
          description: "Implement and analyze page replacement algorithms.",
          difficulty: "Hard",
          completed: false,
          hints: ["Track page references", "Calculate page faults", "Compare algorithms"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Memory Manager Simulation",
          description: "Create a memory management system simulation.",
          difficulty: "Hard",
          completed: false,
          estimatedTime: "5 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "Memory Management Guide",
          type: "article",
          url: "#",
          description: "Complete memory management tutorial"
        }
      ],
      notes: [
        "Master memory concepts",
        "Practice allocation algorithms",
        "Understand virtual memory",
        "Learn optimization techniques"
      ]
    },
    "file-systems": {
      subject: "Operating System",
      title: "File Systems",
      description: "Learn file organization, access methods, and storage management",
      difficulty: "Medium",
      estimatedTime: "8 hours",
      overview: "File systems manage how data is stored and retrieved from storage devices. This topic covers file organization, directory structures, file allocation methods, access control, and storage management techniques.",
      keyConcepts: [
        "File Organization",
        "Directory Structure",
        "File Allocation",
        "Access Control",
        "Storage Management",
        "File Operations"
      ],
      relatedTopics: ["Memory Management", "Process Management", "Data Storage"],
      problems: [
        {
          id: "p1",
          title: "File Allocation",
          description: "Implement different file allocation methods.",
          difficulty: "Medium",
          completed: false,
          hints: ["Compare allocation strategies", "Handle fragmentation", "Track file blocks"]
        }
      ],
      tasks: [
        {
          id: "t1",
          title: "Simple File System",
          description: "Create a basic file system implementation.",
          difficulty: "Medium",
          completed: false,
          estimatedTime: "3 hours"
        }
      ],
      resources: [
        {
          id: "r1",
          title: "File Systems Tutorial",
          type: "article",
          url: "#",
          description: "File system design and implementation"
        }
      ],
      notes: [
        "Understand file concepts",
        "Master allocation methods",
        "Learn access control",
        "Practice storage optimization"
      ]
    }
  };

  // Load approved contributions from localStorage
  const [approvedTopics, setApprovedTopics] = useState<any>({});

  useEffect(() => {
    try {
      const contributions = JSON.parse(localStorage.getItem("researchContributions") || "[]");
      const approved = contributions.filter((c: any) => c.status === "approved" && c.type === "topic");
      
      // Convert approved contributions to topic data format
      const approvedTopicsData: any = {};
      approved.forEach((contrib: any) => {
        const topicId = contrib.title.toLowerCase().replace(/\s+/g, '-');
        approvedTopicsData[topicId] = {
          subject: contrib.customSubject || contrib.subject,
          title: contrib.title,
          description: contrib.description,
          difficulty: contrib.difficulty,
          estimatedTime: contrib.estimatedTime || "Self-paced",
          overview: contrib.overview || "Learn about " + contrib.title,
          keyConcepts: contrib.keyConcepts || [],
          relatedTopics: contrib.relatedTopics || [],
          problems: (contrib.practiceProblems || []).map((problem: string, index: number) => ({
            id: `p${index + 1}`,
            title: problem,
            description: `Practice problem: ${problem}`,
            difficulty: contrib.difficulty,
            completed: false,
            hints: contrib.hints || []
          })),
          tasks: (contrib.projectTasks || []).map((task: string, index: number) => {
            const match = task.match(/\((\d+[^)]*)\)/);
            return {
              id: `t${index + 1}`,
              title: task.replace(/\s*\([^)]*\)/, ''),
              description: `Project task: ${task.replace(/\s*\([^)]*\)/, '')}`,
              difficulty: contrib.difficulty,
              completed: false,
              estimatedTime: match ? match[1] : "1 hour"
            };
          }),
          resources: contrib.resources || [],
          notes: contrib.notes || []
        };
      });
      
      setApprovedTopics(approvedTopicsData);
    } catch (error) {
      console.error("Error loading approved topics:", error);
    }
  }, []);

  // Merge topicsData with approved topics
  const allTopicsData = { ...topicsData, ...approvedTopics };
  const currentTopic = allTopicsData[topicId || ""];

  if (!currentTopic) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Topic not found
            </h1>
            <Link
              to="/research"
              className="text-indigo-600 hover:text-indigo-700"
            >
              Back to Research
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const toggleProblemComplete = (problemId: string) => {
    setCompletedProblems(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const toggleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "article": return <BookOpen className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      case "pdf": return <FileText className="h-4 w-4" />;
      case "external": return <ExternalLink className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const completedCount = completedProblems.length + completedTasks.length;
  const totalCount = currentTopic.problems.length + currentTopic.tasks.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/research/${subjectId}`}
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {currentTopic.subject}
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentTopic.title}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(currentTopic.difficulty)}`}>
                    {currentTopic.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {currentTopic.description}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {currentTopic.estimatedTime}
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    {progressPercentage}% Complete
                  </div>
                </div>
              </div>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {bookmarked ? (
                  <BookmarkCheck className="h-5 w-5 text-indigo-600" />
                ) : (
                  <Bookmark className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {currentTopic.overview}
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Concepts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentTopic.keyConcepts.map((concept, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{concept}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {currentTopic.relatedTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Problems Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Practice Problems</h2>
          <div className="space-y-4">
            {currentTopic.problems.map((problem) => (
              <div key={problem.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {problem.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {problem.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleProblemComplete(problem.id)}
                    className="ml-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {completedProblems.includes(problem.id) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Hints:</h4>
                  <ul className="space-y-1">
                    {problem.hints.map((hint, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="text-indigo-500 mr-2">#{index + 1}</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Tasks</h2>
          <div className="space-y-4">
            {currentTopic.tasks.map((task) => (
              <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.estimatedTime}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {task.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="ml-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {completedTasks.includes(task.id) ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Learning Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTopic.resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow block"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300`}>
                    {getResourceIcon(resource.type)}
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded capitalize">
                    {resource.type}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {resource.description}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Research Notes Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Research Notes</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-3">
              {currentTopic.notes.map((note, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;
