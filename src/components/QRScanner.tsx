
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { QrCode } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (data: any) => void;
}

const QRScanner = ({ onScanSuccess }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock QR code scanner for demo purposes
  // In a real implementation, you'd integrate with a proper QR scanning library
  const handleScan = () => {
    setIsScanning(true);
    setError(null);
    
    // Simulating a scan after 2 seconds
    setTimeout(() => {
      try {
        // Create mock data (in a real app this would come from the actual scan)
        const mockScanData = {
          firstName: "Per",
          lastName: "Andersson",
          company: "Example AB",
          type: "regular"
        };
        
        onScanSuccess(mockScanData);
        toast.success("QR-kod inläst!");
      } catch (err) {
        setError("Kunde inte läsa QR-koden. Försök igen.");
        toast.error("Fel vid inläsning av QR-kod");
      } finally {
        setIsScanning(false);
      }
    }, 2000);
  };
  
  return (
    <div className="flex flex-col items-center my-4">
      <Button
        onClick={handleScan}
        disabled={isScanning}
        className="flex items-center gap-2"
        variant="outline"
      >
        <QrCode className="h-5 w-5" />
        {isScanning ? "Läser QR-kod..." : "Skanna QR-kod"}
      </Button>
      
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      
      <p className="text-sm text-gray-500 mt-2">
        Detta är en simulerad QR-scanner. I en verklig implementation skulle den använda kameran.
      </p>
    </div>
  );
};

export default QRScanner;
