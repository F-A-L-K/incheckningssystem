
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);
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
          
          {visitorType === "service" ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={`w-full h-14 text-2xl justify-between font-normal ${errors.company ? "border-red-500" : ""}`}
                >
                  {company || t('companyPlaceholder')}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Sök företag..." />
                  <CommandList>
                    <CommandEmpty>Inget företag hittades.</CommandEmpty>
                    <CommandGroup>
                      {SERVICE_COMPANIES.map((serviceCompany) => (
                        <CommandItem
                          key={serviceCompany}
                          value={serviceCompany}
                          onSelect={(currentValue) => {
                            setCompany(currentValue === company ? "" : currentValue);
                            setOpen(false);
                            if (currentValue) {
                              setErrors(prev => ({ ...prev, company: false }));
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              company === serviceCompany ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {serviceCompany}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
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
