
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { Label } from "@/components/ui/label";
import { VisitorType } from "@/types/visitors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVisitorAutocomplete } from "@/hooks/useVisitorAutocomplete";

interface CompanyInfoFormProps {
  visitorCount: number;
  visitorType: VisitorType;
  onVisitorCountChange: (count: number) => void;
  onSubmit: (company: string, count: number) => void;
  initialCompany?: string;
}

// Hårdkodade företag för service besök
const SERVICE_COMPANIES = [
  "Fanuc",
  "Inneklimat", 
  "Westbo Elteknik",
  "Ravema AB",
  "Kaeser",
  "Uffes mek AB",
  
];

const CompanyInfoForm = ({ 
  visitorCount, 
  visitorType, 
  onVisitorCountChange, 
  onSubmit,
  initialCompany = ""
}: CompanyInfoFormProps) => {
  const [company, setCompany] = useState<string>(initialCompany);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const { t } = useLanguage();
  
  // Use autocomplete for both regular and service visits
  const { suggestions, loading, searchVisitors, clearSuggestions } = useVisitorAutocomplete(company);

  // Kombinera databas-förslag med hårdkodade service-företag
  const serviceCompanySuggestions = visitorType === "service" && company.length >= 2 
    ? SERVICE_COMPANIES
        .filter(serviceCompany => 
          serviceCompany.toLowerCase().startsWith(company.toLowerCase())
        )
        .map(name => ({ value: name, label: name }))
    : [];
  
  // Kombinera alla förslag
  const allSuggestions = [...suggestions, ...serviceCompanySuggestions];

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    let valid = true;
    
    if (!company.trim()) {
      newErrors.company = true;
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(company, visitorCount);
    }
  };

  const countOptions = [1, 2, 3, 4, 5];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-3xl font-medium mb-4">
          {t('companyInformation')} | {visitorType === "regular" ? t('regularVisit') : t('serviceVisit')}
        </h3>
        <p className="text-xl text-gray-500 mb-8">{t('pleaseEnterCompanyAndCount')}</p>

        <div className="mb-8">
          <Label htmlFor="company" className={`text-xl font-medium mb-3 block ${errors.company ? "text-red-500" : ""}`}>
            {t('company')} {errors.company && <span className="text-red-500">*</span>}
          </Label>
          
          <AutocompleteInput
            id="company"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              searchVisitors(e.target.value);
              if (e.target.value) {
                setErrors(prev => ({ ...prev, company: false }));
              } else {
                clearSuggestions();
              }
            }}
            onOptionSelect={(value) => {
              setCompany(value);
              clearSuggestions();
              setErrors(prev => ({ ...prev, company: false }));
            }}
            options={allSuggestions}
            placeholder={t('companyPlaceholder')}
            className={`h-14 text-2xl ${errors.company ? "border-red-500" : ""}`}
            loading={loading}
          />
          
          {errors.company && (
            <p className="text-red-500 text-base mt-2">{t('enterCompanyName')}</p>
          )}
        </div>

        <div className="mb-8">
          <Label className="text-xl font-medium mb-3 block">{t('numberOfVisitors')}</Label>
          <div className="flex gap-2">
            {countOptions.map((count) => (
              <Button
                key={count}
                type="button"
                variant={visitorCount === count ? "default" : "outline"}
                onClick={() => onVisitorCountChange(count)}
                className="h-12 w-12 text-xl font-medium"
              >
                {count}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-[#3B82F6] h-16 text-2xl">
        {t('continue')}
      </Button>
    </form>
  );
};

export default CompanyInfoForm;
