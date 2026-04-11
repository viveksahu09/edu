import { useState, useEffect } from "react";

interface UseSearchOptions {
  searchKey: string;
  initialQuery?: string;
}

export function useSearch<T extends Record<string, any>>(
  items: T[],
  searchKey: string,
  options: UseSearchOptions = { searchKey: "title" }
) {
  const [query, setQuery] = useState(options.initialQuery || "");
  const [filteredResults, setFilteredResults] = useState<T[]>(items);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults(items);
      return;
    }

    const searchResults = items.filter((item) =>
      item[searchKey].toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResults(searchResults);
  }, [query, items, searchKey]);

  return { query, setQuery, filteredResults };
}
