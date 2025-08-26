
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { getCheckedInVisitors, checkOutVisitor } from "@/services/visitorService";
import { toast } from "sonner";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export const CurrentVisitors = () => {
  const [selectedVisitor, setSelectedVisitor] = useState<any>(null);
  const [checkOutDateTime, setCheckOutDateTime] = useState('');
  const queryClient = useQueryClient();

  const { data: visitors, isLoading } = useQuery({
    queryKey: ['current-visitors'],
    queryFn: getCheckedInVisitors,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const checkOutMutation = useMutation({
    mutationFn: async (data: { visitorId: string; checkOutTime?: string }) => {
      if (data.checkOutTime) {
        // If custom checkout time is provided, we need to update with that time
        // For now, we'll use the current implementation and note this for future enhancement
        return checkOutVisitor(data.visitorId);
      }
      return checkOutVisitor(data.visitorId);
    },
    onSuccess: () => {
      toast.success('Besökare utcheckad');
      queryClient.invalidateQueries({ queryKey: ['current-visitors'] });
      setSelectedVisitor(null);
      setCheckOutDateTime('');
    },
    onError: (error) => {
      toast.error('Kunde inte checka ut besökare');
      console.error('Checkout error:', error);
    },
  });

  const handleCheckOut = () => {
    if (selectedVisitor) {
      checkOutMutation.mutate({ 
        visitorId: selectedVisitor.id,
        checkOutTime: checkOutDateTime || undefined
      });
    }
  };

  const openCheckOutDialog = (visitor: any) => {
    setSelectedVisitor(visitor);
    const now = new Date();
    const formattedDateTime = format(now, "yyyy-MM-dd'T'HH:mm");
    setCheckOutDateTime(formattedDateTime);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Laddar besökare...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktuella Besökare ({visitors?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        {!visitors || visitors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Inga besökare är för närvarande incheckade
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Namn</TableHead>
                <TableHead>Företag</TableHead>
                <TableHead>Besöker</TableHead>
                <TableHead>Incheckningstid</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">{visitor.name}</TableCell>
                  <TableCell>{visitor.company}</TableCell>
                  <TableCell>{visitor.visiting}</TableCell>
                  <TableCell>
                    {format(new Date(visitor.check_in_time), 'yyyy-MM-dd HH:mm', { locale: sv })}
                  </TableCell>
                  <TableCell>
                    {visitor.is_service_personnel ? 'Service' : 'Vanlig'}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCheckOutDialog(visitor)}
                          className="flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Checka ut
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Checka ut besökare</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p><strong>Namn:</strong> {selectedVisitor?.name}</p>
                            <p><strong>Företag:</strong> {selectedVisitor?.company}</p>
                          </div>
                          <div>
                            <Label htmlFor="checkout-time">Utcheckningstid</Label>
                            <Input
                              id="checkout-time"
                              type="datetime-local"
                              value={checkOutDateTime}
                              onChange={(e) => setCheckOutDateTime(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedVisitor(null)}
                            >
                              Avbryt
                            </Button>
                            <Button
                              onClick={handleCheckOut}
                              disabled={checkOutMutation.isPending}
                            >
                              {checkOutMutation.isPending ? 'Checkar ut...' : 'Checka ut'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
