import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Plus, BookOpen, Code, Target, RefreshCw } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface ResearchItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  type: "subject" | "contribution";
  link: string;
  count?: string;
}

export default function ResearchSlider() {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [approvedContributions, setApprovedContributions] = useState<any[]>([]);
  const itemsPerSlide = 16;

  const loadContributions = () => {
    // Load approved contributions from localStorage
    try {
      const contributions = JSON.parse(localStorage.getItem("researchContributions") || "[]");
      const approved = contributions.filter((c: any) => c.status === "approved" && c.type === "topic");
      console.log("Loaded contributions:", approved);
      setApprovedContributions(approved);
    } catch (error) {
      console.error("Error loading contributions:", error);
    }
  };

  useEffect(() => {
    loadContributions();
  }, []);

  // Base subjects
  const baseSubjects: ResearchItem[] = [
    {
      id: "web-dev",
      title: "Web Development",
      description: "HTML, CSS, JavaScript, React, and modern web technologies",
      icon: Code,
      color: "bg-blue-500",
      type: "subject",
      link: "/research/web-dev",
      count: "45 topics"
    },
    {
      id: "dsa",
      title: "Data Structures",
      description: "Arrays, Linked Lists, Trees, Graphs, and Algorithms",
      icon: Code,
      color: "bg-green-500",
      type: "subject",
      link: "/research/dsa",
      count: "38 topics"
    },
    {
      id: "dbms",
      title: "DBMS",
      description: "Database design, SQL, normalization, and query optimization",
      icon: Code,
      color: "bg-purple-500",
      type: "subject",
      link: "/research/dbms",
      count: "32 topics"
    },
    {
      id: "os",
      title: "Operating System",
      description: "Process management, memory, file systems, and concurrency",
      icon: Code,
      color: "bg-orange-500",
      type: "subject",
      link: "/research/os",
      count: "28 topics"
    }
  ];

  // Convert approved contributions to research items
  const contributionItems: ResearchItem[] = approvedContributions.map((contrib) => {
    console.log("Converting contribution:", contrib);
    const item = {
      id: contrib.id,
      title: contrib.title,
      description: contrib.description,
      icon: BookOpen,
      color: "bg-teal-500",
      type: "subject" as const,
      link: `/research/${(contrib.customSubject || contrib.subject).toLowerCase().replace(/\s+/g, '-')}/${contrib.title.toLowerCase().replace(/\s+/g, '-')}`,
      count: `${contrib.difficulty} - ${contrib.estimatedTime || 'Self-paced'}`
    };
    console.log("Converted to research item:", item);
    return item;
  });

  // Combine all items with contribute card
  const researchItems: ResearchItem[] = [
    ...baseSubjects,
    ...contributionItems,
    {
      id: "contribute",
      title: "Contribute",
      description: "Share your knowledge by adding new topics, problems, and tasks",
      icon: Plus,
      color: "bg-indigo-500",
      type: "contribution",
      link: "/research/contribute",
      count: "Add content"
    }
  ];

  // Debug: Log the complete research items
  console.log("Base subjects:", baseSubjects.length);
  console.log("Contribution items:", contributionItems.length);
  console.log("Total research items:", researchItems.length);
  console.log("Research items:", researchItems);

  const filteredItems = researchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + itemsPerSlide >= filteredItems.length
        ? 0
        : prev + itemsPerSlide
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - itemsPerSlide < 0
        ? Math.max(0, filteredItems.length - itemsPerSlide)
        : prev - itemsPerSlide
    );
  };

  const visibleItems = filteredItems.slice(startIndex, startIndex + itemsPerSlide);

  return (
    <section className={`py-8 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Explore Research Topics
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
            
            <button
              onClick={loadContributions}
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              } transition-colors`}
              title="Refresh contributions"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            
            {filteredItems.length > itemsPerSlide && (
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  className={`p-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  } transition-colors`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className={`p-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-white text-gray-900 hover:bg-gray-100"
                  } transition-colors`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.link}
                  className={`group relative block ${
                    item.type === "contribution" 
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" 
                      : isDarkMode 
                        ? "bg-gray-800 text-white" 
                        : "bg-white text-gray-900"
                  } rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
                >
                  <div className="p-6">
                    <div className={`w-12 h-12 ${
                      item.type === "contribution" 
                        ? "bg-white/20" 
                        : item.color
                    } rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${
                        item.type === "contribution" ? "text-white" : "text-white"
                      }`} />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className={`text-sm mb-4 line-clamp-2 ${
                      item.type === "contribution" ? "text-white/90" : "text-gray-600 dark:text-gray-300"
                    }`}>
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        item.type === "contribution" ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {item.count}
                      </span>
                      {item.type === "contribution" && (
                        <div className="flex items-center text-white/80 text-sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Contribute
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {item.type === "contribution" && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </a>
              );
            })}
          </div>

          {filteredItems.length > itemsPerSlide && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({
                length: Math.ceil(filteredItems.length / itemsPerSlide),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setStartIndex(index * itemsPerSlide)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    startIndex === index * itemsPerSlide
                      ? "bg-indigo-600"
                      : isDarkMode
                      ? "bg-gray-600"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
