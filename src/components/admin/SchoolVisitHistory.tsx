import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useLanguage } from '@/contexts/LanguageContext';

interface SchoolVisitData {
  id: string;
  school_name: string;
  teacher_name: string;
  student_count: number;
  visiting: string | null;
  check_in_time: string;
  check_out_time: string | null;
  checked_out: boolean;
}

type SortField = 'school_name' | 'teacher_name' | 'student_count' | 'check_in_time' | 'check_out_time';
type SortDirection = 'asc' | 'desc';

const SchoolVisitHistory = () => {
  const { t } = useLanguage();
  const [searchSchool, setSearchSchool] = useState('');
  const [searchTeacher, setSearchTeacher] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('check_in_time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const itemsPerPage = 15;

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['schoolVisitHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_visits')
        .select('*')
        .order('check_in_time', { ascending: false });

      if (error) {
        console.error('Error fetching school visit history:', error);
        throw error;
      }

      return data || [];
    },
  });

  const filteredAndSortedHistory = useMemo(() => {
    let filtered = history.filter((visit: SchoolVisitData) => {
      const schoolMatch = visit.school_name.toLowerCase().includes(searchSchool.toLowerCase());
      const teacherMatch = visit.teacher_name.toLowerCase().includes(searchTeacher.toLowerCase());
      
      let dateMatch = true;
      if (dateFrom || dateTo) {
        const visitDate = new Date(visit.check_in_time).toISOString().split('T')[0];
        if (dateFrom && visitDate < dateFrom) dateMatch = false;
        if (dateTo && visitDate > dateTo) dateMatch = false;
      }
      
      return schoolMatch && teacherMatch && dateMatch;
    });

    // Sort the filtered results
    filtered.sort((a: SchoolVisitData, b: SchoolVisitData) => {
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
      } else if (sortField === 'student_count') {
        // Handle numeric sorting
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = (aValue as string).toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [history, searchSchool, searchTeacher, dateFrom, dateTo, sortField, sortDirection]);

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
    setSearchSchool('');
    setSearchTeacher('');
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
          <h2 className="text-xl font-semibold">{t('schoolVisitHistory')} ({history.length})</h2>
        </div>

        {/* Search and filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={`${t('searchPlaceholder')} ${t('schoolNameColumn').toLowerCase()}...`}
              value={searchSchool}
              onChange={(e) => {
                setSearchSchool(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={`${t('searchPlaceholder')} ${t('teacherNameColumn').toLowerCase()}...`}
              value={searchTeacher}
              onChange={(e) => {
                setSearchTeacher(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          
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
            {searchSchool || searchTeacher || dateFrom || dateTo ? t('noMatchingVisitorsMessage') : t('noSchoolVisitsMessage')}
          </div>
        ) : (
          <>
            <div className="overflow-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('school_name')}
                    >
                      <div className="flex items-center gap-1">
                        {t('schoolNameColumn')}
                        {getSortIcon('school_name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('teacher_name')}
                    >
                      <div className="flex items-center gap-1">
                        {t('teacherNameColumn')}
                        {getSortIcon('teacher_name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort('student_count')}
                    >
                      <div className="flex items-center gap-1">
                        {t('studentCountColumn')}
                        {getSortIcon('student_count')}
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
                    <TableHead>{t('visitingColumn')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedHistory.map((visit: SchoolVisitData) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">{visit.school_name}</TableCell>
                      <TableCell>{visit.teacher_name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {visit.student_count} {visit.student_count === 1 ? 'elev' : 'elever'}
                        </span>
                      </TableCell>
                      <TableCell>{formatTime(visit.check_in_time)}</TableCell>
                      <TableCell>{formatTime(visit.check_out_time)}</TableCell>
                      <TableCell>{visit.visiting || '-'}</TableCell>
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

export default SchoolVisitHistory;