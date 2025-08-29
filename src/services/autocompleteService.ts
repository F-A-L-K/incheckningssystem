
import { supabase } from "@/integrations/supabase/client";

export interface FrequentVisitor {
  name: string;
  visitCount: number;
}

type VisitorNameRow = {
  name: string;
};

export const getFrequentVisitorNames = async (
  company: string, 
  namePrefix: string
): Promise<FrequentVisitor[]> => {
  if (!company.trim() || namePrefix.length < 2) {
    return [];
  }

  try {
    // Use a simpler query approach to avoid deep type instantiation
    const query = supabase
      .from('CHECKIN_visitors')
      .select('name')
      .eq('company', company)
      .eq('is_school_visit', false)
      .ilike('name', `${namePrefix}%`)
      .not('name', 'is', null);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching frequent visitors:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Count occurrences of each name
    const nameCounts: Record<string, number> = {};
    (data as VisitorNameRow[]).forEach((visitor) => {
      if (visitor.name) {
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
