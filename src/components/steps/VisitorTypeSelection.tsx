
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { VisitorType } from "@/types/visitors";
import { Users, Wrench, ScanFace, ArrowRight, GraduationCap } from "lucide-react";
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
        
        <div className="grid grid-cols-2 gap-8">
          {/* General visit - spans full width */}
          <motion.div 
            className="col-span-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="cursor-pointer hover:border-blue-400 transition-all h-64 relative overflow-hidden"
              onClick={() => onSelectType("regular")}
            >
              <CardContent className="p-8 h-full flex flex-col">
                {/* Icon in top left */}
                <div className="flex justify-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col justify-center text-left">
                  <h4 className="font-semibold text-2xl mb-3 text-gray-900">{t('generalVisit')}</h4>
                  <p className="text-lg text-gray-600 leading-relaxed">{t('generalVisitDescription')}</p>
                </div>
                
                {/* Bottom section with arrow and "Välj" */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <span className="text-lg font-medium text-blue-600">Välj</span>
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Service visit - bottom left */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="cursor-pointer hover:border-blue-400 transition-all h-64 relative overflow-hidden"
              onClick={() => onSelectType("service")}
            >
              <CardContent className="p-8 h-full flex flex-col">
                {/* Icon in top left */}
                <div className="flex justify-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col justify-center text-left">
                  <h4 className="font-semibold text-2xl mb-3 text-gray-900">{t('serviceVisit')}</h4>
                  <p className="text-lg text-gray-600 leading-relaxed">{t('serviceVisitDescription')}</p>
                </div>
                
                {/* Bottom section with arrow and "Välj" */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <span className="text-lg font-medium text-blue-600">Välj</span>
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* School visit - bottom right */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="cursor-pointer hover:border-blue-400 transition-all h-64 relative overflow-hidden"
              onClick={() => onSelectType("school")}
            >
              <CardContent className="p-8 h-full flex flex-col">
                {/* Icon in top left */}
                <div className="flex justify-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col justify-center text-left">
                  <h4 className="font-semibold text-2xl mb-3 text-gray-900">{t('schoolVisit')}</h4>
                  <p className="text-lg text-gray-600 leading-relaxed">{t('schoolVisitDescription')}</p>
                </div>
                
                {/* Bottom section with arrow and "Välj" */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <span className="text-lg font-medium text-blue-600">Välj</span>
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </div>
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
