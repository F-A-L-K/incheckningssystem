import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { Visitor, VisitorType } from "@/types/visitors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVisitorAutocomplete } from "@/hooks/useVisitorAutocomplete";

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
  const [activeFieldIndex, setActiveFieldIndex] = useState<number | null>(null);
  const { t } = useLanguage();
  const { suggestions, loading, searchVisitors, clearSuggestions } = useVisitorAutocomplete(company);

  // Function to capitalize first letter and letters after spaces, make rest lowercase
  const formatFullName = (name: string): string => {
    if (!name) return name;
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  useEffect(() => {
    if (initialVisitors.length > 0) {
      const newVisitors = [...initialVisitors];
      
      // Ensure we have the right number of visitors
      while (newVisitors.length < visitorCount) {
        newVisitors.push({ id: uuidv4(), firstName: "", lastName: "", fullName: "" });
      }
      
      setVisitors(newVisitors.slice(0, visitorCount));
    } else {
      // Create empty visitors if no initial data
      const newVisitors = [];
      for (let i = 0; i < visitorCount; i++) {
        newVisitors.push({ id: uuidv4(), firstName: "", lastName: "", fullName: "" });
      }
      setVisitors(newVisitors);
    }
  }, [visitorCount, initialVisitors]);

  const handleVisitorChange = (index: number, value: string) => {
    const newVisitors = [...visitors];
    newVisitors[index] = { ...newVisitors[index], fullName: value };
    setVisitors(newVisitors);
    
    // Set this field as active
    setActiveFieldIndex(index);
    
    // Clear error for this field if value is not empty
    if (value) {
      setErrors(prev => ({ ...prev, [`visitor-${index}-fullName`]: false }));
    }

    // Trigger autocomplete search for regular visits only
    if (visitorType === "regular" && value.length >= 2) {
      searchVisitors(value);
    } else {
      clearSuggestions();
    }
  };

  const handleAutocompleteSelect = (index: number, selectedName: string) => {
    const newVisitors = [...visitors];
    newVisitors[index] = { ...newVisitors[index], fullName: selectedName };
    setVisitors(newVisitors);
    clearSuggestions();
    setActiveFieldIndex(null);
    
    // Clear any error for this field
    setErrors(prev => ({ ...prev, [`visitor-${index}-fullName`]: false }));
  };

  const handleNameBlur = (index: number) => {
    const newVisitors = [...visitors];
    const currentValue = newVisitors[index].fullName;
    const formattedValue = formatFullName(currentValue);
    
    if (currentValue !== formattedValue) {
      newVisitors[index] = { ...newVisitors[index], fullName: formattedValue };
      setVisitors(newVisitors);
    }
    
    // Clear suggestions and active field when field loses focus
    setTimeout(() => {
      clearSuggestions();
      setActiveFieldIndex(null);
    }, 150);
  };

  const handleFieldFocus = (index: number) => {
    setActiveFieldIndex(index);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    let valid = true;
    
    // Check all visitors have names
    visitors.forEach((visitor, index) => {
      if (!visitor.fullName?.trim()) {
        newErrors[`visitor-${index}-fullName`] = true;
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
          <div key={visitor.id} className="mb-8">
            {index > 0 && <hr className="border-gray-300 mb-8" />}
            <div>
              <AutocompleteInput
                id={`visitor-${index}-fullName`}
                type="text"
                value={visitor.fullName || ''}
                onChange={(e) => handleVisitorChange(index, e.target.value)}
                onBlur={() => handleNameBlur(index)}
                onFocus={() => handleFieldFocus(index)}
                onOptionSelect={(selectedName) => handleAutocompleteSelect(index, selectedName)}
                options={activeFieldIndex === index ? suggestions : []}
                loading={loading}
                className={`h-14 text-2xl ${errors[`visitor-${index}-fullName`] ? "border-red-500" : ""}`}
                placeholder={`${t('visitor')} ${index + 1}`}
              />
              {errors[`visitor-${index}-fullName`] && (
                <p className="text-red-500 text-base mt-2">{t('enterFullNameError')}</p>
              )}
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
