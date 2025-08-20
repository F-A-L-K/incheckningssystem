
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Host } from "@/types/visitors";
import { Check } from "lucide-react";

interface HostSelectionProps {
  hosts: Host[];
  onSelect: (host: Host) => void;
}

const HostSelection = ({ hosts, onSelect }: HostSelectionProps) => {
  const [search, setSearch] = useState("");
  const [selectedHostId, setSelectedHostId] = useState<number | null>(null);
  
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Besöksvärd</h3>
        <p className="text-sm text-gray-500 mb-3">Vänligen välj i listan vem ni besöker genom att klicka på namnet.</p>
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="Sök efter namn eller avdelning..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
        
        <ScrollArea className="h-[300px] w-full">
          <div className="p-2 space-y-2">
            {filteredHosts.length > 0 ? (
              filteredHosts.map((host) => (
                <div 
                  key={host.id}
                  onClick={() => handleSelect(host)}
                  className={`
                    flex justify-between items-center p-3 rounded-md cursor-pointer
                    ${selectedHostId === host.id 
                      ? 'bg-blue-50 border border-blue-300' 
                      : 'hover:bg-gray-50 border border-gray-200'
                    }
                  `}
                >
                  <div>
                    <p className="font-medium">{host.name}</p>
                    <p className="text-sm text-gray-500">{host.department}</p>
                  </div>
                  {selectedHostId === host.id && (
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Inga matchande personer hittades
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default HostSelection;
