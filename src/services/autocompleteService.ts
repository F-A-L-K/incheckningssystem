
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
    // Simplified query to avoid complex type inference
    const { data, error } = await supabase
      .from('CHECKIN_visitors')
      .select('name')
      .eq('company', company)
      .eq('is_school_visit', false)
      .ilike('name', `${namePrefix}%`);

    if (error) {
      console.error('Error fetching frequent visitors:', error);
      return [];
    }

    // Filter out null/empty names and process the data
    const validNames = (data || [])
      .map(item => item.name)
      .filter((name): name is string => name != null && name.trim() !== '');

    if (validNames.length === 0) {
      return [];
    }

    // Count occurrences of each name
    const nameCounts: { [key: string]: number } = {};
    validNames.forEach((name: string) => {
      nameCounts[name] = (nameCounts[name] || 0) + 1;
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
