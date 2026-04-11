import { useState, useEffect } from "react";
import { universities } from "../data/universities";
import type { University } from "../types/university";

export function useUniversity(slug: string | undefined) {
  const [university, setUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("University slug is required");
      setIsLoading(false);
      return;
    }

    const foundUniversity = universities.find((u) => u.slug === slug);
    if (foundUniversity) {
      setUniversity(foundUniversity);
    } else {
      setError("University not found");
    }
    setIsLoading(false);
  }, [slug]);

  return { university, isLoading, error };
}
