
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Visitor } from "@/types/visitors";

interface CheckOutProps {
  checkedInVisitors: Visitor[];
  onCheckOut: (visitorId: string) => void;
  onCancel: () => void;
}

const CheckOut = ({ checkedInVisitors, onCheckOut, onCancel }: CheckOutProps) => {
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const handleVisitorClick = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmCheckOut = () => {
    if (selectedVisitor) {
      onCheckOut(selectedVisitor.id);
      setConfirmDialogOpen(false);
    }
  };
  
  const formatPrivacyName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName.charAt(0)}.`;
  };
  
  if (checkedInVisitors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Det finns inga incheckade besökare för närvarande.</p>
        <Button variant="outline" onClick={onCancel}>Tillbaka</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Klicka på ditt namn i listan nedan för att checka ut</h3>
        {/* <p className="text-gray-500 text-sm mb-4">
          Klicka på ditt namn i listan nedan för att checka ut
        </p> */}
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {checkedInVisitors.map((visitor) => (
            <div 
              key={visitor.id}
              onClick={() => handleVisitorClick(visitor)}
              className="border border-gray-200 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{formatPrivacyName(visitor.firstName, visitor.lastName)}</p>
                  <p className="text-sm text-gray-500">{visitor.hostName}</p>
                </div>
                <div className="text-sm text-gray-400">
                  {visitor.checkInTime && new Date(visitor.checkInTime).toLocaleTimeString('sv-SE', {
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
                Är du säker på att du vill checka ut {selectedVisitor.firstName} {selectedVisitor.lastName}?
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
