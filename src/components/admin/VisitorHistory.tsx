
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface VisitorHistoryData {
  id: string;
  name: string;
  company: string;
  visiting: string;
  check_in_time: string;
  check_out_time: string | null;
  is_service_personnel: boolean;
}

type SortField = 'name' | 'company' | 'visiting' | 'check_in_time' | 'check_out_time';
type SortDirection = 'asc' | 'desc';

const VisitorHistory = () => {
  const [searchName, setSearchName] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('check_in_time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const itemsPerPage = 15;

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['visitorHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('CHECKIN_visitors')
        .select('*')
        .order('check_in_time', { ascending: false });

      if (error) {
        console.error('Error fetching visitor history:', error);
        throw error;
      }

      return data || [];
    },
  });

  const filteredAndSortedHistory = useMemo(() => {
    let filtered = history.filter((visitor: VisitorHistoryData) => {
      const nameMatch = visitor.name.toLowerCase().includes(searchName.toLowerCase());
      const companyMatch = visitor.company.toLowerCase().includes(searchCompany.toLowerCase());
      
      let dateMatch = true;
      if (dateFrom || dateTo) {
        const visitDate = new Date(visitor.check_in_time).toISOString().split('T')[0];
        if (dateFrom && visitDate < dateFrom) dateMatch = false;
        if (dateTo && visitDate > dateTo) dateMatch = false;
      }
      
      return nameMatch && companyMatch && dateMatch;
    });

    // Sort the filtered results
    filtered.sort((a: VisitorHistoryData, b: VisitorHistoryData) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];
      
      // Handle null values for check_out_time
      if (sortField === 'check_out_time') {
        if (!aValue && !bValue) return 0;
        if (!aValue) return sortDirection === 'asc' ? 1 : -1;
        if (!bValue) return sortDirection === 'asc' ? -1 : 1;
      }
      
      if (sortField === 'check_in_time' || sortField === 'check_out_time') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else {
        aValue = (aValue as string).toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [history, searchName, searchCompany, dateFrom, dateTo, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredAndSortedHistory.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const clearFilters = () => {
    setSearchName('');
    setSearchCompany('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Laddar historik...</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Besökarhistorik ({history.length})</h2>
        </div>

        {/* Search and filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Sök namn..."
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Sök företag..."
              value={searchCompany}
              onChange={(e) => {
                setSearchCompany(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="date"
              placeholder="Från datum"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="date"
              placeholder="Till datum"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Visar {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedHistory.length)} av {filteredAndSortedHistory.length} resultat
          </div>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Rensa filter
          </Button>
        </div>

        {filteredAndSortedHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchName || searchCompany || dateFrom || dateTo ? 'Inga matchande besökare hittades.' : 'Ingen besökarhistorik tillgänglig.'}
          </div>
        ) : (
          <>
            <div className="overflow-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Namn
                        {getSortIcon('name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('company')}
                    >
                      <div className="flex items-center gap-1">
                        Företag
                        {getSortIcon('company')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('visiting')}
                    >
                      <div className="flex items-center gap-1">
                        Besöker
                        {getSortIcon('visiting')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('check_in_time')}
                    >
                      <div className="flex items-center gap-1">
                        Incheckningstid
                        {getSortIcon('check_in_time')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('check_out_time')}
                    >
                      <div className="flex items-center gap-1">
                        Utcheckningstid
                        {getSortIcon('check_out_time')}
                      </div>
                    </TableHead>
                    <TableHead>Typ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedHistory.map((visitor: VisitorHistoryData) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-medium">{visitor.name}</TableCell>
                      <TableCell>{visitor.company}</TableCell>
                      <TableCell>{visitor.visiting}</TableCell>
                      <TableCell>{formatTime(visitor.check_in_time)}</TableCell>
                      <TableCell>{formatTime(visitor.check_out_time)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          visitor.is_service_personnel 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {visitor.is_service_personnel ? 'Service' : 'Vanligt'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VisitorHistory;
