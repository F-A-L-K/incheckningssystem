
import { useState, useEffect, useCallback } from "react";
import { getFrequentVisitorNames, FrequentVisitor } from "@/services/autocompleteService";

interface AutocompleteOption {
  value: string;
  label: string;
  visitCount?: number;
}

export const useVisitorAutocomplete = (company: string) => {
  const [suggestions, setSuggestions] = useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, AutocompleteOption[]>>({});

  const debouncedSearch = useCallback(
    debounce(async (company: string, namePrefix: string) => {
      const cacheKey = `${company}-${namePrefix}`;
      
      // Check cache first
      if (cache[cacheKey]) {
        setSuggestions(cache[cacheKey]);
        setLoading(false);
        return;
      }

      try {
        const frequentVisitors = await getFrequentVisitorNames(company, namePrefix);
        const options = frequentVisitors.map(visitor => ({
          value: visitor.name,
          label: visitor.name,
          visitCount: visitor.visitCount
        }));
        
        setSuggestions(options);
        
        // Cache the results
        setCache(prev => ({ ...prev, [cacheKey]: options }));
      } catch (error) {
        console.error('Error searching for visitor suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [cache]
  );

  const searchVisitors = useCallback((namePrefix: string) => {
    if (!company.trim() || namePrefix.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    debouncedSearch(company, namePrefix);
  }, [company, debouncedSearch]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    loading,
    searchVisitors,
    clearSuggestions
  };
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
