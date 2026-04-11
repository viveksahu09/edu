import React from "react";
import { X, Minimize2, Maximize2 } from "lucide-react";
import SubjectTab from "./SubjectTab";
import { Subject } from "../../types/university";

interface BrowserToolbarProps {
  tabs: Array<{ id: string; subject: Subject }>;
  activeTab: string;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onMinimize: () => void;
  onClose: () => void;
  isMinimized: boolean;
  isDarkMode: boolean;
}

export default function BrowserToolbar({
  tabs,
  activeTab,
  onTabClick,
  onTabClose,
  onMinimize,
  onClose,
  isMinimized,
  isDarkMode,
}: BrowserToolbarProps) {
  return (
    <div
      className={`flex items-center rounded-t-lg ${
        isDarkMode ? "bg-gray-800" : "bg-purple-200"
      }  px-4 py-2 border-b`}
    >
      <div className="flex-1 flex items-center space-x-2 overflow-x-auto ">
        {tabs.map(({ id, subject }) => (
          <SubjectTab
            key={id}
            subject={subject}
            isActive={activeTab === id}
            onClick={() => onTabClick(id)}
            onClose={() => onTabClose(id)}
            textClassName={isDarkMode ? "text-white" : "text-black"}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={onMinimize}
          className={`p-2 ${
            isDarkMode ? "hover:bg-gray-700" : "text-black"
          } rounded-full`}
          title={isMinimized ? "Maximize" : "Minimize"}
        >
          {isMinimized ? (
            <Maximize2
              className={`h-5 w-5 ${isDarkMode ? "text-white" : "text-black"}`}
            />
          ) : (
            <Minimize2
              className={`h-5 w-5 ${isDarkMode ? "text-white" : "text-black"}`}
            />
          )}
        </button>
        <button
          onClick={() => {
            // Close all tabs
            tabs.forEach(({ id }) => onTabClose(id));
            onClose(); // Call onClose if it has additional logic
          }}
          className={`p-2 ${
            isDarkMode ? "hover:bg-gray-700" : "text-black"
          } rounded-full`}
          title="Close All Tabs"
        >
          <X
            className={`1h-5 w-5 ${isDarkMode ? "text-white" : "text-black"}`}
          />
        </button>
      </div>
    </div>
  );
}
