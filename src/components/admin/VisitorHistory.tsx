
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

const getVisitorHistory = async () => {
  const { data, error } = await supabase
    .from('CHECKIN_visitors')
    .select('*')
    .order('check_in_time', { ascending: false })
    .limit(100); // Limit to last 100 visitors for performance

  if (error) {
    console.error('Error fetching visitor history:', error);
    throw error;
  }

  return data || [];
};

export const VisitorHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: visitors, isLoading } = useQuery({
    queryKey: ['visitor-history'],
    queryFn: getVisitorHistory,
  });

  const filteredVisitors = visitors?.filter(visitor =>
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.visiting.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Laddar historik...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Besökshistorik</CardTitle>
        <div className="mt-4">
          <Input
            placeholder="Sök efter namn, företag eller värd..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredVisitors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Inga resultat hittades' : 'Ingen historik tillgänglig'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Namn</TableHead>
                  <TableHead>Företag</TableHead>
                  <TableHead>Besöker</TableHead>
                  <TableHead>Incheckningstid</TableHead>
                  <TableHead>Utcheckningstid</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">{visitor.name}</TableCell>
                    <TableCell>{visitor.company}</TableCell>
                    <TableCell>{visitor.visiting}</TableCell>
                    <TableCell>
                      {format(new Date(visitor.check_in_time), 'yyyy-MM-dd HH:mm', { locale: sv })}
                    </TableCell>
                    <TableCell>
                      {visitor.check_out_time 
                        ? format(new Date(visitor.check_out_time), 'yyyy-MM-dd HH:mm', { locale: sv })
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {visitor.is_service_personnel ? 'Service' : 'Vanlig'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        visitor.checked_out 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {visitor.checked_out ? 'Utcheckad' : 'Incheckad'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
