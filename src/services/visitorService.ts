
import { supabase } from "@/integrations/supabase/client";
import { Visitor, VisitorType } from "@/types/visitors";

export interface CheckInData {
  name: string;
  company: string;
  visiting: string;
  is_service_personnel: boolean;
}

export const saveVisitor = async (visitorData: CheckInData) => {
  const { data, error } = await supabase
    .from('CHECKIN_visitors')
    .insert([visitorData])
    .select()
    .single();

  if (error) {
    console.error('Error saving visitor:', error);
    throw error;
  }

  return data;
};

export const getCheckedInVisitors = async () => {
  const { data, error } = await supabase
    .from('CHECKIN_visitors')
    .select('*')
    .eq('checked_out', false)
    .order('check_in_time', { ascending: false });

  if (error) {
    console.error('Error fetching visitors:', error);
    throw error;
  }

  return data || [];
};

export const checkOutVisitor = async (visitorId: string) => {
  const { data, error } = await supabase
    .from('CHECKIN_visitors')
    .update({ 
      checked_out: true, 
      check_out_time: new Date().toISOString() 
    })
    .eq('id', visitorId)
    .select()
    .single();

  if (error) {
    console.error('Error checking out visitor:', error);
    throw error;
  }

  return data;
};

export const convertToVisitorFormat = (dbVisitor: any): Visitor => {
  return {
    id: dbVisitor.id,
    firstName: dbVisitor.name.split(' ')[0] || '',
    lastName: dbVisitor.name.split(' ').slice(1).join(' ') || '',
    checkInTime: dbVisitor.check_in_time,
    hostName: dbVisitor.visiting,
    company: dbVisitor.company,
    type: dbVisitor.is_service_personnel ? 'service' : 'regular'
  };
};
