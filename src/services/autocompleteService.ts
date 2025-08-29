
import { supabase } from "@/integrations/supabase/client";

export interface FrequentVisitor {
  name: string;
  visitCount: number;
}

export const getFrequentVisitorNames = async (
  company: string, 
  namePrefix: string
): Promise<FrequentVisitor[]> => {
  if (!company.trim() || namePrefix.length < 2) {
    return [];
  }

  try {
    // Use rpc with a simple query to completely avoid type inference issues
    const { data, error } = await supabase.rpc('exec', {
      sql: `
        SELECT name 
        FROM "CHECKIN_visitors" 
        WHERE company = $1 
        AND is_school_visit = false 
        AND name ILIKE $2 
        AND name IS NOT NULL
      `,
      args: [company, `${namePrefix}%`]
    });

    if (error) {
      console.error('Error fetching frequent visitors:', error);
      return [];
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Count occurrences of each name
    const nameCounts: Record<string, number> = {};
    data.forEach((row: any) => {
      const name = row.name;
      if (name && typeof name === 'string') {
        nameCounts[name] = (nameCounts[name] || 0) + 1;
      }
    });

    // Filter names that appear at least 3 times and sort by frequency
    const frequentVisitors: FrequentVisitor[] = Object.entries(nameCounts)
      .filter(([_, count]) => count >= 3)
      .map(([name, count]) => ({ name, visitCount: count }))
      .sort((a, b) => b.visitCount - a.visitCount);

    return frequentVisitors;
  } catch (error) {
    console.error('Error in getFrequentVisitorNames:', error);
    return [];
  }
};
