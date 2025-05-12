
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { VisitorType, Visitor, Host } from "@/types/visitors";
import VisitorTypeSelection from "@/components/steps/VisitorTypeSelection";
import VisitorInfoForm from "@/components/steps/VisitorInfoForm";
import HostSelection from "@/components/steps/HostSelection";
import TermsAgreement from "@/components/steps/TermsAgreement";
import CheckInConfirmation from "@/components/steps/CheckInConfirmation";
import CheckOut from "@/components/steps/CheckOut";
import { Button } from "@/components/ui/button";

// Mock data for hosts
const HOSTS: Host[] = [
  { id: 1, name: "Anna Andersson", department: "HR" },
  { id: 2, name: "Erik Johansson", department: "IT" },
  { id: 3, name: "Maria Nilsson", department: "Marketing" },
  { id: 4, name: "Lars Pettersson", department: "Finance" },
  { id: 5, name: "Sofia Berg", department: "Operations" },
];

type Step = 
  | "type-selection"
  | "visitor-info"
  | "host-selection"
  | "terms"
  | "confirmation"
  | "check-out";

const CheckInSystem = () => {
  const [step, setStep] = useState<Step>("type-selection");
  const [visitorType, setVisitorType] = useState<VisitorType | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(1);
  const [company, setCompany] = useState<string>("");
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [checkedInVisitors, setCheckedInVisitors] = useState<Visitor[]>([]);

  const resetForm = () => {
    setVisitorType(null);
    setVisitors([]);
    setVisitorCount(1);
    setCompany("");
    setSelectedHost(null);
    setTermsAccepted(false);
    setStep("type-selection");
  };

  const handleTypeSelection = (type: VisitorType) => {
    setVisitorType(type);
    setStep("visitor-info");
  };

  const handleVisitorInfoSubmit = (newVisitors: Visitor[], companyName: string) => {
    setVisitors(newVisitors);
    setCompany(companyName);
    setStep("host-selection");
  };

  const handleHostSelection = (host: Host) => {
    setSelectedHost(host);
    setStep("terms");
  };

  const handleTermsAccepted = () => {
    setTermsAccepted(true);
    setStep("confirmation");
    
    // Add visitors to checked-in list
    const timestamp = new Date().toISOString();
    const checkedInVisitorsWithTimestamp = visitors.map(visitor => ({
      ...visitor,
      checkInTime: timestamp,
      hostName: selectedHost?.name || "",
      company,
      type: visitorType || "regular"
    }));
    
    setCheckedInVisitors(prev => [...prev, ...checkedInVisitorsWithTimestamp]);
    toast.success("Incheckning genomförd!");
  };

  const startCheckOut = () => {
    setStep("check-out");
  };

  const handleCheckOut = (visitorId: string) => {
    setCheckedInVisitors(prev => prev.filter(v => v.id !== visitorId));
    toast.success("Utcheckning genomförd!");
    resetForm();
  };

  const renderCurrentStep = () => {
    switch (step) {
      case "type-selection":
        return <VisitorTypeSelection onSelectType={handleTypeSelection} />;
      
      case "visitor-info":
        return (
          <VisitorInfoForm 
            visitorCount={visitorCount}
            onVisitorCountChange={setVisitorCount}
            onSubmit={handleVisitorInfoSubmit}
            visitorType={visitorType || "regular"}
          />
        );
      
      case "host-selection":
        return <HostSelection hosts={HOSTS} onSelect={handleHostSelection} />;
        
      case "terms":
        return (
          <TermsAgreement 
            visitorType={visitorType || "regular"} 
            onAccept={handleTermsAccepted} 
          />
        );
        
      case "confirmation":
        return (
          <CheckInConfirmation 
            visitors={visitors}
            company={company}
            host={selectedHost?.name || ""}
            visitorType={visitorType || "regular"}
          />
        );

      case "check-out":
        return (
          <CheckOut 
            checkedInVisitors={checkedInVisitors} 
            onCheckOut={handleCheckOut}
            onCancel={() => setStep("type-selection")}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {step === "check-out" ? "Utcheckning" : "Incheckning"}
        </h2>
        
        {step !== "check-out" && checkedInVisitors.length > 0 && (
          <Button 
            variant="outline"
            onClick={startCheckOut}
            className="text-blue-500 border-blue-300 hover:bg-blue-50"
          >
            Checka ut
          </Button>
        )}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderCurrentStep()}
      </motion.div>
      
      {step !== "type-selection" && step !== "check-out" && (
        <div className="mt-6">
          <Button 
            variant="ghost" 
            onClick={() => {
              if (step === "visitor-info") {
                resetForm();
              } else if (step === "host-selection") {
                setStep("visitor-info");
              } else if (step === "terms") {
                setStep("host-selection");
              } else if (step === "confirmation") {
                resetForm();
              }
            }}
            className="text-gray-500"
          >
            {step === "confirmation" ? "Stäng" : "Tillbaka"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckInSystem;
