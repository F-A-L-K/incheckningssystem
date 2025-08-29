
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
        
        <div className="w-full">
          {filteredHosts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredHosts.map((host) => (
                <div 
                  key={host.id}
                  onClick={() => handleSelect(host)}
                  className={`
                    relative p-4 rounded-lg cursor-pointer text-center transition-all
                    ${selectedHostId === host.id 
                      ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                      : 'bg-card border border-border hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
                    }
                  `}
                >
                  <p className="font-medium text-lg leading-tight">{host.name}</p>
                  {selectedHostId === host.id && (
                    <Check className="absolute top-2 right-2 h-5 w-5" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-lg">
              {t('noMatchingPersons')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostSelection;
