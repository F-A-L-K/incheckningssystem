
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { VisitorType } from "@/types/visitors";
import { User, Wrench, ScanFace } from "lucide-react";
import FaceRecognition from "@/components/FaceRecognition";

interface VisitorTypeSelectionProps {
  onSelectType: (type: VisitorType) => void;
  onFaceRecognized?: (visitorData: any) => void;
}

const VisitorTypeSelection = ({ onSelectType, onFaceRecognized }: VisitorTypeSelectionProps) => {
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);

  const handleFaceRecognized = (visitorData: any) => {
    setShowFaceRecognition(false);
    if (onFaceRecognized) {
      onFaceRecognized(visitorData);
    }
  };

  return (
    <>
      <div className="text-center">
        <h3 className="text-lg font-medium mb-6">Välj typ av besök</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="cursor-pointer hover:border-blue-400 transition-all"
              onClick={() => onSelectType("regular")}
            >
              <CardContent className="p-6 flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <User className="h-8 w-8 text-blue-500" />
                </div>
                <h4 className="font-medium text-lg">Vanligt besök</h4>
                <p className="text-gray-500 text-sm mt-2">
                  Möten, intervjuer eller andra besök
                </p>
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
              <CardContent className="p-6 flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <Wrench className="h-8 w-8 text-blue-500" />
                </div>
                <h4 className="font-medium text-lg">Service besök</h4>
                <p className="text-gray-500 text-sm mt-2">
                  Underhåll, bygg eller servicearbete
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowFaceRecognition(true)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2 mx-auto"
          >
            <ScanFace className="h-4 w-4" />
            Ansiktsidentifiering
          </button>
        </div>
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
