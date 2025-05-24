import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CheckOutProps {
  checkedInVisitors: any[];
  onCheckOut: (visitorId: string) => void;
  onCancel: () => void;
}

const CheckOut = ({ checkedInVisitors, onCheckOut, onCancel }: CheckOutProps) => {
  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Auto-close after 1 minute
  useEffect(() => {
    const timer = setTimeout(() => {
      onCancel();
    }, 60000); // 60000ms = 1 minute
    
    // Cleanup on unmount
    return () => clearTimeout(timer);
  }, [onCancel]);
  
  const handleVisitorClick = (visitor: any) => {
    setSelectedVisitor(visitor);
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmCheckOut = () => {
    if (selectedVisitor) {
      onCheckOut(selectedVisitor.id);
      setConfirmDialogOpen(false);
    }
  };
  
  const formatPrivacyName = (fullName: string) => {
    const nameParts = fullName.split(' ');
    if (nameParts.length === 1) return fullName;
    const firstName = nameParts[0];
    const lastInitial = nameParts[nameParts.length - 1].charAt(0);
    return `${firstName} ${lastInitial}.`;
  };
  
  if (checkedInVisitors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Det finns inga incheckade besökare för närvarande.</p>
        {/* <Button variant="outline" onClick={onCancel}>Tillbaka</Button> */}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Klicka på ditt namn i listan nedan för att checka ut</h3>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {checkedInVisitors.map((visitor) => (
            <div 
              key={visitor.id}
              onClick={() => handleVisitorClick(visitor)}
              className="border border-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{formatPrivacyName(visitor.name)}</p>
                  <p className="text-sm text-gray-500">Besöker {visitor.visiting}</p>
                </div>
                <div className="text-sm text-gray-400">
                  {visitor.check_in_time && new Date(visitor.check_in_time).toLocaleTimeString('sv-SE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Button variant="outline" onClick={onCancel} className="w-full">
        Avbryt
      </Button>
      
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bekräfta utcheckning</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedVisitor && (
              <p>
                Är du säker på att du vill checka ut {selectedVisitor.name}?
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={handleConfirmCheckOut}>
              Checka ut
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckOut;
