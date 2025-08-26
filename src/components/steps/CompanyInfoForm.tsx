
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisitorType } from "@/types/visitors";

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
          Företagsinformation | {visitorType === "regular" ? "Vanligt besök" : "Servicepersonal"}
        </h3>
        <p className="text-xl text-gray-500 mb-8">Vänligen ange företag och antal besökare.</p>

        <div className="mb-8">
          <Label htmlFor="company" className={`text-xl font-medium mb-3 block ${errors.company ? "text-red-500" : ""}`}>
            Företag {errors.company && <span className="text-red-500">*</span>}
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
            placeholder="Företagsnamn"
          />
          {errors.company && (
            <p className="text-red-500 text-base mt-2">Ange namn på företag/organisation</p>
          )}
        </div>

        <div className="mb-8">
          <Label htmlFor="visitor-count" className="text-xl font-medium mb-3 block">Antal besökare</Label>
          <Select 
            value={visitorCount.toString()} 
            onValueChange={(value) => onVisitorCountChange(parseInt(value))}
          >
            <SelectTrigger id="visitor-count" className="w-full h-14 text-xl">
              <SelectValue placeholder="Välj antal" />
            </SelectTrigger>
            <SelectContent>
              {countOptions.map((count) => (
                <SelectItem key={count} value={count.toString()} className="text-xl py-3">
                  {count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-[#3B82F6] h-16 text-2xl">
        Fortsätt
      </Button>
    </form>
  );
};

export default CompanyInfoForm;
