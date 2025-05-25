
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";

interface FaceRegistrationProps {
  onClose: () => void;
  onFaceRegistered: (faceData: string) => void;
  visitorName: string;
  onAutoCheckIn: () => void;
}

const FaceRegistration = ({ onClose, onFaceRegistered, visitorName, onAutoCheckIn }: FaceRegistrationProps) => {
  const [currentStep, setCurrentStep] = useState<"consent" | "scanning" | "completed">("consent");
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [scannedFaceId, setScannedFaceId] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleConsentAccepted = () => {
    if (!consentChecked) return;
    setCurrentStep("scanning");
    startCamera();
  };

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

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureAndScanFace = async () => {
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

      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // Simulera ansiktsskanning
      await new Promise(resolve => setTimeout(resolve, 2000));

      const faceId = `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setScannedFaceId(faceId);
      
      // Spara ansiktsdata
      const faceData = {
        id: faceId,
        name: visitorName,
        timestamp: new Date().toISOString(),
        features: `simulated_features_${Math.random().toString(36)}`
      };

      const existingFaces = JSON.parse(localStorage.getItem('registeredFaces') || '[]');
      existingFaces.push(faceData);
      localStorage.setItem('registeredFaces', JSON.stringify(existingFaces));

      stopCamera();
      setCurrentStep("completed");
      
      onFaceRegistered(faceId);
      toast.success("Ansikte registrerat! Checkar in automatiskt...");

      // Automatisk incheckning efter 1 sekund
      setTimeout(() => {
        onAutoCheckIn();
      }, 1000);

    } catch (error) {
      console.error('Fel vid ansiktsskanning:', error);
      toast.error("Kunde inte skanna ansikte. Försök igen.");
    } finally {
      setIsScanning(false);
    }
  };

  if (hasPermission === false && currentStep === "scanning") {
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
          <h3 className="text-lg font-medium">
            {currentStep === "consent" && `Samtycke för ansiktsregistrering - ${visitorName}`}
            {currentStep === "scanning" && `Registrera ansikte - ${visitorName}`}
            {currentStep === "completed" && "Registrering slutförd"}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {currentStep === "consent" && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h5 className="font-medium text-yellow-800 mb-3">Samtycke för datalagring</h5>
              <p className="text-sm text-yellow-700 mb-4">
                För att registrera ditt ansikte behöver vi ditt samtycke att spara dina ansiktsdata. 
                Denna information används endast för identifiering vid framtida besök och kommer att 
                hanteras enligt våra integritetspolicyer.
              </p>
              
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="consent" 
                  checked={consentChecked}
                  onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
                />
                <label htmlFor="consent" className="text-sm leading-5 text-yellow-800">
                  Jag samtycker till att mina ansiktsdata sparas för identifieringsändamål
                </label>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={onClose}>
                Avbryt
              </Button>
              <Button 
                onClick={handleConsentAccepted}
                disabled={!consentChecked}
                className="bg-[#19647E]"
              >
                Fortsätt till skanning
              </Button>
            </div>
          </div>
        )}

        {currentStep === "scanning" && (
          <>
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
          </>
        )}

        {currentStep === "completed" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              </div>
              <h4 className="text-lg font-medium text-green-600 mb-2">Ansikte registrerat!</h4>
              <p className="text-gray-600">
                Ditt ansikte har registrerats framgångsrikt. Du checkas nu in automatiskt...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceRegistration;
