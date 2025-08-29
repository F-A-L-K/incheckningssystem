
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { VisitorType } from "@/types/visitors";
import FaceRegistration from "@/components/FaceRegistration";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [showFaceRegistration, setShowFaceRegistration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async () => {
    if (loading || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAccept();
    } finally {
      setIsSubmitting(false);
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
        t('termsVisitors'),
        t('termsPhotography'),
        t('termsSmokeFree'),
        t('termsServiceProducts'),
        t('termsEmergency'),
        "",
        t('termsHotWork'),
        t('termsSafety'),
        t('termsWasteSort'),
        t('termsWorkComplete'),
        t('termsCheckOut'),
      ]
    : [
        t('termsVisitors'),
        t('termsPhotography'),
        t('termsSmokeFree'),
        t('termsRegularProducts'),
        t('termsEmergency'),
      ];

  return (
    <>
      <div className="space-y-6 relative pb-12">
        <div>
          <h3 className="text-lg font-medium mb-4">{t('termsAndSafety')}</h3>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h4 className="font-medium mb-3">{t('byContunuingYouAgree')}</h4>
            <ul className="space-y-2">
              {terms.map((term, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-sm">{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleSubmit}
            disabled={loading || isSubmitting}
            className="w-full bg-[#3B82F6]"
          >
            {(loading || isSubmitting) ? t('checkingIn') : t('acceptTermsAndCheckIn')}
          </Button>
        </div>

        {/* {!isCheckOut && visitorCount === 1 && (
          <div className="absolute bottom-0 right-0">
            <button
              onClick={() => setShowFaceRegistration(true)}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <Camera className="h-4 w-4" />
              {t('registerFace')}
            </button>
          </div>
        )} */}
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
