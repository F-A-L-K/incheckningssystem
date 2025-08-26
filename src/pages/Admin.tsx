
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCheckedInVisitors, checkOutVisitor, convertToVisitorFormat } from '@/services/visitorService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  
  const { data: visitors = [], isLoading, refetch } = useQuery({
    queryKey: ['checkedInVisitors'],
    queryFn: async () => {
      const data = await getCheckedInVisitors();
      return data.map(convertToVisitorFormat);
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleCheckOut = async (visitorId: string, visitorName: string) => {
    try {
      await checkOutVisitor(visitorId);
      toast({
        title: "Visitor checked out",
        description: `${visitorName} has been successfully checked out.`,
      });
      refetch();
    } catch (error) {
      console.error('Error checking out visitor:', error);
      toast({
        title: "Error",
        description: "Failed to check out visitor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (timeString: string) => {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Currently checked-in visitors</p>
        </div>

        <div className="bg-card rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Active Visitors ({visitors.length})</h2>
            </div>

            {visitors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No visitors are currently checked in.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Visiting</TableHead>
                    <TableHead>Check-in Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-medium">
                        {visitor.firstName} {visitor.lastName}
                      </TableCell>
                      <TableCell>{visitor.company}</TableCell>
                      <TableCell>{visitor.hostName}</TableCell>
                      <TableCell>
                        {visitor.checkInTime ? formatTime(visitor.checkInTime) : '-'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          visitor.type === 'service' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {visitor.type === 'service' ? 'Service' : 'Regular'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCheckOut(visitor.id, `${visitor.firstName} ${visitor.lastName}`)}
                          className="flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Check Out
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
