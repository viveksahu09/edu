import React from "react";
import { Link } from "react-router-dom";
import { FileText, Loader } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  url: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  onClose: () => void;
}

export default function SearchResults({
  results,
  isLoading,
  onClose,
}: SearchResultsProps) {
  return (
    <div
      className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200"
      onMouseLeave={onClose}
    >
      {isLoading ? (
        <div className="p-4 flex items-center justify-center">
          <Loader className="h-5 w-5 text-gray-400 animate-spin" />
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      ) : results.length > 0 ? (
        <ul className="max-h-96 overflow-auto">
          {results.map((result) => (
            <li key={result.id}>
              <Link
                to={result.url}
                className="flex items-center px-4 py-3 hover:bg-gray-50"
                onClick={onClose}
              >
                <FileText className="h-5 w-5 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {result.title}
                  </p>
                  <p className="text-xs text-gray-500">{result.type}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-gray-500">No results found</div>
      )}
    </div>
  );
}
