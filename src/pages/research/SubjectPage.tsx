import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Star, BarChart3 } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  progress: number;
  tags: string[];
  problemCount: number;
  taskCount: number;
}

interface SubjectData {
  [key: string]: {
    name: string;
    description: string;
    icon: string;
    color: string;
    topics: Topic[];
  };
}

const SubjectPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();

  const subjectsData: SubjectData = {
    "web-dev": {
      name: "Web Development",
      description: "Master modern web technologies from HTML basics to advanced frameworks",
      icon: "Code",
      color: "blue",
      topics: [
        {
          id: "html",
          title: "HTML",
          description: "Learn the fundamentals of HTML5, semantic markup, and document structure",
          difficulty: "Easy",
          estimatedTime: "4 hours",
          progress: 75,
          tags: ["Beginner", "Fundamental", "Important"],
          problemCount: 12,
          taskCount: 5
        },
        {
          id: "css",
          title: "CSS",
          description: "Master CSS3, layouts, animations, and responsive design",
          difficulty: "Easy",
          estimatedTime: "6 hours",
          progress: 60,
          tags: ["Beginner", "Design", "Essential"],
          problemCount: 15,
          taskCount: 7
        },
        {
          id: "javascript",
          title: "JavaScript",
          description: "Learn JavaScript from basics to advanced concepts including ES6+",
          difficulty: "Medium",
          estimatedTime: "12 hours",
          progress: 45,
          tags: ["Intermediate", "Programming", "Core"],
          problemCount: 25,
          taskCount: 10
        },
        {
          id: "react",
          title: "React",
          description: "Build modern web applications with React, hooks, and state management",
          difficulty: "Hard",
          estimatedTime: "16 hours",
          progress: 30,
          tags: ["Advanced", "Framework", "Popular"],
          problemCount: 20,
          taskCount: 8
        },
        {
          id: "tailwind",
          title: "Tailwind CSS",
          description: "Learn utility-first CSS framework for rapid UI development",
          difficulty: "Medium",
          estimatedTime: "8 hours",
          progress: 20,
          tags: ["Intermediate", "CSS", "Modern"],
          problemCount: 10,
          taskCount: 4
        }
      ]
    },
    "dsa": {
      name: "Data Structures",
      description: "Understanding data organization, algorithms, and problem-solving techniques",
      icon: "Database",
      color: "green",
      topics: [
        {
          id: "arrays",
          title: "Arrays",
          description: "Learn array operations, multi-dimensional arrays, and common algorithms",
          difficulty: "Easy",
          estimatedTime: "6 hours",
          progress: 80,
          tags: ["Beginner", "Fundamental", "Data Structure"],
          problemCount: 18,
          taskCount: 6
        },
        {
          id: "linked-lists",
          title: "Linked Lists",
          description: "Master singly, doubly, and circular linked lists with operations",
          difficulty: "Medium",
          estimatedTime: "8 hours",
          progress: 55,
          tags: ["Intermediate", "Data Structure", "Pointer"],
          problemCount: 22,
          taskCount: 8
        },
        {
          id: "trees",
          title: "Trees",
          description: "Learn binary trees, BST, AVL trees, and tree traversal algorithms",
          difficulty: "Hard",
          estimatedTime: "12 hours",
          progress: 35,
          tags: ["Advanced", "Data Structure", "Recursive"],
          problemCount: 30,
          taskCount: 10
        },
        {
          id: "graphs",
          title: "Graphs",
          description: "Understand graph representations, BFS, DFS, and graph algorithms",
          difficulty: "Hard",
          estimatedTime: "14 hours",
          progress: 25,
          tags: ["Advanced", "Algorithm", "Complex"],
          problemCount: 28,
          taskCount: 9
        }
      ]
    },
    "dbms": {
      name: "DBMS",
      description: "Database management systems, SQL, and data modeling concepts",
      icon: "Database",
      color: "purple",
      topics: [
        {
          id: "sql-basics",
          title: "SQL Basics",
          description: "Learn fundamental SQL queries, tables, and basic operations",
          difficulty: "Easy",
          estimatedTime: "5 hours",
          progress: 70,
          tags: ["Beginner", "Database", "Query"],
          problemCount: 16,
          taskCount: 5
        },
        {
          id: "joins",
          title: "SQL Joins",
          description: "Master different types of joins and complex query operations",
          difficulty: "Medium",
          estimatedTime: "7 hours",
          progress: 50,
          tags: ["Intermediate", "Database", "Advanced Query"],
          problemCount: 20,
          taskCount: 7
        },
        {
          id: "normalization",
          title: "Database Normalization",
          description: "Understand normalization forms and database design principles",
          difficulty: "Medium",
          estimatedTime: "8 hours",
          progress: 40,
          tags: ["Intermediate", "Design", "Theory"],
          problemCount: 14,
          taskCount: 6
        }
      ]
    },
    "os": {
      name: "Operating System",
      description: "Process management, memory allocation, and system architecture",
      icon: "Cpu",
      color: "orange",
      topics: [
        {
          id: "processes",
          title: "Process Management",
          description: "Learn about processes, threads, scheduling, and synchronization",
          difficulty: "Medium",
          estimatedTime: "10 hours",
          progress: 45,
          tags: ["Intermediate", "Core", "Scheduling"],
          problemCount: 18,
          taskCount: 7
        },
        {
          id: "memory",
          title: "Memory Management",
          description: "Understand memory allocation, paging, segmentation, and virtual memory",
          difficulty: "Hard",
          estimatedTime: "12 hours",
          progress: 30,
          tags: ["Advanced", "Memory", "Hardware"],
          problemCount: 24,
          taskCount: 8
        },
        {
          id: "file-systems",
          title: "File Systems",
          description: "Learn file organization, access methods, and storage management",
          difficulty: "Medium",
          estimatedTime: "8 hours",
          progress: 35,
          tags: ["Intermediate", "Storage", "IO"],
          problemCount: 16,
          taskCount: 6
        }
      ]
    }
  };

  const currentSubject = subjectsData[subjectId || ""];

  if (!currentSubject) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Subject not found
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return "bg-green-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/research"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Research
          </Link>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentSubject.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {currentSubject.description}
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {currentSubject.topics.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Topics
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSubject.topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/research/${subjectId}/${topic.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                {/* Topic Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {topic.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {topic.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {topic.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {topic.estimatedTime}
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    {topic.problemCount} problems
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {topic.taskCount} tasks
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Progress</span>
                    <span className="text-gray-600 dark:text-gray-300">{topic.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(topic.progress)}`}
                      style={{ width: `${topic.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Subject Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              {currentSubject.topics.reduce((sum, topic) => sum + topic.problemCount, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Total Problems
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              {currentSubject.topics.reduce((sum, topic) => sum + topic.taskCount, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Total Tasks
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {Math.round(currentSubject.topics.reduce((sum, topic) => sum + topic.progress, 0) / currentSubject.topics.length)}%
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Avg Progress
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {currentSubject.topics.reduce((sum, topic) => sum + parseInt(topic.estimatedTime), 0)}h
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Total Time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;
