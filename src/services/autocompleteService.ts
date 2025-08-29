
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
    // Use explicit any type to avoid TypeScript type instantiation issues
    const queryResult: any = await supabase
      .from('CHECKIN_visitors')
      .select('name')
      .eq('company', company)
      .eq('is_school_visit', false)
      .ilike('name', `${namePrefix}%`)
      .not('name', 'is', null);

    const { data, error } = queryResult;

    if (error) {
      console.error('Error fetching frequent visitors:', error);
      return [];
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Count occurrences of each name
    const nameCounts: Record<string, number> = {};
    data.forEach((visitor: any) => {
      if (visitor?.name && typeof visitor.name === 'string') {
        nameCounts[visitor.name] = (nameCounts[visitor.name] || 0) + 1;
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
