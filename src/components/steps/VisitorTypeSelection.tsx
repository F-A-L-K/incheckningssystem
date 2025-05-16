
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { VisitorType } from "@/types/visitors";
import { User, Wrench, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VisitorTypeSelectionProps {
  onSelectType: (type: VisitorType) => void;
  onQrScanSuccess?: (visitorData: any) => void;
}

const VisitorTypeSelection = ({ onSelectType, onQrScanSuccess }: VisitorTypeSelectionProps) => {
  const [showScanner, setShowScanner] = useState(false);
  
  const handleScanSuccess = (scannedData: any) => {
    // Validate that the scanned data has the expected properties
    if (scannedData && scannedData.firstName && scannedData.lastName) {
      if (onQrScanSuccess) {
        onQrScanSuccess(scannedData);
      }
      setShowScanner(false);
    } else {
      toast.error("Ogiltig ansiktsigenkänning. Saknar nödvändig information.");
    }
  };

  const handleMockFaceScan = () => {
    // This is a mock function that would be replaced with actual facial recognition
    setTimeout(() => {
      const mockData = {
        firstName: "Anna",
        lastName: "Andersson",
        email: "anna@example.com",
        phone: "070-123456",
        company: "Demo AB"
      };
      handleScanSuccess(mockData);
    }, 2000);
  };
  
  return (
    <div className="text-center">
      <h3 className="text-lg font-medium mb-6">Välj typ av besök</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className="cursor-pointer hover:border-blue-400 transition-all"
            onClick={() => onSelectType("regular")}
          >
            <CardContent className="p-6 flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <User className="h-8 w-8 text-blue-500" />
              </div>
              <h4 className="font-medium text-lg">Vanligt besök</h4>
              <p className="text-gray-500 text-sm mt-2">
                Möten, intervjuer eller andra besök
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className="cursor-pointer hover:border-blue-400 transition-all"
            onClick={() => onSelectType("service")}
          >
            <CardContent className="p-6 flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <Wrench className="h-8 w-8 text-blue-500" />
              </div>
              <h4 className="font-medium text-lg">Service besök</h4>
              <p className="text-gray-500 text-sm mt-2">
                Underhåll, bygg eller servicearbete
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full max-w-xs mx-auto flex items-center gap-2 border-dashed"
        onClick={() => setShowScanner(true)}
      >
        <ScanFace className="h-5 w-5" />
        Skanna Ansikte
      </Button>

      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center">
            <h3 className="font-medium text-lg mb-4">Ansiktsigenkänning</h3>
            
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Placeholder for the actual camera feed */}
                <div className="p-4 text-center">
                  <ScanFace className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <p>Kameran aktiverad...</p>
                  <p className="text-sm text-gray-500 mt-2">Placera ansiktet i mitten av kameran</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button variant="ghost" onClick={() => setShowScanner(false)}>
                Avbryt
              </Button>
              <Button onClick={handleMockFaceScan}>
                Skanna (demo)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VisitorTypeSelection;
