
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
  const [searchName, setSearchName] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('all');
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
      
      // Visit type filter
      let typeMatch = true;
      if (visitTypeFilter !== 'all') {
        if (visitTypeFilter === 'service' && !visitor.is_service_personnel) typeMatch = false;
        if (visitTypeFilter === 'regular' && visitor.is_service_personnel) typeMatch = false;
      }
      
      let dateMatch = true;
      if (dateFrom || dateTo) {
        const visitDate = new Date(visitor.check_in_time).toISOString().split('T')[0];
        if (dateFrom && visitDate < dateFrom) dateMatch = false;
        if (dateTo && visitDate > dateTo) dateMatch = false;
      }
      
      return nameMatch && companyMatch && typeMatch && dateMatch;
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
  }, [history, searchName, searchCompany, visitTypeFilter, dateFrom, dateTo, sortField, sortDirection]);

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
    setVisitTypeFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">{t('loadingHistory')}</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t('visitorHistory')} ({history.length})</h2>
        </div>

        {/* Search and filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('searchNamePlaceholder')}
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
              placeholder={t('searchCompanyPlaceholder')}
              value={searchCompany}
              onChange={(e) => {
                setSearchCompany(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          
          <Select value={visitTypeFilter} onValueChange={(value) => {
            setVisitTypeFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger>
              <SelectValue placeholder={t('visitTypeFilter')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allVisitsFilter')}</SelectItem>
              <SelectItem value="regular">{t('regularVisitsFilter')}</SelectItem>
              <SelectItem value="service">{t('serviceVisitsFilter')}</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="date"
              placeholder={t('dateFromLabel')}
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
              placeholder={t('dateToLabel')}
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
            {t('showingText')} {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedHistory.length)} {t('ofText')} {filteredAndSortedHistory.length} {t('resultsText')}
          </div>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            {t('clearFiltersButton')}
          </Button>
        </div>

        {filteredAndSortedHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchName || searchCompany || visitTypeFilter !== 'all' || dateFrom || dateTo ? t('noMatchingVisitorsMessage') : t('noVisitorHistoryMessage')}
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
                        {t('nameColumn')}
                        {getSortIcon('name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('company')}
                    >
                      <div className="flex items-center gap-1">
                        {t('companyColumn')}
                        {getSortIcon('company')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('visiting')}
                    >
                      <div className="flex items-center gap-1">
                        {t('visitingColumn')}
                        {getSortIcon('visiting')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('check_in_time')}
                    >
                      <div className="flex items-center gap-1">
                        {t('checkInTimeColumn')}
                        {getSortIcon('check_in_time')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('check_out_time')}
                    >
                      <div className="flex items-center gap-1">
                        {t('checkOutTimeColumn')}
                        {getSortIcon('check_out_time')}
                      </div>
                    </TableHead>
                    <TableHead>{t('typeColumn')}</TableHead>
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
                          {visitor.is_service_personnel ? t('serviceType') : t('regularType')}
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
                      >
                        {t('previousButton')}
                      </PaginationPrevious>
                    </PaginationItem>
                    
                    {(() => {
                      const pages = [];
                      const showEllipsis = totalPages > 7;
                      
                      if (!showEllipsis) {
                        // Show all pages if 7 or fewer
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(
                            <PaginationItem key={i}>
                              <PaginationLink
                                onClick={() => setCurrentPage(i)}
                                isActive={i === currentPage}
                                className="cursor-pointer"
                              >
                                {i}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      } else {
                        // Smart pagination with ellipsis
                        const showStartEllipsis = currentPage > 4;
                        const showEndEllipsis = currentPage < totalPages - 3;
                        
                        // Always show first page
                        pages.push(
                          <PaginationItem key={1}>
                            <PaginationLink
                              onClick={() => setCurrentPage(1)}
                              isActive={1 === currentPage}
                              className="cursor-pointer"
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                        );
                        
                        // Show start ellipsis if needed
                        if (showStartEllipsis) {
                          pages.push(
                            <PaginationItem key="start-ellipsis">
                              <span className="flex h-9 w-9 items-center justify-center">...</span>
                            </PaginationItem>
                          );
                        }
                        
                        // Show pages around current page
                        const start = Math.max(2, currentPage - 1);
                        const end = Math.min(totalPages - 1, currentPage + 1);
                        
                        for (let i = start; i <= end; i++) {
                          if (i !== 1 && i !== totalPages) {
                            pages.push(
                              <PaginationItem key={i}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(i)}
                                  isActive={i === currentPage}
                                  className="cursor-pointer"
                                >
                                  {i}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                        }
                        
                        // Show end ellipsis if needed
                        if (showEndEllipsis) {
                          pages.push(
                            <PaginationItem key="end-ellipsis">
                              <span className="flex h-9 w-9 items-center justify-center">...</span>
                            </PaginationItem>
                          );
                        }
                        
                        // Always show last page if it's different from first
                        if (totalPages > 1) {
                          pages.push(
                            <PaginationItem key={totalPages}>
                              <PaginationLink
                                onClick={() => setCurrentPage(totalPages)}
                                isActive={totalPages === currentPage}
                                className="cursor-pointer"
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      }
                      
                      return pages;
                    })()}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      >
                        {t('nextButton')}
                      </PaginationNext>
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
