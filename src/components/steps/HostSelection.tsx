
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [customHostName, setCustomHostName] = useState("");
  const { t } = useLanguage();
  
  // Sort hosts by ID first, then filter by search
  const sortedHosts = [...hosts].sort((a, b) => a.id - b.id);
  
  const filteredHosts = search.trim() === "" 
    ? sortedHosts 
    : sortedHosts.filter(host => 
        host.name.toLowerCase().includes(search.toLowerCase())
        // host.department.toLowerCase().includes(search.toLowerCase())
      );
  
  const handleSelect = (host: Host) => {
    setSelectedHostId(host.id);
    onSelect(host);
  };

  const handleCustomHostSubmit = () => {
    if (customHostName.trim()) {
      const customHost: Host = {
        id: -1, // Use -1 for custom hosts
        name: customHostName.trim(),
        department: "Annan"
      };
      setSelectedHostId(-1);
      onSelect(customHost);
      setIsCustomDialogOpen(false);
      setCustomHostName("");
    }
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
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
              
              {/* Annan... button */}
              <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
                <DialogTrigger asChild>
                  <div className={`
                    relative p-4 rounded-lg cursor-pointer text-center transition-all
                    ${selectedHostId === -1 
                      ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                      : 'bg-card border border-border hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
                    }
                  `}>
                    <p className="font-medium text-lg leading-tight">Annan...</p>
                    {selectedHostId === -1 && (
                      <Check className="absolute top-2 right-2 h-5 w-5" />
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ange namn på besöksvärd</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Skriv namn här..."
                      value={customHostName}
                      onChange={(e) => setCustomHostName(e.target.value)}
                      className="text-lg py-4 px-4"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCustomHostSubmit();
                        }
                      }}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCustomDialogOpen(false);
                          setCustomHostName("");
                        }}
                      >
                        Avbryt
                      </Button>
                      <Button
                        onClick={handleCustomHostSubmit}
                        disabled={!customHostName.trim()}
                      >
                        Bekräfta
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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
