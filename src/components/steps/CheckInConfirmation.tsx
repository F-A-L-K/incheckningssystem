
import { motion } from "framer-motion";
import { Visitor, VisitorType } from "@/types/visitors";
import { CheckCircle } from "lucide-react";

interface CheckInConfirmationProps {
  visitors: Visitor[];
  company: string;
  host: string;
  visitorType: VisitorType;
}

const CheckInConfirmation = ({ 
  visitors, 
  company, 
  host, 
  visitorType 
}: CheckInConfirmationProps) => {
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
        <p className="text-gray-500 mt-2">
          {visitors.length > 1 
            ? `${visitors.length} besökare har checkats in.`
            : 'Du är nu incheckad.'}
        </p>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 text-left">
        <h4 className="font-medium text-gray-700 mb-2">Besöksinformation</h4>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Besökare:</span> {visitors.map(v => `${v.firstName} ${v.lastName}`).join(', ')}</p>
          <p><span className="font-medium">Företag:</span> {company}</p>
          <p><span className="font-medium">Värd:</span> {host}</p>
          <p><span className="font-medium">Besökstyp:</span> {visitorType === "regular" ? "Vanlig besökare" : "Servicepersonal"}</p>
          <p><span className="font-medium">Tid:</span> {new Date().toLocaleString('sv-SE')}</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        {visitorType === "regular" 
          ? "En av våra medarbetare kommer snart och möter dig. Vänligen ta plats i väntrummet."
          : "Vänligen vänta på att din kontaktperson kommer och möter dig. Ha din ID-handling redo."}
      </p>
    </div>
  );
};

export default CheckInConfirmation;
