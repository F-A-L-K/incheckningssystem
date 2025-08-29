import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { VisitorType, Visitor, Host } from "@/types/visitors";
import VisitorTypeSelection from "@/components/steps/VisitorTypeSelection";
import CompanyInfoForm from "@/components/steps/CompanyInfoForm";
import SchoolInfoForm from "@/components/steps/SchoolInfoForm";
import VisitorNamesForm from "@/components/steps/VisitorNamesForm";
import HostSelection from "@/components/steps/HostSelection";
import TermsAgreement from "@/components/steps/TermsAgreement";
import CheckInConfirmation from "@/components/steps/CheckInConfirmation";
import CheckOut from "@/components/steps/CheckOut";
import { Button } from "@/components/ui/button";
import { saveVisitor, getCheckedInVisitors, checkOutVisitor, convertToVisitorFormat } from "@/services/visitorService";
import { useLanguage } from "@/contexts/LanguageContext";

// Department mapping function
const getDepartmentTranslationKey = (department: string): string => {
  const departmentMap: Record<string, string> = {
    "VD": "departmentVD",
    "Produktionsledning": "departmentProduktionsledning", 
    "Försäljning": "departmentForsaljning",
    "Processutveckling": "departmentProcessutveckling",
    "Produktionsteknik": "departmentProduktionsteknik",
    "Kvalitet- och miljö": "departmentKvalitetOchMiljo",
    "Teknik": "departmentTeknik",
    "Ekonomi": "departmentEkonomi",
    "Logistik": "departmentLogistik",
    "Lager": "departmentLager"
  };
  return departmentMap[department] || department;
};

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
  | "company-info"
  | "school-info"
  | "visitor-names"
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
  const { t } = useLanguage();
  
  // Create translated hosts based on current language
  const getTranslatedHosts = (): Host[] => {
    return HOSTS.map(host => ({
      ...host,
      department: t(getDepartmentTranslationKey(host.department) as any) as string
    }));
  };
  const [step, setStep] = useState<Step>(initialStep);
  const [visitorType, setVisitorType] = useState<VisitorType | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(1);
  const [company, setCompany] = useState<string>("");
  const [school, setSchool] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const [studentCount, setStudentCount] = useState<number>(1);
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
        title: t('error'),
        description: t('failedToLoad'),
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setVisitorType(null);
    setVisitors([]);
    setVisitorCount(1);
    setCompany("");
    setSchool("");
    setTeacherName("");
    setStudentCount(1);
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
    if (type === "school") {
      setStep("school-info");
    } else {
      setStep("company-info");
    }
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
    
    // Gå till company-info steget med förifylld information
    setStep("company-info");
    
    toast({
      title: t('welcomeBack'),
      description: `${visitorData.name}! ${t('infoFilledAutomatically')}`,
    });
  };

  const handleCompanyInfoSubmit = (companyName: string, count: number) => {
    setCompany(companyName);
    setVisitorCount(count);
    setStep("visitor-names");
  };

  const handleVisitorNamesSubmit = (newVisitors: Visitor[]) => {
    setVisitors(newVisitors);
    setStep("host-selection");
  };

  const handleSchoolInfoSubmit = (schoolName: string, teacherNameValue: string, studentCountValue: number) => {
    setSchool(schoolName);
    setTeacherName(teacherNameValue);
    setStudentCount(studentCountValue);
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
      if (visitorType === "school") {
        // For school visits, create a single entry with teacher name and student count
        const visitorData = {
          name: teacherName,
          company: school,
          visiting: selectedHost?.name || "",
          is_service_personnel: false,
          is_school_visit: true,
          student_count: studentCount,
          teacher_name: teacherName
        };
        
        await saveVisitor(visitorData);
      } else {
        // For regular and service visits, save each visitor individually
        for (const visitor of visitors) {
          const visitorData = {
            name: visitor.fullName || `${visitor.firstName} ${visitor.lastName}`,
            company: company,
            visiting: selectedHost?.name || "",
            is_service_personnel: visitorType === "service",
            is_school_visit: false
          };
          
          await saveVisitor(visitorData);
        }
      }
      
      setStep("confirmation");
      toast({
        title: t('checkInCompletedToast'),
        description: t('welcomeToast'),
      });
    } catch (error) {
      console.error('Failed to save visitors:', error);
      toast({
        title: t('error'),
        description: t('failedToCheckIn'),
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
        title: t('checkOutCompletedToast'),
        description: t('haveANiceDay'),
      });
      // Don't reset form - stay on checkout page and reload visitors
      loadCheckedInVisitors();
    } catch (error) {
      console.error('Failed to check out visitor:', error);
      toast({
        title: t('error'),
        description: t('failedToCheckOut'),
        variant: "destructive",
      });
    }
  };

  const handleVisitorCheckedOut = () => {
    // Reload the checked in visitors list
    loadCheckedInVisitors();
  };

  const handleBackNavigation = () => {
    if (step === "company-info" || step === "school-info") {
      // Om det finns igenkänd data, rensa den och gå tillbaka
      if (recognizedVisitorData) {
        setRecognizedVisitorData(null);
        setVisitors([]);
        setCompany("");
        setVisitorType(null);
      }
      setStep("type-selection");
    } else if (step === "visitor-names") {
      if (visitorType === "school") {
        setStep("school-info");
      } else {
        setStep("company-info");
      }
    } else if (step === "host-selection") {
      if (visitorType === "school") {
        setStep("school-info");
      } else {
        setStep("visitor-names");
      }
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
      
      case "company-info":
        return (
          <CompanyInfoForm 
            visitorCount={visitorCount}
            onVisitorCountChange={setVisitorCount}
            onSubmit={handleCompanyInfoSubmit}
            visitorType={visitorType || "regular"}
            initialCompany={company}
          />
        );

      
      case "school-info":
        return (
          <SchoolInfoForm 
            onSubmit={handleSchoolInfoSubmit}
            initialSchool={school}
            initialTeacherName={teacherName}
            initialStudentCount={studentCount}
          />
        );

      case "visitor-names":
        return (
          <VisitorNamesForm 
            visitorCount={visitorCount}
            visitorType={visitorType || "regular"}
            company={company}
            onSubmit={handleVisitorNamesSubmit}
            initialVisitors={visitors}
          />
        );
      
      case "host-selection":
        return <HostSelection hosts={getTranslatedHosts()} onSelect={handleHostSelection} />;
        
      case "terms":
        const primaryVisitorName = visitorType === "school" 
          ? teacherName 
          : visitors.length > 0 ? (visitors[0].fullName || `${visitors[0].firstName} ${visitors[0].lastName}`) : "Besökare";
        const visitorInfo = {
          name: primaryVisitorName,
          company: visitorType === "school" ? school : company,
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
            visitorCount={visitorType === "school" ? studentCount : visitors.length}
          />
        );
        
      case "confirmation":
        return (
          <CheckInConfirmation 
            visitors={visitorType === "school" ? [{id: "1", firstName: teacherName, lastName: ""}] : visitors}
            company={visitorType === "school" ? school : company}
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
            onCancel={onCheckOutComplete || (() => setStep("type-selection"))}
            onVisitorCheckedOut={handleVisitorCheckedOut}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
      
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
            {t('back')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckInSystem;
