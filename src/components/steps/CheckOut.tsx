
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface CheckOutProps {
  checkedInVisitors: any[];
  onCheckOut: (visitorId: string) => void;
  onCancel: () => void;
  onVisitorCheckedOut?: () => void;
}

const CheckOut = ({ checkedInVisitors, onCheckOut, onCancel, onVisitorCheckedOut }: CheckOutProps) => {
  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(null);
  const { t } = useLanguage();
  
  // Auto-close after 45 seconds without activity
  const resetAutoCloseTimer = () => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
    }
    const timer = setTimeout(() => {
      onCancel();
    }, 30000); // 30 seconds
    setAutoCloseTimer(timer);
  };
  
  useEffect(() => {
    resetAutoCloseTimer();
    
    // Cleanup on unmount - CRITICAL: Clear timer when component unmounts
    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        setAutoCloseTimer(null);
      }
    };
  }, [autoCloseTimer]);
  
  // Reset timer on any activity
  const handleActivity = () => {
    resetAutoCloseTimer();
  };
  
  const handleVisitorClick = (visitor: any) => {
    handleActivity();
    setSelectedVisitor(visitor);
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmCheckOut = () => {
    if (selectedVisitor) {
      onCheckOut(selectedVisitor.id);
      setConfirmDialogOpen(false);
      setSelectedVisitor(null);
      // Reset timer after checkout - stay on checkout page
      resetAutoCloseTimer();
      if (onVisitorCheckedOut) {
        onVisitorCheckedOut();
      }
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
      <div className="text-center py-12">
        <p className="text-gray-500 mb-6 text-xl">{t('noCheckedInVisitors')}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-medium mb-6">{t('clickNameToCheckOut')}</h3>
        
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {checkedInVisitors.map((visitor) => (
            <div 
              key={visitor.id}
              onClick={() => handleVisitorClick(visitor)}
              className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onMouseEnter={handleActivity}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-xl">{formatPrivacyName(visitor.name)}</p>
                  <p className="text-lg text-gray-500">{t('visiting')} {visitor.visiting}</p>
                </div>
                <div className="text-lg text-gray-400">
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
      
      <Button variant="outline" onClick={() => { handleActivity(); onCancel(); }} className="w-full text-lg py-4">
        {t('cancel')}
      </Button>
      
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{t('confirmCheckOut')}</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            {selectedVisitor && (
              <p className="text-lg">
                {t('areYouSureCheckOut')} {selectedVisitor.name}?
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { handleActivity(); setConfirmDialogOpen(false); }} className="text-lg py-3 px-6">
              {t('cancel')}
            </Button>
            <Button onClick={handleConfirmCheckOut} className="text-lg py-3 px-6">
              {t('checkOutButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckOut;
