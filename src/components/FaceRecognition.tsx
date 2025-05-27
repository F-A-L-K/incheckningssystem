import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FaceRecognitionProps {
  onClose: () => void;
  onFaceRecognized: (visitorData: any) => void;
}

const FaceRecognition = ({ onClose, onFaceRecognized }: FaceRecognitionProps) => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      });
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Kunde inte starta kamera:', error);
      setHasPermission(false);
      toast({
        title: "Kamerafel",
        description: "Kunde inte komma åt kameran. Kontrollera behörigheter.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const scanForFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64 image
      const imageBase64 = canvas.toDataURL('image/jpeg');

      // Send to backend for recognition
      const response = await fetch('http://localhost:5000/api/recognize-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 }),
      });

      const data = await response.json();
      console.log('Recognition response:', data);

      if (data.status === 'success' && data.recognized) {
        const visitorInfo = data.visitor_info;
        
        // Transform the stored visitor info to match expected format
        const visitorData = {
          name: visitorInfo.name,
          company: visitorInfo.company,
          visiting: visitorInfo.visiting,
          visitorType: visitorInfo.visitorType || "regular",
          phone: "070-123 45 67", // Default values
          email: "exempel@foretagab.se"
        };

        stopCamera();
        onFaceRecognized(visitorData);
        toast({
          title: "Välkommen tillbaka!",
          description: `${visitorInfo.name}!`,
        });
      } else {
        toast({
          title: "Ansiktet kändes inte igen",
          description: "Vänligen genomför vanlig incheckning.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Fel vid ansiktsigenkänning:', error);
      toast({
        title: "Skanningsfel",
        description: "Kunde inte skanna ansikte. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Kameraåtkomst krävs</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-600 mb-4">
            För att skanna ansikte behöver vi åtkomst till din kamera. 
            Kontrollera webbläsarens behörigheter och försök igen.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
            <Button onClick={startCamera}>Försök igen</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Skanna ansikte för igenkänning</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-md mx-auto rounded-lg bg-gray-900"
            style={{ transform: 'scaleX(-1)' }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <div className="w-48 h-60 border-4 border-blue-500 rounded-full opacity-70"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-blue-500 text-sm font-medium bg-white px-2 py-1 rounded">
                  Placera ansiktet här
                </div>
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Placera ditt ansikte inom den blå cirkeln för att se om vi känner igen dig
          </p>
          
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button 
              onClick={scanForFace}
              disabled={isScanning || !stream}
              className="bg-[#19647E]"
            >
              <Camera className="h-4 w-4 mr-2" />
              {isScanning ? "Skannar..." : "Skanna ansikte"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;
