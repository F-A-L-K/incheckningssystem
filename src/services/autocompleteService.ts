
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
    // Use rpc call to bypass complex type inference
    const { data, error } = await supabase.rpc('get_frequent_visitors', {
      p_company: company,
      p_name_prefix: namePrefix
    });

    if (error) {
      console.error('Error fetching frequent visitors via RPC:', error);
      // Fallback to direct query if RPC fails
      return await getFallbackFrequentVisitors(company, namePrefix);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getFrequentVisitorNames:', error);
    // Fallback to direct query
    return await getFallbackFrequentVisitors(company, namePrefix);
  }
};

// Fallback function using raw query
const getFallbackFrequentVisitors = async (
  company: string, 
  namePrefix: string
): Promise<FrequentVisitor[]> => {
  try {
    // Use any type to completely bypass type inference
    const response: any = await supabase
      .from('CHECKIN_visitors')
      .select('name')
      .eq('company', company)
      .eq('is_school_visit', false)
      .ilike('name', `${namePrefix}%`)
      .not('name', 'is', null);

    if (response.error || !response.data) {
      console.error('Error in fallback query:', response.error);
      return [];
    }

    // Count occurrences of each name
    const nameCounts: Record<string, number> = {};
    response.data.forEach((visitor: any) => {
      if (visitor.name && typeof visitor.name === 'string') {
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
    console.error('Error in fallback frequent visitors:', error);
    return [];
  }
};
