import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, TrendingUp, BookOpen, Code, Database, Cpu } from "lucide-react";
import ResearchSlider from "../components/research/ResearchSlider";

interface Subject {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
  topicCount: number;
}

interface TrendingTopic {
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  topicId: string;
}

const Research = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects] = useState<Subject[]>([
    {
      id: "web-dev",
      name: "Web Development",
      icon: Code,
      description: "HTML, CSS, JavaScript, React, and modern web technologies",
      color: "bg-blue-500",
      topicCount: 45
    },
    {
      id: "dsa",
      name: "Data Structures",
      icon: Database,
      description: "Arrays, Linked Lists, Trees, Graphs, and Algorithms",
      color: "bg-green-500",
      topicCount: 38
    },
    {
      id: "dbms",
      name: "DBMS",
      icon: Database,
      description: "Database design, SQL, normalization, and query optimization",
      color: "bg-purple-500",
      topicCount: 32
    },
    {
      id: "os",
      name: "Operating System",
      icon: Cpu,
      description: "Process management, memory, file systems, and concurrency",
      color: "bg-orange-500",
      topicCount: 28
    }
  ]);

  const [trendingTopics] = useState<TrendingTopic[]>([
    { id: "1", title: "React", subject: "Web Development", difficulty: "Hard", topicId: "react" },
    { id: "2", title: "Trees", subject: "Data Structures", difficulty: "Hard", topicId: "trees" },
    { id: "3", title: "SQL Joins", subject: "DBMS", difficulty: "Medium", topicId: "joins" },
    { id: "4", title: "Process Management", subject: "Operating System", difficulty: "Medium", topicId: "processes" },
    { id: "5", title: "CSS", subject: "Web Development", difficulty: "Easy", topicId: "css" },
    { id: "6", title: "Arrays", subject: "Data Structures", difficulty: "Easy", topicId: "arrays" }
  ]);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Research Slider with Subjects and Contribute */}
        <ResearchSlider />

        {/* Trending Topics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-5 w-5 text-indigo-500 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Trending Topics
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingTopics.map((topic) => {
              const getSubjectId = (subject: string) => {
                switch(subject) {
                  case "Web Development": return "web-dev";
                  case "Data Structures": return "dsa";
                  case "DBMS": return "dbms";
                  case "Operating System": return "os";
                  default: return subject.toLowerCase().replace(' ', '-');
                }
              };
              
              return (
              <Link
                key={topic.id}
                to={`/research/${getSubjectId(topic.subject)}/${topic.topicId}`}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {topic.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {topic.subject}
                </p>
              </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              143
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Total Topics
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              89
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Practice Problems
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              56
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Project Tasks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
