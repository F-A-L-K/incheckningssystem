
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

// Funktion för att automatiskt checka ut gamla besökare
const autoCheckoutOldVisitors = async () => {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  try {
    // Checka ut besökare som checkade in före 18:00 och det är nu efter 18:00 samma dag eller senare
    const { error: error1 } = await supabase
      .from('CHECKIN_visitors')
      .update({ 
        checked_out: true, 
        check_out_time: new Date().toISOString()
      })
      .eq('checked_out', false)
      .lt('check_in_time', `${currentDate}T18:00:00`)
      .filter('check_in_time', 'lt', `${currentDate}T00:00:00`);

    if (error1) {
      console.error('Error auto-checking out visitors (before 18:00):', error1);
    }

    // Checka ut besökare som checkade in efter 18:00 och det är nu efter 18:00 nästa dag
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];
    
    const { error: error2 } = await supabase
      .from('CHECKIN_visitors')
      .update({ 
        checked_out: true, 
        check_out_time: new Date().toISOString()
      })
      .eq('checked_out', false)
      .gte('check_in_time', `${yesterdayDate}T18:00:00`)
      .lt('check_in_time', `${currentDate}T00:00:00`);

    if (error2) {
      console.error('Error auto-checking out visitors (after 18:00):', error2);
    }
  } catch (error) {
    console.error('Error in auto-checkout process:', error);
  }
};

export const getCheckedInVisitors = async () => {
  // Kör automatisk utcheckning först
  await autoCheckoutOldVisitors();
  
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
