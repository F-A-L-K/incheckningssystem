
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { VisitorType } from "@/types/visitors";
import { User, Wrench, ScanFace } from "lucide-react";
import FaceRecognition from "@/components/FaceRecognition";
import { useLanguage } from "@/contexts/LanguageContext";

interface VisitorTypeSelectionProps {
  onSelectType: (type: VisitorType) => void;
  onFaceRecognized?: (visitorData: any) => void;
}

const VisitorTypeSelection = ({ onSelectType, onFaceRecognized }: VisitorTypeSelectionProps) => {
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);
  const { t } = useLanguage();

  const handleFaceRecognized = (visitorData: any) => {
    setShowFaceRecognition(false);
    if (onFaceRecognized) {
      onFaceRecognized(visitorData);
    }
  };

  return (
    <>
      <div className="text-center">
        <h3 className="text-4xl font-medium mb-6">{t('visitorType')}</h3>
        <p className="text-2xl text-gray-500 mb-12">{t('pleaseSelectVisitorType')}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="cursor-pointer hover:border-blue-400 transition-all"
              onClick={() => onSelectType("regular")}
            >
              <CardContent className="p-16 flex flex-col items-center justify-center">
                <h4 className="font-medium text-4xl text-center mb-4">{t('regularVisit')}</h4>
                <p className="text-xl text-gray-600 text-center">{t('regularVisitDescription')}</p>
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
              <CardContent className="p-16 flex flex-col items-center justify-center">
                <h4 className="font-medium text-4xl text-center mb-4">{t('serviceVisit')}</h4>
                <p className="text-xl text-gray-600 text-center">{t('serviceVisitDescription')}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Commented out face identification button
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowFaceRecognition(true)}
            className="text-lg text-blue-600 hover:text-blue-800 flex items-center justify-center gap-3 mx-auto py-2"
          >
            <ScanFace className="h-6 w-6" />
            {t('faceIdentification')}
          </button>
        </div>
        */}
      </div>

      {showFaceRecognition && (
        <FaceRecognition
          onClose={() => setShowFaceRecognition(false)}
          onFaceRecognized={handleFaceRecognized}
        />
      )}
    </>
  );
};

export default VisitorTypeSelection;
