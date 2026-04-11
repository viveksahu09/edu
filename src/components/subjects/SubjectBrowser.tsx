import { useState, useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { Subject } from "../../types/university";
import UnitSection from "./UnitSection";
import BrowserToolbar from "./BrowserToolbar";
import { useTheme } from "../../context/ThemeContext";

interface SubjectBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  universityName: string;
}

interface TabInfo {
  id: string;
  subject: Subject;
}

export default function SubjectBrowser({
  isOpen,
  onClose,
  subjects,
  universityName,
}: SubjectBrowserProps) {
  const { isDarkMode } = useTheme();
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const browserRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newSubjects = subjects.filter(
      (subject) => !tabs.some((tab) => tab.id === subject.id)
    );

    if (newSubjects.length > 0) {
      setTabs((prev) => [
        ...prev,
        ...newSubjects.map((subject) => ({ id: subject.id, subject })),
      ]);
      setActiveTab(newSubjects[0].id);
    }
  }, [subjects]);

  const activeSubject = tabs.find((tab) => tab.id === activeTab)?.subject;

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button === 2) {
      const browserElement = browserRef.current;
      if (browserElement) {
        const offsetX =
          event.clientX - browserElement.getBoundingClientRect().left;
        const offsetY =
          event.clientY - browserElement.getBoundingClientRect().top;

        const handleMouseMove = (moveEvent: MouseEvent) => {
          browserElement.style.left = `${moveEvent.clientX - offsetX}px`;
          browserElement.style.top = `${moveEvent.clientY - offsetY}px`;
        };

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    }
  };

  const handleTabClick = (tabId: string) => {
    setIsMinimized(false);
    setActiveTab(tabId);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={browserRef}
      onMouseDown={handleMouseDown}
      className={`fixed z-50 transition-all duration-300 shadow-xl ${
        isMinimized ? "w-1/2.5 h-24 bottom-5 right-0 rounded-l-lg" : "inset-0"
      } ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <div
        className={`flex flex-col ${
          isMinimized ? "overflow-hidden" : "h-full"
        }`}
      >
        <BrowserToolbar
          tabs={tabs}
          activeTab={activeTab || ""}
          onTabClick={handleTabClick}
          onTabClose={(tabId) => {
            setTabs((prev) => prev.filter((tab) => tab.id !== tabId));
            if (tabs.length === 1) {
              onClose();
            }
          }}
          onMinimize={() => setIsMinimized(!isMinimized)}
          onClose={onClose}
          isMinimized={isMinimized}
          isDarkMode={isDarkMode}
        />

        {/* Content Area */}
        {!isMinimized && activeSubject && (
          <div
            className={`flex-1 p-6 overflow-y-auto ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <div className="max-w-4xl mx-auto">
              {/* Subject Header */}
              <div className="mb-8">
                <h1
                  className={`text-4xl font-bold ${
                    isDarkMode
                      ? "text-white"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
                  }`}
                >
                  {activeSubject.name}
                </h1>
                <p
                  className={`mt-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {universityName}
                </p>
              </div>

              {/* Download All Button */}
              <div className="flex justify-end mb-6">
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download All Units
                </button>
              </div>

              {/* Units */}
              <div className="space-y-6">
                {activeSubject.units?.map((unit, index) => (
                  <UnitSection
                    key={index}
                    unitNumber={unit.number}
                    title={unit.title}
                    overview={unit.overview}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
