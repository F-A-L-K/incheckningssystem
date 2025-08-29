
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
    // Use rpc or raw query to avoid TypeScript type instantiation issues
    const { data, error } = await supabase.rpc('get_visitor_names', {
      p_company: company,
      p_name_prefix: namePrefix
    });

    if (error) {
      console.error('Error fetching frequent visitors:', error);
      // Fallback to direct query if RPC doesn't exist
      return await fallbackQuery(company, namePrefix);
    }

    if (!data) {
      return [];
    }

    // Count occurrences of each name
    const nameCounts: Record<string, number> = {};
    data.forEach((visitor: VisitorNameRow) => {
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
    return await fallbackQuery(company, namePrefix);
  }
};

// Fallback function using a simpler approach
async function fallbackQuery(company: string, namePrefix: string): Promise<FrequentVisitor[]> {
  try {
    // Use any type to completely bypass TypeScript inference
    const result: any = await supabase
      .from('CHECKIN_visitors')
      .select('name')
      .eq('company', company)
      .eq('is_school_visit', false)
      .ilike('name', `${namePrefix}%`)
      .not('name', 'is', null);

    const { data, error } = result;

    if (error || !data) {
      return [];
    }

    // Count occurrences of each name
    const nameCounts: Record<string, number> = {};
    data.forEach((visitor: any) => {
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
    console.error('Error in fallback query:', error);
    return [];
  }
}
