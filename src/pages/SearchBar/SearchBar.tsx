import React, { useState } from "react";
import { Search, X } from "lucide-react";
import SearchResults from "./SearchResults";
import { useSearch } from "../../hooks/userSearch";

interface SearchItem {
  id: string;
  title: string;
  type: string;
  url: string;
}

const mockSearchItems: SearchItem[] = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    type: "Course Notes",
    url: "/notes/cs-intro",
  },
  {
    id: "2",
    title: "Data Structures and Algorithms",
    type: "Study Material",
    url: "/notes/dsa",
  },
];

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { query, setQuery, filteredResults } = useSearch(
    mockSearchItems,
    "title"
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search notes, courses..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && query && (
        <SearchResults
          results={filteredResults}
          isLoading={isLoading}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
