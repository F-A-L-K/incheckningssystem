
import { motion } from "framer-motion";
import { Visitor, VisitorType } from "@/types/visitors";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface CheckInConfirmationProps {
  visitors: Visitor[];
  company: string;
  host: string;
  visitorType: VisitorType;
  onClose: () => void;
}

const CheckInConfirmation = ({ 
  visitors, 
  company, 
  host, 
  visitorType,
  onClose
}: CheckInConfirmationProps) => {
  const [countdown, setCountdown] = useState(10);
  const { t } = useLanguage();

  // Effect to handle countdown and automatic close
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex justify-center"
      >
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
      </motion.div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-800">
          {t('checkInCompleted')}
        </h3>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 text-left">
        <h4 className="font-medium text-gray-700 mb-2">{t('visitorInfo')}</h4>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">{t('visitor')}:</span> {visitors.map(v => v.fullName || `${v.firstName} ${v.lastName}`).join(', ')}</p>
          <p><span className="font-medium">{visitorType === "school" ? t('school') : t('company')}:</span> {company}</p>
          <p><span className="font-medium">{t('host')}:</span> {host}</p>
          <p><span className="font-medium">{t('visitType')}:</span> {
            visitorType === "regular" ? t('regularVisitText') : 
            visitorType === "service" ? t('serviceVisitText') : 
            t('schoolVisitText')
          }</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        {visitorType === "regular" 
          ? t('regularWaitingMessage')
          : visitorType === "service"
          ? t('serviceWaitingMessage')
          : t('regularWaitingMessage')}
      </p>

      <div className="mt-6">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="text-gray-500"
        >
          {t('closingIn')} {countdown} {t('seconds')}
        </Button>
      </div>
    </div>
  );
};

export default CheckInConfirmation;
