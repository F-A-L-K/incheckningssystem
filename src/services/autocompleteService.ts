
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
    // Use explicit any type to avoid type inference issues
    const { data: rawData, error } = await supabase
      .from('CHECKIN_visitors')
      .select('name')
      .eq('company', company)
      .eq('is_school_visit', false)
      .ilike('name', `${namePrefix}%`)
      .not('name', 'is', null) as { data: any[] | null; error: any };

    if (error) {
      console.error('Error fetching frequent visitors:', error);
      return [];
    }

    // Safely handle the data with explicit type checking
    const visitors = rawData || [];
    const validVisitors = visitors.filter((item): item is { name: string } => 
      item && typeof item === 'object' && 'name' in item && typeof item.name === 'string'
    );

    // Count occurrences of each name
    const nameCounts: Record<string, number> = {};
    validVisitors.forEach((visitor) => {
      nameCounts[visitor.name] = (nameCounts[visitor.name] || 0) + 1;
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
