
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { VisitorType } from "@/types/visitors";
import { useLanguage } from "@/contexts/LanguageContext";

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
  "Ravema",
  "Kaeser",
  "Uffes mek AB",
  "Lindroths maskinservice"
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useLanguage();

  // Filtrera företag baserat på input (minst 2 tecken)
  const filteredCompanies = visitorType === "service" && company.length >= 2 
    ? SERVICE_COMPANIES.filter(serviceCompany => 
        serviceCompany.toLowerCase().startsWith(company.toLowerCase())
      )
    : [];

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

        <div className="mb-8 relative">
          <Label htmlFor="company" className={`text-xl font-medium mb-3 block ${errors.company ? "text-red-500" : ""}`}>
            {t('company')} {errors.company && <span className="text-red-500">*</span>}
          </Label>
          
          <Input 
            id="company"
            type="text" 
            value={company} 
            onChange={(e) => {
              setCompany(e.target.value);
              setShowSuggestions(e.target.value.length >= 2 && visitorType === "service");
              if (e.target.value) {
                setErrors(prev => ({ ...prev, company: false }));
              }
            }}
            onFocus={() => {
              if (company.length >= 2 && visitorType === "service") {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              // Delay för att tillåta klick på suggestions
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className={`h-14 text-2xl ${errors.company ? "border-red-500" : ""}`}
            placeholder={t('companyPlaceholder')}
          />
          
          {/* Dropdown suggestions */}
          {showSuggestions && filteredCompanies.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredCompanies.map((serviceCompany) => (
                <button
                  key={serviceCompany}
                  type="button"
                  className="w-full text-left px-4 py-3 text-lg hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    setCompany(serviceCompany);
                    setShowSuggestions(false);
                    setErrors(prev => ({ ...prev, company: false }));
                  }}
                >
                  {serviceCompany}
                </button>
              ))}
            </div>
          )}
          
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
