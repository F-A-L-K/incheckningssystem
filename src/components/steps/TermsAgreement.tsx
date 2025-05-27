
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera } from "lucide-react";
import { VisitorType } from "@/types/visitors";
import FaceRegistration from "@/components/FaceRegistration";

interface TermsAgreementProps {
  visitorType: VisitorType;
  onAccept: () => void;
  loading?: boolean;
  visitorName?: string;
  visitorInfo?: {
    name: string;
    company: string;
    visiting: string;
    visitorType: string;
  };
  isCheckOut?: boolean;
  visitorCount?: number;
}

const TermsAgreement = ({ visitorType, onAccept, loading = false, visitorName = "Besökare", visitorInfo, isCheckOut = false, visitorCount = 1 }: TermsAgreementProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [showFaceRegistration, setShowFaceRegistration] = useState(false);

  const handleSubmit = () => {
    if (isChecked && !loading) {
      onAccept();
    }
  };

  const handleFaceRegistered = (faceId: string) => {
    console.log('Ansikte registrerat med ID:', faceId);
  };

  const handleAutoCheckIn = () => {
    setShowFaceRegistration(false);
    // Automatisk incheckning genom att kalla onAccept
    onAccept();
  };

  const terms = visitorType === "service" 
    ? [
        "Jag förstår att jag måste följa alla säkerhetsföreskrifter",
        "Jag har rätt behörighet för att utföra det planerade arbetet",
        "Jag kommer att rapportera eventuella säkerhetsincidenter omedelbart",
        "Jag accepterar att mitt besök registreras"
      ]
    : [
        "Jag förstår att jag måste följa alla säkerhetsföreskrifter",
        "Jag kommer att bära skyddsutrustning vid behov",
        "Jag accepterar att mitt besök registreras",
        "Jag kommer att följa min värd under hela besöket"
      ];

  return (
    <>
      <div className="space-y-6 relative">
        <div>
          <h3 className="text-lg font-medium mb-4">Villkor och säkerhet</h3>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h4 className="font-medium mb-3">Genom att fortsätta godkänner du följande:</h4>
            <ul className="space-y-2">
              {terms.map((term, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-sm">{term}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="terms" 
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked as boolean)}
              disabled={loading}
            />
            <label htmlFor="terms" className="text-sm leading-5">
              Jag har läst och godkänner ovanstående villkor
            </label>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleSubmit}
            disabled={!isChecked || loading}
            className="w-full bg-[#19647E]"
          >
            {loading ? "Checkar in..." : "Genomför incheckning"}
          </Button>
        </div>

        {!isCheckOut && visitorCount === 1 && (
          <div className="absolute bottom-0 right-0">
            <button
              onClick={() => setShowFaceRegistration(true)}
              disabled={!isChecked || loading}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <Camera className="h-4 w-4" />
              Registrera ansikte
            </button>
          </div>
        )}
      </div>

      {showFaceRegistration && (
        <FaceRegistration
          onClose={() => setShowFaceRegistration(false)}
          onFaceRegistered={handleFaceRegistered}
          visitorName={visitorName}
          onAutoCheckIn={handleAutoCheckIn}
          visitorInfo={visitorInfo}
        />
      )}
    </>
  );
};

export default TermsAgreement;
