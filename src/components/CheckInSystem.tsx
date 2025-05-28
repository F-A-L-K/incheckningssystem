import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { VisitorType, Visitor, Host } from "@/types/visitors";
import VisitorTypeSelection from "@/components/steps/VisitorTypeSelection";
import VisitorInfoForm from "@/components/steps/VisitorInfoForm";
import HostSelection from "@/components/steps/HostSelection";
import TermsAgreement from "@/components/steps/TermsAgreement";
import CheckInConfirmation from "@/components/steps/CheckInConfirmation";
import CheckOut from "@/components/steps/CheckOut";
import { Button } from "@/components/ui/button";
import { saveVisitor, getCheckedInVisitors, checkOutVisitor, convertToVisitorFormat } from "@/services/visitorService";

// Mock data for hosts
const HOSTS: Host[] = [
  { id: 1, name: "Per Falk", department: "VD" },
  { id: 2, name: "Magnus Ericsson", department: "Produktionsledning" },
  { id: 3, name: "Anna Falk", department: "Försäljning" },
  { id: 8, name: "Erika Falk", department: "Processutveckling" },
  { id: 4, name: "Joel Hill Sveningsson", department: "Produktionsteknik" },
  { id: 5, name: "Fredrik Falk", department: "Produktionsteknik" },
  { id: 7, name: "Håkan Hansson", department: "Kvalitet- och miljö" },
  { id: 9, name: "Robert Sandtjärn", department: "Produktionsteknik" },
  { id: 6, name: "Jonas Wadhed", department: "Teknik" },
  { id: 10, name: "Gunilla Ljungkvist", department: "Ekonomi" },
  { id: 11, name: "Jonathan Lind", department: "Logistik" },
  { id: 12, name: "Roland Mellin", department: "Teknik" },
  { id: 13, name: "Lena Bergquist", department: "Lager" },
  
];

type Step = 
  | "type-selection"
  | "visitor-info"
  | "host-selection"
  | "terms"
  | "confirmation"
  | "check-out";

interface CheckInSystemProps {
  initialStep?: Step;
  onCheckOutComplete?: () => void;
}

