
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";

interface FaceRegistrationProps {
  onClose: () => void;
  onFaceRegistered: (faceData: string) => void;
  visitorName: string;
}

const FaceRegistration = ({ onClose, onFaceRegistered, visitorName }: FaceRegistrationProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

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
      toast.error("Kunde inte komma åt kameran. Kontrollera behörigheter.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureAndScanFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsScanning(true);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;

      // Sätt canvas storlek till video storlek
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Rita video frame till canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Konvertera till base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // Simulera ansiktssканning (i riktiga implementationen skulle du använda Face API eller liknande)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Skapa en unik face ID (i verkligheten skulle detta vara en hash av ansiktsdata)
      const faceId = `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Spara ansiktsdata (i verkligheten skulle detta vara biometriska features)
      const faceData = {
        id: faceId,
        name: visitorName,
        imageData: imageData,
        timestamp: new Date().toISOString(),
        features: `simulated_features_${Math.random().toString(36)}`
      };

      // Spara till localStorage (i produktion skulle detta sparas säkert i databasen)
      const existingFaces = JSON.parse(localStorage.getItem('registeredFaces') || '[]');
      existingFaces.push(faceData);
      localStorage.setItem('registeredFaces', JSON.stringify(existingFaces));

      onFaceRegistered(faceId);
      toast.success(`Ansikte registrerat för ${visitorName}!`);
      onClose();

    } catch (error) {
      console.error('Fel vid ansiktsskankning:', error);
      toast.error("Kunde inte skanna ansikte. Försök igen.");
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
            För att registrera ansikte behöver vi åtkomst till din kamera. 
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
          <h3 className="text-lg font-medium">Registrera ansikte - {visitorName}</h3>
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
            style={{ transform: 'scaleX(-1)' }} // Spegla för bättre användarupplevelse
          />
          
          {/* Ansikts-outline */}
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

          <canvas
            ref={canvasRef}
            className="hidden"
          />
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Placera ditt ansikte inom den blå cirkeln och klicka på "Skanna ansikte"
          </p>
          
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button 
              onClick={captureAndScanFace}
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

export default FaceRegistration;
