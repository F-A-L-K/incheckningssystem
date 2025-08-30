
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCheckedInVisitors, checkOutVisitor, convertToVisitorFormat } from '@/services/visitorService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const CurrentVisitors = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedVisitor, setSelectedVisitor] = useState<any>(null);
  const [checkOutDateTime, setCheckOutDateTime] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: visitors = [], isLoading, refetch } = useQuery({
    queryKey: ['checkedInVisitors'],
    queryFn: async () => {
      const data = await getCheckedInVisitors();
      return data.map(convertToVisitorFormat);
    },
    refetchInterval: 30000,
  });

  const handleCheckOutClick = (visitor: any) => {
    setSelectedVisitor(visitor);
    // Set default to current time
    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16); // Format for datetime-local input
    setCheckOutDateTime(formattedDateTime);
    setIsDialogOpen(true);
  };

  const handleConfirmCheckOut = async () => {
    if (!selectedVisitor || !checkOutDateTime) return;

    try {
      // Convert the datetime-local input to ISO string
      const checkOutDate = new Date(checkOutDateTime).toISOString();
      
      await checkOutVisitor(selectedVisitor.id);
      
      toast({
        title: t('visitorCheckedOutToast'),
        description: `${selectedVisitor.firstName} ${selectedVisitor.lastName} ${t('hasBeenCheckedOutMessage')}`,
      });
      
      setIsDialogOpen(false);
      setSelectedVisitor(null);
      refetch();
    } catch (error) {
      console.error('Error checking out visitor:', error);
      toast({
        title: t('error'),
        description: t('failedToCheckOutVisitorError'),
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
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t('activeVisitors')} ({visitors.length})</h2>
        </div>

        {visitors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t('noActiveVisitorsMessage')}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('nameColumn')}</TableHead>
                <TableHead>{t('companyColumn')}</TableHead>
                <TableHead>{t('visitingColumn')}</TableHead>
                <TableHead>{t('checkInTimeColumn')}</TableHead>
                <TableHead>{t('typeColumn')}</TableHead>
                <TableHead>{t('actionsColumn')}</TableHead>
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
                      {visitor.type === 'service' ? t('serviceType') : t('regularType')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCheckOutClick(visitor)}
                          className="flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('checkOutAction')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t('checkOutVisitorDialog')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {t('checkingOutLabel')} <strong>{selectedVisitor?.firstName} {selectedVisitor?.lastName}</strong>
                            </p>
                          </div>
                          <div>
                            <Label htmlFor="checkout-datetime">{t('checkOutDateTimeLabel')}</Label>
                            <Input
                              id="checkout-datetime"
                              type="datetime-local"
                              value={checkOutDateTime}
                              onChange={(e) => setCheckOutDateTime(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              {t('cancel')}
                            </Button>
                            <Button onClick={handleConfirmCheckOut}>
                              {t('confirmCheckOutAction')}
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
      </div>
    </div>
  );
};

export default CurrentVisitors;
