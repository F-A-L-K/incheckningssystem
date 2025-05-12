
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { VisitorType } from "@/types/visitors";

interface TermsAgreementProps {
  visitorType: VisitorType;
  onAccept: () => void;
}

const TermsAgreement = ({ visitorType, onAccept }: TermsAgreementProps) => {
  const [accepted, setAccepted] = useState(false);
  
  const regularTerms = (
    <>
      <h4 className="font-medium mb-2">Besöksvillkor</h4>
      <div className="text-sm space-y-2 text-gray-700">
        <p>Som besökare accepterar du följande:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Att följa säkerhetsregler och anvisningar från personal</li>
          <li>Att bära besöksbricka synligt under hela besöket</li>
          <li>Att inte fotografera eller filma i lokalerna utan tillstånd</li>
          <li>Att inte beträda områden du inte har behörighet till</li>
          <li>Att respektera sekretess gällande information du får tillgång till</li>
        </ul>
        <p className="mt-4">
          Genom att checka in accepterar du att vi lagrar dina personuppgifter enligt GDPR för besöksändamål.
          Informationen raderas efter besöket.
        </p>
      </div>
    </>
  );

  const serviceTerms = (
    <>
      <h4 className="font-medium mb-2">Villkor för servicepersonal</h4>
      <div className="text-sm space-y-2 text-gray-700">
        <p>Som servicepersonal accepterar du följande:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Att följa alla säkerhetsrutiner och anvisningar från personal</li>
          <li>Att bära besöksbricka och/eller arbetskort synligt under hela besöket</li>
          <li>Att endast använda godkänd utrustning och verktyg</li>
          <li>Att respektera alla säkerhetsföreskrifter för den specifika arbetsmiljön</li>
          <li>Att utföra arbetet enligt överenskomna standarder och tidplaner</li>
          <li>Att rapportera eventuella incidenter eller avvikelser omedelbart</li>
          <li>Att inte fotografera eller filma i lokalerna utan särskilt tillstånd</li>
        </ul>
        <p className="mt-4">
          Genom att checka in accepterar du att vi lagrar dina personuppgifter enligt GDPR för besöks- och säkerhetsändamål.
          Du bekräftar också att du har nödvändig behörighet och utbildning för det arbete du ska utföra.
        </p>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-2">Villkor för besök</h3>
      <p className="text-gray-500 text-sm mb-4">
        Vänligen läs igenom och godkänn villkoren för att slutföra incheckningen
      </p>
      
      <div className="border border-gray-200 rounded-md p-4 max-h-[300px] overflow-y-auto bg-gray-50">
        {visitorType === "regular" ? regularTerms : serviceTerms}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={accepted} 
          onCheckedChange={(checked) => setAccepted(checked === true)}
        />
        <label 
          htmlFor="terms" 
          className="text-sm font-medium leading-none cursor-pointer"
        >
          Jag har läst och godkänner villkoren
        </label>
      </div>
      
      <Button 
        onClick={onAccept} 
        disabled={!accepted} 
        className="w-full"
      >
        Checka in
      </Button>
    </div>
  );
};

export default TermsAgreement;
