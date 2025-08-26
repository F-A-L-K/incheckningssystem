
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Host } from "@/types/visitors";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HostSelectionProps {
  hosts: Host[];
  onSelect: (host: Host) => void;
}

const HostSelection = ({ hosts, onSelect }: HostSelectionProps) => {
  const [search, setSearch] = useState("");
  const [selectedHostId, setSelectedHostId] = useState<number | null>(null);
  const { t } = useLanguage();
  
  // Sort hosts by ID first, then filter by search
  const sortedHosts = [...hosts].sort((a, b) => a.id - b.id);
  
  const filteredHosts = search.trim() === "" 
    ? sortedHosts 
    : sortedHosts.filter(host => 
        host.name.toLowerCase().includes(search.toLowerCase()) ||
        host.department.toLowerCase().includes(search.toLowerCase())
      );
  
  const handleSelect = (host: Host) => {
    setSelectedHostId(host.id);
    onSelect(host);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-medium mb-3">{t('visitingHost')}</h3>
        <p className="text-lg text-gray-500 mb-6">{t('pleaseSelectHost')}</p>
      </div>
      
      <div>
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 text-lg py-4 px-4"
        />
        
        <ScrollArea className="h-[400px] w-full">
          <div className="p-2 space-y-3">
            {filteredHosts.length > 0 ? (
              filteredHosts.map((host) => (
                <div 
                  key={host.id}
                  onClick={() => handleSelect(host)}
                  className={`
                    flex justify-between items-center p-5 rounded-lg cursor-pointer
                    ${selectedHostId === host.id 
                      ? 'bg-blue-50 border border-blue-300' 
                      : 'hover:bg-gray-50 border border-gray-200'
                    }
                  `}
                >
                  <div>
                    <p className="font-medium text-xl">{host.name}</p>
                    <p className="text-lg text-gray-500">{host.department}</p>
                  </div>
                  {selectedHostId === host.id && (
                    <Check className="h-7 w-7 text-blue-500" />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-lg">
                {t('noMatchingPersons')}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default HostSelection;
