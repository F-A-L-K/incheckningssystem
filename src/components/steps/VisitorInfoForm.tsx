import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { Visitor, VisitorType } from "@/types/visitors";

interface VisitorInfoFormProps {
  visitorCount: number;
  visitorType: VisitorType;
  onVisitorCountChange: (count: number) => void;
  onSubmit: (visitors: Visitor[], company: string) => void;
  initialVisitors?: Visitor[];
  initialCompany?: string;
}

const VisitorInfoForm = ({ 
  visitorCount, 
  visitorType, 
  onVisitorCountChange, 
  onSubmit,
  initialVisitors = [],
  initialCompany = ""
}: VisitorInfoFormProps) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [company, setCompany] = useState<string>(initialCompany);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Function to capitalize first letter and make rest lowercase
  const formatName = (name: string): string => {
    if (!name) return name;
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  useEffect(() => {
    // Initialize visitors array based on count and initial data
    const newVisitors = [...visitors];
    
    if (newVisitors.length < visitorCount) {
      // Add more visitor slots
      for (let i = newVisitors.length; i < visitorCount; i++) {
        // Use initial data if available, otherwise create empty visitor
        const initialVisitor = initialVisitors[i];
        newVisitors.push(
          initialVisitor || { id: uuidv4(), firstName: "", lastName: "" }
        );
      }
    } else if (newVisitors.length > visitorCount) {
      // Remove excess visitor slots
      newVisitors.splice(visitorCount);
    }
    
    setVisitors(newVisitors);
  }, [visitorCount]);

  // Initialize visitors with existing data on component mount
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
  }, []);

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
    
    // Check company name
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
      onSubmit(visitors, company);
    }
  };

  const countOptions = [1, 2, 3, 4, 5];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">
          Besökarinformation - {visitorType === "regular" ? "Vanlig besökare" : "Servicepersonal"}
        </h3>

        <div className="mb-6">
          <Label htmlFor="company" className={errors.company ? "text-red-500" : ""}>
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
            className={errors.company ? "border-red-500" : ""}
            placeholder="Företagsnamn"
          />
          {errors.company && (
            <p className="text-red-500 text-xs mt-1">Ange namn på företag/organisation</p>
          )}
        </div>
        
        <div className="mb-6">
          <Label htmlFor="visitor-count">Antal besökare</Label>
          <Select 
            value={visitorCount.toString()} 
            onValueChange={(value) => onVisitorCountChange(parseInt(value))}
          >
            <SelectTrigger id="visitor-count" className="w-full">
              <SelectValue placeholder="Välj antal" />
            </SelectTrigger>
            <SelectContent>
              {countOptions.map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {visitors.map((visitor, index) => (
          <div key={visitor.id} className="p-4 bg-gray-50 rounded-md mb-4">
            <h4 className="font-medium mb-3">Besökare {index + 1}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label 
                  htmlFor={`visitor-${index}-firstName`}
                  className={errors[`visitor-${index}-firstName`] ? "text-red-500" : ""}
                >
                  Förnamn {errors[`visitor-${index}-firstName`] && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id={`visitor-${index}-firstName`}
                  type="text"
                  value={visitor.firstName}
                  onChange={(e) => handleVisitorChange(index, "firstName", e.target.value)}
                  onBlur={() => handleNameBlur(index, "firstName")}
                  className={errors[`visitor-${index}-firstName`] ? "border-red-500" : ""}
                  placeholder="Förnamn"
                />
                {errors[`visitor-${index}-firstName`] && (
                  <p className="text-red-500 text-xs mt-1">Ange ett förnamn</p>
                )}
              </div>
              
              <div>
                <Label 
                  htmlFor={`visitor-${index}-lastName`}
                  className={errors[`visitor-${index}-lastName`] ? "text-red-500" : ""}
                >
                  Efternamn {errors[`visitor-${index}-lastName`] && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id={`visitor-${index}-lastName`}
                  type="text"
                  value={visitor.lastName}
                  onChange={(e) => handleVisitorChange(index, "lastName", e.target.value)}
                  onBlur={() => handleNameBlur(index, "lastName")}
                  className={errors[`visitor-${index}-lastName`] ? "border-red-500" : ""}
                  placeholder="Efternamn"
                />
                {errors[`visitor-${index}-lastName`] && (
                  <p className="text-red-500 text-xs mt-1">Ange ett efternamn</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Button type="submit" className="w-full bg-[#19647E]">
        Fortsätt
      </Button>
    </form>
  );
};

export default VisitorInfoForm;
