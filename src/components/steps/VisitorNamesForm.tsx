
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Visitor, VisitorType } from "@/types/visitors";
import { useLanguage } from "@/contexts/LanguageContext";

interface VisitorNamesFormProps {
  visitorCount: number;
  visitorType: VisitorType;
  company: string;
  onSubmit: (visitors: Visitor[]) => void;
  initialVisitors?: Visitor[];
}

const VisitorNamesForm = ({ 
  visitorCount, 
  visitorType, 
  company,
  onSubmit,
  initialVisitors = []
}: VisitorNamesFormProps) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const { t } = useLanguage();

  // Function to capitalize first letter and make rest lowercase
  const formatName = (name: string): string => {
    if (!name) return name;
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (initialVisitors.length > 0) {
      const newVisitors = [...initialVisitors];
      
      // Ensure we have the right number of visitors
      while (newVisitors.length < visitorCount) {
        newVisitors.push({ id: uuidv4(), firstName: "", lastName: "" });
      }
      
      setVisitors(newVisitors.slice(0, visitorCount));
    } else {
      // Create empty visitors if no initial data
      const newVisitors = [];
      for (let i = 0; i < visitorCount; i++) {
        newVisitors.push({ id: uuidv4(), firstName: "", lastName: "" });
      }
      setVisitors(newVisitors);
    }
  }, [visitorCount, initialVisitors]);

  const handleVisitorChange = (index: number, field: "firstName" | "lastName", value: string) => {
    const newVisitors = [...visitors];
    newVisitors[index] = { ...newVisitors[index], [field]: value };
    setVisitors(newVisitors);
    
    // Clear error for this field if value is not empty
    if (value) {
      setErrors(prev => ({ ...prev, [`visitor-${index}-${field}`]: false }));
    }
  };

  const handleNameBlur = (index: number, field: "firstName" | "lastName") => {
    const newVisitors = [...visitors];
    const currentValue = newVisitors[index][field];
    const formattedValue = formatName(currentValue);
    
    if (currentValue !== formattedValue) {
      newVisitors[index] = { ...newVisitors[index], [field]: formattedValue };
      setVisitors(newVisitors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    let valid = true;
    
    // Check all visitors have names
    visitors.forEach((visitor, index) => {
      if (!visitor.firstName.trim()) {
        newErrors[`visitor-${index}-firstName`] = true;
        valid = false;
      }
      if (!visitor.lastName.trim()) {
        newErrors[`visitor-${index}-lastName`] = true;
        valid = false;
      }
    });
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(visitors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-3xl font-medium mb-4">
          {t('visitorNames')} | {visitorType === "regular" ? t('regularVisit') : t('serviceVisit')}
        </h3>
        <p className="text-xl text-gray-500 mb-6">{t('enterNamesForAllVisitors')} {company}.</p>
        
        {visitors.map((visitor, index) => (
          <div key={visitor.id} className="p-6 bg-gray-50 rounded-lg mb-6">
            <h4 className="font-medium mb-5 text-2xl">{t('visitor')} {index + 1}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label 
                  htmlFor={`visitor-${index}-firstName`}
                  className={`text-xl font-medium mb-3 block ${errors[`visitor-${index}-firstName`] ? "text-red-500" : ""}`}
                >
                  {t('firstName')} {errors[`visitor-${index}-firstName`] && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id={`visitor-${index}-firstName`}
                  type="text"
                  value={visitor.firstName}
                  onChange={(e) => handleVisitorChange(index, "firstName", e.target.value)}
                  onBlur={() => handleNameBlur(index, "firstName")}
                  className={`h-14 text-2xl ${errors[`visitor-${index}-firstName`] ? "border-red-500" : ""}`}
                  placeholder={t('firstNamePlaceholder')}
                />
                {errors[`visitor-${index}-firstName`] && (
                  <p className="text-red-500 text-base mt-2">{t('enterFirstName')}</p>
                )}
              </div>
              
              <div>
                <Label 
                  htmlFor={`visitor-${index}-lastName`}
                  className={`text-xl font-medium mb-3 block ${errors[`visitor-${index}-lastName`] ? "text-red-500" : ""}`}
                >
                  {t('lastName')} {errors[`visitor-${index}-lastName`] && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id={`visitor-${index}-lastName`}
                  type="text"
                  value={visitor.lastName}
                  onChange={(e) => handleVisitorChange(index, "lastName", e.target.value)}
                  onBlur={() => handleNameBlur(index, "lastName")}
                  className={`h-14 text-2xl ${errors[`visitor-${index}-lastName`] ? "border-red-500" : ""}`}
                  placeholder={t('lastNamePlaceholder')}
                />
                {errors[`visitor-${index}-lastName`] && (
                  <p className="text-red-500 text-base mt-2">{t('enterLastName')}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Button type="submit" className="w-full bg-[#3B82F6] h-16 text-2xl">
        {t('continue')}
      </Button>
    </form>
  );
};

export default VisitorNamesForm;
