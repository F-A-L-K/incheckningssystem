
import { motion } from "framer-motion";
import { Visitor, VisitorType } from "@/types/visitors";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
          Incheckning genomförd!
        </h3>

      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 text-left">
        <h4 className="font-medium text-gray-700 mb-2">Besöksinformation</h4>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Besökare:</span> {visitors.map(v => `${v.firstName} ${v.lastName}`).join(', ')}</p>
          <p><span className="font-medium">Företag:</span> {company}</p>
          <p><span className="font-medium">Värd:</span> {host}</p>
          <p><span className="font-medium">Besökstyp:</span> {visitorType === "regular" ? "Vanligt besök" : "Service besök"}</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        {visitorType === "regular" 
          ? "Vid väntan, ta gärna en titt på vår utställning av diverse produkter vid ingången eller sätt er ner vid bordet bakom."
          : "Vänligen vänta på att din kontaktperson kommer och möter dig."}
      </p>

      <div className="mt-6">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="text-gray-500"
        >
          Stänger om {countdown} sekunder...
        </Button>
      </div>
    </div>
  );
};

export default CheckInConfirmation;