const CheckInSystem = ({ initialStep = "type-selection", onCheckOutComplete }: CheckInSystemProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>(initialStep);
  const [visitorType, setVisitorType] = useState<VisitorType | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(1);
  const [company, setCompany] = useState<string>("");
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [checkedInVisitors, setCheckedInVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recognizedVisitorData, setRecognizedVisitorData] = useState<any>(null);

  useEffect(() => {
    setStep(initialStep);
    if (initialStep === "check-out") {
      loadCheckedInVisitors();
    }
  }, [initialStep]);

  const loadCheckedInVisitors = async () => {
    try {
      const visitors = await getCheckedInVisitors();
      setCheckedInVisitors(visitors);
    } catch (error) {
      console.error('Failed to load checked-in visitors:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ladda incheckade besökare",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setVisitorType(null);
    setVisitors([]);
    setVisitorCount(1);
    setCompany("");
    setSelectedHost(null);
    setTermsAccepted(false);
    setRecognizedVisitorData(null);
    setStep("type-selection");
    if (onCheckOutComplete) {
      onCheckOutComplete();
    }
  };

  const handleTypeSelection = (type: VisitorType) => {
    setVisitorType(type);
    setStep("visitor-info");
  };

  const handleFaceRecognized = async (visitorData: any) => {
    // Auto-fyll information baserat på ansiktsigenkänning
    setRecognizedVisitorData(visitorData);
    setVisitorType(visitorData.visitorType || "regular");
    
    // Sätt pre-ifylld besökarinformation
    const recognizedVisitor: Visitor = {
      id: "1",
      firstName: visitorData.name.split(' ')[0] || "",
      lastName: visitorData.name.split(' ').slice(1).join(' ') || "",
    };
    
    setVisitors([recognizedVisitor]);
    setCompany(visitorData.company || "");
    
    // Gå till visitor-info steget med förifylld information
    setStep("visitor-info");
    
    toast({
      title: "Välkommen tillbaka!",
      description: `${visitorData.name}! Information ifylld automatiskt.`,
    });
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

  const handleTermsAccepted = async () => {
    setTermsAccepted(true);
    setLoading(true);
    
    try {
      // Save each visitor to the database
      for (const visitor of visitors) {
        const visitorData = {
          name: `${visitor.firstName} ${visitor.lastName}`,
          company,
          visiting: selectedHost?.name || "",
          is_service_personnel: visitorType === "service"
        };
        
        await saveVisitor(visitorData);
      }
      
      setStep("confirmation");
      toast({
        title: "Incheckning genomförd!",
        description: "Välkommen!",
      });
    } catch (error) {
      console.error('Failed to save visitors:', error);
      toast({
        title: "Fel",
        description: "Kunde inte genomföra incheckning",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startCheckOut = () => {
    setStep("check-out");
    loadCheckedInVisitors();
  };

  const handleCheckOut = async (visitorId: string) => {
    try {
      await checkOutVisitor(visitorId);
      setCheckedInVisitors(prev => prev.filter(v => v.id !== visitorId));
      toast({
        title: "Utcheckning genomförd!",
        description: "Ha en bra dag!",
      });
      resetForm();
    } catch (error) {
      console.error('Failed to check out visitor:', error);
      toast({
        title: "Fel",
        description: "Kunde inte genomföra utcheckning",
        variant: "destructive",
      });
    }
  };

  const handleBackNavigation = () => {
    if (step === "visitor-info") {
      // Om det finns igenkänd data, rensa den och gå tillbaka
      if (recognizedVisitorData) {
        setRecognizedVisitorData(null);
        setVisitors([]);
        setCompany("");
        setVisitorType(null);
      }
      setStep("type-selection");
    } else if (step === "host-selection") {
      setStep("visitor-info");
    } else if (step === "terms") {
      setStep("host-selection");
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case "type-selection":
        return (
          <VisitorTypeSelection 
            onSelectType={handleTypeSelection}
            onFaceRecognized={handleFaceRecognized}
          />
        );
      
      case "visitor-info":
        return (
          <VisitorInfoForm 
            visitorCount={visitorCount}
            onVisitorCountChange={setVisitorCount}
            onSubmit={handleVisitorInfoSubmit}
            visitorType={visitorType || "regular"}
            initialVisitors={visitors}
            initialCompany={company}
          />
        );
      
      case "host-selection":
        return <HostSelection hosts={HOSTS} onSelect={handleHostSelection} />;
        
      case "terms":
        const primaryVisitorName = visitors.length > 0 ? `${visitors[0].firstName} ${visitors[0].lastName}` : "Besökare";
        const visitorInfo = {
          name: primaryVisitorName,
          company: company,
          visiting: selectedHost?.name || "",
          visitorType: visitorType || "regular"
        };
        
        return (
          <TermsAgreement 
            visitorType={visitorType || "regular"} 
            onAccept={handleTermsAccepted}
            loading={loading}
            visitorName={primaryVisitorName}
            visitorInfo={visitorInfo}
            isCheckOut={false}
            visitorCount={visitors.length}
          />
        );
        
      case "confirmation":
        return (
          <CheckInConfirmation 
            visitors={visitors}
            company={company}
            host={selectedHost?.name || ""}
            visitorType={visitorType || "regular"}
            onClose={resetForm}
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
          null
        )}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderCurrentStep()}
      </motion.div>
      
      {step !== "type-selection" && step !== "check-out" && step !== "confirmation" && (
        <div className="mt-6">
          <Button 
            variant="ghost" 
            onClick={handleBackNavigation}
            className="text-gray-500"
          >
            Tillbaka
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckInSystem;
