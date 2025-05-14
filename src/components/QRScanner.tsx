
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { QrCode, Camera } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (data: any) => void;
}

const QRScanner = ({ onScanSuccess }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "qr-scanner-container";
  
  useEffect(() => {
    // Clean up scanner when component unmounts
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(error => {
          console.error("Failed to stop scanner:", error);
        });
      }
    };
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setError(null);
    
    const html5QrCode = new Html5Qrcode(scannerContainerId);
    scannerRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: "environment" }, // Use the back camera if available
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        // Handle successful scan
        try {
          // Try to parse the QR code text as JSON
          const scanData = JSON.parse(decodedText);
          onScanSuccess(scanData);
          toast.success("QR-kod inläst!");
          
          // Stop scanning after successful scan
          html5QrCode.stop().catch(error => {
            console.error("Failed to stop scanner:", error);
          });
          setIsScanning(false);
        } catch (err) {
          setError("Ogiltig QR-kod format. Kontrollera att det är en besökar-QR.");
          toast.error("Ogiltig QR-kod format");
          
          // Stop scanning on error
          html5QrCode.stop().catch(error => {
            console.error("Failed to stop scanner:", error);
          });
          setIsScanning(false);
        }
      },
      (errorMessage) => {
        // Skip errors during scanning (these are usually frame processing errors)
        console.log("QR scan error:", errorMessage);
      }
    ).catch((err) => {
      setError("Kunde inte starta kameran. Kontrollera att du har gett tillåtelse.");
      toast.error("Kunde inte starta kameran");
      console.error("QR code scanner error:", err);
      setIsScanning(false);
    });
  };
  
  const handleStopScan = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(error => {
        console.error("Failed to stop scanner:", error);
      });
      setIsScanning(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center my-4">
      {!isScanning ? (
        <Button
          onClick={handleScan}
          className="flex items-center gap-2"
          variant="outline"
        >
          <QrCode className="h-5 w-5" />
          Skanna QR-kod
        </Button>
      ) : (
        <div className="space-y-4 w-full max-w-sm">
          <div id={scannerContainerId} className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden"></div>
          <Button
            onClick={handleStopScan}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Camera className="h-5 w-5" />
            Avbryt skanning
          </Button>
        </div>
      )}
      
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      
      {!isScanning && (
        <p className="text-sm text-gray-500 mt-2">
          Skanna en QR-kod för att automatiskt fylla i besöksinformation.
        </p>
      )}
    </div>
  );
};

export default QRScanner;
