
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
    // Use rpc to bypass complex type inference
    const { data, error } = await supabase.rpc('get_frequent_visitor_names', {
      company_param: company,
      name_prefix: namePrefix
    });

    if (error) {
      console.error('Error fetching frequent visitors:', error);
      // Fallback to direct query if RPC fails
      return await fallbackQuery(company, namePrefix);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getFrequentVisitorNames:', error);
    // Fallback to direct query
    return await fallbackQuery(company, namePrefix);
  }
};

// Fallback function with explicit typing to avoid type inference issues
const fallbackQuery = async (company: string, namePrefix: string): Promise<FrequentVisitor[]> => {
  try {
    const { data, error } = await supabase
      .from('CHECKIN_visitors')
      .select('name')
      .eq('company', company)
      .eq('is_school_visit', false)
      .ilike('name', `${namePrefix}%`)
      .not('name', 'is', null) as { data: { name: string }[] | null, error: any };

    if (error || !data) {
      return [];
    }

    // Count occurrences of each name
    const nameCounts: Record<string, number> = {};
    data.forEach((visitor) => {
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
    console.error('Error in fallbackQuery:', error);
    return [];
  }
};
