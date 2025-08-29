
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { VisitorType } from "@/types/visitors";
import { useLanguage } from "@/contexts/LanguageContext";

interface CompanyInfoFormProps {
  visitorCount: number;
  visitorType: VisitorType;
  onVisitorCountChange: (count: number) => void;
  onSubmit: (company: string, count: number) => void;
  initialCompany?: string;
}

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
          <Input 
            id="company"
            type="text" 
            value={company} 
            onChange={(e) => {
              setCompany(e.target.value);
              if (e.target.value) {
                setErrors(prev => ({ ...prev, company: false }));
              }
            }}
            className={`h-14 text-2xl ${errors.company ? "border-red-500" : ""}`}
            placeholder={t('companyPlaceholder')}
          />
          {errors.company && (
            <p className="text-red-500 text-base mt-2">{t('enterCompanyName')}</p>
          )}
        </div>

        <div className="mb-8">
          <Label className="text-xl font-medium mb-3 block">{t('numberOfVisitors')}</Label>
          <RadioGroup 
            value={visitorCount.toString()} 
            onValueChange={(value) => onVisitorCountChange(parseInt(value))}
            className="flex flex-row gap-4"
          >
            {countOptions.map((count) => (
              <div key={count} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={count.toString()} 
                  id={`visitor-${count}`}
                  className="h-6 w-6"
                />
                <Label 
                  htmlFor={`visitor-${count}`} 
                  className="text-xl font-medium cursor-pointer"
                >
                  {count}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-[#3B82F6] h-16 text-2xl">
        {t('continue')}
      </Button>
    </form>
  );
};

export default CompanyInfoForm;
