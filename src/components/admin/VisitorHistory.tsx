
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface VisitorHistoryData {
  id: string;
  name: string;
  company: string;
  visiting: string;
  check_in_time: string;
  check_out_time: string | null;
  is_service_personnel: boolean;
}

const VisitorHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['visitorHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('CHECKIN_visitors')
        .select('*')
        .order('check_in_time', { ascending: false });

      if (error) {
        console.error('Error fetching visitor history:', error);
        throw error;
      }

      return data || [];
    },
  });

  const filteredHistory = history.filter((visitor: VisitorHistoryData) =>
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.visiting.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Laddar historik...</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Besökarhistorik ({history.length})</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Sök namn, företag eller värd..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'Inga matchande besökare hittades.' : 'Ingen besökarhistorik tillgänglig.'}
          </div>
        ) : (
          <div className="overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Namn</TableHead>
                  <TableHead>Företag</TableHead>
                  <TableHead>Besöker</TableHead>
                  <TableHead>Incheckningstid</TableHead>
                  <TableHead>Utcheckningstid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Typ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((visitor: VisitorHistoryData) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">{visitor.name}</TableCell>
                    <TableCell>{visitor.company}</TableCell>
                    <TableCell>{visitor.visiting}</TableCell>
                    <TableCell>{formatTime(visitor.check_in_time)}</TableCell>
                    <TableCell>{formatTime(visitor.check_out_time)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        visitor.check_out_time 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {visitor.check_out_time ? 'Utcheckad' : 'Incheckad'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        visitor.is_service_personnel 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {visitor.is_service_personnel ? 'Service' : 'Vanligt'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorHistory;
